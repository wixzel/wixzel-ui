import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";
import { controlFocus, controlFocusWithin, controlSurface, inputVariants } from "../recipes/input";
import { useFieldControl } from "./field";

export type InputProps = Omit<ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants> & {
    /** An icon or short text inside the start of the field. It takes the accent while the field has focus. */
    leading?: ReactNode;
    /** An icon, unit, shortcut or button inside the end of the field. */
    trailing?: ReactNode;
  };

export function Input({ className, size, leading, trailing, ...props }: InputProps) {
  const control = useFieldControl(props);

  if (!leading && !trailing) {
    return (
      <input
        {...props}
        {...control}
        className={cn(inputVariants({ size }), controlSurface, controlFocus, className)}
      />
    );
  }

  // With adornments the wrapper draws the box and the input fills it.
  return (
    <div
      data-invalid={control["aria-invalid"] ? "" : undefined}
      data-disabled={control.disabled ? "" : undefined}
      className={cn(
        inputVariants({ size }),
        controlSurface,
        controlFocusWithin,
        "group/input flex cursor-text items-center gap-2 px-0",
        "data-invalid:border-danger-ink data-disabled:cursor-not-allowed data-disabled:bg-bg-subtle",
        "[&_svg:not([class*='size-'])]:size-4",
        className,
      )}
    >
      {leading && (
        <span className="flex shrink-0 items-center ps-2.5 text-fg-subtle transition-colors duration-(--wx-duration-fast) group-focus-within/input:text-accent-ink">
          {leading}
        </span>
      )}
      <input
        {...props}
        {...control}
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-fg-subtle disabled:cursor-not-allowed disabled:text-fg-disabled",
          !leading && "ps-3",
          !trailing && "pe-3",
        )}
      />
      {trailing && (
        <span className="flex shrink-0 items-center gap-1 pe-2 text-fg-subtle transition-opacity duration-(--wx-duration-fast)">
          {trailing}
        </span>
      )}
    </div>
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  const control = useFieldControl(props);
  return (
    <textarea
      {...props}
      {...control}
      className={cn(
        "min-h-20 w-full min-w-0 resize-y rounded-md px-3 py-2 text-body-sm leading-relaxed placeholder:text-fg-subtle [field-sizing:content]",
        controlSurface,
        controlFocus,
        className,
      )}
    />
  );
}
