import { Avatar as AvatarPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn";

const sizes = {
  xs: "size-5 text-[0.5625rem]",
  sm: "size-6 text-[0.625rem]",
  md: "size-8 text-caption",
  lg: "size-10 text-body-sm",
  xl: "size-14 text-heading-sm",
} as const;

const squareCorners = { xs: "rounded-xs", sm: "rounded-xs", md: "rounded-sm", lg: "rounded-md", xl: "rounded-lg" } as const;

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export interface AvatarProps extends ComponentProps<typeof AvatarPrimitive.Root> {
  /** Used for the alt text and the initials fallback. */
  name: string;
  src?: string;
  size?: keyof typeof sizes;
  /** Round for people; square for workspaces, teams and agents. */
  shape?: "round" | "square";
  /** Presence, as a dot on the lower edge ringed in the page colour. */
  status?: "online" | "busy" | "away" | "offline";
}

const statusColors = {
  online: "bg-success",
  busy: "bg-danger",
  away: "bg-warning",
  offline: "bg-fg-disabled",
} as const;

export function Avatar({ name, src, size = "md", shape = "round", status, className, ...props }: AvatarProps) {
  const avatar = (
    <AvatarPrimitive.Root
      className={cn(
        "relative inline-flex shrink-0 select-none overflow-hidden bg-bg-muted align-middle",
        sizes[size],
        shape === "round" ? "rounded-full" : squareCorners[size],
        className,
      )}
      {...props}
    >
      {src && <AvatarPrimitive.Image src={src} alt={name} className="size-full object-cover" />}
      <AvatarPrimitive.Fallback
        delayMs={src ? 400 : 0}
        className="grid size-full place-items-center bg-[linear-gradient(to_bottom,var(--wx-color-bg-muted),color-mix(in_oklab,var(--wx-color-bg-muted),var(--wx-color-fg)_6%))] font-semibold tracking-wide text-fg-muted"
      >
        <span aria-hidden>{initials(name)}</span>
        <span className="sr-only">{name}</span>
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
  if (!status) return avatar;
  // The wrapper takes the avatar's shape, so a ring drawn on it (AvatarGroup) follows the curve.
  return (
    <span className={cn("relative inline-flex shrink-0", shape === "round" ? "rounded-full" : squareCorners[size])}>
      {avatar}
      <span
        role="img"
        aria-label={status}
        className={cn(
          "absolute -bottom-px -end-px size-[30%] min-h-2 min-w-2 rounded-full ring-2 ring-bg",
          statusColors[status],
        )}
      />
    </span>
  );
}

/** Overlapping avatars with a "+3" for the rest. They fan out a little on hover. */
export function AvatarGroup({
  children,
  max,
  size = "md",
  className,
  ...props
}: ComponentProps<"div"> & { max?: number; size?: keyof typeof sizes }) {
  const items = Array.isArray(children) ? children : [children];
  const shown = max ? items.slice(0, max) : items;
  const rest = items.length - shown.length;
  return (
    <div
      className={cn(
        "group/avatars flex items-center *:ring-2 *:ring-bg [&>*:not(:first-child)]:-ms-1.5",
        "[&>*]:transition-[margin] [&>*]:duration-(--wx-duration-move) [&>*]:ease-move hover:[&>*:not(:first-child)]:-ms-0.5",
        className,
      )}
      {...props}
    >
      {shown}
      {rest > 0 && (
        <span
          className={cn(
            "relative inline-grid shrink-0 place-items-center bg-bg-muted font-medium tabular-nums text-fg-muted rounded-full",
            sizes[size],
          )}
        >
          +{rest}
        </span>
      )}
    </div>
  );
}
