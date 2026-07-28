"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  SYNAPSE_BRAND,
  SYNAPSE_CLASSES,
  SYNAPSE_NAV,
  cn,
} from "@/lib/synapse-theme";

/** Routes that currently have real page implementations. */
const LIVE_HREFS = new Set(["/", "/dashboard", "/airlock", "/intake"]);

type AppShellProps = {
  title?: string;
  children: ReactNode;
};

export function AppShell({ title, children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className={SYNAPSE_CLASSES.pageShell}>
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-10">
          <div className="flex min-w-0 items-center gap-4">
            <Link href="/" className="group shrink-0">
              <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300/70 transition group-hover:text-cyan-200">
                {SYNAPSE_BRAND.productName}
              </p>
              <p className="mt-1 text-sm font-semibold tracking-tight text-slate-100">
                {title ?? SYNAPSE_BRAND.systemName}
              </p>
            </Link>

            <div className="hidden h-8 w-px bg-white/10 sm:block" />

            <p className="hidden max-w-xs text-xs leading-5 text-slate-500 sm:block">
              {SYNAPSE_BRAND.systemLine}
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            {SYNAPSE_NAV.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const isLive = LIVE_HREFS.has(item.href);

              if (!isLive) {
                return (
                  <span
                    key={item.href}
                    title={`${item.description} (coming soon)`}
                    className="cursor-not-allowed rounded-full border border-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-slate-600"
                  >
                    {item.label}
                  </span>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.description}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition",
                    isActive
                      ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
                      : "border-white/10 text-slate-400 hover:border-cyan-300/30 hover:text-cyan-100"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}
