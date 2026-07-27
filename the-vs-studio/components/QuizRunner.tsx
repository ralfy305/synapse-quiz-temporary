"use client";

import { useMemo, useState } from "react";

import { GlassPanel } from "@/components/synapse/GlassPanel";
import type {
  AssessmentModule,
  AssessmentQuestion,
  ResponseAnswer,
} from "@/lib/types";

type QuizRunnerProps = {
  module: AssessmentModule;
  onComplete: (
    moduleId: string,
    responses: Record<string, ResponseAnswer>
  ) => void | Promise<void>;
  onExit: () => void;
};

function isAnswered(
  question: AssessmentQuestion,
  answer: ResponseAnswer | undefined
) {
  if (question.type === "rank") {
    return Array.isArray(answer) && answer.length === question.options.length;
  }

  if (question.type === "scale") {
    return (
      typeof answer === "object" &&
      answer !== null &&
      !Array.isArray(answer) &&
      typeof answer.value === "number"
    );
  }

  if (typeof answer === "string") {
    return answer.trim().length > 0;
  }

  return answer !== undefined;
}

export function QuizRunner({
  module,
  onComplete,
  onExit,
}: QuizRunnerProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, ResponseAnswer>>({});
  const [isSaving, setIsSaving] = useState(false);

  const question = module.questions[questionIndex];
  const answer = responses[question.id];
  const canContinue = isAnswered(question, answer);
  const isLastQuestion = questionIndex === module.questions.length - 1;
  const progress = Math.round(
    ((questionIndex + (canContinue ? 1 : 0)) / module.questions.length) * 100
  );

  const answeredCount = useMemo(
    () =>
      module.questions.filter((item) =>
        isAnswered(item, responses[item.id])
      ).length,
    [module.questions, responses]
  );

  function setAnswer(value: ResponseAnswer) {
    setResponses((current) => ({ ...current, [question.id]: value }));
  }

  async function handleContinue() {
    if (!canContinue || isSaving) return;

    if (!isLastQuestion) {
      setQuestionIndex((current) => current + 1);
      return;
    }

    setIsSaving(true);
    try {
      await onComplete(module.id, responses);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(61,154,166,0.18),_transparent_34%),linear-gradient(180deg,_#071119_0%,_#02060a_100%)] px-5 py-8 text-slate-100 md:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.34em] text-cyan-300/70">
              Synapse Intake · {answeredCount}/{module.questions.length}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              {module.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              {module.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onExit}
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-400 transition hover:border-cyan-300/35 hover:text-cyan-100"
          >
            Exit module
          </button>
        </header>

        <div className="mb-5 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-cyan-300 transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <GlassPanel variant="strong" padding="lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300/70">
              Question {questionIndex + 1}
            </p>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">
              {question.type}
            </span>
          </div>

          <h2 className="mt-5 text-2xl font-semibold leading-tight text-white md:text-3xl">
            {question.text}
          </h2>

          <div className="mt-7">
            <QuestionField
              question={question}
              answer={answer}
              onChange={setAnswer}
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() =>
                setQuestionIndex((current) => Math.max(0, current - 1))
              }
              disabled={questionIndex === 0 || isSaving}
              className="rounded-full border border-white/10 px-5 py-3 text-xs uppercase tracking-[0.22em] text-slate-300 transition hover:border-cyan-300/35 disabled:cursor-not-allowed disabled:opacity-35"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue || isSaving}
              className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-35"
            >
              {isSaving
                ? "Saving…"
                : isLastQuestion
                  ? "Complete module"
                  : "Next question"}
            </button>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

function QuestionField({
  question,
  answer,
  onChange,
}: {
  question: AssessmentQuestion;
  answer: ResponseAnswer | undefined;
  onChange: (answer: ResponseAnswer) => void;
}) {
  if (question.type === "mcq" || question.type === "scenario") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-2xl border p-4 text-left text-sm leading-6 transition ${
              answer === option
                ? "border-cyan-300/55 bg-cyan-300/12 text-cyan-50"
                : "border-white/10 bg-black/20 text-slate-300 hover:border-cyan-300/30"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }

  if (question.type === "rank") {
    const ranking = Array.isArray(answer) ? answer : [];

    return (
      <div>
        <p className="mb-4 text-sm text-slate-400">
          Select each option in order of importance. Select an item again to
          remove it from the ranking.
        </p>
        <div className="grid gap-3">
          {question.options.map((option) => {
            const rank = ranking.indexOf(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() =>
                  onChange(
                    rank >= 0
                      ? ranking.filter((item) => item !== option)
                      : [...ranking, option]
                  )
                }
                className={`flex items-center gap-4 rounded-2xl border p-4 text-left text-sm transition ${
                  rank >= 0
                    ? "border-cyan-300/45 bg-cyan-300/10 text-cyan-50"
                    : "border-white/10 bg-black/20 text-slate-300 hover:border-cyan-300/30"
                }`}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/15 text-xs">
                  {rank >= 0 ? rank + 1 : "—"}
                </span>
                {option}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (question.type === "scale") {
    const value =
      typeof answer === "object" &&
      answer !== null &&
      !Array.isArray(answer) &&
      typeof answer.value === "number"
        ? answer.value
        : 3;

    return (
      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
        <div className="mb-4 flex items-center justify-between gap-4 text-sm text-slate-400">
          <span>{question.labels[0]}</span>
          <strong className="text-3xl text-cyan-200">{value}</strong>
          <span className="text-right">{question.labels[1]}</span>
        </div>
        <input
          className="w-full accent-cyan-300"
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={(event) =>
            onChange({ value: Number(event.target.value) })
          }
        />
      </div>
    );
  }

  if (question.type === "text") {
    return (
      <textarea
        className="min-h-40 w-full resize-y rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-7 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40"
        placeholder={question.placeholder ?? "Write your response…"}
        value={typeof answer === "string" ? answer : ""}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return null;
}
