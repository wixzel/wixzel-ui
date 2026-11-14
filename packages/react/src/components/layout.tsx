import { CaretDown } from "@phosphor-icons/react";
import { Accordion as AccordionPrimitive, Popover as PopoverPrimitive, Slot } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";
import { slottable } from "../lib/slot";
import { useScopeAttributes } from "./scope";

/** A panel of a settings page or editor: an icon tile, a title, a line of description, then the body. */
export function Section({
  title,
  description,
  icon,
  actions,
  tone = "default",
  className,
  children,
  ...props
}: Omit<ComponentProps<"section">, "title"> & {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  /** danger: a red wash for destructive settings such as deleting an account. */
  tone?: "default" | "danger";
}) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-lg bg-card p-5",
        tone === "danger" && "bg-[color-mix(in_oklab,var(--wx-color-danger-subtle),var(--wx-color-card)_35%)]",
        className,
      )}
      {...props}
    >
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-2.5">
            {icon && (
              <span
                className={cn(
                  "mt-px grid size-7 shrink-0 place-items-center rounded-sm bg-bg-muted [&_svg]:size-4",
                  tone === "danger" ? "bg-danger-subtle text-danger-ink" : "text-fg-muted",
                )}
              >
                {icon}
              </span>
            )}
            <div className="flex min-w-0 flex-col gap-0.5">
              {title && <h2 className="text-heading-sm">{title}</h2>}
              {description && <p className="text-body-sm text-fg-muted">{description}</p>}
            </div>
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

/**
 * A bar that sticks to the bottom of an editor while there are unsaved
 * changes: a quiet action on the start, the save action on the end. Sharpens
 * in from a blur when it appears.
 */
export function ActionBar({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "wx-plane-overlay sticky bottom-3 z-(--wx-z-sticky) flex animate-wx-rise-in items-center justify-between gap-3 rounded-lg bg-surface-overlay px-3 py-2",
        "shadow-[0_0_0_1px_var(--wx-color-border-strong),0_10px_24px_-8px_rgb(24_22_10/0.2)]",
        className,
      )}
      {...props}
    />
  );
}

/** When a list has nothing in it: say what will appear and how to add the first one. */
export function EmptyState({
  icon,
  title,
  description,
  actions,
  className,
  ...props
}: Omit<ComponentProps<"div">, "title"> & {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg bg-card px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      {icon && (
        <span className="grid size-11 place-items-center rounded-md bg-surface text-fg-muted [&_svg]:size-5">{icon}</span>
      )}
      <div className="flex max-w-[44ch] flex-col gap-1">
        <h3 className="text-heading-sm">{title}</h3>
        {description && <p className="text-body-sm text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="mt-1 flex flex-wrap items-center justify-center gap-2">{actions}</div>}
    </div>
  );
}

/** A quick action: an icon tile and a label, the whole thing pressable. Fills a shade darker on hover. */
export function Tile({
  icon,
  title,
  description,
  asChild,
  className,
  children,
  ...props
}: Omit<ComponentProps<"button">, "title"> & {
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      type={asChild ? undefined : "button"}
      className={cn(
        "group/tile flex min-h-16 items-center gap-3 rounded-lg bg-card px-3.5 py-3 text-start wx-focus",
        "transition-[background-color,scale] duration-(--wx-duration-move) ease-move",
        "hover:bg-[color-mix(in_oklab,var(--wx-color-card),var(--wx-color-fg)_4%)] active:scale-[0.98] active:duration-(--wx-duration-instant)",
        className,
      )}
      {...props}
    >
      {/* With asChild the child (a Link) becomes the tile and the icon and text go inside it. */}
      {slottable(asChild, children, (content) => (
        <>
          {icon && (
            <span className="grid size-9 shrink-0 place-items-center rounded-md bg-surface text-fg-muted transition-colors group-hover/tile:bg-accent-subtle group-hover/tile:text-accent-ink [&_svg]:size-5">
              {icon}
            </span>
          )}
          {(title || description) && (
            <span className="flex min-w-0 flex-col">
              {title && <span className="truncate text-body-sm font-medium">{title}</span>}
              {description && <span className="truncate text-caption text-fg-muted">{description}</span>}
            </span>
          )}
          {content}
        </>
      ))}
    </Comp>
  );
}

// ---------------------------------------------------------------- Accordion

export const Accordion = AccordionPrimitive.Root;

/** Rows that open in place, on one tinted panel split by hairlines. Open rows show their content below a hairline. */
export function AccordionItem({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn(
        "overflow-hidden border-t border-border bg-card first:rounded-t-lg first:border-t-0 last:rounded-b-lg",
        className,
      )}
      {...props}
    />
  );
}

export function AccordionTrigger({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group/trigger flex min-h-11 flex-1 items-center gap-3 px-4 py-2.5 text-start text-body-sm font-medium outline-none",
          "transition-colors hover:bg-[color-mix(in_oklab,var(--wx-color-card),var(--wx-color-fg)_4%)] focus-visible:bg-bg-muted",
          className,
        )}
        {...props}
      >
        <span className="flex min-w-0 flex-1 items-center gap-3">{children}</span>
        <CaretDown
          aria-hidden
          className="size-4 shrink-0 text-fg-subtle transition-transform duration-(--wx-duration-move) ease-move group-data-[state=open]/trigger:rotate-180"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden border-t border-border data-[state=closed]:animate-wx-collapse data-[state=open]:animate-wx-expand"
      {...props}
    >
      <div className={cn("p-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

// ---------------------------------------------------------------- Popover

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverClose = PopoverPrimitive.Close;

export function PopoverContent({
  className,
  sideOffset = 6,
  align = "center",
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) {
  const scope = useScopeAttributes();
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        {...scope}
        sideOffset={sideOffset}
        align={align}
        className={cn(
          "wx-plane-overlay z-(--wx-z-popover) w-72 rounded-lg border border-border bg-surface-overlay p-4 text-body-sm text-fg shadow-lg outline-none",
          "origin-(--radix-popover-content-transform-origin)",
          "data-[side=bottom]:[--wx-pop-y:-4px] data-[side=top]:[--wx-pop-y:4px]",
          "data-[state=open]:animate-wx-pop-in data-[state=closed]:animate-wx-pop-out",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
