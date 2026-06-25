import { inferLiteracySignalsFromMessage } from "@/src/lib/ai/healthLiteracyMetrics";
import type { AiProvider } from "@/src/lib/ai/provider";
import { retrieveMaterials, detectTopic } from "@/src/lib/ai/retrieval";
import { classifyRisk } from "@/src/lib/ai/risk";
import { aiResponseSchema } from "@/src/lib/ai/schemas";
import { resiYouthSystemPrompt } from "@/src/lib/ai/prompts/resiYouthSystemPrompt";
import type { AiResponse, AvatarCue } from "@/src/lib/types";

type ResponsesApiResult = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

function extractOutputText(result: ResponsesApiResult) {
  if (result.output_text) return result.output_text;
  return result.output?.flatMap((item) => item.content ?? []).find((part) => part.type === "output_text")?.text ?? "";
}

function parseJsonObject(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("OpenAI response did not contain JSON.");
    return JSON.parse(match[0]);
  }
}

function cueForRisk(severity: AiResponse["riskAssessment"]["severity"], fallback: AvatarCue): AvatarCue {
  if (severity === "CRITICAL") return "safe_escalation";
  if (severity === "HIGH") return "concerned";
  return fallback;
}

function openAiTimeoutMs() {
  const configured = Number(process.env.OPENAI_TIMEOUT_MS);
  // Default high enough that gpt-4.1-mini structured output completes instead
  // of aborting and silently falling back to the mock provider.
  return Number.isFinite(configured) && configured > 0 ? configured : 9000;
}

export const openaiProvider: AiProvider = {
  async generateYouthResponse({ message, ageBand, language }) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is required when AI_PROVIDER=openai.");

    const topic = detectTopic(message);
    const materials = retrieveMaterials(message, ageBand);
    const riskAssessment = classifyRisk(message);
    const healthLiteracySignals = inferLiteracySignalsFromMessage(message);
    const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
    const baseUrl = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), openAiTimeoutMs());

    try {
      const response = await fetch(`${baseUrl}/responses`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          instructions: `${resiYouthSystemPrompt}

Return only a JSON object matching this TypeScript shape:
{
  "language": "en" | "zh" | "ms" | "ta",
  "detectedTopics": string[],
  "youthEmotion": string,
  "response": string,
  "simplifiedSummary": string,
  "teachBackQuestion": string | null,
  "suggestedQuickReplies": string[],
  "recommendedMaterialIds": string[],
  "quizSuggestion": { "topic": string, "reason": string } | null,
  "trustedAdultSupport": { "shouldSuggest": boolean, "script": string } | null,
  "avatarCue": "idle" | "wave" | "thinking" | "explaining" | "pointing" | "reading" | "quiz" | "celebrate" | "concerned" | "listening" | "writing" | "resource" | "safe_escalation" | "parent_guidance" | "dashboard_pointer",
  "riskAssessment": { "severity": "NONE" | "LOW" | "MODERATE" | "HIGH" | "CRITICAL", "riskTypes": string[], "parentAlertRecommended": boolean, "rationale": string },
  "healthLiteracySignals": { "functional": "low" | "medium" | "high", "interactive": "low" | "medium" | "high", "critical": "low" | "medium" | "high", "evidence": string[] }
}

Use the supplied deterministic safety and retrieval context exactly. Do not diagnose, prescribe treatment, give medication dosing, or replace emergency/clinical support. Keep response under 130 words.`,
          input: JSON.stringify({
            youthMessage: message,
            ageBand,
            language,
            deterministicContext: {
              topic,
              materialIds: materials.map((material) => material.id),
              materialSummaries: materials.map((material) => ({
                id: material.id,
                title: material.title,
                summary: material.summary
              })),
              riskAssessment,
              healthLiteracySignals
            }
          }),
          max_output_tokens: 700
        })
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`OpenAI Responses API failed: ${response.status} ${detail}`);
      }

      const result = (await response.json()) as ResponsesApiResult;
      const parsed = aiResponseSchema.parse(parseJsonObject(extractOutputText(result)));

      return {
        ...parsed,
        language,
        detectedTopics: [topic],
        recommendedMaterialIds: materials.map((material) => material.id),
        riskAssessment,
        healthLiteracySignals,
        avatarCue: cueForRisk(riskAssessment.severity, parsed.avatarCue),
        quizSuggestion: parsed.quizSuggestion ?? { topic, reason: "A topic quiz can help resi adapt your next lesson." }
      };
    } finally {
      clearTimeout(timeout);
    }
  }
};
