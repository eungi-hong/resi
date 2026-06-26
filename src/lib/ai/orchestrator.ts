import { mockGenerateYouthResponse } from "@/src/lib/ai/mockProvider";
import { openaiProvider } from "@/src/lib/ai/openaiProvider";
import { shouldUseOpenAi, type ChatTurn } from "@/src/lib/ai/provider";
import { aiResponseSchema } from "@/src/lib/ai/schemas";
import type { AgeBand, Language } from "@/src/lib/types";

function providerErrorLabel(error: unknown) {
  if (error instanceof Error) return error.name === "AbortError" ? "timeout" : error.message;
  return "unknown provider error";
}

export async function runResiYouthPipeline(
  message: string,
  options: { ageBand?: AgeBand; language?: Language; history?: ChatTurn[] } = {}
) {
  const ageBand = options.ageBand ?? "TEEN_13_15";
  const language = options.language ?? "en";
  const history = options.history ?? [];
  let raw;
  if (shouldUseOpenAi()) {
    try {
      raw = await openaiProvider.generateYouthResponse({ message, ageBand, language, history });
    } catch (error) {
      console.warn(`OpenAI provider unavailable; using local fallback response (${providerErrorLabel(error)}).`);
      raw = mockGenerateYouthResponse(message, { ageBand, language });
    }
  } else {
    raw = mockGenerateYouthResponse(message, { ageBand, language });
  }
  return aiResponseSchema.parse(raw);
}
