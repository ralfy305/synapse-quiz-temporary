"use client";

import { useMemo, useState } from "react";
import { GlassPanel } from "../synapse/GlassPanel";
import { AirlockStatusPanel } from "./AirlockStatusPanel";
import { cn } from "../../lib/synapse-theme";
import type { AirlockMediatorResult } from "../../lib/airlock-triage";
import {
    buildDeliveredMessage,
    canDeliverMessage,
    requiresSenderChoice,
    shouldOfferReframe,
} from "../../lib/airlock-triage";

type SenderChoice = "original" | "reframed";

type AirlockComposerProps = {
    className?: string;
    initialMessage?: string;
    mediatorResult?: AirlockMediatorResult | null;
    onAnalyze?: (message: string) => void | Promise<void>;
    onDeliver?: (payload: {
      originalMessage: string;
      deliveredMessage: string;
      senderChoice: SenderChoice;
      result: AirlockMediatorResult | null;
    }) => void | Promise<void>;
};

export function AirlockComposer({
 className,
 initialMessage = "",
 mediatorResult = null,
 onAnalyze,
 onDeliver,
}: AirlockComposerProps) {
 const [message, setMessage] = useState(initialMessage);
 const [senderChoice, setSenderChoice] = useState<SenderChoice>("reframed");
 const [isWorking, setIsWorking] = useState(false);

 const canDeliver = mediatorResult ? canDeliverMessage(mediatorResult) : false;
 const hasReframe = mediatorResult ? shouldOfferReframe(mediatorResult) : false;
 const needsChoice = mediatorResult ? requiresSenderChoice(mediatorResult) : false;

 const deliveredMessage = useMemo(() => {
     if (!mediatorResult) return message;

     return buildDeliveredMessage(mediatorResult, senderChoice, message);
 }, [mediatorResult, message, senderChoice]);

 async function handleAnalyze() {
     if (!message.trim() || !onAnalyze) return;

     setIsWorking(true);

     try {
         await onAnalyze(message.trim());
     } finally {
         setIsWorking(false);
     }
 }

 async function handleDeliver() {
     if (!onDeliver || !deliveredMessage) return;

     setIsWorking(true);

     try {
         await onDeliver({
          originalMessage: message.trim(),
          deliveredMessage,
          senderChoice,
          result: mediatorResult,
         });
     } finally {
         setIsWorking(false);
     }
 }

 return (
     <div className={cn("grid gap-6 lg:grid-cols-[1fr_0.9fr]", className)}>
         <GlassPanel variant="strong" padding="lg">
          <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300/70">
               Synapse Airlock

        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-100">
          Draft before delivery
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Write the message exactly as it wants to come out. Dr. Ponz can
          evaluate the signal, reduce heat, and offer a safer reframe before
          the other person receives it.
        </p>

        <label className="mt-6 block">
          <span className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
               Original message
          </span>

          <textarea
               value={message}
               onChange={(event) => setMessage(event.target.value)}
               rows={10}
               placeholder="Type the message that needs to pass through the Airlock..."
               className="mt-3 w-full resize-none rounded-3xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40 focus:bg-black/40"
          />
        </label>

        {hasReframe && mediatorResult?.reframed_message ? (
          <div className="mt-5 rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
               <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/70">
                 Suggested reframe
               </p>

               <p className="mt-3 text-sm leading-6 text-cyan-50">
                 {mediatorResult.reframed_message}
               </p>

               {needsChoice ? (
                 <div className="mt-4 flex flex-wrap gap-3">
                  <button
                      type="button"
                      onClick={() => setSenderChoice("original")}
                      className={cn(
                        "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition",
                        senderChoice === "original"
                           ? "border-orange-300/60 bg-orange-300/15 text-orange-100"
                           : "border-white/10 bg-white/[0.03] text-slate-400"
                      )}
                  >
                      Send original
                  </button>

                  <button
                      type="button"

                           onClick={() => setSenderChoice("reframed")}
                           className={cn(
                             "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition",
                             senderChoice === "reframed"
                                ? "border-cyan-300/60 bg-cyan-300/15 text-cyan-100"
                                : "border-white/10 bg-white/[0.03] text-slate-400"
                           )}
                       >
                           Send reframe
                       </button>
                      </div>
                   ) : null}
               </div>
             ) : null}

             <div className="mt-6 flex flex-wrap gap-3">
               <button
                   type="button"
                   onClick={handleAnalyze}
                   disabled={!message.trim() || isWorking}
                   className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-40"
               >
                   Analyze
               </button>

               <button
                   type="button"
                   onClick={handleDeliver}
                   disabled={!canDeliver || !deliveredMessage || isWorking}
                   className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100 transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-40"
               >
                   Deliver
               </button>
             </div>
         </GlassPanel>

         <AirlockStatusPanel result={mediatorResult} />
      </div>
    );
}
