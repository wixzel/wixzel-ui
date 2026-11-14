import { CheckCircle, Info, Warning, WarningCircle } from "@phosphor-icons/react";
import type { ComponentProps } from "react";
import { Toaster as Sonner, toast } from "sonner";
import { cn } from "../lib/cn";
import { buttonVariants } from "../recipes/button";
import { Spinner } from "./spinner";

export { toast };

/** Mount once near the root. Then call toast("Saved"), toast.success(…), toast.promise(…). */
export function Toaster({ toastOptions, ...props }: ComponentProps<typeof Sonner>) {
  return (
    <Sonner
      position="bottom-right"
      gap={8}
      icons={{
        success: <CheckCircle className="size-4 text-success-ink" />,
        error: <WarningCircle className="size-4 text-danger-ink" />,
        warning: <Warning className="size-4 text-warning-ink" />,
        info: <Info className="size-4 text-info-ink" />,
        loading: <Spinner size="md" className="text-fg-muted" />,
      }}
      toastOptions={{
        unstyled: true,
        ...toastOptions,
        classNames: {
          toast: cn(
            "wx-plane-overlay flex w-(--width) items-start gap-3 rounded-lg border border-border bg-surface-overlay px-3.5 py-3 text-body-sm text-fg shadow-lg",
          ),
          icon: "mt-0.5 flex size-4 shrink-0 items-center justify-center",
          content: "flex min-w-0 flex-1 flex-col gap-0.5",
          title: "font-medium",
          description: "text-fg-muted",
          actionButton: cn(buttonVariants({ variant: "primary", size: "sm" }), "-my-1 ms-auto"),
          cancelButton: cn(buttonVariants({ variant: "ghost", size: "sm" }), "-my-1"),
          closeButton: "border border-border bg-surface-overlay text-fg-muted hover:text-fg",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
}
