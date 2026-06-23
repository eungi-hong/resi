import { classifyRisk } from "@/src/lib/ai/risk";

export function youthSafetyCheck(message: string) {
  const risk = classifyRisk(message);
  return {
    allowed: true,
    risk,
    boundaries: ["educational_only", "no_diagnosis", "no_emergency_care", "trusted_adult_support"]
  };
}
