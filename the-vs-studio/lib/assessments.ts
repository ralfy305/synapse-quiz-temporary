export type BaseQuestion = {
  id: string;
  text: string;
};

export type ChoiceQuestion = BaseQuestion & {
  type: "mcq" | "rank" | "scenario";
  options: string[];
};

export type ScaleQuestion = BaseQuestion & {
  type: "scale";
  labels: [string, string];
};

export type TextQuestion = BaseQuestion & {
  type: "text";
  placeholder?: string;
};

export type AssessmentQuestion = ChoiceQuestion | ScaleQuestion | TextQuestion;

export type AssessmentModule = {
  id: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
};

export const ASSESSMENT_MODULES: AssessmentModule[] = [
  {
    id: "individual",
    title: "The Individual Profile",
    description: "Baseline values, decision style, and emotional instincts.",
    questions: [
      {
        id: "individual-1",
        type: "rank",
        text: "Please rank the following life areas in order of importance right now.",
        options: [
          "Career and personal growth",
          "Financial security",
          "Family and close friendships",
          "Health and wellness",
          "Adventure and new experiences",
          "Romantic partnership",
          "Community and social life",
        ],
      },
      {
        id: "individual-2",
        type: "mcq",
        text: "When making a major life decision, your primary guide is usually:",
        options: [
          "Gut instinct and intuition",
          "Careful analysis of tradeoffs",
          "Advice from people you trust",
          "Core principles and values",
        ],
      },
      {
        id: "individual-3",
        type: "scenario",
        text: "A close partner cancels an important plan at the last minute. What is your first private reaction?",
        options: [
          "Frustration and anger",
          "Disappointment and sadness",
          "Immediate understanding",
          "Feeling let down or disrespected",
        ],
      },
    ],
  },
  {
    id: "preferences",
    title: "Preferences and Boundaries",
    description: "Needs, triggers, repair style, and daily connection patterns.",
    questions: [
      {
        id: "preferences-1",
        type: "text",
        text: "What are three non-negotiable values you live by in a relationship?",
        placeholder: "Honesty, growth, consistency...",
      },
      {
        id: "preferences-2",
        type: "text",
        text: "What small everyday gestures make you feel most loved or desired?",
        placeholder: "Morning coffee, affectionate check-ins, acts of care...",
      },
      {
        id: "preferences-3",
        type: "mcq",
        text: "How do you prefer to resolve conflict?",
        options: [
          "Fast and direct",
          "With some space first",
          "In writing before talking",
          "Only after emotions cool down",
        ],
      },
      {
        id: "preferences-4",
        type: "scale",
        text: "How well does your partner currently speak your love language?",
        labels: ["Rarely gets it right", "Fluent"],
      },
    ],
  },
  {
    id: "future",
    title: "Aspirations and Alignment",
    description: "Commitment pace, shared vision, and long-range compatibility.",
    questions: [
      {
        id: "future-1",
        type: "text",
        text: "Where do you see yourself in five years, and how does your partner fit that picture?",
      },
      {
        id: "future-2",
        type: "mcq",
        text: "What pace for deepening commitment feels ideal?",
        options: [
          "Take it slow",
          "Steady progress over time",
          "Ready when it feels right",
          "Move quickly when there is clarity",
        ],
      },
      {
        id: "future-3",
        type: "mcq",
        text: "How should financial decisions work in the long run?",
        options: [
          "Fully separate",
          "Mixed model with shared expenses",
          "Mostly combined",
          "Undecided",
        ],
      },
      {
        id: "future-4",
        type: "scale",
        text: "How aligned do you feel your current life goals are with your partner's?",
        labels: ["Very misaligned", "Perfectly aligned"],
      },
    ],
  },
  {
    id: "dynamics",
    title: "Compatibility and Dynamics",
    description: "Communication under stress, teamwork, and felt safety.",
    questions: [
      {
        id: "dynamics-1",
        type: "text",
        text: "What strength does your partner bring out in you?",
      },
      {
        id: "dynamics-2",
        type: "text",
        text: "Where do recurring disagreements tend to show up?",
      },
      {
        id: "dynamics-3",
        type: "scale",
        text: "How emotionally safe do you feel with your partner?",
        labels: ["Rarely", "Always"],
      },
      {
        id: "dynamics-4",
        type: "scale",
        text: "How well do you communicate during stressful moments?",
        labels: ["Poorly", "Very well"],
      },
    ],
  },
];
