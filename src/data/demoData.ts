import type { Alert, AgeBand, DemoUser, EducationMaterial, LiteracyDimension, LiteracyMetric, Quiz } from "@/src/lib/types";

export const demoUsers: DemoUser[] = [
  { id: "asha", role: "YOUTH", name: "Asha", demoUsername: "asha", languagePreference: "en", age: 13, ageBand: "TEEN_13_15", avatarId: "see_wave" },
  { id: "weijun", role: "YOUTH", name: "Wei Jun", demoUsername: "weijun", languagePreference: "en", age: 16, ageBand: "OLDER_TEEN_16_18", avatarId: "ree_idle" },
  { id: "nabil", role: "YOUTH", name: "Nabil", demoUsername: "nabil", languagePreference: "en", age: 12, ageBand: "CHILD_10_12", avatarId: "ree_wave" },
  { id: "priya", role: "YOUTH", name: "Priya", demoUsername: "priya", languagePreference: "en", age: 17, ageBand: "OLDER_TEEN_16_18", avatarId: "see_idle" },
  { id: "parent-as", role: "PARENT", name: "Mrs Kumar", demoUsername: "parent", languagePreference: "en", linkedYouthIds: ["asha", "nabil"] },
  { id: "admin", role: "ADMIN", name: "MOH Demo Admin", demoUsername: "admin", languagePreference: "en" }
];

const ageConfig: Record<AgeBand, { label: string; difficulty: EducationMaterial["difficulty"]; dimension: LiteracyDimension; goalLabel: EducationMaterial["goalLabel"]; minutes: number }> = {
  CHILD_10_12: { label: "10-12", difficulty: "Starter", dimension: "FUNCTIONAL", goalLabel: "Understand", minutes: 4 },
  TEEN_13_15: { label: "13-15", difficulty: "Explorer", dimension: "INTERACTIVE", goalLabel: "Practise", minutes: 5 },
  OLDER_TEEN_16_18: { label: "16-18", difficulty: "Decision guide", dimension: "CRITICAL", goalLabel: "Question", minutes: 7 }
};

const baseTopics = [
  {
    topic: "vaping",
    title: "Vaping and peer pressure",
    summary: "Learn what vaping can do, why it can feel socially hard to say no, and practise a low-drama refusal script.",
    localContextNote: "In Singapore, vaping can still show up through peers and online content. This module focuses on choices, pressure, and support without shaming.",
    quickExplainer: "Vaping is often talked about like it is harmless or normal. resi's goal is not to scare you. It is to help you understand the risks and prepare for real social situations.",
    scenario: "Your friend says, 'Just try once, everyone does it.' You want a reply that does not turn into a big argument.",
    practiceActivity: ["Nah, I am good.", "I do not want to risk getting hooked.", "I am keeping my training and sleep clear."],
    myth: "If it smells fruity, it must be safer.",
    reality: "Flavour can make something feel less serious, but it does not prove it is safe or harmless.",
    trustedAdultScript: "I wanted to ask about vaping because people around me talk about it. I am not asking for a lecture. I want help thinking through what to do.",
    avatarCue: "thinking" as const
  },
  {
    topic: "diabetes",
    title: "Diabetes, body respect, and everyday habits",
    summary: "Understand why prevention can matter even when you feel young and fine, without shame or extreme dieting.",
    localContextNote: "Singapore has strong public-health attention on diabetes. This module keeps the message practical and body-respectful.",
    quickExplainer: "Diabetes prevention is not about blaming bodies. It is about noticing how sleep, movement, food, stress, and family history can shape future health.",
    scenario: "Your parent says diabetes matters, but you feel too young for it to be relevant.",
    practiceActivity: ["Pick one drink swap this week.", "Add a short walk after a meal.", "Notice whether sleep changes cravings or energy."],
    myth: "Only older adults need to care about diabetes.",
    reality: "Habits build early. Small choices now can support your future self without needing extreme rules.",
    trustedAdultScript: "Can we talk about diabetes in a way that is not about weight or blame? I want practical ideas I can actually try.",
    avatarCue: "reading" as const
  },
  {
    topic: "screen-time",
    title: "Screen time, sleep, and social media",
    summary: "Explore doomscrolling, comparison, attention, and sleep while building boundaries you control.",
    localContextNote: "Many Singapore youth juggle school chat groups, social feeds, games, and family expectations. The goal is balance, not guilt.",
    quickExplainer: "Screens are not automatically bad. The question is whether they are helping you rest, learn, connect, and feel okay.",
    scenario: "You plan to sleep, then short videos keep going for another hour.",
    practiceActivity: ["Charge the phone away from bed for 20 minutes.", "Use a 'last video' timer.", "Replace one scroll session with music, stretching, or a shower."],
    myth: "If I can still wake up for school, scrolling late is not affecting me.",
    reality: "Sleep quality can affect mood, attention, and stress even when you technically wake up on time.",
    trustedAdultScript: "I am trying to reset my sleep and phone habits. Can you help me make a plan that does not feel like punishment?",
    avatarCue: "resource" as const
  },
  {
    topic: "mental-health",
    title: "Mental health and online self-diagnosis",
    summary: "Name stress and feelings carefully, check online claims, and decide when to talk to someone trusted.",
    localContextNote: "Online labels can feel validating, but youth still deserve careful support from people who can understand context.",
    quickExplainer: "It can be helpful to find words for what you feel. It is also important not to let TikTok or a quiz diagnose you.",
    scenario: "A video lists anxiety symptoms and you recognise some of them.",
    practiceActivity: ["Track what happens, how often, and what helps.", "Ask one trusted adult or counsellor for a calm check-in.", "Notice whether sleep, school, or relationships are affected."],
    myth: "If a post describes me, I definitely have that condition.",
    reality: "A post can start reflection, but diagnosis needs a qualified person and your real-life context.",
    trustedAdultScript: "I saw mental health content online and I am wondering if it fits what I feel. Can you help me think it through?",
    avatarCue: "listening" as const
  },
  {
    topic: "sleep-stress",
    title: "Sleep and stress reset",
    summary: "Build a realistic wind-down plan for school pressure, late-night thoughts, and tired mornings.",
    localContextNote: "Stress from school, tuition, CCAs, and family expectations can make sleep feel hard. This module starts small.",
    quickExplainer: "Sleep is not just discipline. It is affected by routines, worry, light, caffeine, noise, and what your brain expects at night.",
    scenario: "You feel tired but your mind keeps replaying tomorrow's tasks.",
    practiceActivity: ["Write a two-minute worry list.", "Choose one consistent wind-down cue.", "Move the hardest conversation to daytime if possible."],
    myth: "Rest only counts if I fall asleep immediately.",
    reality: "Quiet rest and a repeatable routine can still train your body toward sleep.",
    trustedAdultScript: "I am tired and stressed, and I want help making nights easier instead of just being told to sleep earlier.",
    avatarCue: "concerned" as const
  },
  {
    topic: "nutrition-movement",
    title: "Food, movement, and energy",
    summary: "Think about energy, strength, and mood without body shaming or all-or-nothing rules.",
    localContextNote: "Singapore food culture is varied and social. This module focuses on patterns and choices, not perfect meals.",
    quickExplainer: "Food and movement support your body, brain, mood, and sleep. You do not need extreme rules to learn what helps you.",
    scenario: "You want more energy, but advice online keeps turning into strict diet rules.",
    practiceActivity: ["Add one filling breakfast option.", "Notice how different snacks affect focus.", "Pick movement that does not feel like punishment."],
    myth: "Healthy eating means never enjoying favourite foods.",
    reality: "A sustainable pattern can include favourite foods and still support health.",
    trustedAdultScript: "Can we talk about food and movement without comments about body size? I want help with energy and habits.",
    avatarCue: "celebrate" as const
  },
  {
    topic: "misinformation",
    title: "Health misinformation and miracle claims",
    summary: "Learn how to check online health claims, influencer advice, fear language, and miracle cures.",
    localContextNote: "Youth see health advice across TikTok, Instagram, chat groups, and ads. This module builds source-checking confidence.",
    quickExplainer: "Not every confident post is trustworthy. resi helps you slow down and ask: who said this, what evidence is shown, and what might they gain?",
    scenario: "An influencer says a supplement fixes stress, skin, sleep, and weight in one week.",
    practiceActivity: ["Check the source.", "Look for evidence, not only testimonials.", "Compare with a trusted health or school resource."],
    myth: "If many people share it, it must work.",
    reality: "Popularity can spread mistakes quickly. Evidence matters more than vibes.",
    trustedAdultScript: "I found a health claim online and want to check it before believing or sharing it. Can we look at it together?",
    avatarCue: "pointing" as const
  }
] as const;

function ageCopy(ageBand: AgeBand, topic: string) {
  if (ageBand === "CHILD_10_12") {
    return {
      prefix: "Start simple",
      learn: ["Spot the main idea", "Choose one safe next step", "Know when to ask an adult"],
      tone: `A short, concrete ${topic} lesson with examples you can picture.`
    };
  }
  if (ageBand === "TEEN_13_15") {
    return {
      prefix: "Practise in real life",
      learn: ["Understand the pressure around the topic", "Practise words you can actually use", "Decide who could support you"],
      tone: `A scenario-based ${topic} lesson for school, friends, online spaces, and family conversations.`
    };
  }
  return {
    prefix: "Make a decision",
    learn: ["Compare claims and tradeoffs", "Plan a self-directed next step", "Prepare questions for adults or professionals"],
    tone: `A decision-aid ${topic} lesson with misinformation checks and autonomy-preserving support.`
  };
}

export const educationMaterials: EducationMaterial[] = baseTopics.flatMap((base) =>
  (Object.keys(ageConfig) as AgeBand[]).map((ageBand) => {
    const config = ageConfig[ageBand];
    const copy = ageCopy(ageBand, base.title.toLowerCase());
    return {
      id: `${base.topic}-${ageBand.toLowerCase()}`,
      topic: base.topic,
      title: `${base.title}: ${config.difficulty}`,
      summary: base.summary,
      content: copy.tone,
      ageBand,
      language: "en",
      readingLevel: ageBand === "CHILD_10_12" ? "simple" : ageBand === "TEEN_13_15" ? "middle" : "advanced",
      literacyDimension: config.dimension,
      sourceStatus: "SAMPLE",
      localContextNote: base.localContextNote,
      estimatedMinutes: config.minutes,
      difficulty: config.difficulty,
      goalLabel: config.goalLabel,
      progress: ageBand === "TEEN_13_15" ? 42 : ageBand === "OLDER_TEEN_16_18" ? 28 : 18,
      whatYouLearn: copy.learn,
      quickExplainer: `${copy.prefix}: ${base.quickExplainer}`,
      scenario: base.scenario,
      practiceActivity: base.practiceActivity,
      mythCheck: { myth: base.myth, reality: base.reality },
      trustedAdultScript: base.trustedAdultScript,
      avatarCue: base.avatarCue
    };
  })
);

function topicQuizQuestions(material: EducationMaterial): Quiz["questions"] {
  const adultOption = material.ageBand === "CHILD_10_12" ? "Ask a trusted adult to think it through with you" : "Ask a trusted person or compare with a reliable source";
  const shared = [
    {
      id: `${material.id}-q-support`,
      prompt: "What is the safest first step if you feel unsure?",
      options: ["Keep it secret", adultOption, "Copy what friends or influencers do"],
      answerIndex: 1,
      dimension: "INTERACTIVE" as const,
      explanation: "Trusted support helps you use health information in a real situation."
    },
    {
      id: `${material.id}-q-source`,
      prompt: "Which is a warning sign that a health claim may be unreliable?",
      options: ["It explains limits clearly", "It uses miracle-cure language", "It suggests checking with a professional"],
      answerIndex: 1,
      dimension: "CRITICAL" as const,
      explanation: "Miracle claims often skip evidence, tradeoffs, and safety limits."
    }
  ];

  const byTopic: Record<string, Quiz["questions"]> = {
    vaping: [
      {
        id: `${material.id}-q-fact`,
        prompt: "Why can vaping be risky even when a flavour sounds harmless?",
        options: ["Flavour proves it is safe", "It can still involve nicotine, chemicals, and habit-forming use", "Only adults can be affected"],
        answerIndex: 1,
        dimension: "FUNCTIONAL",
        explanation: "Flavour can make vaping feel less serious, but it does not prove safety."
      },
      {
        id: `${material.id}-q-scenario`,
        prompt: "A friend says, 'Just try once.' Which reply keeps the boundary low-drama?",
        options: ["No thanks, I am good", "Everyone who vapes is bad", "I will do it if nobody finds out"],
        answerIndex: 0,
        dimension: "INTERACTIVE",
        explanation: "A short, calm line is easier to use when pressure is happening."
      },
      ...shared
    ],
    diabetes: [
      {
        id: `${material.id}-q-fact`,
        prompt: "What is the point of learning about diabetes when you are young?",
        options: ["To blame bodies", "To notice habits that can support future health", "To follow extreme diet rules"],
        answerIndex: 1,
        dimension: "FUNCTIONAL",
        explanation: "The goal is practical prevention without shame or extreme rules."
      },
      {
        id: `${material.id}-q-scenario`,
        prompt: "Which small step best matches this module?",
        options: ["Skip meals to be healthy", "Try one drink swap or short walk after a meal", "Ignore sleep and stress"],
        answerIndex: 1,
        dimension: "INTERACTIVE",
        explanation: "Small sustainable actions are more useful than all-or-nothing rules."
      },
      ...shared
    ],
    "screen-time": [
      {
        id: `${material.id}-q-fact`,
        prompt: "Why can late scrolling affect the next day?",
        options: ["Sleep quality can affect mood, attention, and stress", "Screens never affect rest", "Only games affect sleep"],
        answerIndex: 0,
        dimension: "FUNCTIONAL",
        explanation: "Even when you wake up on time, sleep quality can still matter."
      },
      {
        id: `${material.id}-q-scenario`,
        prompt: "Which boundary is most realistic to test first?",
        options: ["Never use a phone again", "Use a last-video timer tonight", "Hide the problem from everyone"],
        answerIndex: 1,
        dimension: "INTERACTIVE",
        explanation: "A small test gives you evidence about what works."
      },
      ...shared
    ],
    "mental-health": [
      {
        id: `${material.id}-q-fact`,
        prompt: "Why should online mental-health labels be handled carefully?",
        options: ["A post can start reflection, but it cannot diagnose you", "Every video is a diagnosis", "Feelings should be ignored"],
        answerIndex: 0,
        dimension: "FUNCTIONAL",
        explanation: "Diagnosis needs a qualified person and your real-life context."
      },
      {
        id: `${material.id}-q-scenario`,
        prompt: "A video describes anxiety and it sounds familiar. What is a strong next step?",
        options: ["Panic and self-diagnose immediately", "Track what happens and ask a trusted adult or counsellor", "Never talk about it"],
        answerIndex: 1,
        dimension: "INTERACTIVE",
        explanation: "Tracking patterns and asking for support turns a worry into a clearer conversation."
      },
      ...shared
    ],
    "sleep-stress": [
      {
        id: `${material.id}-q-fact`,
        prompt: "What can make sleep harder besides discipline?",
        options: ["Only laziness", "Routines, worry, light, caffeine, and stress", "Nothing affects sleep"],
        answerIndex: 1,
        dimension: "FUNCTIONAL",
        explanation: "Sleep is shaped by routines and stress signals, not just willpower."
      },
      {
        id: `${material.id}-q-scenario`,
        prompt: "Your mind keeps replaying tomorrow's tasks. What is a useful reset?",
        options: ["Scroll until you forget", "Write a two-minute worry list", "Start a hard conversation at midnight"],
        answerIndex: 1,
        dimension: "INTERACTIVE",
        explanation: "A short worry list can move tasks out of your head and into a plan."
      },
      ...shared
    ],
    "nutrition-movement": [
      {
        id: `${material.id}-q-fact`,
        prompt: "What is this module trying to avoid?",
        options: ["Body shaming and extreme rules", "Energy and mood", "Enjoying favourite foods"],
        answerIndex: 0,
        dimension: "FUNCTIONAL",
        explanation: "Health learning should support energy, strength, and mood without shame."
      },
      {
        id: `${material.id}-q-scenario`,
        prompt: "Which next step is most sustainable?",
        options: ["Ban every favourite food", "Notice how different snacks affect focus", "Exercise as punishment"],
        answerIndex: 1,
        dimension: "INTERACTIVE",
        explanation: "Noticing patterns helps you choose what supports your day."
      },
      ...shared
    ],
    misinformation: [
      {
        id: `${material.id}-q-fact`,
        prompt: "What matters more than a post being popular?",
        options: ["Evidence and source quality", "How confident the influencer sounds", "How many people share it"],
        answerIndex: 0,
        dimension: "CRITICAL",
        explanation: "Popularity can spread mistakes quickly; evidence matters more."
      },
      {
        id: `${material.id}-q-scenario`,
        prompt: "An influencer says one supplement fixes stress, skin, sleep, and weight. What should you do first?",
        options: ["Buy it before it sells out", "Check the source and look for evidence", "Share it with friends immediately"],
        answerIndex: 1,
        dimension: "CRITICAL",
        explanation: "Big multi-problem claims deserve careful checking before acting or sharing."
      },
      ...shared
    ]
  };

  return [
    ...(byTopic[material.topic] ?? shared),
    {
      id: `${material.id}-q-diagnosis`,
      prompt: "Why does resi avoid diagnosing or prescribing treatment?",
      options: ["Diagnosis and treatment need a qualified professional", "Symptoms never matter", "Questions are not allowed"],
      answerIndex: 0,
      dimension: "FUNCTIONAL",
      explanation: "Health learning can guide questions and next steps, but it is not clinical care."
    }
  ];
}

export const quizzes: Quiz[] = educationMaterials.map((material) => ({
  id: `${material.id}-quiz`,
  topic: material.topic,
  ageBand: material.ageBand,
  language: material.language,
  title: `${material.title.split(":")[0]} check-in`,
  literacyDimension: material.literacyDimension,
  questions: topicQuizQuestions(material)
}));

export const initialMetrics: Record<string, LiteracyMetric[]> = {
  asha: [
    { topic: "vaping", dimension: "FUNCTIONAL", score: 62, confidence: 0.58, evidence: ["Understands basic vaping risk"] },
    { topic: "vaping", dimension: "INTERACTIVE", score: 48, confidence: 0.45, evidence: ["Practising peer-pressure scripts"] },
    { topic: "vaping", dimension: "CRITICAL", score: 42, confidence: 0.36, evidence: ["Needs practice questioning social norms"] }
  ],
  weijun: [
    { topic: "misinformation", dimension: "FUNCTIONAL", score: 74, confidence: 0.7, evidence: ["Strong factual recall"] },
    { topic: "misinformation", dimension: "INTERACTIVE", score: 68, confidence: 0.58, evidence: ["Plans questions before acting"] },
    { topic: "misinformation", dimension: "CRITICAL", score: 61, confidence: 0.54, evidence: ["Compares online claims"] }
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
    title: "Area to watch: peer pressure around vaping",
    summary: "Asha has been exploring whether vaping is normal if friends are doing it. No raw chat transcript is shared by default.",
    recommendedActions: ["Start with curiosity", "Avoid accusations", "Offer to practise a refusal script"],
    status: "OPEN"
  },
  {
    id: "alert-nabil-sleep",
    youthUserId: "nabil",
    severity: "LOW",
    type: "sleep_screen_time",
    title: "Support note: sleep and scrolling",
    summary: "Nabil is learning how late-night scrolling can affect sleep and mood.",
    recommendedActions: ["Ask what boundary feels fair", "Avoid taking the phone as a first move", "Offer to test one routine for a week"],
    status: "OPEN"
  }
];

export const parentInsights = {
  asha: {
    summary: "Asha may be working through peer pressure around vaping and wants practical words that do not make the situation bigger.",
    strengths: ["Understands that peer pressure changes decision-making", "Open to practising scripts"],
    growthAreas: ["Questioning the idea that 'everyone does it' means it is safe"],
    approach: "Start with curiosity, not accusation. Ask what makes saying no hard before giving advice.",
    starters: ["What do people your age usually find hard about saying no?", "Would it help to practise a line you can use without making it awkward?"]
  },
  nabil: {
    summary: "Nabil is noticing a link between scrolling, sleep, and energy.",
    strengths: ["Can name one habit that affects sleep"],
    growthAreas: ["Needs a concrete routine that feels fair"],
    approach: "Use a collaborative experiment rather than a punishment.",
    starters: ["What is one phone boundary that would feel possible this week?", "Should we try a short sleep reset together?"]
  }
};

export function getYouthUsers() {
  return demoUsers.filter((user) => user.role === "YOUTH");
}

export function getUser(id = "asha") {
  return demoUsers.find((user) => user.id === id) ?? demoUsers[0];
}

export function getMaterialsFor(ageBand: string, language = "en", topic?: string) {
  const filtered = educationMaterials.filter((material) => material.ageBand === ageBand && (!topic || material.topic === topic));
  return filtered.filter((material) => material.language === "en" || material.language === language);
}

export function getRecommendedMaterials(userId = "asha") {
  const user = getUser(userId);
  return getMaterialsFor(user.ageBand ?? "TEEN_13_15", "en").slice(0, 4);
}
