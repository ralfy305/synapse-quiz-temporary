export type SynapseModuleKey = "A" | "B" | "C" | "D" | "E";

export type SynapseQuestionType =
  | "mcq"
  | "likert"
  | "ranking"
  | "short_written"
  | "long_written"
  | "scenario";

export type SynapseRound = 1 | 2;

export type SynapseQuestion = {
  questionId: string;
  module: SynapseModuleKey;
  submodule: string;
  questionType: SynapseQuestionType;
  round1Text: string;
  round2Text: string | null;
  options: readonly string[] | null;
  minChars: number;
  hasTimer: boolean;
  requiresConsentGate: boolean;
  displayOrder: number;
  isActive: boolean;
};

export const SYNAPSE_MODULES = {
  A: {
      label: "Module A",
      title: "Individual Profile",
      description:
         "Values, decision-making, emotional expression, recharging, and criticism response.",
  },
  B: {
      label: "Module B",
      title: "Relationship Paradigm",
      description:
         "Non-negotiables, boundaries, financial expectations, affection, intimacy, and trust.",
  },
  C: {
      label: "Module C",
      title: "Scenario Dynamics",
      description:

        "High-signal conflict and intimacy scenarios that reveal behavior under pressure.",
 },
 D: {
     label: "Module D",
     title: "Friction & Synergy",
     description:
        "Recurring tension, desired change, and moments of relational synchrony.",
 },
 E: {
     label: "Module E",
     title: "Deep Reflection",
     description:
        "Self-only long-form reflection prompts that feed the final Synapse Report.",
 },
} as const;

export const SYNAPSE_QUESTIONS: readonly SynapseQuestion[] = [
 {
     questionId: "A1_Q1",
     module: "A",
     submodule: "A1",
     questionType: "ranking",
     round1Text: "Rank these from most to least important in your life right now.",
     round2Text:
        "Rank these as you believe your partner would rank them for their own life right now.",
     options: [
        "Career",
        "Financial Security",
        "Family",
        "Health",
        "Adventure",
        "Romance",
        "Community",
     ],
     minChars: 0,
     hasTimer: false,
     requiresConsentGate: false,
     displayOrder: 1,
     isActive: true,
 },
 {
     questionId: "A1_Q2",
     module: "A",
     submodule: "A1",
     questionType: "mcq",
     round1Text: "When you face a hard decision, what guides you most?",
     round2Text: "When your partner faces a hard decision, what guides them most?",
     options: [
        "Gut instinct",
        "Careful analysis",
        "Advice from trusted people",
        "A core personal principle",
     ],
     minChars: 0,
     hasTimer: false,

     requiresConsentGate: false,
     displayOrder: 2,
     isActive: true,
 },
 {
     questionId: "A2_Q1",
     module: "A",
     submodule: "A2",
     questionType: "likert",
     round1Text:
       "How easily do you express difficult emotions out loud? (0 = need days to process, 5 = say it as I feel it)",
     round2Text: "How easily does your partner express difficult emotions out loud?",
     options: null,
     minChars: 0,
     hasTimer: false,
     requiresConsentGate: false,
     displayOrder: 3,
     isActive: true,
 },
 {
     questionId: "A2_Q2",
     module: "A",
     submodule: "A2",
     questionType: "mcq",
     round1Text: "When someone cancels plans on you last minute, your gut reaction is:",
     round2Text:
       "When someone cancels plans on your partner last minute, their gut reaction is:",
     options: [
       "Frustration",
       "Disappointment",
       "Quiet understanding",
       "Feeling deprioritized",
     ],
     minChars: 0,
     hasTimer: false,
     requiresConsentGate: false,
     displayOrder: 4,
     isActive: true,
 },
 {
     questionId: "A3_Q1",
     module: "A",
     submodule: "A3",
     questionType: "mcq",
     round1Text: "When you are overwhelmed, how do you most effectively recharge?",
     round2Text:
       "When your partner is overwhelmed, how do they most effectively recharge?",
     options: [
       "Talking it through with someone",
       "Going fully solo",
       "Losing yourself in a hobby",
       "Physical movement",
     ],
     minChars: 0,

     hasTimer: false,
     requiresConsentGate: false,
     displayOrder: 5,
     isActive: true,
 },
 {
     questionId: "A3_Q2",
     module: "A",
     submodule: "A3",
     questionType: "mcq",
     round1Text: "When someone criticizes you, your immediate instinct is:",
     round2Text: "When someone criticizes your partner, their immediate instinct is:",
     options: [
       "Open listening",
       "Defending yourself",
       "Feeling hurt quietly",
       "Questioning their motive",
     ],
     minChars: 0,
     hasTimer: false,
     requiresConsentGate: false,
     displayOrder: 6,
     isActive: true,
 },
 {
     questionId: "B1_Q1",
     module: "B",
     submodule: "B1",
     questionType: "short_written",
     round1Text:
       "What are the three non-negotiable values this relationship must protect, no matter what?",
     round2Text:
       "What three non-negotiable values do you believe your partner requires this relationship to protect?",
     options: null,
     minChars: 100,
     hasTimer: false,
     requiresConsentGate: false,
     displayOrder: 7,
     isActive: true,
 },
 {
     questionId: "B2_Q1",
     module: "B",
     submodule: "B2",
     questionType: "likert",
     round1Text:
       "How comfortable are you with your partner maintaining close friendships with their exes? (0 = not at all, 5 = fully comfortable)",
     round2Text:
       "How comfortable is your partner with you maintaining close friendships with your exes?",
     options: null,
     minChars: 0,
     hasTimer: false,
     requiresConsentGate: false,

     displayOrder: 8,
     isActive: true,
 },
 {
     questionId: "B2_Q2",
     module: "B",
     submodule: "B2",
     questionType: "mcq",
     round1Text:
       "How much financial transparency do you expect in this relationship?",
     round2Text:
       "How much financial transparency does your partner expect from you?",
     options: [
       "Full visibility on everything",
       "Summaries of shared expenses only",
       "Complete financial independence",
       "Needs to be formally negotiated",
     ],
     minChars: 0,
     hasTimer: false,
     requiresConsentGate: false,
     displayOrder: 9,
     isActive: true,
 },
 {
     questionId: "B3_Q1",
     module: "B",
     submodule: "B3",
     questionType: "mcq",
     round1Text:
       "Which form of affection actually makes you feel most loved when you receive it?",
     round2Text:
       "Which form of affection makes your partner feel most loved when they receive it?",
     options: [
       "Words/Affirmation",
       "Physical Touch",
       "Acts of Service",
       "Quality Time",
       "Gifts",
     ],
     minChars: 0,
     hasTimer: false,
     requiresConsentGate: false,
     displayOrder: 10,
     isActive: true,
 },
 {
     questionId: "B3_Q2",
     module: "B",
     submodule: "B3",
     questionType: "short_written",
     round1Text:
       "What most reliably increases your desire for physical or emotional intimacy?",
     round2Text:
       "What most reliably increases your partner's desire for physical or emotional intimacy?",

     options: null,
     minChars: 100,
     hasTimer: false,
     requiresConsentGate: true,
     displayOrder: 11,
     isActive: true,
 },
 {
     questionId: "B3_Q3",
     module: "B",
     submodule: "B3",
     questionType: "mcq",
     round1Text: "What counts as the most severe breach of trust for you?",
     round2Text: "What does your partner consider the most severe breach of trust?",
     options: [
       "Physical infidelity",
       "Emotional affairs/confiding in others",
       "Hidden financial actions",
       "Sexting/digital secrets",
       "Public disrespect",
     ],
     minChars: 0,
     hasTimer: false,
     requiresConsentGate: true,
     displayOrder: 12,
     isActive: true,
 },
 {
     questionId: "C1_Q1",
     module: "C",
     submodule: "C1",
     questionType: "scenario",
     round1Text:
       "Your partner is upset with you and has gone completely silent. Describe exactly what you do in that moment, and what you hope happens next.",
     round2Text:
       "You are upset and have gone silent. How do you think your partner wants to respond, and how close do they actually come to doing that?",
     options: null,
     minChars: 200,
     hasTimer: true,
     requiresConsentGate: false,
     displayOrder: 13,
     isActive: true,
 },
 {
     questionId: "C1_Q2",
     module: "C",
     submodule: "C1",
     questionType: "scenario",
     round1Text:
       "You discover your partner hid a financial issue from you for months. What is your very first action, and what are you most afraid of in that moment?",
     round2Text:
       "You hid a financial issue for months. What do you imagine your partner's first reaction would be, and what would they need from you to begin to trust again?",
     options: null,
     minChars: 200,
     hasTimer: true,
     requiresConsentGate: false,
     displayOrder: 14,
     isActive: true,
 },
 {
     questionId: "C1_Q3",
     module: "C",
     submodule: "C1",
     questionType: "scenario",
     round1Text:
       "A close friend flirts with you at a party while your partner is across the room. Walk through what you do in the moment, and what you tell your partner afterward.",
     round2Text:
       "A close friend flirts with your partner. How do you think your partner handles it in the moment, and what do you need to hear from them afterward?",
     options: null,
     minChars: 200,
     hasTimer: true,
     requiresConsentGate: false,
     displayOrder: 15,
     isActive: true,
 },
 {
     questionId: "D1_Q1",
     module: "D",
     submodule: "D1",
     questionType: "mcq",
     round1Text:
       "Which topic consistently creates the most tension or avoidance between you?",
     round2Text: "Which topic does your partner avoid discussing the most?",
     options: [
       "Money",
       "Sex/Intimacy",
       "Family/In-laws",
       "Household chores",
       "Time management",
       "Other (write in)",
     ],
     minChars: 0,
     hasTimer: false,
     requiresConsentGate: false,
     displayOrder: 16,
     isActive: true,
 },
 {
     questionId: "D1_Q2",
     module: "D",
     submodule: "D1",
     questionType: "short_written",
     round1Text:
       "What is one pattern in this relationship you most want to change, and what would that change make possible?",
     round2Text:
       "What is the one pattern your partner most wants to change about the relationship?",
     options: null,
     minChars: 100,
     hasTimer: false,
     requiresConsentGate: false,
     displayOrder: 17,
     isActive: true,
 },
 {
     questionId: "D2_Q1",
     module: "D",
     submodule: "D2",
     questionType: "short_written",
     round1Text:
       'Describe your most "in sync" moment with your partner. What made it feel so effortless?',
     round2Text:
       'What moment would your partner describe as your most "in sync" time together?',
     options: null,
     minChars: 100,
     hasTimer: false,
     requiresConsentGate: false,
     displayOrder: 18,
     isActive: true,
 },
 {
     questionId: "E1_Q1",
     module: "E",
     submodule: "E1",
     questionType: "long_written",
     round1Text:
       "If this relationship were a story, what chapter are you in right now, and what would you title it?",
     round2Text: null,
     options: null,
     minChars: 100,
     hasTimer: false,
     requiresConsentGate: false,
     displayOrder: 19,
     isActive: true,
 },
 {
     questionId: "E1_Q2",
     module: "E",
     submodule: "E1",
     questionType: "long_written",
     round1Text:
       'Tell the story of a "no" you wish you had said sooner, in love, conflict, or intimacy. What would have changed if you had said it out loud?',
     round2Text: null,
     options: null,
     minChars: 100,
     hasTimer: false,
     requiresConsentGate: false,

       displayOrder: 20,
       isActive: true,
   },
   {
       questionId: "E1_Q3",
       module: "E",
       submodule: "E1",
       questionType: "long_written",
       round1Text:
         "Write a brief five-year vow: outline exactly how you will protect trust, honor limits, and keep choosing this person even when life gets loud.",
       round2Text: null,
       options: null,
       minChars: 100,
       hasTimer: false,
       requiresConsentGate: false,
       displayOrder: 21,
       isActive: true,
   },
] as const;

export const CONSENT_GATE_QUESTION_IDS = SYNAPSE_QUESTIONS.filter(
   (question) => question.requiresConsentGate
).map((question) => question.questionId);

export const TIMER_QUESTION_IDS = SYNAPSE_QUESTIONS.filter(
   (question) => question.hasTimer
).map((question) => question.questionId);

export const MODULE_E_QUESTION_IDS = SYNAPSE_QUESTIONS.filter(
   (question) => question.module === "E"
).map((question) => question.questionId);

export function getQuestionById(questionId: string) {
   return SYNAPSE_QUESTIONS.find((question) => question.questionId === questionId);
}

export function getQuestionsByModule(module: SynapseModuleKey) {
   return SYNAPSE_QUESTIONS.filter((question) => question.module === module);
}

export function getQuestionsBySubmodule(submodule: string) {
   return SYNAPSE_QUESTIONS.filter((question) => question.submodule === submodule);
}

export function getRoundText(question: SynapseQuestion, round: SynapseRound) {
   if (round === 1) return question.round1Text;
   return question.round2Text ?? question.round1Text;
}

export function isWrittenQuestion(question: SynapseQuestion) {
   return (
       question.questionType === "short_written" ||
       question.questionType === "long_written" ||
       question.questionType === "scenario"

    );
}

export function shouldRunVagueCheck(question: SynapseQuestion) {
    return isWrittenQuestion(question);
}

export function shouldRunScenarioAnalysis(question: SynapseQuestion) {
    return question.questionType === "scenario";
}

export function shouldRunStructuredAnalysis(question: SynapseQuestion) {
    return (
        question.questionType === "mcq" ||
        question.questionType === "likert" ||
        question.questionType === "ranking"
    );
}
