import { Separator as SeparatorPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

/** A placeholder with a slow band of light passing over it. */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn(
        "rounded-sm bg-bg-muted",
        "bg-[linear-gradient(90deg,transparent_30%,color-mix(in_oklab,var(--wx-color-surface),transparent_40%)_50%,transparent_70%)] bg-size-[200%_100%] bg-no-repeat",
        "animate-wx-shimmer",
        className,
      )}
      {...props}
    />
  );
}

export function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "w-px self-stretch",
        className,
      )}
      {...props}
    />
  );
}

/** A keycap: a raised face with an even 1px edge. */
export function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-xs bg-surface px-1",
        "font-sans text-[0.6875rem] font-medium leading-none text-fg-muted",
        "shadow-[0_0_0_1px_var(--wx-color-border-strong),0_1px_2px_rgb(24_22_10/0.06)]",
        className,
      )}
      {...props}
    />
  );
}
