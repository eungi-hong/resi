import { educationMaterials } from "@/src/data/demoData";

export function detectTopic(message: string) {
  const text = message.toLowerCase();
  if (/vap(e|ing)|smok/.test(text)) return "vaping";
  if (/diabetes|weight|obesity|food|exercise/.test(text)) return "diabetes";
  if (/scroll|screen|social media|phone|doomscroll/.test(text)) return "screen-time";
  if (/anxiety|sad|stress|mental|panic|depress|tiktok/.test(text)) return "mental-health";
  if (/sleep|tired/.test(text)) return "sleep-stress";
  if (/misinformation|claim|influencer|miracle/.test(text)) return "misinformation";
  return "misinformation";
}

export function retrieveMaterials(message: string, ageBand = "TEEN_13_15") {
  const topic = detectTopic(message);
  return educationMaterials.filter((material) => material.topic === topic && material.ageBand === ageBand).slice(0, 2);
}
