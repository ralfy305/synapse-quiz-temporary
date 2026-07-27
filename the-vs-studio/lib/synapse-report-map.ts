import type { SynapseQuestion } from "./synapse-questionnaire";

export type SynapseReportAxis =
  | "communication"
  | "emotionalSafety"
  | "sharedValues"
  | "conflictResolution"
  | "intimacy";

export type ReportWeight = "high" | "medium" | "low";

export type SynapseReportAxisConfig = {
  axis: SynapseReportAxis;
  label: string;

 scoreField:
    | "score_communication"
    | "score_emotional_safety"
    | "score_shared_values"
    | "score_conflict_resolution"
    | "score_intimacy";
 description: string;
 primaryQuestionIds: readonly string[];
 supportingQuestionIds: readonly string[];
 highSignalModules: readonly string[];
};

export const SYNAPSE_REPORT_AXES: Record<
 SynapseReportAxis,
 SynapseReportAxisConfig
> = {
 communication: {
    axis: "communication",
    label: "Communication",
    scoreField: "score_communication",
    description:
       "How clearly each partner expresses needs, receives difficult emotion, repairs misunderstandings, and stays reachable during tension.",
    primaryQuestionIds: ["A2_Q1", "A2_Q2", "D1_Q1", "D1_Q2", "C1_Q1"],
    supportingQuestionIds: ["A3_Q2", "D2_Q1", "E1_Q1"],
    highSignalModules: ["A2", "D1", "C1"],
 },

 emotionalSafety: {
    axis: "emotionalSafety",
    label: "Emotional Safety",
    scoreField: "score_emotional_safety",
    description:
       "How safe each partner feels being honest, vulnerable, imperfect, disappointed, or afraid without expecting punishment, withdrawal, or contempt.",
    primaryQuestionIds: ["B2_Q1", "B3_Q2", "B3_Q3", "C1_Q1", "C1_Q2"],
    supportingQuestionIds: ["A2_Q1", "A3_Q2", "E1_Q2"],
    highSignalModules: ["B2", "B3", "C1"],
 },

 sharedValues: {
    axis: "sharedValues",
    label: "Shared Values",
    scoreField: "score_shared_values",
    description:
       "How aligned the partners are around priorities, non-negotiables, decision-making, money expectations, trust, and the life structure they are building.",
    primaryQuestionIds: ["A1_Q1", "A1_Q2", "B1_Q1", "B2_Q2", "B3_Q3"],
    supportingQuestionIds: ["D1_Q2", "E1_Q3"],
    highSignalModules: ["A1", "B1", "B2"],
 },

 conflictResolution: {
    axis: "conflictResolution",
    label: "Conflict Resolution",

     scoreField: "score_conflict_resolution",
     description:
         "How the couple handles criticism, silence, hidden information, tension topics, repair attempts, and behavior under emotional pressure.",
     primaryQuestionIds: ["A3_Q1", "A3_Q2", "C1_Q1", "C1_Q2", "D1_Q1", "D1_Q2"],
     supportingQuestionIds: ["A2_Q2", "D2_Q1", "E1_Q2"],
     highSignalModules: ["A3", "C1", "D1"],
   },

   intimacy: {
     axis: "intimacy",
     label: "Intimacy",
     scoreField: "score_intimacy",
     description:
         "How the couple understands affection, desire, trust, emotional closeness, boundaries, and the conditions that make connection feel safe.",
     primaryQuestionIds: ["B3_Q1", "B3_Q2", "B3_Q3", "C1_Q3", "E1_Q1", "E1_Q3"],
     supportingQuestionIds: ["B2_Q1", "D2_Q1", "E1_Q2"],
     highSignalModules: ["B3", "C1", "E1"],
   },
};

export const SYNAPSE_REPORT_AXIS_ORDER: readonly SynapseReportAxis[] = [
   "communication",
   "emotionalSafety",
   "sharedValues",
   "conflictResolution",
   "intimacy",
];

export const SYNAPSE_REPORT_SCORE_FIELDS = SYNAPSE_REPORT_AXIS_ORDER.map(
   (axis) => SYNAPSE_REPORT_AXES[axis].scoreField
);

export function getReportAxisConfig(axis: SynapseReportAxis) {
   return SYNAPSE_REPORT_AXES[axis];
}

export function getReportAxisByScoreField(
   scoreField: SynapseReportAxisConfig["scoreField"]
) {
   return SYNAPSE_REPORT_AXIS_ORDER.find(
     (axis) => SYNAPSE_REPORT_AXES[axis].scoreField === scoreField
   );
}

export function getAxesForQuestion(questionId: string) {
   return SYNAPSE_REPORT_AXIS_ORDER.filter((axis) => {
     const config = SYNAPSE_REPORT_AXES[axis];

     return (
         config.primaryQuestionIds.includes(questionId) ||
         config.supportingQuestionIds.includes(questionId)
     );
   });

}

export function getQuestionWeightForAxis(
   questionId: string,
   axis: SynapseReportAxis
): ReportWeight {
   const config = SYNAPSE_REPORT_AXES[axis];

   if (config.primaryQuestionIds.includes(questionId)) {
       return "high";
   }

   if (config.supportingQuestionIds.includes(questionId)) {
       return "medium";
   }

   return "low";
}

export function getDefaultReportWeight(question: Pick<SynapseQuestion, "questionType" | "module" |
"submodule">): ReportWeight {
   if (question.questionType === "scenario") {
       return "high";
   }

   if (question.module === "E") {
       return "high";
   }

   if (question.submodule === "B3" || question.submodule === "D1") {
       return "high";
   }

   if (question.questionType === "short_written" || question.questionType === "long_written") {
       return "medium";
   }

   return "low";
}

export type SynapseReportTemplate = {
   overallSummary: string;
   dynamicLabel: string;
   scores: Record<SynapseReportAxis, number>;
   strengths: string[];
   frictionPoints: string[];
   blindSpots: string[];
   repairOpportunities: string[];
   partnerAPortrait: string;
   partnerBPortrait: string;
   closingNote: string;
   urgentFlag: boolean;
   urgentNote: string | null;
};

export const EMPTY_SYNAPSE_REPORT: SynapseReportTemplate = {
    overallSummary: "",
    dynamicLabel: "",
    scores: {
        communication: 0,
        emotionalSafety: 0,
        sharedValues: 0,
        conflictResolution: 0,
        intimacy: 0,
    },
    strengths: [],
    frictionPoints: [],
    blindSpots: [],
    repairOpportunities: [],
    partnerAPortrait: "",
    partnerBPortrait: "",
    closingNote: "",
    urgentFlag: false,
    urgentNote: null,
};

export function normalizeScore(value: unknown, fallback = 50) {
    if (typeof value !== "number" || Number.isNaN(value)) {
        return fallback;
    }

    return Math.max(0, Math.min(100, Math.round(value)));
}

export function mapRawReportScores(raw: {
    score_communication?: number;
    score_emotional_safety?: number;
    score_shared_values?: number;
    score_conflict_resolution?: number;
    score_intimacy?: number;
}) {
    return {
        communication: normalizeScore(raw.score_communication),
        emotionalSafety: normalizeScore(raw.score_emotional_safety),
        sharedValues: normalizeScore(raw.score_shared_values),
        conflictResolution: normalizeScore(raw.score_conflict_resolution),
        intimacy: normalizeScore(raw.score_intimacy),
    };
}
