"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import {
  SYNAPSE_BRAND,
  SYNAPSE_NAV,
  SYNAPSE_ROUTES,
  cn,
} from "@/lib/synapse-theme";

const AVAILABLE_ROUTES = new Set<string>([
  SYNAPSE_ROUTES.home,
  SYNAPSE_ROUTES.dashboard,
  SYNAPSE_ROUTES.airlock,
  SYNAPSE_ROUTES.intake,
]);

type AppShellProps = {
  children: ReactNode;
  title?: string;
};

export function AppShell({ children, title }: AppShellProps) {
  const pathname = usePathname();
  const navigation = SYNAPSE_NAV.filter((item) =>
    AVAILABLE_ROUTES.has(item.href)
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(61,154,166,0.14),_transparent_34%),linear-gradient(180deg,_#071119_0%,_#02060a_100%)] text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#02060a]/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-3 md:px-10">
          <Link href="/" className="group flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-xs font-semibold tracking-[0.18em] text-cyan-100 shadow-lg shadow-cyan-950/40">
              PS
            </span>

            <span>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-cyan-300/70">
                {SYNAPSE_BRAND.productName}
              </span>
              <span className="block text-sm font-medium text-slate-100 transition group-hover:text-cyan-100">
                {title ?? SYNAPSE_BRAND.interpreterName}
              </span>
            </span>
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-1">
            {navigation.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3 py-2 text-[10px] font-medium uppercase tracking-[0.2em] transition",
                    isActive
                      ? "bg-cyan-300/12 text-cyan-100 ring-1 ring-cyan-300/25"
                      : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs text-slate-500 md:px-10">
          <span>{SYNAPSE_BRAND.systemLine}</span>
          <span className="uppercase tracking-[0.2em]">
            Local intelligence layer
          </span>
        </div>
      </footer>
    </div>
  );
}
