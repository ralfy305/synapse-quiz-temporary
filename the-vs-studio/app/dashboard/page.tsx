"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { GlassPanel } from "@/components/synapse/GlassPanel";
import { PartnerBadge } from "@/components/synapse/PartnerBadge";
import { ASSESSMENT_MODULES } from "@/lib/assessments";

import { getModuleHistory } from "@/app/actions/responses";
import type {
   ModuleCompletion,
   ResponseAnswer,
   ScaleQuestion,
} from "@/lib/types";
import {
   SYNAPSE_REPORT_AXES,
   SYNAPSE_REPORT_AXIS_ORDER,
   mapRawReportScores,
   type SynapseReportAxis,
} from "@/lib/synapse-report-map";

const reportScores: Record<SynapseReportAxis, number> = mapRawReportScores({
   score_communication: 82,
   score_emotional_safety: 76,
   score_shared_values: 88,
   score_conflict_resolution: 64,
   score_intimacy: 71,
});

const diagnostics = [
   { label: "Empathy coherence", value: "88%", tone: "emerald" },
   { label: "Perception gap risk", value: "34%", tone: "amber" },
   { label: "Escalation pressure", value: "21%", tone: "cyan" },
];

const systemNotes = [
   "Report axes now come from the shared Synapse report map.",
   "Assessment modules remain local data assets and can be extended without Replit plumbing.",
   "History comparison still reads real saved module completions from the response store.",
];

function getScoreTone(score: number) {
   if (score >= 80) return "text-emerald-300";
   if (score >= 65) return "text-cyan-300";
   if (score >= 45) return "text-amber-300";
   return "text-red-300";
}

function getBarTone(score: number) {
   if (score >= 80) return "bg-emerald-300";
   if (score >= 65) return "bg-cyan-300";
   if (score >= 45) return "bg-amber-300";
   return "bg-red-300";
}

function getScaleValue(answer: ResponseAnswer | undefined): number | null {
   if (
      typeof answer === "object" &&
      answer !== null &&
      !Array.isArray(answer) &&
      "value" in answer &&
      typeof answer.value === "number"
   ) {
      return answer.value;
   }

   return null;
}

export default function DashboardPage() {
   return (
     <AppShell title="Core">
       <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-5">
          <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300/70">
                Neural Review Layer
              </p>

              <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
                Synapse Core

             </h1>

             <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
                 Review assessment progress, behavioral vectors, report axes, and
                 relationship signal drift across prior runs.
             </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
             <PartnerBadge role="partner_a" size="sm" />
             <PartnerBadge role="partner_b" size="sm" />

             <Link
                 href="/intake"
                 className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-100 transition hover:bg-cyan-300/15"
             >
                 Open Intake
             </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <GlassPanel variant="strong" padding="lg">
             <div className="flex flex-wrap items-center justify-between gap-3">
                 <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-cyan-300/70">
                     Synapse Report
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-slate-100">
                     Five-axis relational radar
                  </h2>
                 </div>

                 <div className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-emerald-200">
                  Preview Map
                 </div>
             </div>

             <div className="mt-6 grid gap-4">
                 {SYNAPSE_REPORT_AXIS_ORDER.map((axis) => {
                  const config = SYNAPSE_REPORT_AXES[axis];
                  const score = reportScores[axis];

                  return (
                     <div
                         key={axis}
                         className="rounded-3xl border border-white/10 bg-black/20 p-4"
                     >
                         <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                             <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                               {config.scoreField}

                              </p>

                              <h3 className="mt-2 text-lg font-semibold text-slate-100">
                                   {config.label}
                              </h3>

                              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                                   {config.description}
                              </p>
                             </div>

                             <div className={`text-3xl font-semibold ${getScoreTone(score)}`}>
                              {score}
                             </div>
                         </div>

                         <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                             <div
                              className={`h-full rounded-full ${getBarTone(score)}`}
                              style={{ width: `${score}%` }}
                             />
                         </div>
                     </div>
                 );
               })}
             </div>
          </GlassPanel>

          <div className="space-y-6">
             <GlassPanel variant="dark" padding="lg">
               <p className="text-[10px] uppercase tracking-[0.32em] text-cyan-300/70">
                 System Pulse
               </p>

               <h2 className="mt-2 text-xl font-semibold">Live Diagnostics</h2>

               <div className="mt-5 space-y-3">
                 {diagnostics.map((item) => (
                     <div
                         key={item.label}
                         className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                     >
                         <span className="text-sm text-slate-300">{item.label}</span>

                         <span
                             className={`text-sm font-medium ${ item.tone === "emerald" ? "text-emerald-400" : item.tone === "amber" ? "text-amber-400" : "text-cyan-400" }`}
                         >
                             {item.value}

                           </span>
                       </div>
                   ))}
               </div>
             </GlassPanel>

             <GlassPanel variant="dark" padding="lg">
               <p className="text-[10px] uppercase tracking-[0.32em] text-cyan-300/70">
                   Integration Notes
               </p>

               <div className="mt-5 space-y-3">
                   {systemNotes.map((note) => (
                       <div
                           key={note}
                           className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-400"
                       >
                           {note}
                       </div>
                   ))}
               </div>
             </GlassPanel>
          </div>
        </section>

        <section className="mt-6">
          <GlassPanel variant="default" padding="lg">
             <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
               <div>
                   <p className="text-[10px] uppercase tracking-[0.32em] text-cyan-300/70">
                       Active Modules
                   </p>

                   <h2 className="mt-2 text-xl font-semibold text-slate-100">
                       Assessment suite
                   </h2>
               </div>

               <Link
                   href="/intake"
                   className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-100"
               >
                   Continue Intake
               </Link>
             </div>

             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {ASSESSMENT_MODULES.map((module) => (
                   <div
                       key={module.id}
                       className="rounded-2xl border border-white/10 bg-black/20 p-4"
                   >
                       <div className="font-medium text-white">{module.title}</div>

                           <div className="mt-1 text-sm leading-6 text-slate-400">
                             {module.description}
                           </div>

                           <div className="mt-3 text-xs uppercase tracking-[0.22em] text-cyan-300/70">
                             {module.questions.length} questions
                           </div>
                      </div>
                     ))}
                   </div>
                 </GlassPanel>
             </section>

             <RecapCompareSection />
         </div>
     </AppShell>
   );
}

/* ========================================================================== */
/* Minimal self-contained Recap & Compare section + pure SVG chart                     */
/* Only scale questions across the suite are numeric and chartable.                    */
/* No new dependencies. History is append-only via responses.ts.                       */
/* ========================================================================== */

function RecapCompareSection() {
   const [modulesWithHistory, setModulesWithHistory] = useState<
     Array<{
         module: (typeof ASSESSMENT_MODULES)[number];
         history: ModuleCompletion[];
     }>
   >([]);

   useEffect(() => {
     let cancelled = false;

     async function load() {
         const results: Array<{
             module: (typeof ASSESSMENT_MODULES)[number];
             history: ModuleCompletion[];
         }> = [];

         for (const assessmentModule of ASSESSMENT_MODULES) {
             const history = await getModuleHistory(assessmentModule.id);

             if (history.length >= 2) {
                 results.push({ module: assessmentModule, history });
             }
         }

         if (!cancelled) {
             setModulesWithHistory(results);
         }
     }

     load();

     return () => {
       cancelled = true;
     };
 }, []);

 if (modulesWithHistory.length === 0) {
     return (
       <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
          Re-take any module from Intake to see recap charts comparing earlier
          runs here.
       </div>
     );
 }

 return (
     <div className="mt-8">
       <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300/70">
               History Layer
            </p>

            <h2 className="text-xl font-semibold tracking-tight">
               Recap &amp; Compare to Earlier
            </h2>
          </div>

          <div className="text-xs text-slate-400">
            {modulesWithHistory.length} module(s) with prior runs
          </div>
       </div>

       <div className="space-y-6">
          {modulesWithHistory.map(({ module: assessmentModule, history }) => {
            const latest = history[0];
            const previous = history[1];

            const scaleQuestions = assessmentModule.questions.filter(
               (question): question is ScaleQuestion =>
                  question.type === "scale"
            );

            const chartData = scaleQuestions
               .map((question) => {
                   const previousAnswer = previous.responses.find(
                    (response) => response.questionId === question.id
                   )?.answer;

                   const latestAnswer = latest.responses.find(
                    (response) => response.questionId === question.id
                   )?.answer;

                 const previousValue = getScaleValue(previousAnswer);
                 const latestValue = getScaleValue(latestAnswer);

                 if (previousValue === null && latestValue === null) {
                     return null;
                 }

                 return {
                     id: question.id,
                     label:
                       question.text.length > 68
                         ? question.text.slice(0, 65) + "..."
                         : question.text,
                     previous: previousValue,
                     latest: latestValue,
                 };
             })
             .filter(Boolean) as Array<{
             id: string;
             label: string;
             previous: number | null;
             latest: number | null;
          }>;

          const runCount = history.length;
          const latestDate = new Date(latest.completedAt).toLocaleDateString();
          const previousDate = new Date(previous.completedAt).toLocaleDateString();

          return (
             <GlassPanel
                 key={assessmentModule.id}
                 variant="default"
                 padding="lg"
                 className="mt-6"
             >
                 <div className="flex flex-wrap items-center justify-between gap-3">
                     <div>
                       <div className="font-semibold text-white">
                         {assessmentModule.title}
                       </div>

                       <div className="text-xs text-slate-400">
                         {assessmentModule.description}
                       </div>
                     </div>

                     <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest text-cyan-300/70">
                       <span className="rounded bg-white/5 px-2 py-0.5">
                         {runCount} runs

                        </span>

                        <span>Latest: {latestDate}</span>
                        <span>Previous: {previousDate}</span>
                    </div>
                   </div>

                   {chartData.length > 0 ? (
                    <div className="mt-5">
                        <ScaleComparisonChart data={chartData} />

                        <div className="mt-3 text-[10px] text-slate-400">
                           Scale answers normalized 0–1. Left bar = previous run,
                           right bar = latest.
                        </div>
                    </div>
                   ) : (
                    <div className="mt-4 text-sm text-slate-400">
                        No scale questions in this module. Raw response history is
                        preserved in the database.
                    </div>
                   )}
                 </GlassPanel>
             );
           })}
         </div>
      </div>
   );
}

function ScaleComparisonChart({
   data,
}: {
   data: Array<{
      id: string;
      label: string;
      previous: number | null;
      latest: number | null;
   }>;
}) {
   const rowHeight = 26;
   const labelWidth = 260;
   const barMaxWidth = 140;
   const height = 18 + data.length * rowHeight;
   const width = labelWidth + barMaxWidth * 2 + 60;

   return (
      <svg width={width} height={height} className="max-w-full text-[10px]">
         {data.map((datum, index) => {
           const y = 12 + index * rowHeight;
           const previousWidth =
             datum.previous != null ? Math.max(2, datum.previous * barMaxWidth) : 2;
           const latestWidth =
             datum.latest != null ? Math.max(2, datum.latest * barMaxWidth) : 2;
           const delta = (datum.latest ?? 0) - (datum.previous ?? 0);

        const deltaColor =
          delta > 0 ? "#67e8f9" : delta < 0 ? "#fbbf24" : "#64748b";

        return (
          <g key={datum.id}>
             <text x={4} y={y + 4} fill="#94a3b8" fontSize="10">
               {datum.label}
             </text>

             <rect
               x={labelWidth}
               y={y - 8}
               width={previousWidth}
               height={16}
               fill="#475569"
               rx="2"
             />

             {datum.previous != null ? (
               <text
                   x={labelWidth + previousWidth + 4}
                   y={y + 4}
                   fill="#64748b"
                   fontSize="9"
               >
                   {datum.previous}
               </text>
             ) : null}

             <rect
               x={labelWidth + barMaxWidth + 12}
               y={y - 8}
               width={latestWidth}
               height={16}
               fill="#67e8f9"
               rx="2"
             />

             {datum.latest != null ? (
               <text
                   x={labelWidth + barMaxWidth + 12 + latestWidth + 4}
                   y={y + 4}
                   fill="#67e8f9"
                   fontSize="9"
               >
                   {datum.latest}
               </text>
             ) : null}

             <text
               x={labelWidth + barMaxWidth * 2 + 40}
               y={y + 4}
               fill={deltaColor}
               fontSize="9"
               fontWeight="600"

                 >
                      {delta > 0 ? `+${delta.toFixed(1)}` : delta < 0 ? delta.toFixed(1) : "•"}
                 </text>
               </g>
            );
         })}
      </svg>
    );
}
