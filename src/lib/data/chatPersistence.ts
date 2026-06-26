import type { AiResponse, AgeBand, Language } from "@/src/lib/types";
import type { ChatTurn } from "@/src/lib/ai/provider";
import { runResiYouthPipeline } from "@/src/lib/ai/orchestrator";
import { calculateLiteracyUpdate } from "@/src/lib/ai/healthLiteracyMetrics";
import { shouldCreateParentAlert } from "@/src/lib/ai/risk";
import { hasDatabaseUrl, prisma } from "@/src/lib/db";

function signalValue(signal: "low" | "medium" | "high") {
  return signal;
}

function severityScore(severity: AiResponse["riskAssessment"]["severity"]) {
  if (severity === "CRITICAL") return 100;
  if (severity === "HIGH") return 82;
  if (severity === "MODERATE") return 56;
  if (severity === "LOW") return 24;
  return 0;
}

export async function runAndPersistYouthChat(input: {
  youthUserId: string;
  message: string;
  language: Language;
  ageBand: AgeBand;
  conversationId?: string;
  history?: ChatTurn[];
}) {
  const response = await runResiYouthPipeline(input.message, {
    ageBand: input.ageBand,
    language: input.language,
    history: input.history
  });
  if (!hasDatabaseUrl) return { ...response, conversationId: input.conversationId };

  const conversation = input.conversationId
    ? await prisma.conversation.update({
        where: { id: input.conversationId },
        data: { updatedAt: new Date(), language: input.language }
      })
    : await prisma.conversation.create({
        data: {
          id: `conversation-${input.youthUserId}-${Date.now()}`,
          youthUserId: input.youthUserId,
          title: response.detectedTopics[0] ?? "Health question",
          language: input.language
        }
      });

  const userMessage = await prisma.message.create({
    data: {
      id: `message-user-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      conversationId: conversation.id,
      sender: "USER",
      content: input.message,
      language: input.language,
      safetyLabels: { submitted: true }
    }
  });

  const assistantMessage = await prisma.message.create({
    data: {
      id: `message-assistant-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      conversationId: conversation.id,
      sender: "ASSISTANT",
      content: response.response,
      language: response.language,
      safetyLabels: response.riskAssessment,
      avatarCue: response.avatarCue,
      metadata: response
    }
  });

  const topic = response.detectedTopics[0] ?? "general";
  await prisma.healthContext.upsert({
    where: { youthUserId_topic: { youthUserId: input.youthUserId, topic } },
    update: {
      summary: response.simplifiedSummary,
      knownConcerns: response.riskAssessment,
      confidence: 0.72,
      lastUpdatedAt: new Date()
    },
    create: {
      id: `context-${input.youthUserId}-${topic}`,
      youthUserId: input.youthUserId,
      topic,
      summary: response.simplifiedSummary,
      socioculturalFactors: { location: "Singapore", language: input.language, ageBand: input.ageBand },
      knownConcerns: response.riskAssessment,
      confidence: 0.72,
      lastUpdatedAt: new Date()
    }
  });

  await prisma.riskAssessment.create({
    data: {
      id: `risk-${input.youthUserId}-${Date.now()}`,
      youthUserId: input.youthUserId,
      topic,
      riskType: response.riskAssessment.riskTypes[0] ?? "general_learning",
      severity: response.riskAssessment.severity,
      score: severityScore(response.riskAssessment.severity),
      rationale: response.riskAssessment.rationale,
      evidenceMessageIds: [userMessage.id, assistantMessage.id],
      recommendedAction: response.trustedAdultSupport?.script ?? "Continue supportive education and monitor for safety needs.",
      parentAlertRecommended: response.riskAssessment.parentAlertRecommended
    }
  });

  const signals = [
    ["FUNCTIONAL", response.healthLiteracySignals.functional],
    ["INTERACTIVE", response.healthLiteracySignals.interactive],
    ["CRITICAL", response.healthLiteracySignals.critical]
  ] as const;

  await Promise.all(signals.map(async ([dimension, signal]) => {
    const existing = await prisma.healthLiteracyMetric.findUnique({
      where: { youthUserId_topic_dimension: { youthUserId: input.youthUserId, topic, dimension } }
    });
    const current = existing
      ? { topic, dimension, score: existing.score, confidence: existing.confidence, evidence: existing.evidence as string[] }
      : { topic, dimension, score: 40, confidence: 0.2, evidence: [] };
    const updated = calculateLiteracyUpdate(current, signalValue(signal), `Chat evidence: ${response.healthLiteracySignals.evidence[0] ?? "learning signal"}`, 0.05);
    await prisma.healthLiteracyMetric.upsert({
      where: { youthUserId_topic_dimension: { youthUserId: input.youthUserId, topic, dimension } },
      update: { score: updated.score, confidence: updated.confidence, evidence: updated.evidence },
      create: {
        id: `metric-${input.youthUserId}-${topic}-${dimension}`,
        youthUserId: input.youthUserId,
        topic,
        dimension,
        score: updated.score,
        confidence: updated.confidence,
        evidence: updated.evidence
      }
    });
  }));

  const parentLink = await prisma.parentYouthLink.findFirst({ where: { youthUserId: input.youthUserId } });
  if (parentLink && shouldCreateParentAlert(response.riskAssessment.severity, "HIGH")) {
    await prisma.alert.upsert({
      where: { id: `alert-${input.youthUserId}-${topic}-${response.riskAssessment.severity}` },
      update: {
        severity: response.riskAssessment.severity,
        summary: response.simplifiedSummary,
        recommendedActions: [response.trustedAdultSupport?.script ?? "Start with curiosity and ask what support would help."],
        status: "OPEN"
      },
      create: {
        id: `alert-${input.youthUserId}-${topic}-${response.riskAssessment.severity}`,
        youthUserId: input.youthUserId,
        parentUserId: parentLink.parentUserId,
        type: response.riskAssessment.riskTypes[0] ?? "support_need",
        severity: response.riskAssessment.severity,
        title: response.riskAssessment.severity === "CRITICAL" ? "Urgent support needed" : "Support need detected",
        summary: response.simplifiedSummary,
        recommendedActions: [response.trustedAdultSupport?.script ?? "Start with curiosity and ask what support would help."],
        status: "OPEN"
      }
    });
  }

  await prisma.parentInsight.upsert({
    where: { id: `insight-${input.youthUserId}` },
    update: {
      summary: response.simplifiedSummary,
      growthAreas: response.healthLiteracySignals.evidence,
      suggestedParentApproach: response.trustedAdultSupport?.script ?? "Start with curiosity, not accusation.",
      conversationStarters: response.trustedAdultSupport?.script ? [response.trustedAdultSupport.script] : ["What did you find useful about what you learned?"],
      riskLevel: response.riskAssessment.severity
    },
    create: {
      id: `insight-${input.youthUserId}`,
      youthUserId: input.youthUserId,
      summary: response.simplifiedSummary,
      literacyStrengths: ["Asked a health literacy question"],
      growthAreas: response.healthLiteracySignals.evidence,
      suggestedParentApproach: response.trustedAdultSupport?.script ?? "Start with curiosity, not accusation.",
      conversationStarters: response.trustedAdultSupport?.script ? [response.trustedAdultSupport.script] : ["What did you find useful about what you learned?"],
      riskLevel: response.riskAssessment.severity
    }
  });

  return { ...response, conversationId: conversation.id };
}
