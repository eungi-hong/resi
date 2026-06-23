import { z } from "zod";

export const aiResponseSchema = z.object({
  language: z.enum(["en", "zh", "ms", "ta"]),
  detectedTopics: z.array(z.string()),
  youthEmotion: z.string(),
  response: z.string(),
  simplifiedSummary: z.string(),
  teachBackQuestion: z.string().nullable(),
  suggestedQuickReplies: z.array(z.string()),
  recommendedMaterialIds: z.array(z.string()),
  quizSuggestion: z.object({ topic: z.string(), reason: z.string() }).nullable(),
  trustedAdultSupport: z.object({ shouldSuggest: z.boolean(), script: z.string() }).nullable(),
  avatarCue: z.enum(["idle", "wave", "thinking", "explaining", "celebrate", "concerned", "resource", "quiz", "safe_escalation"]),
  riskAssessment: z.object({
    severity: z.enum(["NONE", "LOW", "MODERATE", "HIGH", "CRITICAL"]),
    riskTypes: z.array(z.string()),
    parentAlertRecommended: z.boolean(),
    rationale: z.string()
  }),
  healthLiteracySignals: z.object({
    functional: z.enum(["low", "medium", "high"]),
    interactive: z.enum(["low", "medium", "high"]),
    critical: z.enum(["low", "medium", "high"]),
    evidence: z.array(z.string())
  })
});
