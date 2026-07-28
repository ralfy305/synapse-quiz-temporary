/**
 * Shared domain types for Project Synapse (the-vs-studio body).
 */

export type {
  AssessmentModule,
  AssessmentQuestion,
  ChoiceQuestion,
  ScaleQuestion,
  TextQuestion,
} from "./assessments";

export type QuestionResponse = {
  questionId: string;
  answer: unknown;
  timestamp: string;
};

export type ModuleCompletion = {
  moduleId: string;
  responses: QuestionResponse[];
  completedAt: string;
};
