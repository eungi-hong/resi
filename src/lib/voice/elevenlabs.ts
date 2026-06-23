export function elevenLabsEnabled() {
  return Boolean(process.env.ELEVENLABS_API_KEY && (process.env.ELEVENLABS_VOICE_ID_REE || process.env.ELEVENLABS_VOICE_ID_SEE));
}

export async function synthesizeWithElevenLabs() {
  throw new Error("ElevenLabs is optional for the MVP. Configure API route wiring before enabling live voice.");
}
