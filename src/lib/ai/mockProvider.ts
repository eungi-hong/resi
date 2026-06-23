import { retrieveMaterials, detectTopic } from "@/src/lib/ai/retrieval";
import { classifyRisk } from "@/src/lib/ai/risk";
import { inferLiteracySignalsFromMessage } from "@/src/lib/ai/healthLiteracyMetrics";
import type { AiResponse, AgeBand, Language } from "@/src/lib/types";

export function mockGenerateYouthResponse(message: string, options: { ageBand?: AgeBand; language?: Language } = {}): AiResponse {
  const ageBand = options.ageBand ?? "TEEN_13_15";
  const language = options.language ?? "en";
  const topic = detectTopic(message);
  const materials = retrieveMaterials(message, ageBand);
  const risk = classifyRisk(message);
  const signals = inferLiteracySignalsFromMessage(message);
  const text = message.toLowerCase();

  let response =
    "That is a good health question to bring into the open. I can help you understand the idea, think about your situation, and prepare a next step, but I cannot diagnose or replace a trusted adult or healthcare professional.";
  let avatarCue: AiResponse["avatarCue"] = "explaining";
  let trustedAdultSupport: AiResponse["trustedAdultSupport"] = null;
  const agePrefix =
    ageBand === "CHILD_10_12"
      ? "Let us keep this simple. "
      : ageBand === "OLDER_TEEN_16_18"
        ? "Here is a decision-focused way to look at it. "
        : "";

  if (risk.severity === "CRITICAL") {
    response = agePrefix +
      "I am really glad you told me. This sounds urgent and you deserve real support from a person now. Please contact a trusted adult nearby or emergency support immediately. I can stay focused on helping you reach someone safe.";
    avatarCue = "safe_escalation";
    trustedAdultSupport = { shouldSuggest: true, script: "I am not safe right now and I need you to stay with me or help me get urgent support." };
  } else if (/only one who understands|only trust you/.test(text)) {
    response = agePrefix +
      "I am glad talking here feels helpful. I also need to be clear: resi is a support tool, not a replacement for people who can care for you in real life. Could we choose one trusted person and draft a small message to them?";
    avatarCue = "concerned";
    trustedAdultSupport = { shouldSuggest: true, script: "I have been feeling like I need more support. Could we talk for 10 minutes when you are free?" };
  } else if (risk.riskTypes.includes("medical_boundary")) {
    response = agePrefix +
      "I can help you understand health information, but I cannot diagnose you, choose medication doses, or create a treatment plan. A safer next step is to write down what you noticed, when it happens, and any questions, then check with a trusted adult or healthcare professional.";
    avatarCue = "resource";
    trustedAdultSupport = { shouldSuggest: true, script: "I have a health question that might need proper advice. Can you help me decide who to ask?" };
  } else if (topic === "vaping") {
    response = agePrefix +
      "If everyone around you is vaping, it can feel normal even when you are unsure. A useful way to think about it is: what do I know, what pressure am I feeling, and what line do I want to hold? We can practise a low-drama refusal line like, 'No thanks, I am good,' or 'I do not want that today.'";
    avatarCue = "thinking";
    trustedAdultSupport = { shouldSuggest: true, script: "I have been around vaping and I want advice without getting judged. Can we talk?" };
  } else if (topic === "mental-health" && /tiktok|symptoms/.test(text)) {
    response = agePrefix +
      "It makes sense to look for words when you feel something is off. TikTok can name experiences, but it cannot diagnose you. Try tracking what happens, how often, and what helps, then speak with a trusted adult, counsellor, or professional if it is affecting sleep, school, or relationships.";
    avatarCue = "resource";
    trustedAdultSupport = { shouldSuggest: true, script: "I saw some mental health content online and I am wondering if it fits what I feel. Can you help me think it through?" };
  } else if (topic === "diabetes") {
    response = agePrefix +
      "Being young can make health risks feel far away. The point is not to be scared or ashamed; it is that sleep, movement, food, and stress habits can protect your future self. Small habits count more than extreme changes.";
  } else if (topic === "screen-time" || topic === "sleep-stress") {
    response = agePrefix +
      "Scrolling for hours can make sleep harder because your brain stays alert and time slips by. A realistic plan is to choose one boundary you control, like charging your phone away from bed for 20 minutes before sleep, then noticing if your mood or energy changes.";
  }

  return {
    language,
    detectedTopics: [topic],
    youthEmotion: risk.severity === "HIGH" ? "distressed" : "curious",
    response,
    simplifiedSummary: "Learn the facts, notice your situation, and choose one safe next step.",
    teachBackQuestion: "What is one thing you would tell a friend who asked the same question?",
    suggestedQuickReplies:
      ageBand === "CHILD_10_12"
        ? ["Use a simple example", "What adult can help?", "Quiz me gently", "One safe next step"]
        : ageBand === "OLDER_TEEN_16_18"
          ? ["Give me a decision aid", "Check the claim", "Help me plan the conversation", "Go deeper"]
          : ["Explain simply", "Quiz me", "Help me talk to an adult", "What should I do next?"],
    recommendedMaterialIds: materials.map((material) => material.id),
    quizSuggestion: { topic, reason: "A short quiz can help resi adapt your next lesson." },
    trustedAdultSupport,
    avatarCue,
    riskAssessment: risk,
    healthLiteracySignals: signals
  };
}
