/** Shared by Dialog and ConfirmDialog, so a confirmation is the same object as any other dialog. */

export const dialogScrim = [
  "fixed inset-0 z-(--wx-z-overlay) bg-overlay",
  "data-[state=open]:animate-wx-fade-in data-[state=closed]:animate-wx-fade-out",
];

// Sharpens out of a blur over a plain scrim.
export const dialogPanel = [
  "fixed start-1/2 top-1/2 z-(--wx-z-modal) w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2",
  "flex max-h-[calc(100dvh-32px)] flex-col gap-5 overflow-y-auto",
  "wx-plane-overlay rounded-xl border border-border bg-surface-overlay p-6 text-fg shadow-xl outline-none",
  "data-[state=open]:animate-wx-rise-in data-[state=closed]:animate-wx-rise-out",
];

export const dialogWidths = { sm: "max-w-[400px]", md: "max-w-[520px]", lg: "max-w-[680px]", xl: "max-w-[880px]" } as const;

export const dialogTitle = "text-heading-md text-balance";

export const dialogDescription = "text-body-md text-fg-muted";
