export type AirlockTriageLevel = "green" | "yellow" | "red";

export type AirlockDeliveryState =
   | "clear_to_send"
   | "choose_original_or_reframe"
   | "paused_for_review";

export type AirlockMediatorResult = {
   triage_level: AirlockTriageLevel;
   needs_human_review: boolean;
   review_reason: string | null;
   tone: string;
   core_emotion: string;
   core_need: string;
   neutral_summary_for_receiver: string;
   reframed_message: string | null;

 reflection_question: string;
 mediator_note: string | null;
};

export type AirlockTriageConfig = {
 level: AirlockTriageLevel;
 label: string;
 title: string;
 deliveryState: AirlockDeliveryState;
 senderInstruction: string;
 receiverInstruction: string;
 facilitatorInstruction: string;
 badgeClassName: string;
 panelClassName: string;
};

export const AIRLOCK_TRIAGE_CONFIG: Record<
 AirlockTriageLevel,
 AirlockTriageConfig
> = {
 green: {
    level: "green",
    label: "Green",
    title: "Clear for Delivery",
    deliveryState: "clear_to_send",
    senderInstruction:
       "This message can be delivered. A reframe may be shown as an optional clarity aid.",
    receiverInstruction:
       "Read the message as a direct communication from your partner. Pause before responding.",
    facilitatorInstruction:
       "No review required. Store the original message, mediator summary, and optional reframe.",
    badgeClassName:
       "border-emerald-400/25 bg-emerald-400/10 text-emerald-100",
    panelClassName:
       "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-50",
 },

 yellow: {
    level: "yellow",
    label: "Yellow",
    title: "Reframe Recommended",
    deliveryState: "choose_original_or_reframe",
    senderInstruction:
       "This message may escalate the conversation. Show the sender the original and reframed version before delivery.",
    receiverInstruction:
       "This message has been mediated for clarity. Read for the underlying need before replying.",
    facilitatorInstruction:
       "Log sender choice as original or reframed. Store the reframe, emotional signal, and reflection question.",
    badgeClassName:
       "border-amber-400/25 bg-amber-400/10 text-amber-100",
    panelClassName:
       "border-amber-400/20 bg-amber-400/[0.06] text-amber-50",
 },

   red: {
     level: "red",
     label: "Red",
     title: "Paused for Human Review",
     deliveryState: "paused_for_review",
     senderInstruction:
        "This message cannot be delivered through the Airlock right now because it may involve safety, coercion, crisis, or severe escalation.",
     receiverInstruction:
        "A message was paused for review. The system is holding the conversation until it can be handled safely.",
     facilitatorInstruction:
        "Do not deliver the raw message. Store the audit event and route the session to human review.",
     badgeClassName:
        "border-red-400/25 bg-red-400/10 text-red-100",
     panelClassName:
        "border-red-400/20 bg-red-400/[0.06] text-red-50",
   },
};

export const AIRLOCK_REVIEW_TRIGGERS = [
   "threats_of_harm",
   "self_harm_or_suicidal_ideation",
   "active_abuse_or_coercion",
   "stalking_or_intimidation",
   "blackmail_or_forced_control",
   "severe_contempt_or_dehumanization",
   "crisis_level_distress",
] as const;

export type AirlockReviewTrigger = (typeof AIRLOCK_REVIEW_TRIGGERS)[number];

export const AIRLOCK_HOLDING_MESSAGES = {
   redReceiver:
     "A message was paused by the Airlock because it may need careful review before delivery. The conversation is being held for safety and clarity.",

   redSender:
     "The Airlock paused this message because it may contain language that needs review before it can be delivered safely.",

   yellowSender:
     "The Airlock detected possible escalation. Review the original and the reframed version before choosing what to send.",

   greenSender:
     "The Airlock found no delivery block. You may send the message as written or use the optional reframe.",
} as const;

export function getAirlockTriageConfig(level: AirlockTriageLevel) {
   return AIRLOCK_TRIAGE_CONFIG[level];
}

export function getDeliveryState(result: Pick<AirlockMediatorResult, "triage_level" | "needs_human_review">): AirlockDeliveryState {
   if (result.needs_human_review || result.triage_level === "red") {
       return "paused_for_review";
   }

   if (result.triage_level === "yellow") {
       return "choose_original_or_reframe";
   }

   return "clear_to_send";
}

export function canDeliverMessage(result: Pick<AirlockMediatorResult, "triage_level" | "needs_human_review">) {
   return getDeliveryState(result) !== "paused_for_review";
}

export function shouldOfferReframe(result: Pick<AirlockMediatorResult, "triage_level" | "needs_human_review" | "reframed_message">) {
   if (result.needs_human_review || result.triage_level === "red") {
       return false;
   }

   return Boolean(result.reframed_message?.trim());
}

export function requiresSenderChoice(result: Pick<AirlockMediatorResult, "triage_level" | "needs_human_review" | "reframed_message">) {
   if (!shouldOfferReframe(result)) {
       return false;
   }

   return result.triage_level === "yellow";
}

export function getSenderHoldingMessage(result: Pick<AirlockMediatorResult, "triage_level" | "needs_human_review">) {
   if (result.needs_human_review || result.triage_level === "red") {
       return AIRLOCK_HOLDING_MESSAGES.redSender;
   }

   if (result.triage_level === "yellow") {
       return AIRLOCK_HOLDING_MESSAGES.yellowSender;
   }

   return AIRLOCK_HOLDING_MESSAGES.greenSender;
}

export function getReceiverHoldingMessage(result: Pick<AirlockMediatorResult, "triage_level" | "needs_human_review">) {
   if (result.needs_human_review || result.triage_level === "red") {
       return AIRLOCK_HOLDING_MESSAGES.redReceiver;
   }

    return null;
}

export function normalizeTriageLevel(value: unknown): AirlockTriageLevel {
    if (value === "green" || value === "yellow" || value === "red") {
        return value;
    }

    return "yellow";
}

export function normalizeMediatorResult(raw: Partial<AirlockMediatorResult>): AirlockMediatorResult {
    const level = normalizeTriageLevel(raw.triage_level);

    return {
        triage_level: raw.needs_human_review ? "red" : level,
        needs_human_review: Boolean(raw.needs_human_review || level === "red"),
        review_reason: raw.review_reason ?? null,
        tone: raw.tone ?? "unclear",
        core_emotion: raw.core_emotion ?? "unclear",
        core_need: raw.core_need ?? "unclear",
        neutral_summary_for_receiver:
          raw.neutral_summary_for_receiver ??
          "The sender is expressing something emotionally important, but the signal needs clarification.",
        reframed_message: raw.reframed_message ?? null,
        reflection_question:
          raw.reflection_question ??
          "What need might be underneath this message that is not being said directly?",
        mediator_note: raw.mediator_note ?? null,
    };
}

export function buildDeliveredMessage(
    result: AirlockMediatorResult,
    senderChoice: "original" | "reframed",
    originalMessage: string
) {
    if (!canDeliverMessage(result)) {
        return null;
    }

    if (senderChoice === "reframed" && result.reframed_message) {
        return result.reframed_message;
    }

    return originalMessage;
}
