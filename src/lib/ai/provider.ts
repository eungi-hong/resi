import type { AgeBand, AiResponse, Language } from "@/src/lib/types";

export type AiProvider = {
  generateYouthResponse(input: {
    message: string;
    ageBand: AgeBand;
    language: Language;
  }): Promise<AiResponse>;
};

export function shouldUseOpenAi() {
  return process.env.AI_PROVIDER === "openai" && Boolean(process.env.OPENAI_API_KEY);
}
