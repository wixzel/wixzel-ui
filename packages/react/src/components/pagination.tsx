import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { useLabels } from "./labels";

/** The pages to show: the first, the last, and the current one with a neighbour each side; gaps as null. */
function pageList(page: number, count: number): (number | null)[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const pages = new Set([1, count, page - 1, page, page + 1].filter((p) => p >= 1 && p <= count));
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | null)[] = [];
  for (const p of sorted) {
    const prev = out.at(-1);
    if (typeof prev === "number" && p - prev === 2) out.push(prev + 1);
    else if (typeof prev === "number" && p - prev > 2) out.push(null);
    out.push(p);
  }
  return out;
}

/**
 * Moves through a long list a page at a time. Previous and Next on the ends,
 * the page numbers between with the current one inked; on a phone the numbers
 * give way to "Page 2 of 9". Renders nothing when there is only one page.
 */
export function Pagination({
  page,
  pageCount,
  onPageChange,
  className,
  ...props
}: Omit<ComponentProps<"nav">, "onChange"> & {
  /** The current page, from 1. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  const labels = useLabels();
  if (pageCount <= 1) return null;
  const go = (p: number) => onPageChange(Math.min(pageCount, Math.max(1, p)));
  return (
    <nav aria-label={labels.pagination} className={cn("flex items-center justify-center gap-1", className)} {...props}>
      <Button size="sm" variant="ghost" iconStart={<CaretLeft className="rtl:rotate-180" />} disabled={page <= 1} onClick={() => go(page - 1)}>
        {labels.previousPage}
      </Button>
      <ol className="flex items-center gap-1 max-sm:hidden">
        {pageList(page, pageCount).map((p, i) =>
          p === null ? (
            <li key={`gap-${i}`} aria-hidden className="w-6 text-center text-body-sm text-fg-subtle">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                aria-current={p === page ? "page" : undefined}
                onClick={() => go(p)}
                className={cn(
                  "h-control-sm min-w-control-sm rounded-md px-2 text-body-sm font-medium tabular-nums text-fg-muted wx-focus",
                  "transition-[background-color,color,scale] duration-(--wx-duration-fast) ease-standard",
                  "hover:bg-bg-muted hover:text-fg active:scale-[0.96]",
                  // The current page is inked, like the current tab.
                  "aria-[current=page]:bg-fg aria-[current=page]:text-bg",
                )}
              >
                {p}
              </button>
            </li>
          ),
        )}
      </ol>
      <span className="px-2 text-body-sm tabular-nums text-fg-muted sm:hidden">
        {labels.pageOf.replace("{page}", String(page)).replace("{count}", String(pageCount))}
      </span>
      <Button size="sm" variant="ghost" iconEnd={<CaretRight className="rtl:rotate-180" />} disabled={page >= pageCount} onClick={() => go(page + 1)}>
        {labels.nextPage}
      </Button>
    </nav>
  );
}
