import type { ComponentProps } from "react";
import { cn } from "../lib/cn";
import { useLabels } from "./labels";

const sizes = { sm: "size-3.5", md: "size-4", lg: "size-5", xl: "size-8" } as const;

/**
 * The ring spinner: a quarter arc with round ends turning over a faint track.
 * With reduced motion it turns at a third of the speed rather than stopping,
 * since a still frame would show nothing. Inherits the text colour.
 */
export function Spinner({
  size = "md",
  label,
  className,
  ...props
}: Omit<ComponentProps<"svg">, "children"> & { size?: keyof typeof sizes; label?: string }) {
  const labels = useLabels();
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      role="status"
      aria-label={label ?? labels.loading}
      className={cn("wx-motion-essential shrink-0 animate-wx-spin motion-reduce:[animation-duration:2.4s]", sizes[size], className)}
      {...props}
    >
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeOpacity={0.18} strokeWidth={1.75} />
      <path d="M8 1.75a6.25 6.25 0 0 1 6.25 6.25" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
    </svg>
  );
}
