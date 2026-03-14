"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ASSESSMENT_MODULES, type AssessmentQuestion } from "@/lib/assessments";

type AnswerValue = string | number;

function getQuestionKey(moduleId: string, questionId: string) {
  return `${moduleId}:${questionId}`;
}

function isAnswered(value: AnswerValue | undefined) {
  return value !== undefined && `${value}`.trim().length > 0;
}

export default function HomePage() {
  const [moduleIndex, setModuleIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [reflection, setReflection] = useState("Awaiting subject input.");
  const [isProcessing, setIsProcessing] = useState(false);

  const currentModule = ASSESSMENT_MODULES[moduleIndex];
  const currentQuestion = currentModule.questions[questionIndex];
  const answerKey = getQuestionKey(currentModule.id, currentQuestion.id);

  const allQuestions = useMemo(
    () => ASSESSMENT_MODULES.flatMap((module) => module.questions),
    []
  );
  const completedCount = Object.values(answers).filter((value) =>
    isAnswered(value)
  ).length;
  const progress = Math.round((completedCount / allQuestions.length) * 100);

  const setAnswer = (value: AnswerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [answerKey]: value,
    }));
  };

  const handleAnalyze = async () => {
    const answer = answers[answerKey];
    if (!isAnswered(answer)) return;

    setIsProcessing(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Assessment module: ${currentModule.title}\nQuestion: ${currentQuestion.text}\nAnswer: ${answer}`,
            },
          ],
        }),
      });

      const data = (await response.json()) as { content?: string; error?: string };
      setReflection(
        data.content ||
          data.error ||
          "Mediator link failed. The clinical layer is temporarily unavailable."
      );
    } catch {
      setReflection(
        "Mediator link failed. The clinical layer is temporarily unavailable."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = () => {
    if (questionIndex < currentModule.questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      return;
    }

    if (moduleIndex < ASSESSMENT_MODULES.length - 1) {
      setModuleIndex((prev) => prev + 1);
      setQuestionIndex(0);
    }
  };

  const handleBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex((prev) => prev - 1);
      return;
    }

    if (moduleIndex > 0) {
      const previousModule = ASSESSMENT_MODULES[moduleIndex - 1];
      setModuleIndex((prev) => prev - 1);
      setQuestionIndex(previousModule.questions.length - 1);
    }
  };

  const isFinalQuestion =
    moduleIndex === ASSESSMENT_MODULES.length - 1 &&
    questionIndex === currentModule.questions.length - 1;
  const currentAnswer = answers[answerKey];

  return (
    <main className="synapse-app">
      <div className="synapse-orb synapse-orb-a" />
      <div className="synapse-orb synapse-orb-b" />

      <header className="topbar">
        <div>
          <p className="eyebrow">Project Synapse</p>
          <h1>Dr. Ponz Intake Chamber</h1>
        </div>
        <div className="topbar-actions">
          <div className="status-pill">
            <span className="status-dot-live" />
            Fine-tuned mediator online
          </div>
          <Link href="/dashboard" className="ghost-link">
            Open dashboard
          </Link>
        </div>
      </header>

      <section className="hero-panel">
        <div>
          <p className="eyebrow">Assessment Runtime</p>
          <h2>We&apos;re porting the product, not the old Replit shell.</h2>
          <p className="hero-copy">
            This build keeps your local Next.js foundation and folds in the
            stronger Synapse quiz logic. The UI is rebuilt around a sharper
            control-room feel instead of the old placeholder workspace.
          </p>
        </div>
        <div className="hero-metrics">
          <div className="metric-card">
            <span>Modules</span>
            <strong>{ASSESSMENT_MODULES.length}</strong>
          </div>
          <div className="metric-card">
            <span>Questions</span>
            <strong>{allQuestions.length}</strong>
          </div>
          <div className="metric-card">
            <span>Complete</span>
            <strong>{progress}%</strong>
          </div>
        </div>
      </section>

      <div className="main-grid">
        <aside className="module-rail">
          <div className="panel-heading">
            <p className="eyebrow">Protocol Map</p>
            <h3>Assessment modules</h3>
          </div>
          <div className="module-list">
            {ASSESSMENT_MODULES.map((module, index) => {
              const moduleComplete = module.questions.every((question) =>
                isAnswered(answers[getQuestionKey(module.id, question.id)])
              );

              return (
                <button
                  key={module.id}
                  type="button"
                  className={`module-card ${
                    index === moduleIndex ? "active" : ""
                  }`}
                  onClick={() => {
                    setModuleIndex(index);
                    setQuestionIndex(0);
                  }}
                >
                  <span className="module-kicker">
                    {moduleComplete ? "Completed" : `Module ${index + 1}`}
                  </span>
                  <strong>{module.title}</strong>
                  <p>{module.description}</p>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="question-stage">
          <div className="question-card">
            <div className="question-header">
              <div>
                <p className="eyebrow">{currentModule.title}</p>
                <h3>{currentQuestion.text}</h3>
              </div>
              <div className="progress-shell" aria-label="assessment progress">
                <div className="progress-track">
                  <div
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span>{completedCount} answered</span>
              </div>
            </div>

            <QuestionInput
              question={currentQuestion}
              value={currentAnswer}
              onChange={setAnswer}
            />

            <div className="question-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={handleBack}
                disabled={moduleIndex === 0 && questionIndex === 0}
              >
                Back
              </button>
              <div className="action-group">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleAnalyze}
                  disabled={!isAnswered(currentAnswer) || isProcessing}
                >
                  {isProcessing ? "Analyzing..." : "Run mediator pass"}
                </button>
                {isFinalQuestion ? (
                  <Link href="/dashboard" className="primary-button">
                    Finish and review
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={handleNext}
                    disabled={!isAnswered(currentAnswer)}
                  >
                    Next question
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <aside className="insight-rail">
          <div className="insight-card">
            <div className="panel-heading">
              <p className="eyebrow">Mediator Channel</p>
              <h3>Dr. Ponz reflection</h3>
            </div>
            <p className="insight-copy">{reflection}</p>
          </div>

          <div className="insight-card">
            <div className="panel-heading">
              <p className="eyebrow">Current signal</p>
              <h3>Question metadata</h3>
            </div>
            <ul className="meta-list">
              <li>
                <span>Type</span>
                <strong>{currentQuestion.type}</strong>
              </li>
              <li>
                <span>Prompt id</span>
                <strong>{currentQuestion.id}</strong>
              </li>
              <li>
                <span>Theme</span>
                <strong>{currentModule.title}</strong>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}

function QuestionInput({
  question,
  value,
  onChange,
}: {
  question: AssessmentQuestion;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
}) {
  if (
    question.type === "mcq" ||
    question.type === "scenario" ||
    question.type === "rank"
  ) {
    return (
      <div className="choice-grid">
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            className={`choice-card ${value === option ? "selected" : ""}`}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }

  if (question.type === "scale") {
    const numericValue = typeof value === "number" ? value : 3;

    return (
      <div className="scale-shell">
        <div className="scale-labels">
          <span>{question.labels[0]}</span>
          <strong>{numericValue}</strong>
          <span>{question.labels[1]}</span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={numericValue}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
    );
  }

  if (question.type === "text") {
    return (
      <textarea
        className="response-input"
        placeholder={question.placeholder || "Enter your answer"}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <div className="response-input">Unsupported question type.</div>
  );
}
