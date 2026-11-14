import type { VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";
import { slottable } from "../lib/slot";
import { buttonVariants } from "../recipes/button";
import { Spinner } from "./spinner";

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render the child (a router's Link) as the button, keeping icons, spinner and shortcut. */
    asChild?: boolean;
    /** Swaps the start icon for a spinner. The button keeps its width and stops accepting clicks. */
    loading?: boolean;
    iconStart?: ReactNode;
    /** Slides forward on hover. Use for arrows and chevrons that lead somewhere. */
    iconEnd?: ReactNode;
    /** A shortcut shown inside the button, such as "⌘↵". */
    shortcut?: string;
  };

export function Button({
  className,
  variant,
  size,
  block,
  asChild,
  loading,
  disabled,
  iconStart,
  iconEnd,
  shortcut,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, block }), className);
  const iconOnly = typeof size === "string" && size.startsWith("icon");
  const isFilled = variant === "primary" || variant === "danger";
  // With asChild the child (a Link, say) becomes the button and keeps every
  // detail: icons, the spinner, the sliding end icon and the shortcut.
  const Comp = asChild ? Slot.Root : "button";
  const own = asChild
    ? { "aria-disabled": disabled || loading || undefined }
    : { type, disabled: disabled || loading };

  return (
    <Comp
      className={classes}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      {...own}
      {...props}
    >
      {loading ? <Spinner size={size === "lg" || size === "icon-lg" ? "lg" : "md"} /> : iconStart}
      {slottable(asChild, children, (content) => (loading && iconOnly ? null : content))}
      {iconEnd && (
        <span className="-me-0.5 inline-flex transition-transform duration-(--wx-duration-move) ease-move group-hover/button:translate-x-0.5 rtl:group-hover/button:-translate-x-0.5 rtl:[&_svg]:-scale-x-100">
          {iconEnd}
        </span>
      )}
      {shortcut && (
        <kbd
          className={cn(
            "-me-1 ms-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-xs px-1 font-sans text-[0.6875rem] font-medium leading-none",
            isFilled ? "bg-[rgb(255_255_255/0.2)] text-current" : "bg-bg-muted text-fg-subtle",
          )}
        >
          {shortcut}
        </kbd>
      )}
    </Comp>
  );
}
