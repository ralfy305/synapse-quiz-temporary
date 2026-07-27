import Link from "next/link";
import { GlassPanel } from "./GlassPanel";
import { PartnerBadge } from "./PartnerBadge";
import {
  SYNAPSE_BRAND,
  SYNAPSE_CLASSES,
  SYNAPSE_MODULES,
  SYNAPSE_ROUTES,
  cn,
} from "../../lib/synapse-theme";

type SynapseHeroPortal = {
  href: string;
  title: string;
  eyebrow: string;
  description: string;
};

const HERO_PORTALS: readonly SynapseHeroPortal[] = [
  {
      href: SYNAPSE_ROUTES.intake,
      title: SYNAPSE_MODULES.intake.label,
      eyebrow: SYNAPSE_MODULES.intake.eyebrow,
      description: SYNAPSE_MODULES.intake.description,
  },
  {
      href: SYNAPSE_ROUTES.airlock,
      title: SYNAPSE_MODULES.airlock.label,
      eyebrow: SYNAPSE_MODULES.airlock.eyebrow,
      description: SYNAPSE_MODULES.airlock.description,
  },
  {
      href: SYNAPSE_ROUTES.dashboard,
      title: SYNAPSE_MODULES.core.label,
      eyebrow: SYNAPSE_MODULES.core.eyebrow,
      description: SYNAPSE_MODULES.core.description,
  },
];

export function SynapseHero() {
  return (
      <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-8">
         <div className="space-y-4">
            <p className={SYNAPSE_CLASSES.tinyEyebrow}>
              {SYNAPSE_BRAND.productName}
            </p>

            <h1 className={SYNAPSE_CLASSES.heroTitle}>
              Neural intake, mediated dialogue, and behavioral intelligence.

          </h1>

          <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
             {SYNAPSE_BRAND.systemName} is the environment.{" "}
             {SYNAPSE_BRAND.interpreterName} is the interpretation layer.
             Together, they read tension, pattern, motive, repair capacity,
             emotional drift, and relational signal.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <PartnerBadge role="partner_a" />
          <PartnerBadge role="partner_b" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {HERO_PORTALS.map((portal) => (
             <Link
                 key={portal.href}
                 href={portal.href}
                 className={cn(
                  "group block rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition duration-300",
                  "hover:border-cyan-300/40 hover:bg-white/[0.07]"
                 )}
             >
                 <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/70">
                  {portal.eyebrow}
                 </p>

                 <h2 className="mt-3 text-lg font-semibold text-slate-100">
                  {portal.title}
                 </h2>

                 <p className="mt-2 text-sm leading-6 text-slate-400">
                  {portal.description}
                 </p>

                 <div className="mt-5 text-xs uppercase tracking-[0.24em] text-slate-500 transition group-hover:text-cyan-200">
                  Enter
                 </div>
             </Link>
          ))}
        </div>
      </div>

      <GlassPanel variant="strong" padding="lg" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(232,130,12,0.20),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(36,113,163,0.20),_transparent_35%)]" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
             <div>

                    <p className={SYNAPSE_CLASSES.tinyEyebrow}>
                     Interpretation Layer
                    </p>

                    <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                     {SYNAPSE_BRAND.interpreterName}
                    </h2>
               </div>

               <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-emerald-200">
                    Online
               </div>
             </div>

             <div className="mt-6 space-y-4">
               <GlassPanel variant="dark" padding="sm">
                    <p className={SYNAPSE_CLASSES.mutedEyebrow}>Role</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                     Mediator, pattern reader, reframing engine, and clinical
                     narrator operating inside the Synapse environment.
                    </p>
               </GlassPanel>

               <GlassPanel variant="dark" padding="sm">
                    <p className={SYNAPSE_CLASSES.mutedEyebrow}>Current Functions</p>

                    <ul className="mt-3 space-y-2 text-sm text-slate-300">
                     <li>• Intake reflection</li>
                     <li>• Airlock mediation</li>
                     <li>• Empathy comparison</li>
                     <li>• Behavioral drift detection</li>
                     <li>• Synapse Report synthesis</li>
                    </ul>
               </GlassPanel>

               <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-4 text-sm leading-6 text-cyan-100">
                    “{SYNAPSE_BRAND.systemLine}”
               </div>
             </div>
           </div>
          </GlassPanel>
        </section>
    );
}
