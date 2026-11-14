import { type ComponentProps, type ReactNode, useState } from "react";
import { cn } from "../lib/cn";
import { useLabels } from "./labels";

export interface ColumnSeries {
  key: string;
  label: ReactNode;
  /** primary: the accent. secondary: a quieter step of the same hue, for a second measure (visitors beside views). */
  tone?: "primary" | "secondary";
  /** How a value of this series reads in the tooltip, the axis and the table. */
  format?: (value: number) => string;
}

export interface ColumnPoint {
  key: string;
  /** Full label, in the tooltip and the table: "Tue, 4 Nov". */
  label: string;
  /** Terse label for the axis tick; falls back to `label`. */
  axisLabel?: string;
  values: Record<string, number>;
}

const tones = {
  primary: "bg-accent-edge",
  secondary: "bg-[color-mix(in_oklab,var(--wx-color-accent-edge)_38%,var(--wx-color-bg-muted))]",
};

/**
 * Columns over a run of days or months. One group per point; two series sit
 * side by side in two steps of the accent, split by a 2px gap rather than a
 * stroke. Hairline gridlines, the scale in its own gutter, roughly six ticks
 * along the bottom. Hovering a column shows its numbers; the same numbers are
 * one click away as a table, for screen readers and for copying.
 */
export function ColumnChart({
  points,
  series,
  height = 168,
  empty,
  className,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  points: ColumnPoint[];
  series: ColumnSeries[];
  /** Plot height in pixels. */
  height?: number;
  /** Shown instead of the chart when every value is zero. */
  empty?: ReactNode;
}) {
  const labels = useLabels();
  const [hover, setHover] = useState<number | null>(null);
  const fmt = (s: ColumnSeries, v: number) => (s.format ? s.format(v) : v.toLocaleString());
  const max = Math.max(1, ...points.flatMap((p) => series.map((s) => p.values[s.key] || 0)));
  const total = points.reduce((n, p) => n + series.reduce((m, s) => m + (p.values[s.key] || 0), 0), 0);
  const tickEvery = Math.max(1, Math.ceil(points.length / 6));
  const primary = series[0];

  if (!total || !primary) {
    return (
      <div className={cn("grid place-items-center py-12 text-center text-body-sm text-fg-muted", className)} {...props}>
        {empty ?? labels.noData}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      {series.length > 1 && (
        <div className="flex flex-wrap items-center gap-4">
          {series.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5 text-caption text-fg-muted">
              <span aria-hidden className={cn("size-2.5 rounded-[3px]", tones[s.tone ?? "primary"])} />
              {s.label}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-start gap-1" aria-hidden>
        <div className="relative min-w-0 flex-1">
          <div className="pointer-events-none absolute inset-x-0 top-0" style={{ height }}>
            {[0, 0.5, 1].map((f) => (
              <div key={f} className="absolute inset-x-0 border-t border-border" style={{ top: f * height }} />
            ))}
          </div>

          <div className="flex items-end gap-0.5" style={{ height }}>
            {points.map((p, i) => (
              <div
                key={p.key}
                className="relative flex h-full flex-1 items-end justify-center gap-0.5"
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
              >
                {series.map((s) => {
                  const v = p.values[s.key] || 0;
                  return (
                    <div
                      key={s.key}
                      className={cn(
                        "w-full max-w-[11px] rounded-t-[3px] transition-opacity duration-(--wx-duration-fast) ease-standard",
                        tones[s.tone ?? "primary"],
                        hover !== null && hover !== i && "opacity-55",
                      )}
                      style={{ height: v ? Math.max(3, (v / max) * height) : 0 }}
                    />
                  );
                })}
                {hover === i && (
                  <div
                    className={cn(
                      "wx-plane-overlay pointer-events-none absolute bottom-[calc(100%+6px)] z-10 w-max animate-wx-fade-in rounded-md bg-surface-overlay px-2.5 py-1.5 text-caption",
                      "shadow-[0_0_0_1px_var(--wx-color-border),0_8px_20px_-8px_rgb(24_22_10/0.25)]",
                      i > points.length - 3 ? "end-0" : i < 2 ? "start-0" : "left-1/2 -translate-x-1/2",
                    )}
                  >
                    <p className="font-semibold text-fg">{p.label}</p>
                    {series.map((s) => (
                      <p key={s.key} className="tabular-nums text-fg-muted">
                        {s.label}: {fmt(s, p.values[s.key] || 0)}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Ticks sit over the plot rather than in boxed columns, so a label is never clipped by its bar. */}
          <div className="relative mt-1.5 h-4">
            {points.map((p, i) => {
              if (i % tickEvery !== 0) return null;
              const first = i === 0;
              const last = i + tickEvery >= points.length;
              return (
                <span
                  key={p.key}
                  className={cn(
                    "absolute whitespace-nowrap text-[10px] tabular-nums text-fg-subtle",
                    first ? "translate-x-0" : last ? "-translate-x-full" : "-translate-x-1/2",
                  )}
                  style={{ left: `${((i + 0.5) / points.length) * 100}%` }}
                >
                  {p.axisLabel ?? p.label}
                </span>
              );
            })}
          </div>
        </div>
        <div className="relative w-11 shrink-0" style={{ height }}>
          {[0, 0.5, 1].map((f) => (
            <span key={f} className="absolute end-0 -translate-y-1/2 text-[10px] tabular-nums text-fg-subtle" style={{ top: f * height }}>
              {fmt(primary, Math.round(max * (1 - f)))}
            </span>
          ))}
        </div>
      </div>

      <details className="group/table">
        <summary className="w-fit cursor-pointer rounded-xs text-caption text-fg-muted transition-colors hover:text-fg wx-focus">
          {labels.showAsTable}
        </summary>
        <div className="mt-2 max-h-64 overflow-auto rounded-md bg-surface">
          <table className="w-full text-start text-caption">
            <thead className="sticky top-0 bg-surface text-fg-subtle">
              <tr>
                <th className="px-3 py-1.5 text-start font-medium">{labels.date}</th>
                {series.map((s) => (
                  <th key={s.key} className="px-3 py-1.5 text-end font-medium">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.key} className="border-t border-border">
                  <td className="px-3 py-1.5">{p.label}</td>
                  {series.map((s) => (
                    <td key={s.key} className="px-3 py-1.5 text-end tabular-nums">
                      {fmt(s, p.values[s.key] || 0)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
