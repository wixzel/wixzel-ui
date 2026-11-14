import { cva } from "class-variance-authority";

/**
 * Details every button carries:
 * - Press shrinks to 96% at once and eases back on release.
 * - Filled buttons have a 1px darker rim, a top highlight and a hard bottom edge.
 * - Secondary buttons are raised and go concave while held.
 * - An end icon (an arrow, say) slides 2px forward on hover.
 * - Loading swaps the start icon for a spinner and keeps the width.
 */
export const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-medium wx-focus",
    "transition-[background-color,box-shadow,color,scale] duration-(--wx-duration-move) ease-move",
    "active:scale-[0.96] active:duration-(--wx-duration-instant) active:ease-standard",
    "disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45",
    "data-loading:opacity-100",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-accent text-accent-fg",
          "shadow-[0_0_0_1px_color-mix(in_oklab,var(--wx-color-accent)_76%,black),inset_0_1px_0_rgb(255_255_255/0.22),0_1px_0_rgb(24_22_10/0.24)]",
          "hover:bg-accent-hover",
          "active:shadow-[0_0_0_1px_color-mix(in_oklab,var(--wx-color-accent)_74%,black),inset_0_1px_0_rgb(0_0_0/0.2)]",
        ],
        // The raised and pressed shadows as they were when this button was approved,
        // kept here so later changes to the shared depth tokens don't move it.
        secondary: [
          "bg-surface text-fg hover:bg-bg-subtle active:bg-bg-subtle",
          "shadow-[0_0_0_1px_light-dark(rgb(24_22_10/0.15),rgb(255_255_255/0.11)),0_1px_0_light-dark(rgb(24_22_10/0.1),rgb(0_0_0/0.6)),inset_0_1px_0_light-dark(rgb(255_255_255/0),rgb(255_255_255/0.06))]",
          "active:shadow-[0_0_0_1px_light-dark(rgb(24_22_10/0.18),rgb(255_255_255/0.09)),inset_0_1px_0_light-dark(rgb(24_22_10/0.1),rgb(0_0_0/0.5))]",
        ],
        ghost:
          "text-fg-muted hover:bg-bg-muted hover:text-fg active:bg-[color-mix(in_oklab,var(--wx-color-bg-muted),var(--wx-color-fg)_6%)]",
        danger: [
          "bg-danger text-danger-fg",
          "shadow-[0_0_0_1px_color-mix(in_oklab,var(--wx-color-danger)_76%,black),inset_0_1px_0_rgb(255_255_255/0.22),0_1px_0_rgb(24_22_10/0.24)]",
          "hover:bg-[color-mix(in_oklab,var(--wx-color-danger),black_10%)]",
        ],
        link: "h-auto! px-0! text-accent-ink underline decoration-[color-mix(in_oklab,currentColor,transparent_65%)] underline-offset-[3px] hover:decoration-current active:scale-100",
      },
      size: {
        xs: "h-control-xs gap-1 rounded-sm px-2 text-caption [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-control-sm gap-1.5 rounded-md px-2.5 text-body-sm",
        md: "h-control-md gap-1.5 rounded-md px-3 text-body-sm",
        lg: "h-control-lg gap-2 rounded-lg px-4 text-body-md",
        "icon-xs": "size-control-xs rounded-sm [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-control-sm rounded-md",
        icon: "size-control-md rounded-md",
        "icon-lg": "size-control-lg rounded-lg [&_svg:not([class*='size-'])]:size-5",
      },
      block: { true: "w-full" },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);
