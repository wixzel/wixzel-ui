import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

/** Scrolls sideways inside its own frame, never the page. Numbers are tabular. */
export function Table({ className, frameClassName, ...props }: ComponentProps<"table"> & { frameClassName?: string }) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-lg bg-card", frameClassName)}>
      <table className={cn("w-full caption-bottom border-collapse text-body-sm tabular-nums", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return <thead className={cn("[&>tr]:border-b [&>tr]:border-border", className)} {...props} />;
}

export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return <tbody className={cn("[&>tr]:border-t [&>tr]:border-border", className)} {...props} />;
}

export function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return <tfoot className={cn("border-t border-border font-medium", className)} {...props} />;
}

export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "transition-colors duration-(--wx-duration-fast) [tbody>&]:hover:bg-[color-mix(in_oklab,var(--wx-color-card),var(--wx-color-fg)_3%)]",
        // Selected rows take the accent wash and an accent edge on their leading cell.
        "data-[state=selected]:bg-accent-subtle [tbody>&]:data-[state=selected]:hover:bg-accent-subtle",
        "data-[state=selected]:[&>td:first-child]:shadow-[inset_2px_0_0_var(--wx-color-accent-edge)]",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({
  className,
  align = "start",
  ...props
}: Omit<ComponentProps<"th">, "align"> & { align?: "start" | "end" | "center" }) {
  return (
    <th
      className={cn(
        "h-9 whitespace-nowrap px-3 text-caption font-medium text-fg-subtle first:ps-4 last:pe-4",
        align === "start" && "text-start",
        align === "end" && "text-end",
        align === "center" && "text-center",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  align = "start",
  ...props
}: Omit<ComponentProps<"td">, "align"> & { align?: "start" | "end" | "center" }) {
  return (
    <td
      className={cn(
        "h-11 px-3 align-middle text-fg first:ps-4 last:pe-4",
        align === "start" && "text-start",
        align === "end" && "text-end",
        align === "center" && "text-center",
        className,
      )}
      {...props}
    />
  );
}

export function TableCaption({ className, ...props }: ComponentProps<"caption">) {
  return <caption className={cn("border-t border-border px-4 py-3 text-start text-caption text-fg-muted", className)} {...props} />;
}
