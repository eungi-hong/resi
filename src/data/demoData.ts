import type { Alert, DemoUser, EducationMaterial, LiteracyMetric, Quiz } from "@/src/lib/types";

export const demoUsers: DemoUser[] = [
  { id: "asha", role: "YOUTH", name: "Asha", demoUsername: "asha", languagePreference: "ta", age: 13, ageBand: "TEEN_13_15", avatarId: "see_wave" },
  { id: "weijun", role: "YOUTH", name: "Wei Jun", demoUsername: "weijun", languagePreference: "zh", age: 16, ageBand: "OLDER_TEEN_16_18", avatarId: "ree_idle" },
  { id: "nabil", role: "YOUTH", name: "Nabil", demoUsername: "nabil", languagePreference: "ms", age: 12, ageBand: "CHILD_10_12", avatarId: "ree_wave" },
  { id: "priya", role: "YOUTH", name: "Priya", demoUsername: "priya", languagePreference: "en", age: 17, ageBand: "OLDER_TEEN_16_18", avatarId: "see_idle" },
  { id: "parent-as", role: "PARENT", name: "Mrs Kumar", demoUsername: "parent", languagePreference: "en", linkedYouthIds: ["asha", "nabil"] },
  { id: "admin", role: "ADMIN", name: "MOH Demo Admin", demoUsername: "admin", languagePreference: "en" }
];

const topics = [
  ["vaping", "Vaping and smoking", "Peer pressure, myths, refusal skills, and supporting friends."],
  ["diabetes", "Diabetes and healthy habits", "Shame-free prevention, food, movement, sleep, and the invincibility gap."],
  ["screen-time", "Screen time and social media", "Sleep, mood, comparison, doomscrolling, and healthier boundaries."],
  ["mental-health", "Mental health and stress", "Emotions, stress, online self-diagnosis, and asking for help."],
  ["sleep-stress", "Sleep and stress", "Wind-down routines, school pressure, and practical recovery."],
  ["nutrition-movement", "Nutrition and movement", "Everyday energy, body respect, and sustainable habits."],
  ["misinformation", "Online misinformation", "How to check miracle claims, influencer advice, and fear-based posts."]
] as const;

const ageBands = ["CHILD_10_12", "TEEN_13_15", "OLDER_TEEN_16_18"] as const;

export const educationMaterials: EducationMaterial[] = topics.flatMap(([topic, title, summary]) =>
  ageBands.map((ageBand, index) => ({
    id: `${topic}-${ageBand.toLowerCase()}`,
    topic,
    title: `${title}: ${index === 0 ? "Starter" : index === 1 ? "Explorer" : "Decision guide"}`,
    summary,
    content:
      `This sample lesson helps you understand ${title.toLowerCase()} in a Singapore youth context. It focuses on facts, personal choices, and how to ask a trusted adult for support. ` +
      "It is educational and not medical advice. Check official sources or a healthcare professional for personal concerns.",
    ageBand,
    language: "en",
    readingLevel: index === 0 ? "simple" : index === 1 ? "middle" : "advanced",
    literacyDimension: index === 0 ? "FUNCTIONAL" : index === 1 ? "INTERACTIVE" : "CRITICAL",
    sourceStatus: "SAMPLE",
    localContextNote: "Demo-localized for Singapore's multilingual, school, family, and peer contexts."
  }))
);

export const quizzes: Quiz[] = topics.map(([topic, title]) => ({
  id: `${topic}-quiz`,
  topic,
  ageBand: topic === "vaping" ? "TEEN_13_15" : "OLDER_TEEN_16_18",
  language: "en",
  title: `${title} quiz`,
  literacyDimension: topic === "misinformation" ? "CRITICAL" : "INTERACTIVE",
  questions: [
    {
      id: `${topic}-q1`,
      prompt: "What is a strong first step when you see a health claim online?",
      options: ["Share it quickly", "Check who said it and what evidence they used", "Assume it is false"],
      answerIndex: 1,
      dimension: "CRITICAL",
      explanation: "Checking source and evidence builds critical health literacy."
    },
    {
      id: `${topic}-q2`,
      prompt: "If you feel unsure about a health choice, what can help?",
      options: ["Ask one trusted adult or professional", "Keep it secret", "Only ask social media"],
      answerIndex: 0,
      dimension: "INTERACTIVE",
      explanation: "Trusted support helps you apply information safely."
    },
    {
      id: `${topic}-q3`,
      prompt: "Why does resi avoid diagnosing you?",
      options: ["Because diagnosis needs a qualified professional", "Because symptoms never matter", "Because questions are not allowed"],
      answerIndex: 0,
      dimension: "FUNCTIONAL",
      explanation: "Health learning is different from clinical diagnosis."
    },
    {
      id: `${topic}-q4`,
      prompt: "What does a good conversation starter sound like?",
      options: ["You are wrong", "Can I talk about something I am trying to understand?", "Never mind"],
      answerIndex: 1,
      dimension: "INTERACTIVE",
      explanation: "Open, specific language makes support easier."
    },
    {
      id: `${topic}-q5`,
      prompt: "Which is a misinformation red flag?",
      options: ["Clear source links", "Miracle cure language", "Saying to ask a professional"],
      answerIndex: 1,
      dimension: "CRITICAL",
      explanation: "Miracle claims often skip real evidence."
    }
  ]
}));

export const initialMetrics: Record<string, LiteracyMetric[]> = {
  asha: [
    { topic: "vaping", dimension: "FUNCTIONAL", score: 62, confidence: 0.58, evidence: ["Completed vaping starter"] },
    { topic: "vaping", dimension: "INTERACTIVE", score: 48, confidence: 0.45, evidence: ["Asked about peer pressure"] },
    { topic: "vaping", dimension: "CRITICAL", score: 42, confidence: 0.36, evidence: ["Needs practice spotting social norms"] }
  ],
  weijun: [
    { topic: "misinformation", dimension: "FUNCTIONAL", score: 74, confidence: 0.7, evidence: ["Strong factual recall"] },
    { topic: "misinformation", dimension: "INTERACTIVE", score: 68, confidence: 0.58, evidence: ["Plans questions before acting"] },
    { topic: "misinformation", dimension: "CRITICAL", score: 61, confidence: 0.54, evidence: ["Compares claims"] }
  ],
  nabil: [
    { topic: "screen-time", dimension: "FUNCTIONAL", score: 55, confidence: 0.44, evidence: ["Understands sleep link"] },
    { topic: "screen-time", dimension: "INTERACTIVE", score: 38, confidence: 0.36, evidence: ["Needs routine practice"] },
    { topic: "screen-time", dimension: "CRITICAL", score: 34, confidence: 0.3, evidence: ["Early learner"] }
  ],
  priya: [
    { topic: "mental-health", dimension: "FUNCTIONAL", score: 70, confidence: 0.62, evidence: ["Knows stress signals"] },
    { topic: "mental-health", dimension: "INTERACTIVE", score: 58, confidence: 0.5, evidence: ["Considering support options"] },
    { topic: "mental-health", dimension: "CRITICAL", score: 65, confidence: 0.57, evidence: ["Questions online self-diagnosis"] }
  ]
};

export const demoAlerts: Alert[] = [
  {
    id: "alert-asha-vaping",
    youthUserId: "asha",
    severity: "MODERATE",
    type: "peer_pressure",
    title: "Possible peer pressure around vaping",
    summary: "Asha has been exploring whether vaping is normal if friends are doing it. No raw chat transcript is shared by default.",
    recommendedActions: ["Start with curiosity", "Avoid accusations", "Offer to practise a refusal script"],
    status: "OPEN"
  }
];

export function getYouthUsers() {
  return demoUsers.filter((user) => user.role === "YOUTH");
}

export function getUser(id = "asha") {
  return demoUsers.find((user) => user.id === id) ?? demoUsers[0];
}

export function getMaterialsFor(ageBand: string, language = "en", topic?: string) {
  const filtered = educationMaterials.filter((material) => material.ageBand === ageBand && (!topic || material.topic === topic));
  return filtered.filter((material) => material.language === language || material.language === "en");
}
