import { CheckCircle, Info, Warning, WarningCircle } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";

type Tone = "neutral" | "info" | "success" | "warning" | "danger";

const tones: Record<Tone, { box: string; icon: ReactNode }> = {
  neutral: { box: "bg-bg-subtle border-border [&_[data-icon]]:text-fg-muted", icon: <Info /> },
  info: {
    box: "bg-info-subtle border-[color-mix(in_oklab,var(--wx-color-info-ink),transparent_78%)] [&_[data-icon]]:text-info-ink",
    icon: <Info />,
  },
  success: {
    box: "bg-success-subtle border-[color-mix(in_oklab,var(--wx-color-success-ink),transparent_78%)] [&_[data-icon]]:text-success-ink",
    icon: <CheckCircle />,
  },
  warning: {
    box: "bg-warning-subtle border-[color-mix(in_oklab,var(--wx-color-warning-ink),transparent_75%)] [&_[data-icon]]:text-warning-ink",
    icon: <Warning />,
  },
  danger: {
    box: "bg-danger-subtle border-[color-mix(in_oklab,var(--wx-color-danger-ink),transparent_78%)] [&_[data-icon]]:text-danger-ink",
    icon: <WarningCircle />,
  },
};

export interface AlertProps extends Omit<ComponentProps<"div">, "title"> {
  tone?: Tone;
  title?: ReactNode;
  /** Replace the tone's icon, or pass false for none. */
  icon?: ReactNode | false;
  /** A button or link on the end, such as "Retry". */
  action?: ReactNode;
}

/** A tinted panel in its tone. Danger and warning are announced to screen readers. */
export function Alert({ tone = "neutral", title, icon, action, className, children, ...props }: AlertProps) {
  const t = tones[tone];
  return (
    <div
      role={tone === "danger" || tone === "warning" ? "alert" : "status"}
      className={cn(
        "flex animate-wx-fade-in items-start gap-3 rounded-md border px-3.5 py-3 text-body-sm text-fg",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.5)] dark:shadow-none",
        "[&_[data-icon]>svg]:size-4",
        t.box,
        className,
      )}
      {...props}
    >
      {icon !== false && (
        <span data-icon className="mt-0.5 flex shrink-0">
          {icon ?? t.icon}
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={cn(title && "text-fg-muted")}>{children}</div>}
      </div>
      {action && <div className="-my-1 flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}
