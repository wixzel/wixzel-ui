import { cva } from "class-variance-authority";

/**
 * Shared by every text-like control, so Input, Textarea and Select read as one
 * family. A field is a tinted fill with no border; it darkens a shade on
 * hover and on focus takes a solid 2px accent edge. Invalid fields keep a red
 * edge, solid red on focus.
 */
export const controlSurface = [
  "border border-transparent bg-bg-muted text-fg",
  "transition-[border-color,box-shadow,background-color] duration-(--wx-duration-fast) ease-standard",
  "hover:bg-[color-mix(in_oklab,var(--wx-color-bg-muted),var(--wx-color-fg)_5%)]",
  "aria-invalid:border-danger-ink",
  "disabled:cursor-not-allowed disabled:bg-bg-subtle disabled:text-fg-disabled",
];

export const controlFocus = [
  "outline-none",
  "focus-visible:border-accent-edge focus-visible:shadow-[0_0_0_1px_var(--wx-color-focus)]",
  "aria-invalid:focus-visible:border-danger-ink aria-invalid:focus-visible:shadow-[0_0_0_1px_var(--wx-color-danger-ink)]",
];

export const controlFocusWithin = [
  "focus-within:border-accent-edge focus-within:shadow-[0_0_0_1px_var(--wx-color-focus)]",
  "data-invalid:focus-within:border-danger-ink data-invalid:focus-within:shadow-[0_0_0_1px_var(--wx-color-danger-ink)]",
];

export const inputVariants = cva("w-full min-w-0 placeholder:text-fg-subtle", {
  variants: {
    size: {
      sm: "h-control-sm rounded-md px-2.5 text-body-sm",
      md: "h-control-md rounded-md px-3.5 text-body-sm",
      lg: "h-control-lg rounded-lg px-3.5 text-body-md",
    },
  },
  defaultVariants: { size: "md" },
});
