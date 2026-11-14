/**
 * Shared by Select, DropdownMenu and Combobox so every floating list in every
 * product is the same object. Exported for products that compose a popover of
 * their own: a panel, rows, a group label, a divider.
 */

export const floatingPanel = [
  "z-(--wx-z-popover) min-w-(--radix-select-trigger-width,9rem) overflow-hidden",
  "wx-plane-overlay rounded-lg border border-border bg-surface-overlay p-1 text-fg shadow-lg",
  // Sharpens out of a blur as it drifts a few pixels from its trigger.
  "data-[side=bottom]:[--wx-pop-y:-4px] data-[side=top]:[--wx-pop-y:4px]",
  "data-[state=open]:animate-wx-pop-in data-[state=closed]:animate-wx-pop-out",
];

export const menuItem = [
  "group/item relative flex h-8 cursor-default select-none items-center gap-2 rounded-sm px-2 text-body-sm text-fg outline-none",
  "data-highlighted:bg-bg-muted data-disabled:pointer-events-none data-disabled:text-fg-disabled",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg]:text-fg-subtle data-highlighted:[&_svg]:text-fg",
];

export const menuLabel = "px-2 pb-1 pt-2 text-caption font-medium text-fg-subtle";

export const menuSeparator = "-mx-1 my-1 h-px bg-border";
