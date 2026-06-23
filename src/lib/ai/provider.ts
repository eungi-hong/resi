export type AiProvider = {
  generate(input: string): Promise<string>;
};

export function isMockMode() {
  return process.env.NEXT_PUBLIC_MOCK_MODE !== "false" || !process.env.OPENAI_API_KEY;
}
