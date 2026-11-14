import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn";
import { slottable } from "../lib/slot";

/**
 * Tabs that are pages: a row of links across the top of a section of an app
 * (an admin area, a creator studio), each one its own URL. They look like
 * <Tabs variant="line">, with the current page inked, but navigate instead of
 * swapping panels. Scrolls sideways on a narrow screen rather than wrapping.
 */
export function NavTabs({ className, ...props }: ComponentProps<"nav">) {
  return (
    <nav
      className={cn(
        "flex items-center gap-1 overflow-x-auto border-b border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      {...props}
    />
  );
}

/** One page in NavTabs. Pass a router's Link with `asChild`; mark the page you're on with `current`. */
export function NavTab({
  current,
  asChild,
  className,
  children,
  ...props
}: ComponentProps<"a"> & { current?: boolean; asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      aria-current={current ? "page" : undefined}
      className={cn(
        "relative isolate inline-flex h-11 shrink-0 select-none items-center gap-1.5 whitespace-nowrap px-3.5 text-body-sm font-medium text-fg-muted wx-focus",
        "transition-colors duration-(--wx-duration-fast) ease-standard hover:text-fg",
        "before:absolute before:inset-x-0 before:inset-y-1.5 before:-z-10 before:rounded-md before:transition-colors before:duration-(--wx-duration-fast) hover:before:bg-bg-muted",
        // The current page is inked: a solid block of text colour, the label reversed out of it.
        "aria-[current=page]:text-bg aria-[current=page]:before:bg-fg",
        "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {slottable(asChild, children)}
    </Comp>
  );
}
