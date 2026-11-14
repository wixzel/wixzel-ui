import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "info";
type Appearance = "soft" | "solid" | "outline";

const tones: Record<Tone, Record<Appearance, string>> = {
  neutral: {
    soft: "bg-bg-muted text-fg-muted shadow-[inset_0_0_0_1px_rgb(24_22_10/0.04)]",
    solid: "bg-bg-inverse text-fg-inverse",
    outline: "border-border-strong text-fg-muted",
  },
  accent: {
    soft: "bg-accent-subtle text-accent-ink",
    solid: "bg-accent text-accent-fg",
    outline: "border-accent-edge text-accent-ink",
  },
  success: {
    soft: "bg-success-subtle text-success-ink",
    solid: "bg-success text-success-fg",
    outline: "border-success-ink text-success-ink",
  },
  warning: {
    soft: "bg-warning-subtle text-warning-ink",
    solid: "bg-warning text-warning-fg",
    outline: "border-warning-ink text-warning-ink",
  },
  danger: {
    soft: "bg-danger-subtle text-danger-ink",
    solid: "bg-danger text-danger-fg",
    outline: "border-danger-ink text-danger-ink",
  },
  info: {
    soft: "bg-info-subtle text-info-ink",
    solid: "bg-info text-info-fg",
    outline: "border-info-ink text-info-ink",
  },
};

export interface BadgeProps extends ComponentProps<"span"> {
  tone?: Tone;
  appearance?: Appearance;
  /** A status dot before the label ("Active", "Failed"). */
  dot?: boolean;
  /** The dot sends out a slow ring: something is happening right now (a live call, an agent speaking). */
  pulse?: boolean;
  size?: "sm" | "md";
}

export function Badge({
  tone = "neutral",
  appearance = "soft",
  dot,
  pulse,
  size = "md",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xs border border-transparent font-medium tabular-nums",
        "[&_svg]:size-3 [&_svg]:shrink-0",
        size === "md" ? "h-5 px-1.5 text-caption" : "h-4 px-1 text-[0.6875rem] leading-4",
        tones[tone][appearance],
        className,
      )}
      {...props}
    >
      {(dot || pulse) && (
        <span aria-hidden className="relative flex size-1.5 shrink-0">
          {pulse && <span className="absolute inset-0 animate-wx-pulse rounded-full bg-current" />}
          <span className="relative size-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
