"use client";

import { useMemo, useState } from "react";
import type { AssessmentModule, AssessmentQuestion } from "@/lib/types";
import { GlassPanel } from "@/components/synapse/GlassPanel";
import { SYNAPSE_CLASSES, cn } from "@/lib/synapse-theme";

type QuizRunnerProps = {
  module: AssessmentModule;
  onComplete: (moduleId: string, responses: Record<string, unknown>) => void | Promise<void>;
  onExit: () => void;
};

function isAnswered(question: AssessmentQuestion, value: unknown): boolean {
  if (value === undefined || value === null) return false;

  if (question.type === "text") {
    return typeof value === "string" && value.trim().length > 0;
  }

  if (question.type === "rank") {
    return Array.isArray(value) && value.length === question.options.length;
  }

  if (question.type === "scale") {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof (value as { value?: unknown }).value === "number"
    );
  }

  return typeof value === "string" && value.length > 0;
}

export function QuizRunner({ module, onComplete, onExit }: QuizRunnerProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [rankDraft, setRankDraft] = useState<string[] | null>(null);
  const [saving, setSaving] = useState(false);

  const question = module.questions[index];
  const progress = useMemo(
    () => Math.round(((index + 1) / module.questions.length) * 100),
    [index, module.questions.length]
  );

  const currentValue =
    question.type === "rank"
      ? rankDraft ??
        (Array.isArray(answers[question.id])
          ? (answers[question.id] as string[])
          : [...question.options])
      : answers[question.id];

  const canAdvance = isAnswered(
    question,
    question.type === "rank" ? currentValue : answers[question.id]
  );

  function setAnswer(value: unknown) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function ensureRankOrder(): string[] {
    if (rankDraft) return rankDraft;
    if (Array.isArray(answers[question.id])) {
      return answers[question.id] as string[];
    }
    return [...(question.type === "rank" ? question.options : [])];
  }

  function moveRankItem(from: number, direction: -1 | 1) {
    const order = [...ensureRankOrder()];
    const to = from + direction;
    if (to < 0 || to >= order.length) return;
    const tmp = order[from];
    order[from] = order[to];
    order[to] = tmp;
    setRankDraft(order);
    setAnswer(order);
  }

  async function handleNext() {
    if (!canAdvance || saving) return;

    if (question.type === "rank") {
      setAnswer(ensureRankOrder());
      setRankDraft(null);
    }

    if (index < module.questions.length - 1) {
      setIndex((i) => i + 1);
      return;
    }

    setSaving(true);
    try {
      const finalAnswers = {
        ...answers,
        ...(question.type === "rank"
          ? { [question.id]: ensureRankOrder() }
          : {}),
      };
      await onComplete(module.id, finalAnswers);
    } finally {
      setSaving(false);
    }
  }

  function handleBack() {
    if (index === 0) {
      onExit();
      return;
    }
    setRankDraft(null);
    setIndex((i) => i - 1);
  }

  return (
    <div className={SYNAPSE_CLASSES.pageShell}>
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-8 md:px-10">
        <header className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className={SYNAPSE_CLASSES.tinyEyebrow}>Intake Module</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                {module.title}
              </h1>
            </div>
            <button
              type="button"
              onClick={onExit}
              className={SYNAPSE_CLASSES.ghostButton}
            >
              Exit
            </button>
          </div>

          <div>
            <div className="mb-2 flex justify-between text-xs text-slate-400">
              <span>
                Question {index + 1} of {module.questions.length}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-cyan-300 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </header>

        <GlassPanel variant="strong" padding="lg" className="flex-1">
          <p className={SYNAPSE_CLASSES.mutedEyebrow}>
            {question.type === "mcq"
              ? "Multiple choice"
              : question.type === "scenario"
                ? "Scenario"
                : question.type === "scale"
                  ? "Scale"
                  : question.type === "rank"
                    ? "Rank order"
                    : "Written response"}
          </p>

          <h2 className="mt-3 text-xl font-semibold leading-snug text-slate-100 md:text-2xl">
            {question.text}
          </h2>

          <div className="mt-8 space-y-3">
            {(question.type === "mcq" || question.type === "scenario") &&
              question.options.map((option) => {
                const selected = answers[question.id] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAnswer(option)}
                    className={cn(
                      "w-full rounded-2xl border px-4 py-4 text-left text-sm leading-6 transition",
                      selected
                        ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-50"
                        : "border-white/10 bg-black/20 text-slate-300 hover:border-cyan-300/30"
                    )}
                  >
                    {option}
                  </button>
                );
              })}

            {question.type === "scale" && (
              <div className="space-y-6 py-2">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={
                    typeof (answers[question.id] as { value?: number } | undefined)
                      ?.value === "number"
                      ? (answers[question.id] as { value: number }).value
                      : 0.5
                  }
                  onChange={(e) =>
                    setAnswer({ value: Number(e.target.value) })
                  }
                  className="w-full accent-cyan-300"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{question.labels[0]}</span>
                  <span className="font-mono text-cyan-200">
                    {typeof (answers[question.id] as { value?: number } | undefined)
                      ?.value === "number"
                      ? (answers[question.id] as { value: number }).value.toFixed(1)
                      : "0.5"}
                  </span>
                  <span>{question.labels[1]}</span>
                </div>
                {/* Ensure scale has a default if user never moves slider */}
                {answers[question.id] === undefined ? (
                  <button
                    type="button"
                    className={SYNAPSE_CLASSES.ghostButton}
                    onClick={() => setAnswer({ value: 0.5 })}
                  >
                    Confirm midpoint
                  </button>
                ) : null}
              </div>
            )}

            {question.type === "text" && (
              <textarea
                className={cn(SYNAPSE_CLASSES.textArea, "min-h-[160px] rounded-2xl border border-white/10 bg-black/25 p-4")}
                placeholder={question.placeholder ?? "Type your response…"}
                value={
                  typeof answers[question.id] === "string"
                    ? (answers[question.id] as string)
                    : ""
                }
                onChange={(e) => setAnswer(e.target.value)}
              />
            )}

            {question.type === "rank" && (
              <div className="space-y-2">
                <p className="mb-3 text-xs text-slate-400">
                  Order from most important (top) to least.
                </p>
                {ensureRankOrder().map((item, rankIndex) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-3"
                  >
                    <span className="w-6 font-mono text-xs text-cyan-300/80">
                      {rankIndex + 1}
                    </span>
                    <span className="flex-1 text-sm text-slate-200">{item}</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-400 hover:text-cyan-100"
                        onClick={() => moveRankItem(rankIndex, -1)}
                        disabled={rankIndex === 0}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-400 hover:text-cyan-100"
                        onClick={() => moveRankItem(rankIndex, 1)}
                        disabled={rankIndex === ensureRankOrder().length - 1}
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                ))}
                {answers[question.id] === undefined && (
                  <button
                    type="button"
                    className={cn(SYNAPSE_CLASSES.cyanButton, "mt-2")}
                    onClick={() => setAnswer(ensureRankOrder())}
                  >
                    Confirm this order
                  </button>
                )}
              </div>
            )}
          </div>
        </GlassPanel>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className={SYNAPSE_CLASSES.ghostButton}
          >
            {index === 0 ? "Cancel" : "Back"}
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canAdvance || saving}
            className={SYNAPSE_CLASSES.cyanButton}
          >
            {saving
              ? "Saving…"
              : index === module.questions.length - 1
                ? "Complete module"
                : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
