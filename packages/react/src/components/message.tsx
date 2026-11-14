import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";

/** A conversation between an agent and a person: a call transcript, a chat. */
export function Transcript({ className, ...props }: ComponentProps<"div">) {
  return <div role="log" className={cn("flex flex-col gap-3", className)} {...props} />;
}

/**
 * One turn. The agent speaks from the start side on a neutral bubble; the
 * person answers from the end side on the accent wash. The corner nearest the
 * speaker is tight, so a run of bubbles reads as one voice. A streaming
 * message ends in a blinking block caret.
 */
export function Message({
  from,
  name,
  time,
  streaming,
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  from: "agent" | "person";
  name?: ReactNode;
  time?: ReactNode;
  /** The text is still arriving. */
  streaming?: boolean;
}) {
  const agent = from === "agent";
  return (
    <div
      className={cn("flex max-w-[85%] animate-wx-fade-in flex-col gap-1", agent ? "items-start self-start" : "items-end self-end", className)}
      {...props}
    >
      {(name || time) && (
        <div className="flex items-baseline gap-2 px-1 text-caption text-fg-subtle">
          {name && <span className="font-medium text-fg-muted">{name}</span>}
          {time && <span className="tabular-nums">{time}</span>}
        </div>
      )}
      <div
        className={cn(
          "rounded-lg px-3 py-2 text-body-sm leading-relaxed text-fg",
          agent
            ? "rounded-ss-xs bg-bg-muted shadow-[inset_0_0_0_1px_rgb(24_22_10/0.04)]"
            : "rounded-se-xs bg-accent-subtle shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--wx-color-accent-edge),transparent_75%)]",
        )}
      >
        {children}
        {streaming && (
          <span aria-hidden className="ms-0.5 inline-block h-[1.05em] w-[0.5em] translate-y-[0.15em] animate-wx-caret bg-current opacity-70" />
        )}
      </div>
    </div>
  );
}
