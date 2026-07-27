"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { GlassPanel } from "@/components/synapse/GlassPanel";
import { PartnerBadge } from "@/components/synapse/PartnerBadge";
import { QuizRunner } from "@/components/QuizRunner";
import { ASSESSMENT_MODULES } from "@/lib/assessments";
import type {
    AssessmentModule,
    ResponseAnswer,
} from "@/lib/types";
import {
    getAllModuleCompletions,
    saveModuleResponses,
} from "@/app/actions/responses";
import {
    CONSENT_GATE_QUESTION_IDS,
    MODULE_E_QUESTION_IDS,
    SYNAPSE_QUESTIONS,
    TIMER_QUESTION_IDS,
} from "@/lib/synapse-questionnaire";

function getCompletionPercent(completedCount: number, totalCount: number) {
    if (totalCount === 0) return 0;
    return Math.round((completedCount / totalCount) * 100);
}

function getModuleLabel(index: number) {
    return `Module ${String.fromCharCode(65 + index)}`;
}

export default function IntakePage() {
    const [activeModule, setActiveModule] = useState<AssessmentModule | null>(null);
    const [completedModules, setCompletedModules] = useState<string[]>([]);

    const completionPercent = getCompletionPercent(
      completedModules.length,
      ASSESSMENT_MODULES.length
    );

    const questionStats = useMemo(() => {
      const totalQuestions = SYNAPSE_QUESTIONS.length;
      const writtenQuestions = SYNAPSE_QUESTIONS.filter(
         (question) =>
            question.questionType === "short_written" ||
            question.questionType === "long_written"
      ).length;
      const scenarioQuestions = SYNAPSE_QUESTIONS.filter(
         (question) => question.questionType === "scenario"
      ).length;

      return {
         totalQuestions,
         writtenQuestions,
         scenarioQuestions,
         consentGateCount: CONSENT_GATE_QUESTION_IDS.length,
         timerCount: TIMER_QUESTION_IDS.length,
         moduleECount: MODULE_E_QUESTION_IDS.length,

      };
  }, []);

  async function refreshCompleted() {
      const completions = await getAllModuleCompletions();
      setCompletedModules(completions.map((completion) => completion.moduleId));
  }

  useEffect(() => {
      let cancelled = false;

      void getAllModuleCompletions().then((completions) => {
          if (!cancelled) {
              setCompletedModules(
                completions.map((completion) => completion.moduleId)
              );
          }
      });

      return () => {
          cancelled = true;
      };
  }, []);

  function handleStartModule(module: AssessmentModule) {
      setActiveModule(module);
  }

  async function handleQuizComplete(
      moduleId: string,
      responses: Record<string, ResponseAnswer>
  ) {
      await saveModuleResponses(moduleId, responses);
      await refreshCompleted();
      setActiveModule(null);
  }

  function handleExitQuiz() {
      setActiveModule(null);
  }

  if (activeModule) {
      return (
        <QuizRunner
           module={activeModule}
           onComplete={handleQuizComplete}
           onExit={handleExitQuiz}
        />
      );
  }

  return (
      <AppShell title="Intake">
        <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
           <header className="mb-8 flex flex-wrap items-start justify-between gap-5">
             <div>
               <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300/70">
                 Assessment Layer
               </p>

               <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
                 Synapse Intake
               </h1>

               <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
                 Begin the structured intake process. This builds the behavioral
                 profile Dr. Ponz uses for mediation, empathy comparison, scenario

                analysis, and final report synthesis.
              </p>
           </div>

           <div className="flex flex-wrap items-center gap-3">
              <PartnerBadge role="partner_a" size="sm" />
              <PartnerBadge role="partner_b" size="sm" />
           </div>
         </header>

         <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
           <div className="space-y-6">
              <GlassPanel variant="strong" padding="lg">
                <p className="text-[10px] uppercase tracking-[0.32em] text-cyan-300/70">
                  Intake Progress
                </p>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                      <div className="text-5xl font-semibold text-slate-100">
                         {completionPercent}%
                      </div>

                      <p className="mt-2 text-sm text-slate-400">
                         {completedModules.length} of {ASSESSMENT_MODULES.length} runnable
                         modules completed
                      </p>
                  </div>

                  <button
                      type="button"
                      onClick={() => handleStartModule(ASSESSMENT_MODULES[0])}
                      className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100 transition hover:bg-cyan-300/15"
                  >
                      {completedModules.length > 0
                         ? "Continue"
                         : "Begin Intake"}
                  </button>
                </div>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                      className="h-full rounded-full bg-cyan-300"
                      style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </GlassPanel>

              <GlassPanel variant="dark" padding="lg">
                <p className="text-[10px] uppercase tracking-[0.32em] text-cyan-300/70">
                  Questionnaire Architecture
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">

                  <StatCard label="Seed questions" value={questionStats.totalQuestions} />
                  <StatCard label="Written prompts" value={questionStats.writtenQuestions} />
                  <StatCard label="Scenario prompts" value={questionStats.scenarioQuestions} />
                  <StatCard label="Consent gates" value={questionStats.consentGateCount} />
                  <StatCard label="Timed items" value={questionStats.timerCount} />
                  <StatCard label="Module E items" value={questionStats.moduleECount} />
                </div>
              </GlassPanel>
           </div>

           <GlassPanel variant="default" padding="lg">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-cyan-300/70">
                     Available Modules
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-slate-100">
                     Runnable assessment suite
                  </h2>
                </div>

                <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-slate-400">
                  {ASSESSMENT_MODULES.length} modules
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {ASSESSMENT_MODULES.map((module, index) => {
                  const isCompleted = completedModules.includes(module.id);

                  return (
                     <button
                         key={module.id}
                         type="button"
                         onClick={() => handleStartModule(module)}
                         className="group rounded-3xl border border-white/10 bg-black/20 p-5 text-left transition hover:border-cyan-300/40 hover:bg-white/[0.06]"
                     >
                         <div className="flex items-start justify-between gap-4">
                           <div>
                            <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/70">
                               {getModuleLabel(index)}
                            </p>

                            <div className="mt-2 text-base font-semibold text-white">
                               {module.title}
                            </div>

                            <div className="mt-2 text-sm leading-6 text-slate-400">
                               {module.description}
                            </div>
                           </div>

                             {isCompleted ? (
                                <span className="shrink-0 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                                  Done
                                </span>
                             ) : (
                                <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                                  Open
                                </span>
                             )}
                           </div>

                           <div className="mt-4 flex items-center justify-between text-xs">
                             <span className="text-cyan-300/70">
                                {module.questions.length} questions
                             </span>

                             <span className="uppercase tracking-[0.22em] text-slate-500 transition group-hover:text-cyan-200">
                                Start
                             </span>
                           </div>
                         </button>
                      );
                   })}
                 </div>
              </GlassPanel>
            </section>
          </div>
       </AppShell>
     );
 }

 function StatCard({ label, value }: { label: string; value: number }) {
     return (
       <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-100">{value}</p>
       </div>
     );
 }
