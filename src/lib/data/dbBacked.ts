/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AgeBand, Alert, DemoUser, EducationMaterial, Language, LiteracyMetric, Quiz } from "@/src/lib/types";
import { demoAlerts, demoUsers, educationMaterials, getMaterialsFor, getRecommendedMaterials, getUser, getYouthUsers, initialMetrics, parentInsights, quizzes } from "@/src/data/demoData";
import { avatarManifest } from "@/src/data/avatarManifest";
import { hasDatabaseUrl, prisma } from "@/src/lib/db";

function mapUser(user: any): DemoUser {
  const youthProfile = user.youthProfile;
  return {
    id: user.id,
    role: user.role,
    name: user.name,
    demoUsername: user.demoUsername,
    languagePreference: user.languagePreference,
    age: youthProfile?.age,
    ageBand: youthProfile?.ageBand,
    avatarId: youthProfile?.avatarId,
    linkedYouthIds: user.parentLinks?.map((link: any) => link.youthUserId)
  };
}

function mapMaterial(material: any): EducationMaterial {
  const myth = material.mythCheck as { myth: string; reality: string } | null;
  return {
    id: material.id,
    topic: material.topic,
    title: material.title,
    summary: material.summary,
    content: material.content,
    ageBand: material.ageBand,
    language: material.language,
    readingLevel: material.readingLevel,
    literacyDimension: material.literacyDimension,
    sourceStatus: material.sourceStatus,
    localContextNote: material.localContextNote ?? "",
    estimatedMinutes: material.estimatedMinutes ?? undefined,
    difficulty: material.difficulty ?? undefined,
    goalLabel: material.goalLabel ?? undefined,
    progress: material.progress,
    whatYouLearn: Array.isArray(material.whatYouLearn) ? material.whatYouLearn as string[] : undefined,
    quickExplainer: material.quickExplainer ?? undefined,
    scenario: material.scenario ?? undefined,
    practiceActivity: Array.isArray(material.practiceActivity) ? material.practiceActivity as string[] : undefined,
    mythCheck: myth ?? undefined,
    trustedAdultScript: material.trustedAdultScript ?? undefined,
    avatarCue: material.avatarCue ?? undefined
  };
}

function mapMetric(metric: any): LiteracyMetric {
  return {
    topic: metric.topic,
    dimension: metric.dimension,
    score: metric.score,
    confidence: metric.confidence,
    evidence: Array.isArray(metric.evidence) ? metric.evidence as string[] : []
  };
}

function mapAlert(alert: any): Alert {
  return {
    id: alert.id,
    youthUserId: alert.youthUserId,
    severity: alert.severity,
    type: alert.type,
    title: alert.title,
    summary: alert.summary,
    recommendedActions: Array.isArray(alert.recommendedActions) ? alert.recommendedActions as string[] : [],
    status: alert.status
  };
}

function mapQuiz(quiz: any): Quiz {
  return {
    id: quiz.id,
    topic: quiz.topic,
    ageBand: quiz.ageBand,
    language: quiz.language,
    title: quiz.title,
    literacyDimension: quiz.literacyDimension,
    questions: Array.isArray(quiz.questions) ? quiz.questions as Quiz["questions"] : []
  };
}

export async function getDemoUser(usernameOrId = "asha", fallbackRole: DemoUser["role"] = "YOUTH") {
  if (!hasDatabaseUrl) return getUser(usernameOrId) ?? demoUsers.find((user) => user.role === fallbackRole)!;
  const user =
    await prisma.user.findFirst({
      where: { OR: [{ demoUsername: usernameOrId }, { id: usernameOrId }] },
      include: { youthProfile: true, parentLinks: true }
    }) ??
    await prisma.user.findFirst({ where: { role: fallbackRole }, include: { youthProfile: true, parentLinks: true } });
  return user ? mapUser(user) : demoUsers.find((item) => item.role === fallbackRole)!;
}

export async function getDemoYouthUsers() {
  if (!hasDatabaseUrl) return getYouthUsers();
  const users = await prisma.user.findMany({ where: { role: "YOUTH" }, include: { youthProfile: true }, orderBy: { name: "asc" } });
  return users.map(mapUser);
}

export async function getYouthMetrics(youthId: string) {
  if (!hasDatabaseUrl) return initialMetrics[youthId] ?? [];
  const rows = await prisma.healthLiteracyMetric.findMany({ where: { youthUserId: youthId }, orderBy: [{ topic: "asc" }, { dimension: "asc" }] });
  return rows.map(mapMetric);
}

export async function getLearningMaterials(ageBand?: AgeBand, language: Language | string = "en", topic?: string) {
  if (!hasDatabaseUrl) return ageBand ? getMaterialsFor(ageBand, language, topic) : educationMaterials;
  const rows = await prisma.educationMaterial.findMany({
    where: {
      ageBand,
      topic,
      OR: [{ language: String(language) }, { language: "en" }]
    },
    orderBy: [{ topic: "asc" }, { ageBand: "asc" }]
  });
  return rows.map(mapMaterial);
}

export async function getRecommendedLearningMaterials(userId = "asha") {
  if (!hasDatabaseUrl) return getRecommendedMaterials(userId);
  const user = await getDemoUser(userId, "YOUTH");
  return getLearningMaterials(user.ageBand ?? "TEEN_13_15", user.languagePreference);
}

export async function getTopicMaterial(topic: string, ageBand: AgeBand, language: Language | string = "en") {
  const materials = await getLearningMaterials(ageBand, language, topic);
  return materials[0] ?? educationMaterials.find((material) => material.topic === topic)!;
}

export async function getDemoQuizzes(ageBand?: AgeBand, topic?: string) {
  if (!hasDatabaseUrl) return quizzes.filter((quiz) => (!ageBand || quiz.ageBand === ageBand) && (!topic || quiz.topic === topic));
  const rows = await prisma.quiz.findMany({ where: { ageBand, topic }, orderBy: [{ topic: "asc" }] });
  return rows.map(mapQuiz);
}

export async function getParentDashboardData(parentUsername = "parent") {
  if (!hasDatabaseUrl) {
    const linked = getYouthUsers().filter((user) => ["asha", "nabil"].includes(user.id));
    return {
      linkedYouth: linked,
      alerts: demoAlerts,
      insights: Object.entries(parentInsights).map(([youthUserId, insight]) => ({ youthUserId, ...insight }))
    };
  }
  const parent = await prisma.user.findUnique({
    where: { demoUsername: parentUsername },
    include: { parentLinks: { include: { youth: { include: { youthProfile: true } } } } }
  });
  const linkedYouth = parent?.parentLinks.map((link) => mapUser(link.youth)) ?? [];
  const alerts = await prisma.alert.findMany({ where: { parentUserId: parent?.id }, orderBy: { createdAt: "desc" } });
  const insights = await prisma.parentInsight.findMany({ where: { youthUserId: { in: linkedYouth.map((youth) => youth.id) } }, orderBy: { updatedAt: "desc" } });
  return {
    linkedYouth,
    alerts: alerts.map(mapAlert),
    insights: insights.map((insight) => ({
      youthUserId: insight.youthUserId,
      summary: insight.summary,
      strengths: insight.literacyStrengths as string[],
      growthAreas: insight.growthAreas as string[],
      approach: insight.suggestedParentApproach,
      starters: insight.conversationStarters as string[]
    }))
  };
}

export async function getYouthAlerts(youthId: string) {
  if (!hasDatabaseUrl) return demoAlerts.filter((alert) => alert.youthUserId === youthId);
  const alerts = await prisma.alert.findMany({ where: { youthUserId: youthId }, orderBy: { createdAt: "desc" } });
  return alerts.map(mapAlert);
}

export async function getParentInsight(youthId: string) {
  if (!hasDatabaseUrl) return parentInsights[youthId as keyof typeof parentInsights] ?? parentInsights.asha;
  const insight = await prisma.parentInsight.findFirst({ where: { youthUserId: youthId }, orderBy: { updatedAt: "desc" } });
  return insight
    ? {
        summary: insight.summary,
        strengths: insight.literacyStrengths as string[],
        growthAreas: insight.growthAreas as string[],
        approach: insight.suggestedParentApproach,
        starters: insight.conversationStarters as string[]
      }
    : parentInsights.asha;
}

export async function getConversationMessages(youthId: string) {
  if (!hasDatabaseUrl) return { conversationId: undefined, messages: [] };
  const conversation = await prisma.conversation.findFirst({
    where: { youthUserId: youthId },
    orderBy: { updatedAt: "desc" },
    include: { messages: { orderBy: { createdAt: "asc" }, take: 40 } }
  });
  return {
    conversationId: conversation?.id,
    messages: conversation?.messages.map((message) => ({
      sender: message.sender === "USER" ? "user" as const : "assistant" as const,
      content: message.content,
      cue: message.avatarCue as any
    })) ?? []
  };
}

export async function getAdminAnalyticsData() {
  if (!hasDatabaseUrl) {
    return {
      rows: [
        ["Vaping", 64, 51, 43, "Moderate support need rising"],
        ["Screen time", 71, 58, 52, "Moderate support need stable"],
        ["Mental health", "Hidden for privacy", "Hidden for privacy", "Hidden for privacy", "Small group hidden"],
        ["Misinformation", 62, 48, 46, "Moderate support need rising"]
      ],
      contentCount: educationMaterials.length,
      alertCount: demoAlerts.length
    };
  }
  const metrics = await prisma.healthLiteracyMetric.groupBy({
    by: ["topic", "dimension"],
    _avg: { score: true },
    _count: { youthUserId: true }
  });
  const topics = Array.from(new Set(metrics.map((metric) => metric.topic)));
  const rows = topics.map((topic) => {
    const set = metrics.filter((metric) => metric.topic === topic);
    const value = (dimension: string) => {
      const found = set.find((metric) => metric.dimension === dimension);
      return !found || found._count.youthUserId < 5 ? "Hidden for privacy" : Math.round(found._avg.score ?? 0);
    };
    return [topic, value("FUNCTIONAL"), value("INTERACTIVE"), value("CRITICAL"), "Computed from DB"];
  });
  const [contentCount, alertCount] = await Promise.all([prisma.educationMaterial.count(), prisma.alert.count()]);
  return { rows, contentCount, alertCount };
}

export async function seedAvatarAssetsMetadata() {
  if (!hasDatabaseUrl) return;
  await Promise.all(avatarManifest.map((asset) =>
    prisma.avatarAsset.upsert({
      where: { id: asset.id },
      update: {
        filePath: asset.filePath,
        expectedPath: asset.expectedPath,
        missing: asset.missing,
        recommendedContexts: asset.recommendedContexts
      },
      create: {
        id: asset.id,
        characterName: asset.characterName,
        displayName: asset.displayName,
        genderPresentation: asset.genderPresentation,
        agePresentation: asset.agePresentation,
        pose: asset.pose,
        emotion: asset.emotion,
        action: asset.action,
        filePath: asset.filePath,
        expectedPath: asset.expectedPath,
        altText: asset.altText,
        recommendedContexts: asset.recommendedContexts,
        missing: asset.missing
      }
    })
  ));
}
