import { Slot } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn";
import { slottable } from "../lib/slot";

export function Card({
  className,
  interactive,
  selected,
  asChild,
  children,
  ...props
}: ComponentProps<"div"> & {
  /** Render the child as the card, such as a Link for a card that goes somewhere. */
  asChild?: boolean;
  /** Darkens a shade on hover and shrinks a little when pressed. Use when the whole card is a link or button. */
  interactive?: boolean;
  /** A solid 2px accent ring and a check in the corner. */
  selected?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-selected={selected || undefined}
      aria-selected={selected}
      className={cn(
        // A panel is a tinted fill on the page: no border, no shadow.
        "relative flex flex-col rounded-lg bg-card text-fg",
        interactive && [
          "cursor-pointer transition-[background-color,box-shadow,scale] duration-(--wx-duration-move) ease-move",
          "hover:bg-[color-mix(in_oklab,var(--wx-color-card),var(--wx-color-fg)_4%)] active:scale-[0.99] active:duration-(--wx-duration-instant)",
        ],
        selected && "bg-accent-subtle shadow-[0_0_0_2px_var(--wx-color-accent-edge)] hover:bg-accent-subtle",
        className,
      )}
      {...props}
    >
      {slottable(asChild, children)}
      {selected && (
        <span
          aria-hidden
          className="absolute end-3 top-3 grid size-4 animate-wx-pop-in place-items-center rounded-xs bg-accent text-accent-fg shadow-[0_0_0_1px_color-mix(in_oklab,var(--wx-color-accent)_78%,black)]"
        >
          <svg viewBox="0 0 12 12" fill="none" className="size-2.5">
            <path d="M2.5 6.3 4.8 8.6 9.5 3.6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </Comp>
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1 p-5 pb-0 last:pb-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return <h3 className={cn("text-heading-sm text-balance", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-body-sm text-fg-muted", className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("mt-auto flex items-center gap-2 border-t border-border px-5 py-3", className)} {...props} />
  );
}
