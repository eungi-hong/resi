import type { AiProvider } from "@/src/lib/ai/provider";

export const openaiProvider: AiProvider = {
  async generate() {
    throw new Error("OpenAI provider is configured as an adapter placeholder. Mock mode is enabled unless OPENAI_API_KEY is wired.");
  }
};
