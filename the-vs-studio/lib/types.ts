export type {
  AssessmentModule,
  AssessmentQuestion,
  BaseQuestion,
  ChoiceQuestion,
  ScaleQuestion,
  TextQuestion,
} from "./assessments";

export type ResponseAnswer =
  | string
  | number
  | string[]
  | { value: number }
  | Record<string, unknown>
  | null;

export type QuestionResponse = {
  questionId: string;
  answer: ResponseAnswer;
  timestamp: string;
};

export type ModuleCompletion = {
  moduleId: string;
  responses: QuestionResponse[];
  completedAt: string;
};
