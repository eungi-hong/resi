import type { Severity } from "@/src/lib/types";

export function classifyRisk(message: string): { severity: Severity; riskTypes: string[]; parentAlertRecommended: boolean; rationale: string } {
  const text = message.toLowerCase();
  if (/(kill myself|end my life|self harm|hurt myself|suicide|immediate danger|not safe right now|someone is hurting me|abuse)/.test(text)) {
    return {
      severity: "CRITICAL",
      riskTypes: ["self_harm", "crisis"],
      parentAlertRecommended: true,
      rationale: "Message suggests possible immediate danger or self-harm risk."
    };
  }
  if (/(chest pain|can't breathe|cant breathe|overdose|fainted|bleeding a lot)/.test(text)) {
    return {
      severity: "CRITICAL",
      riskTypes: ["medical_urgency"],
      parentAlertRecommended: true,
      rationale: "Message may describe urgent physical danger that needs immediate in-person help."
    };
  }
  if (/(only one who understands|only trust you|don't tell|dont tell|hide this)/.test(text)) {
    return {
      severity: "HIGH",
      riskTypes: ["ai_dependency", "secrecy"],
      parentAlertRecommended: true,
      rationale: "Message indicates possible overreliance on AI or secrecy around safety."
    };
  }
  if (/(dose|medicine|medication|diagnose|do i have|symptoms mean|treatment plan)/.test(text)) {
    return {
      severity: "MODERATE",
      riskTypes: ["medical_boundary"],
      parentAlertRecommended: false,
      rationale: "Message could cross into diagnosis, medication, or treatment advice."
    };
  }
  if (/(vap(e|ing)|smoke|anxiety|tiktok|scroll|doomscroll|diabetes|weight|body|bully|bullied)/.test(text)) {
    return {
      severity: "MODERATE",
      riskTypes: [/vap(e|ing)/.test(text) ? "vaping" : text.includes("tiktok") ? "misinformation" : "health_concern"],
      parentAlertRecommended: false,
      rationale: "Message includes a youth health topic that may benefit from supportive monitoring."
    };
  }
  return { severity: "LOW", riskTypes: ["general_learning"], parentAlertRecommended: false, rationale: "General educational query." };
}

export function shouldCreateParentAlert(severity: Severity, visibilityLevel: "LOW" | "MEDIUM" | "HIGH" = "MEDIUM") {
  if (severity === "HIGH" || severity === "CRITICAL") return true;
  return severity === "MODERATE" && visibilityLevel === "HIGH";
}
