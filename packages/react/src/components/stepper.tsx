import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";
import { useLabels } from "./labels";
import { Spinner } from "./spinner";

export type StepState = "done" | "current" | "upcoming" | "error" | "loading";

export interface Step {
  title: ReactNode;
  description?: ReactNode;
  /** Overrides the state worked out from `current`: a step that failed, or one still running. */
  state?: StepState;
  /** Vertical only: shown under the step, such as the action that completes it. */
  content?: ReactNode;
}

/**
 * Steps of a wizard, a build or a setup checklist. Each step has a square
 * marker: a number on a tint while upcoming, inked while current, the accent
 * wash with a check that draws itself in once done, red when it needs
 * attention and a spinner while it runs. A thin track joins the markers and
 * fills with the accent as steps finish.
 *
 * Horizontal for a wizard header; vertical for a checklist, where each step
 * can carry a description and its own content. With onStepClick, steps that
 * have been reached become buttons, so people can go back.
 */
export function Stepper({
  steps,
  current = 0,
  orientation = "horizontal",
  onStepClick,
  label,
  className,
  ...props
}: Omit<ComponentProps<"ol">, "children"> & {
  steps: Step[];
  /** The index of the current step. Steps before it are done. */
  current?: number;
  orientation?: "horizontal" | "vertical";
  onStepClick?: (index: number) => void;
  /** The landmark's name. Defaults to the provider's label. */
  label?: string;
}) {
  const labels = useLabels();
  const vertical = orientation === "vertical";
  const states = steps.map((step, i) => step.state ?? (i < current ? "done" : i === current ? "current" : "upcoming"));

  return (
    <ol
      aria-label={label ?? labels.steps}
      data-orientation={orientation}
      className={cn(vertical ? "flex flex-col" : "flex items-center gap-3", className)}
      {...props}
    >
      {steps.map((step, i) => {
        const state = states[i]!;
        const last = i === steps.length - 1;
        const reachable = onStepClick && state !== "upcoming" && i !== current;
        const heading = (
          <>
            <Marker state={state} index={i} />
            <span
              className={cn(
                "flex min-w-0 flex-col",
                vertical ? "gap-0.5 pt-0.5" : state !== "current" && "max-sm:sr-only",
              )}
            >
              <span
                className={cn(
                  "text-body-sm transition-colors duration-(--wx-duration-fast)",
                  state === "current" || state === "loading" ? "font-medium text-fg" : "text-fg-muted",
                  state === "error" && "text-danger-ink",
                  !vertical && "truncate",
                  reachable && "group-hover/step:text-fg",
                )}
              >
                {step.title}
              </span>
              {vertical && step.description && <span className="text-caption text-fg-muted">{step.description}</span>}
              {state === "done" && <span className="sr-only">{labels.stepDone}</span>}
              {state === "error" && <span className="sr-only">{labels.stepError}</span>}
            </span>
          </>
        );
        // The current step's title never truncates; the others give way first.
        const headingClass = cn(
          "group/step flex min-w-0 text-start",
          vertical ? "items-start gap-3" : "items-center gap-2.5",
          !vertical && state === "current" && "shrink-0",
        );

        return (
          <li
            key={i}
            aria-current={i === current ? "step" : undefined}
            className={cn(
              vertical ? "grid grid-cols-[24px_minmax(0,1fr)] gap-x-3" : "flex items-center gap-3",
              !vertical && state !== "current" && "min-w-0",
              !vertical && !last && "flex-1",
            )}
          >
            {vertical ? (
              <>
                <div className="col-start-1 row-span-2 row-start-1 flex flex-col items-center">
                  <span className="h-6" />
                  {!last && <Track done={state === "done"} vertical />}
                </div>
                <div className="col-start-1 col-end-3 row-start-1">
                  {reachable ? (
                    <button type="button" onClick={() => onStepClick(i)} className={cn(headingClass, "rounded-sm wx-focus")}>
                      {heading}
                    </button>
                  ) : (
                    <div className={headingClass}>{heading}</div>
                  )}
                </div>
                <div className={cn("col-start-2 row-start-2 min-w-0", last ? "pt-2" : "pb-5 pt-2", !step.content && "pt-0")}>
                  {step.content}
                </div>
              </>
            ) : (
              <>
                {reachable ? (
                  <button type="button" onClick={() => onStepClick(i)} className={cn(headingClass, "rounded-sm wx-focus")}>
                    {heading}
                  </button>
                ) : (
                  <div className={headingClass}>{heading}</div>
                )}
                {!last && <Track done={state === "done"} />}
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}

const markers: Record<StepState, string> = {
  upcoming: "bg-bg-muted text-fg-subtle",
  current: "bg-fg text-bg",
  loading: "bg-fg text-bg",
  done: "bg-accent-subtle text-accent-ink",
  error: "bg-danger-subtle text-danger-ink",
};

function Marker({ state, index }: { state: StepState; index: number }) {
  return (
    <span
      aria-hidden
      data-state={state}
      className={cn(
        "group/marker grid size-6 shrink-0 place-items-center rounded-sm text-caption font-semibold tabular-nums *:col-start-1 *:row-start-1",
        "transition-[background-color,color,scale] duration-(--wx-duration-fast) ease-standard",
        "group-active/step:scale-[0.96] group-active/step:duration-(--wx-duration-instant)",
        markers[state],
      )}
    >
      {state === "loading" ? (
        <Spinner size="sm" />
      ) : state === "error" ? (
        <svg viewBox="0 0 12 12" fill="none" className="size-3 animate-wx-pop-in">
          <path d="M6 3v3.5" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
          <circle cx="6" cy="9" r="1" fill="currentColor" />
        </svg>
      ) : (
        <>
          <span className={cn("transition-opacity duration-(--wx-duration-fast)", state === "done" && "opacity-0")}>
            {index + 1}
          </span>
          {/* The check draws itself in along its path, like Checkbox. */}
          <svg viewBox="0 0 12 12" fill="none" className="size-3">
            <path
              d="M2.5 6.3 4.8 8.6 9.5 3.6"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] duration-(--wx-duration-base) ease-out group-data-[state=done]/marker:delay-50 group-data-[state=done]/marker:[stroke-dashoffset:0]"
            />
          </svg>
        </>
      )}
    </span>
  );
}

/** The thin track between markers. Its accent fill slides in when the step before it is done. */
function Track({ done, vertical }: { done: boolean; vertical?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn("relative overflow-hidden rounded-full bg-bg-muted", vertical ? "my-1 w-0.5 flex-1" : "h-0.5 min-w-4 flex-1")}
    >
      <span
        className={cn(
          "absolute inset-0 rounded-full bg-accent-edge transition-[scale] duration-(--wx-duration-move) ease-move",
          vertical ? "origin-top" : "origin-left rtl:origin-right",
          done ? "scale-100" : vertical ? "scale-y-0" : "scale-x-0",
        )}
      />
    </span>
  );
}
