"use client";

import { useState } from "react";

type AcknowledgementGateProps = {
  messageId: string;
  aiInsight: string;
  onAcknowledge: () => void;
};

export default function AcknowledgementGate({
  messageId,
  aiInsight,
  onAcknowledge,
}: AcknowledgementGateProps) {
  const [hasAcknowledged, setHasAcknowledged] = useState(false);

  const handleAcknowledge = () => {
    if (hasAcknowledged) return;
    setHasAcknowledged(true);
    onAcknowledge();
  };

  return (
    <div className="p-4 rounded-xl bg-slate-100/60 border border-slate-200 text-xs space-y-3">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-400">
        <span>Message {messageId}</span>
        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Gate Active
        </span>
      </div>
      <p className="text-slate-600">{aiInsight}</p>
      <button
        type="button"
        onClick={handleAcknowledge}
        disabled={hasAcknowledged}
        className="w-full mt-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] bg-slate-900 text-emerald-50 shadow-sm hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {hasAcknowledged ? "Acknowledged" : "Acknowledge & Reveal"}
      </button>
    </div>
  );
}
