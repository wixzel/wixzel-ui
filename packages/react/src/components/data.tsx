import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react";
import { type ComponentProps, type ReactNode, useId } from "react";
import { cn } from "../lib/cn";

type Tone = "accent" | "success" | "warning" | "danger" | "info" | "neutral";

const inks: Record<Tone, string> = {
  accent: "text-accent-ink",
  success: "text-success-ink",
  warning: "text-warning-ink",
  danger: "text-danger-ink",
  info: "text-info-ink",
  neutral: "text-fg-muted",
};

const fills: Record<Tone, string> = {
  accent: "bg-accent-edge",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  neutral: "bg-fg-subtle",
};

/**
 * A trend line drawn to scale, with a soft area under it and the latest point
 * marked. Takes the accent unless given a tone.
 */
export function Sparkline({
  data,
  tone = "accent",
  className,
  ...props
}: Omit<ComponentProps<"svg">, "children"> & { data: number[]; tone?: Tone }) {
  const id = useId();
  const w = 100;
  const h = 28;
  const max = Math.max(...data, 0);
  const min = Math.min(...data, 0);
  const span = max - min || 1;
  const step = data.length > 1 ? w / (data.length - 1) : w;
  const pts = data.map((v, i) => [i * step, h - 2 - ((v - min) / span) * (h - 4)] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  const last = pts.at(-1);
  const color = {
    accent: "var(--wx-color-accent-edge)",
    success: "var(--wx-color-success)",
    warning: "var(--wx-color-warning)",
    danger: "var(--wx-color-danger)",
    info: "var(--wx-color-info)",
    neutral: "var(--wx-color-fg-subtle)",
  }[tone];
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden
      className={cn("h-7 w-full overflow-visible", className)}
      style={{ color }}
      {...props}
    >
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity={0.22} />
          <stop offset="1" stopColor="currentColor" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={`${line} L${w} ${h} L0 ${h} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke="currentColor" strokeWidth={1.5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      {/* The latest point. The SVG stretches to its box, so a <circle> would turn oval; a
          zero-length stroke with round caps is drawn in screen pixels and stays round. */}
      {last && (
        <path
          d={`M${last[0].toFixed(2)} ${last[1].toFixed(2)} h0`}
          stroke="currentColor"
          strokeWidth={5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}

/** A delta chip: up or down, green when the move is good and red when it isn't. */
export function Delta({
  value,
  goodWhen = "up",
  className,
}: {
  /** Percent change, e.g. 12 or -4. */
  value: number;
  /** Spend going up is bad; calls going up is good. */
  goodWhen?: "up" | "down";
  className?: string;
}) {
  const up = value >= 0;
  const good = up === (goodWhen === "up");
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center gap-0.5 rounded-xs px-1 text-caption font-medium tabular-nums",
        good ? "bg-success-subtle text-success-ink" : "bg-danger-subtle text-danger-ink",
        className,
      )}
    >
      <Icon aria-hidden className="size-3" />
      {Math.abs(value)}%<span className="sr-only">{up ? " up" : " down"}</span>
    </span>
  );
}

/** A number that matters: label, value, change, and the trend under it. */
export function StatCard({
  label,
  icon,
  value,
  delta,
  goodWhen,
  trend,
  tone,
  footer,
  className,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  label: ReactNode;
  icon?: ReactNode;
  value: ReactNode;
  delta?: number;
  goodWhen?: "up" | "down";
  trend?: number[];
  tone?: Tone;
  footer?: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2 rounded-lg bg-card p-4 pb-3.5", className)} {...props}>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-caption font-medium text-fg-subtle [&_svg]:size-3.5">
          {icon}
          {label}
        </span>
        {delta !== undefined && <Delta value={delta} goodWhen={goodWhen} />}
      </div>
      <div className="text-heading-lg tabular-nums">{value}</div>
      {trend && <Sparkline data={trend} tone={tone} />}
      {footer && <div className="text-caption text-fg-muted">{footer}</div>}
    </div>
  );
}

/** A single measure toward a whole. The fill slides to its value. */
export function Progress({
  value,
  max = 100,
  tone = "accent",
  label,
  showValue,
  size = "md",
  className,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  value: number;
  max?: number;
  tone?: Tone;
  label?: ReactNode;
  showValue?: boolean;
  size?: "sm" | "md";
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      {(label || showValue) && (
        <div className="flex items-baseline justify-between gap-2 text-caption">
          <span className="font-medium text-fg-muted">{label}</span>
          {showValue && <span className="tabular-nums text-fg-subtle">{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className={cn("overflow-hidden rounded-full bg-bg-muted shadow-[inset_0_1px_0_rgb(24_22_10/0.06)]", size === "md" ? "h-1.5" : "h-1")}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-(--wx-duration-move) ease-move", fills[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** Parts of a whole side by side (completed vs failed), with a legend. Segments keep a 2px gap. */
export function SplitBar({
  segments,
  className,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  segments: { label: ReactNode; value: number; tone: Tone }[];
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
        {segments.map((s, i) => (
          <div
            key={i}
            className={cn("h-full transition-[flex-grow] duration-(--wx-duration-move) ease-move", fills[s.tone])}
            style={{ flexGrow: s.value / total }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-caption text-fg-muted">
        {segments.map((s, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className={cn("size-1.5 rounded-full", fills[s.tone])} />
            {s.label}
            <span className="font-medium tabular-nums text-fg">{s.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** A ranked list: each row has a label, a value and a thin bar scaled to the largest. */
export function BarList({
  items,
  className,
  ...props
}: Omit<ComponentProps<"ul">, "children"> & {
  items: { label: ReactNode; icon?: ReactNode; value: number; display?: ReactNode; aside?: ReactNode; tone?: Tone }[];
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className={cn("flex flex-col gap-3", className)} {...props}>
      {items.map((item, i) => (
        <li key={i} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-3 text-body-sm">
            <span className="flex min-w-0 items-center gap-2 font-medium [&_svg]:size-4 [&_svg]:shrink-0">
              {item.icon}
              <span className="truncate">{item.label}</span>
            </span>
            <span className="flex shrink-0 items-baseline gap-2 tabular-nums">
              {item.display ?? item.value}
              {item.aside && <span className="text-caption text-fg-subtle">{item.aside}</span>}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-bg-muted">
            <div
              className={cn("h-full rounded-full transition-[width] duration-(--wx-duration-move) ease-move", fills[item.tone ?? "accent"])}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Label and value pairs, aligned in two columns. */
export function DescriptionList({
  items,
  className,
  ...props
}: Omit<ComponentProps<"dl">, "children"> & {
  items: { term: ReactNode; value: ReactNode; icon?: ReactNode }[];
}) {
  return (
    <dl className={cn("grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 text-body-sm", className)} {...props}>
      {items.map((item, i) => (
        <div key={i} className="col-span-2 grid grid-cols-subgrid items-center border-t border-border py-2 first:border-t-0 first:pt-0 last:pb-0">
          <dt className="flex items-center gap-2 text-fg-muted [&_svg]:size-4 [&_svg]:text-fg-subtle">
            {item.icon}
            {item.term}
          </dt>
          <dd className="min-w-0 truncate text-end font-medium tabular-nums">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Events in order, joined by a hairline. The latest can be marked live. */
export function Timeline({
  items,
  className,
  ...props
}: Omit<ComponentProps<"ol">, "children"> & {
  items: { title: ReactNode; time?: ReactNode; description?: ReactNode; icon?: ReactNode; tone?: Tone }[];
}) {
  return (
    <ol className={cn("flex flex-col", className)} {...props}>
      {items.map((item, i) => (
        <li key={i} className="relative grid grid-cols-[20px_minmax(0,1fr)] gap-x-3 pb-4 last:pb-0">
          {i < items.length - 1 && <span aria-hidden className="absolute start-[9.5px] top-6 bottom-1 w-px bg-border" />}
          <span
            className={cn(
              "relative mt-px grid size-5 place-items-center rounded-sm bg-bg-muted [&_svg]:size-3",
              inks[item.tone ?? "neutral"],
            )}
          >
            {item.icon ?? <span className={cn("size-1.5 rounded-full", fills[item.tone ?? "neutral"])} />}
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex items-baseline justify-between gap-3 text-body-sm">
              <span className="font-medium">{item.title}</span>
              {item.time && <span className="shrink-0 text-caption tabular-nums text-fg-subtle">{item.time}</span>}
            </div>
            {item.description && <div className="text-caption text-fg-muted">{item.description}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
