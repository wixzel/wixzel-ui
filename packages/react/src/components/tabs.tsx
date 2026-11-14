import { Tabs as TabsPrimitive } from "radix-ui";
import { type ComponentProps, createContext, useContext, useLayoutEffect, useRef } from "react";
import { cn } from "../lib/cn";

type TabsVariant = "line" | "segment";
const VariantContext = createContext<TabsVariant>("line");

export function Tabs({
  className,
  variant = "line",
  ...props
}: ComponentProps<typeof TabsPrimitive.Root> & {
  /** line: sections of a page. segment: switching a view in place. */
  variant?: TabsVariant;
}) {
  return (
    <VariantContext.Provider value={variant}>
      <TabsPrimitive.Root className={cn("flex flex-col gap-4", className)} {...props} />
    </VariantContext.Provider>
  );
}

/**
 * Measures the active tab and moves one indicator to it, so selection slides
 * instead of jumping. The first placement doesn't animate.
 */
function useIndicator(list: React.RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const el = list.current;
    if (!el) return;
    let first = true;
    const place = () => {
      const active = el.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
      if (!active) {
        el.style.setProperty("--wx-tab-opacity", "0");
        return;
      }
      el.style.setProperty("--wx-tab-x", `${active.offsetLeft}px`);
      el.style.setProperty("--wx-tab-w", `${active.offsetWidth}px`);
      el.style.setProperty("--wx-tab-opacity", "1");
      if (first) {
        el.dataset.ready = "";
        first = false;
      }
    };
    place();
    const resize = new ResizeObserver(place);
    resize.observe(el);
    for (const tab of el.querySelectorAll('[role="tab"]')) resize.observe(tab);
    const mutation = new MutationObserver(place);
    mutation.observe(el, { attributes: true, attributeFilter: ["data-state"], subtree: true });
    return () => {
      resize.disconnect();
      mutation.disconnect();
    };
  }, [list]);
}

export function TabsList({ className, children, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  const variant = useContext(VariantContext);
  const ref = useRef<HTMLDivElement>(null);
  useIndicator(ref);
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "group/tabs relative isolate inline-flex items-center",
        variant === "line" && "gap-1 border-b border-border",
        variant === "segment" && "w-fit gap-0.5 rounded-md bg-bg-muted p-0.5",
        className,
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 -z-10 w-(--wx-tab-w) translate-x-(--wx-tab-x) opacity-(--wx-tab-opacity)",
          "group-data-ready/tabs:transition-[translate,width,opacity] group-data-ready/tabs:duration-(--wx-duration-move) group-data-ready/tabs:ease-move",
          // The current tab is inked: a solid block of text colour, the label reversed out of it.
          variant === "line" && "top-1.5 bottom-1.5 rounded-md bg-fg",
          variant === "segment" && "inset-y-0.5 rounded-sm bg-fg",
        )}
      />
    </TabsPrimitive.List>
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = useContext(VariantContext);
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "relative inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-sm text-body-sm font-medium text-fg-muted wx-focus",
        "transition-colors duration-(--wx-duration-fast) ease-standard hover:text-fg data-[state=active]:text-bg",
        "disabled:pointer-events-none disabled:opacity-45",
        "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        variant === "line" && "h-11 px-3.5 after:absolute after:inset-x-0 after:inset-y-1.5 after:-z-20 after:rounded-md after:transition-colors hover:after:bg-bg-muted",
        variant === "segment" && "h-control-xs px-3.5",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn("outline-none data-[state=active]:animate-wx-fade-in", className)}
      {...props}
    />
  );
}
