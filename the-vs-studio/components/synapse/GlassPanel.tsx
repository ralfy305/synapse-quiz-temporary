import type { HTMLAttributes, ReactNode } from "react";
import { cn, SYNAPSE_CLASSES } from "../../lib/synapse-theme";

type GlassPanelVariant = "default" | "strong" | "dark" | "warm";

type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
   children: ReactNode;
   variant?: GlassPanelVariant;
   padding?: "none" | "sm" | "md" | "lg";
};

const variantClassMap: Record<GlassPanelVariant, string> = {
   default: SYNAPSE_CLASSES.glassPanel,
   strong: SYNAPSE_CLASSES.glassPanelStrong,
   dark: SYNAPSE_CLASSES.glassPanelDark,
   warm:
        "rounded-[2rem] border border-orange-300/20 bg-orange-300/[0.05] shadow-2xl shadow-orange-950/20 backdrop-blur-xl",
};

const paddingClassMap: Record<NonNullable<GlassPanelProps["padding"]>, string> = {
   none: "",
   sm: "p-4",
   md: "p-5 md:p-6",
   lg: "p-6 md:p-8",
};

export function GlassPanel({
   children,
   className,
   variant = "default",
   padding = "md",
   ...props
}: GlassPanelProps) {
   return (
        <div
            className={cn(
             variantClassMap[variant],
             paddingClassMap[padding],
             className
            )}
            {...props}
        >
            {children}

        </div>
    );
}
