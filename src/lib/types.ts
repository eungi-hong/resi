export type Role = "YOUTH" | "PARENT" | "ADMIN";
export type Language = "en" | "zh" | "ms" | "ta";
export type AgeBand = "CHILD_10_12" | "TEEN_13_15" | "OLDER_TEEN_16_18";
export type LiteracyDimension = "FUNCTIONAL" | "INTERACTIVE" | "CRITICAL";
export type Severity = "NONE" | "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
export type AvatarCue = "idle" | "wave" | "thinking" | "explaining" | "celebrate" | "concerned" | "resource" | "quiz" | "safe_escalation";

export type DemoUser = {
  id: string;
  role: Role;
  name: string;
  demoUsername: string;
  languagePreference: Language;
  age?: number;
  ageBand?: AgeBand;
  avatarId?: string;
  linkedYouthIds?: string[];
};

export type EducationMaterial = {
  id: string;
  topic: string;
  title: string;
  summary: string;
  content: string;
  ageBand: AgeBand;
  language: Language;
  readingLevel: string;
  literacyDimension: LiteracyDimension;
  sourceStatus: "SAMPLE" | "UNVERIFIED" | "OFFICIAL_REVIEWED";
  localContextNote: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  dimension: LiteracyDimension;
  explanation: string;
};

export type Quiz = {
  id: string;
  topic: string;
  ageBand: AgeBand;
  language: Language;
  title: string;
  literacyDimension: LiteracyDimension;
  questions: QuizQuestion[];
};

export type LiteracyMetric = {
  topic: string;
  dimension: LiteracyDimension;
  score: number;
  confidence: number;
  evidence: string[];
};

export type Alert = {
  id: string;
  youthUserId: string;
  severity: Severity;
  type: string;
  title: string;
  summary: string;
  recommendedActions: string[];
  status: "OPEN" | "ACKNOWLEDGED" | "RESOLVED";
};

export type AiResponse = {
  language: Language;
  detectedTopics: string[];
  youthEmotion: string;
  response: string;
  simplifiedSummary: string;
  teachBackQuestion: string | null;
  suggestedQuickReplies: string[];
  recommendedMaterialIds: string[];
  quizSuggestion: { topic: string; reason: string } | null;
  trustedAdultSupport: { shouldSuggest: boolean; script: string } | null;
  avatarCue: AvatarCue;
  riskAssessment: {
    severity: Severity;
    riskTypes: string[];
    parentAlertRecommended: boolean;
    rationale: string;
  };
  healthLiteracySignals: {
    functional: "low" | "medium" | "high";
    interactive: "low" | "medium" | "high";
    critical: "low" | "medium" | "high";
    evidence: string[];
  };
};
