import type { CSSProperties, HTMLAttributes } from "react";
import { cn, getPartnerTheme } from "../../lib/synapse-theme";
import type { PartnerRole } from "../../lib/synapse-theme";

type PartnerBadgeSize = "sm" | "md" | "lg";
type PartnerBadgeVariant = "glass" | "solid" | "outline";

type PartnerBadgeProps = HTMLAttributes<HTMLDivElement> & {
   role: PartnerRole;
   name?: string;
   size?: PartnerBadgeSize;
   variant?: PartnerBadgeVariant;
   showThemeName?: boolean;
};

const sizeClassMap: Record<PartnerBadgeSize, string> = {
   sm: "px-3 py-1 text-[10px]",
   md: "px-4 py-2 text-xs",
   lg: "px-5 py-3 text-sm",
};

export function PartnerBadge({
   role,
   name,
   size = "md",
   variant = "glass",
   showThemeName = true,
   className,
   ...props
}: PartnerBadgeProps) {
   const partner = getPartnerTheme(role);

   const style: CSSProperties = {
      borderColor: partner.color,
      color: partner.color,

      boxShadow:
          variant === "glass" || variant === "solid"
             ? `0 0 24px ${partner.glow}`
             : undefined,
      background:
          variant === "solid"
             ? partner.dimColor
             : variant === "glass"
               ? partner.glow
               : "transparent",
    };

    return (
      <div
          className={cn(
             "inline-flex items-center gap-2 rounded-full border font-semibold uppercase tracking-[0.22em] backdrop-blur-xl",
             sizeClassMap[size],
             className
          )}
          style={style}
          {...props}
      >
          <span
             className="inline-block h-2.5 w-2.5 rounded-full"
             style={{
               backgroundColor: partner.color,
               boxShadow: `0 0 14px ${partner.color}`,
             }}
          />

          <span>{name ? `${name} · ${partner.label}` : partner.label}</span>

          {showThemeName ? (
             <span className="opacity-60">{partner.themeName}</span>
          ) : null}
      </div>
    );
}
