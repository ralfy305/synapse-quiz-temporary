export const SYNAPSE_BRAND = {
  productName: "Project Synapse",
  systemName: "Synapse",
  interpreterName: "Dr. Ponz",
  coreTagline: "Neural intake, behavioral analysis, and case intelligence.",
  systemLine: "Synapse stores the signal. Dr. Ponz interprets the pattern.",
  airlockLine: "A secure chamber for live mediation, emotional translation, and response reframing.",
} as const;

export const SYNAPSE_ROUTES = {

 home: "/",
 intake: "/intake",
 onboarding: "/onboarding",
 airlock: "/airlock",
 dashboard: "/dashboard",
 memory: "/memory",
 cases: "/cases",
} as const;

export const SYNAPSE_COLORS = {
 background: "#08090d",
 backgroundDeep: "#02060a",
 surface: "#0e1018",
 surfaceRaised: "#141720",
 surfaceOffset: "#1c2030",
 border: "#2e3348",
 divider: "#242838",

 glass: "rgba(18, 22, 34, 0.55)",
 glassDark: "rgba(8, 9, 13, 0.72)",
 glassHover: "rgba(26, 31, 48, 0.72)",
 glassBorder: "rgba(61, 154, 166, 0.28)",

 text: "#e8e6e0",
 textMuted: "#8a8fa8",
 textFaint: "#454a60",

 synapseCyan: "#3d9aa6",
 synapseCyanHover: "#2d7e8a",
 synapseCyanDim: "#0f2a30",
 synapseCyanGlow: "rgba(61, 154, 166, 0.22)",

 neuralAmber: "#e8820c",
 neuralAmberDim: "#2a1a05",
 neuralAmberGlow: "rgba(232, 130, 12, 0.2)",

 ponzGold: "#c9a227",
 ponzGoldDim: "#2a2005",

 partnerA: "#c0392b",
 partnerAHover: "#a93226",
 partnerADim: "#2a0f0d",
 partnerAGlow: "rgba(192, 57, 43, 0.24)",

 partnerB: "#2471a3",
 partnerBHover: "#1f618d",
 partnerBDim: "#0a1a2a",
 partnerBGlow: "rgba(36, 113, 163, 0.24)",

 success: "#27ae60",
 warning: "#e67e22",
 danger: "#c0392b",
} as const;

export const SYNAPSE_ASSETS = {

 ponzIcon: "/ponz/dr-ponz-icon.png",
 heroBackground: "/ponz/hero-bg.png",
 dataViz: "/ponz/data-viz.png",
 loreBackground: "/ponz/lore-bg.png",

 // Optional renamed assets from the uploaded visual direction.
 // Add these files later only if you copy/rename them into public/ponz.
 heartBrain: "/ponz/synapse-heart-brain.jpg",
 airlockExplainer: "/ponz/airlock-explainer.jpg",
 secureAirlockUi: "/ponz/secure-airlock-ui.jpg",
 onboardingLogin: "/ponz/onboarding-login.jpg",
 neuralPath: "/ponz/neural-path.jpg",
 welcomeSynapse: "/ponz/welcome-synapse.jpg",
 neuralBurst: "/ponz/neural-burst.jpg",
 heartNode: "/ponz/heart-node.jpg",
 mobileUi: "/ponz/synapse-mobile-ui.jpg",
 rubySapphireSelector: "/ponz/ruby-sapphire-selector.jpg",
} as const;

export const PARTNERS = {
 partnerA: {
     key: "partner_a",
     label: "Partner A",
     shortLabel: "A",
     color: SYNAPSE_COLORS.partnerA,
     hoverColor: SYNAPSE_COLORS.partnerAHover,
     dimColor: SYNAPSE_COLORS.partnerADim,
     glow: SYNAPSE_COLORS.partnerAGlow,
     themeName: "Ruby",
 },
 partnerB: {
     key: "partner_b",
     label: "Partner B",
     shortLabel: "B",
     color: SYNAPSE_COLORS.partnerB,
     hoverColor: SYNAPSE_COLORS.partnerBHover,
     dimColor: SYNAPSE_COLORS.partnerBDim,
     glow: SYNAPSE_COLORS.partnerBGlow,
     themeName: "Sapphire",
 },
} as const;

export type PartnerKey = keyof typeof PARTNERS;
export type PartnerRole = (typeof PARTNERS)[PartnerKey]["key"];

export const SYNAPSE_NAV = [
 {
     label: "Synapse",
     href: SYNAPSE_ROUTES.home,
     description: "Project identity and entry point.",
 },
 {
     label: "Core",
     href: SYNAPSE_ROUTES.dashboard,
     description: "Signals, vectors, and interpretation layers.",

 },
 {
     label: "Airlock",
     href: SYNAPSE_ROUTES.airlock,
     description: "Live mediation with Dr. Ponz.",
 },
 {
     label: "Intake",
     href: SYNAPSE_ROUTES.intake,
     description: "Structured assessment and profile building.",
 },
 {
     label: "Memory",
     href: SYNAPSE_ROUTES.memory,
     description: "Stored patterns, profiles, and historical analysis.",
 },
 {
     label: "Cases",
     href: SYNAPSE_ROUTES.cases,
     description: "Investigations, timelines, and interpretive records.",
 },
] as const;

export const SYNAPSE_MODULES = {
 intake: {
     label: "Synapse Intake",
     eyebrow: "Assessment Layer",
     description: "Structured behavioral assessment and profile building.",
 },
 airlock: {
     label: "Synapse Airlock",
     eyebrow: "Conversation Chamber",
     description: "Live mediated dialogue with Dr. Ponz.",
 },
 core: {
     label: "Synapse Core",
     eyebrow: "Neural Review Layer",
     description: "Signals, vectors, and command-center review.",
 },
 memory: {
     label: "Synapse Memory",
     eyebrow: "Pattern Archive",
     description: "Stored patterns, profile history, and recurring signals.",
 },
 cases: {
     label: "Synapse Cases",
     eyebrow: "Case Workspace",
     description: "Investigations, timelines, and interpretive records.",
 },
} as const;

export const AIRLOCK_TRIAGE = {
 green: {
     label: "Green",
     title: "Clear for delivery",

      description: "Message can pass with optional reframing.",
      className: "border-emerald-400/25 bg-emerald-400/10 text-emerald-100",
 },
 yellow: {
      label: "Yellow",
      title: "Reframe recommended",
      description: "Sender should choose original or reframed message before delivery.",
      className: "border-amber-400/25 bg-amber-400/10 text-amber-100",
 },
 red: {
      label: "Red",
      title: "Human review required",
      description: "Delivery pauses because the message may contain crisis, coercion, or safety risk.",
      className: "border-red-400/25 bg-red-400/10 text-red-100",
 },
} as const;

export const SYNAPSE_CLASSES = {
 pageShell:
      "min-h-screen bg-[radial-gradient(circle_at_top,_rgba(61,154,166,0.14),_transparent_34%),linear-gradient(180deg,_#071119_0%,_#02060a_100%)] text-slate-100",

 pageShellWarm:
      "min-h-screen bg-[radial-gradient(circle_at_top,_rgba(232,130,12,0.12),_transparent_32%),linear-gradient(180deg,_#12090b_0%,_#02060a_100%)] text-slate-100",

 container:
      "mx-auto w-full max-w-7xl px-6 py-8 md:px-10",

 glassPanel:
      "rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30 backdrop-blur-xl",

 glassPanelStrong:
      "rounded-[2rem] border border-cyan-300/20 bg-cyan-300/[0.06] shadow-2xl shadow-cyan-950/30 backdrop-blur-xl",

 glassPanelDark:
      "rounded-[2rem] border border-white/10 bg-black/30 shadow-2xl shadow-black/40 backdrop-blur-xl",

 tinyEyebrow:
      "text-[10px] uppercase tracking-[0.32em] text-cyan-300/70",

 mutedEyebrow:
      "text-[10px] uppercase tracking-[0.28em] text-slate-500",

 heroTitle:
      "text-4xl font-semibold leading-tight tracking-tight md:text-6xl",

 sectionTitle:
      "text-2xl font-semibold tracking-tight md:text-4xl",

    bodyText:
      "text-sm leading-7 text-slate-300 md:text-base",

    mutedText:
      "text-sm leading-6 text-slate-400",

    cyanButton:
      "rounded-full border border-cyan-300/25 bg-cyan-300/10 px-5 py-2 text-xs uppercase tracking-[0.24em] text-cyan-100 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-50",

    ghostButton:
      "rounded-full border border-white/10 px-5 py-2 text-xs uppercase tracking-[0.24em] text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-100",

    inputShell:
      "rounded-[1.5rem] border border-white/10 bg-black/25 p-3",

    textArea:
      "min-h-[120px] w-full resize-none bg-transparent text-sm leading-7 text-slate-100 outline-none placeholder:text-slate-500",
} as const;

export function getPartnerTheme(role: PartnerRole) {
    if (role === "partner_a") return PARTNERS.partnerA;
    return PARTNERS.partnerB;
}

export function getTriageTheme(level: keyof typeof AIRLOCK_TRIAGE) {
    return AIRLOCK_TRIAGE[level];
}

export function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}
