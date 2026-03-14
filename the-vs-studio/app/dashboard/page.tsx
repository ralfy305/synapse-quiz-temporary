"use client";

import Link from "next/link";
import { ASSESSMENT_MODULES } from "@/lib/assessments";

const diagnostics = [
  { label: "Empathy coherence", value: "88%", tone: "emerald" },
  { label: "Perception gap risk", value: "34%", tone: "amber" },
  { label: "Escalation pressure", value: "21%", tone: "cyan" },
];

const findings = [
  "The dashboard now lives inside the Next.js app instead of a transplanted Vite shell.",
  "Assessment modules are local data assets and can be extended without Replit plumbing.",
  "Dr. Ponz routing stays inside the app with a fine-tuned-model fallback path.",
];

export default function DashboardPage() {
  return (
    <main className="dashboard-page">
      <div className="synapse-orb synapse-orb-c" />

      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Neural Review Layer</p>
          <h1>Synapse dashboard</h1>
          <p className="hero-copy">
            This route replaces the donor mockup with a local dashboard that fits
            the Next.js app and gives us room to wire in real analytics next.
          </p>
        </div>
        <Link href="/" className="ghost-link">
          Return to intake
        </Link>
      </header>

      <section className="dashboard-grid">
        <article className="dashboard-panel span-two">
          <div className="panel-heading">
            <p className="eyebrow">System pulse</p>
            <h2>Active modules</h2>
          </div>
          <div className="dashboard-modules">
            {ASSESSMENT_MODULES.map((module) => (
              <div key={module.id} className="dashboard-module-card">
                <span>{module.id}</span>
                <strong>{module.title}</strong>
                <p>{module.description}</p>
                <em>{module.questions.length} prompts loaded</em>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="panel-heading">
            <p className="eyebrow">Runtime diagnostics</p>
            <h2>Live signals</h2>
          </div>
          <div className="diagnostic-list">
            {diagnostics.map((item) => (
              <div key={item.label} className={`diagnostic-card ${item.tone}`}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="panel-heading">
            <p className="eyebrow">Port summary</p>
            <h2>What changed</h2>
          </div>
          <ul className="summary-list">
            {findings.map((finding) => (
              <li key={finding}>{finding}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
