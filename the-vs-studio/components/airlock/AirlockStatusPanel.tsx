import { GlassPanel } from "../synapse/GlassPanel";
import { cn } from "../../lib/synapse-theme";
import type { AirlockMediatorResult } from "../../lib/airlock-triage";
import {
    getAirlockTriageConfig,
    getDeliveryState,
    getReceiverHoldingMessage,
    getSenderHoldingMessage,
} from "../../lib/airlock-triage";

type AirlockStatusPanelProps = {
    result?: AirlockMediatorResult | null;
    className?: string;
};

function DetailRow({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) {
    if (!value) return null;

    return (
       <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
         <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
           {label}
         </p>
         <p className="mt-2 text-sm leading-6 text-slate-200">{value}</p>
       </div>
    );
}

export function AirlockStatusPanel({
    result,
    className,
}: AirlockStatusPanelProps) {

 if (!result) {
     return (
         <GlassPanel variant="dark" padding="lg" className={className}>
          <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300/70">
            Airlock Status
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-slate-100">
            Waiting for signal
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Draft a message to let Dr. Ponz evaluate tone, emotional signal,
            delivery safety, and whether a reframe is needed.
          </p>
         </GlassPanel>
     );
 }

 const config = getAirlockTriageConfig(result.triage_level);
 const deliveryState = getDeliveryState(result);
 const senderHoldingMessage = getSenderHoldingMessage(result);
 const receiverHoldingMessage = getReceiverHoldingMessage(result);

 return (
     <GlassPanel
         variant="dark"
         padding="lg"
         className={cn(config.panelClassName, className)}
     >
         <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300/70">
                 Airlock Status
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-slate-100">
                 {config.title}
            </h2>
          </div>

          <div className={cn("rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em]",
config.badgeClassName)}>
            {config.label}
          </div>
         </div>

         <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
            Delivery State
          </p>
          <p className="mt-2 text-sm font-medium text-slate-200">
            {deliveryState.replaceAll("_", " ")}
          </p>
         </div>

         <div className="mt-5 grid gap-3">
          <DetailRow label="Sender instruction" value={config.senderInstruction} />
          <DetailRow label="Receiver instruction" value={config.receiverInstruction} />
          <DetailRow label="Core emotion" value={result.core_emotion} />
          <DetailRow label="Core need" value={result.core_need} />
          <DetailRow label="Tone" value={result.tone} />
          <DetailRow
            label="Neutral summary"
            value={result.neutral_summary_for_receiver}
          />
          <DetailRow label="Reflection question" value={result.reflection_question} />
          <DetailRow label="Sender holding message" value={senderHoldingMessage} />
          <DetailRow label="Receiver holding message" value={receiverHoldingMessage} />
          <DetailRow label="Review reason" value={result.review_reason} />
         </div>
      </GlassPanel>
    );
}
