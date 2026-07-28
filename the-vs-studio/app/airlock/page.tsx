"use client";

import Link from "next/link";
import { useState } from "react";
import { AirlockComposer } from "@/components/airlock/AirlockComposer";
import type { AirlockMediatorResult } from "@/lib/airlock-triage";
import { normalizeMediatorResult } from "@/lib/airlock-triage";

const STARTER_PROMPTS = [
    "I feel like you only listen when I’m already upset.",
    "I don’t want to fight, but I need you to understand why this hurt me.",
    "When you disappear during conflict, I start feeling abandoned.",
    "I’m trying not to escalate, but I’m angry and I need to say this clearly.",
];

const RED_TERMS = [
    "kill",
    "hurt myself",
    "hurt you",
    "suicide",
    "die",
    "stalk",
    "threat",
    "blackmail",
    "force you",
    "make you pay",
];

const YELLOW_TERMS = [
    "always",
    "never",
    "liar",
    "hate",
    "whatever",
    "done with you",
    "you don't care",
    "you don’t care",
    "fuck",
    "shut up",
];

function includesAnyTerm(message: string, terms: readonly string[]) {
    const lowered = message.toLowerCase();
    return terms.some((term) => lowered.includes(term));
}

function buildLocalMediatorResult(message: string): AirlockMediatorResult {
    const isRed = includesAnyTerm(message, RED_TERMS);
    const isYellow = !isRed && includesAnyTerm(message, YELLOW_TERMS);

    const triageLevel = isRed ? "red" : isYellow ? "yellow" : "green";

    return normalizeMediatorResult({
        triage_level: triageLevel,
        needs_human_review: isRed,
        review_reason: isRed
          ? "Possible crisis, coercion, threat, or safety-sensitive language detected."
          : null,
        tone: isRed
          ? "safety-sensitive"
          : isYellow
           ? "heated or escalation-prone"
           : "direct but deliverable",
        core_emotion: isRed ? "distress" : isYellow ? "hurt and frustration" : "concern",
        core_need: isRed ? "safety and containment" : "clarity, repair, and being understood",
        neutral_summary_for_receiver:
          "The sender appears to be trying to communicate emotional impact and a need for repair before the conversation escalates.",
        reframed_message: isRed
          ? null
          : "I want to say this carefully because I do not want us to escalate. Something about this situation hurt me, and what I need most is clarity, acknowledgment, and a chance for us to understand each other better.",
        reflection_question:
          "What is the need underneath this message that may be getting hidden by the intensity of the wording?",
        mediator_note:
          triageLevel === "red"
           ? "Delivery paused. This should be reviewed before being sent."
           : triageLevel === "yellow"
             ? "Reframe recommended before delivery."
             : "Message appears deliverable, with optional reframe available.",
    });
}

export default function AirlockPage() {
    const [draftSeed, setDraftSeed] = useState(STARTER_PROMPTS[0]);
    const [composerKey, setComposerKey] = useState(0);
    const [mediatorResult, setMediatorResult] =
        useState<AirlockMediatorResult | null>(null);
    const [lastDelivered, setLastDelivered] = useState<string | null>(null);

    function loadStarterPrompt(prompt: string) {
        setDraftSeed(prompt);
        setMediatorResult(null);
        setLastDelivered(null);
        setComposerKey((current) => current + 1);
    }

    async function analyzeMessage(message: string) {
        setMediatorResult(buildLocalMediatorResult(message));
        setLastDelivered(null);
    }

    async function deliverMessage(payload: { deliveredMessage: string }) {
        setLastDelivered(payload.deliveredMessage);
    }

  return (
     <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.12),_transparent_30%),linear-gradient(180deg,_#08131d_0%,_#02060a_100%)] text-slate-100">
       <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 md:px-10">
         <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
           <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300/70">
                  Project Synapse
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">
                  Synapse Airlock
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
                  Draft before delivery. Dr. Ponz evaluates the emotional signal,
                  triage level, repair need, and whether the message should pass,
                  reframe, or pause.
              </p>
           </div>

           <div className="flex items-center gap-3">
              <Link
                  href="/"
                  className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-100"
              >
                  Return
              </Link>

              <Link
                  href="/dashboard"
                  className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-100 transition hover:bg-cyan-300/15"
              >
                  Open Core
              </Link>
           </div>
         </header>

         <section className="grid flex-1 gap-6 py-8 lg:grid-cols-[280px_minmax(0,1fr)]">
           <aside className="space-y-4">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300/70">
                   Prompt Seeds
                  </p>

                  <div className="mt-4 space-y-2">
                   {STARTER_PROMPTS.map((prompt) => (
                      <button
                         key={prompt}
                         type="button"

                           onClick={() => loadStarterPrompt(prompt)}
                           className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-left text-xs leading-5 text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-100"
                      >
                           {prompt}
                      </button>
                    ))}
                   </div>
                 </div>

                 <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
                   <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300/70">
                    Current Wiring
                   </p>

                   <p className="mt-4 text-sm leading-6 text-slate-400">
                    This page is now using the shared Airlock Composer and Status
                    Panel components. The current triage logic is local preview
                    wiring until the structured PONZ_05 API route is connected.
                   </p>
                 </div>

                 {lastDelivered ? (
                   <div className="rounded-[1.75rem] border border-emerald-300/20 bg-emerald-300/[0.06] p-5">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-300/70">
                      Delivered Message
                    </p>

                    <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-emerald-50">
                      {lastDelivered}
                    </p>
                   </div>
                 ) : null}
             </aside>

             <AirlockComposer
                 key={composerKey}
                 initialMessage={draftSeed}
                 mediatorResult={mediatorResult}
                 onAnalyze={analyzeMessage}
                 onDeliver={deliverMessage}
             />
           </section>
          </div>
       </main>
     );
 }
