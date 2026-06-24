import { mockGenerateYouthResponse } from "@/src/lib/ai/mockProvider";
import { openaiProvider } from "@/src/lib/ai/openaiProvider";
import { shouldUseOpenAi } from "@/src/lib/ai/provider";
import { aiResponseSchema } from "@/src/lib/ai/schemas";
import type { AgeBand, Language } from "@/src/lib/types";

function providerErrorLabel(error: unknown) {
  if (error instanceof Error) return error.name === "AbortError" ? "timeout" : error.message;
  return "unknown provider error";
}

export async function runResiYouthPipeline(message: string, options: { ageBand?: AgeBand; language?: Language } = {}) {
  const ageBand = options.ageBand ?? "TEEN_13_15";
  const language = options.language ?? "en";
  let raw;
  if (shouldUseOpenAi()) {
    try {
      raw = await openaiProvider.generateYouthResponse({ message, ageBand, language });
    } catch (error) {
      console.warn(`OpenAI provider unavailable; using local fallback response (${providerErrorLabel(error)}).`);
      raw = mockGenerateYouthResponse(message, { ageBand, language });
    }
  } else {
    raw = mockGenerateYouthResponse(message, { ageBand, language });
  }
  return aiResponseSchema.parse(raw);
}
