import { mockGenerateYouthResponse } from "@/src/lib/ai/mockProvider";
import { aiResponseSchema } from "@/src/lib/ai/schemas";
import type { AgeBand, Language } from "@/src/lib/types";

export async function runResiYouthPipeline(message: string, options: { ageBand?: AgeBand; language?: Language } = {}) {
  const raw = mockGenerateYouthResponse(message, options);
  return aiResponseSchema.parse(raw);
}
