import { X } from "@phosphor-icons/react";
import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn";
import { dialogDescription, dialogPanel, dialogScrim, dialogTitle, dialogWidths } from "../lib/dialog-styles";
import { Button } from "./button";
import { useLabels } from "./labels";
import { useScopeAttributes } from "./scope";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogOverlay({ className, ...props }: ComponentProps<typeof DialogPrimitive.Overlay>) {
  const scope = useScopeAttributes();
  return (
    <DialogPrimitive.Overlay
      {...scope}
      className={cn(dialogScrim, className)}
      {...props}
    />
  );
}


export function DialogContent({
  className,
  children,
  size = "md",
  hideClose,
  closeLabel,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & {
  size?: keyof typeof dialogWidths;
  /** Hide the close button. Escape still closes. */
  hideClose?: boolean;
  /** The close button's name for screen readers. Defaults to the provider's label. */
  closeLabel?: string;
}) {
  const scope = useScopeAttributes();
  const labels = useLabels();
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        {...scope}
        className={cn(
          dialogPanel,
          dialogWidths[size],
          className,
        )}
        {...props}
      >
        {children}
        {!hideClose && (
          <DialogPrimitive.Close asChild>
            <Button variant="ghost" size="icon-sm" className="absolute end-3 top-3 text-fg-muted" aria-label={closeLabel ?? labels.close}>
              <X />
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 pe-8", className)} {...props} />;
}

/** A band along the bottom, a shade off the dialog, so the actions read as a separate step. */
export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "-mx-6 -mb-6 mt-1 flex flex-col-reverse gap-2 border-t border-border bg-bg-subtle px-6 py-3.5",
        "sm:flex-row sm:items-center sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn(dialogTitle, className)} {...props} />;
}

export function DialogDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn(dialogDescription, className)} {...props} />;
}

// ---------------------------------------------------------------- Drawer

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;

const drawerSides = {
  right:
    "inset-y-2 end-2 w-[min(calc(100vw-16px),var(--wx-drawer-size,420px))] data-[state=open]:animate-wx-drawer-in-right data-[state=closed]:animate-wx-drawer-out-right rtl:data-[state=open]:animate-wx-drawer-in-left rtl:data-[state=closed]:animate-wx-drawer-out-left",
  left: "inset-y-2 start-2 w-[min(calc(100vw-16px),var(--wx-drawer-size,420px))] data-[state=open]:animate-wx-drawer-in-left data-[state=closed]:animate-wx-drawer-out-left rtl:data-[state=open]:animate-wx-drawer-in-right rtl:data-[state=closed]:animate-wx-drawer-out-right",
  bottom:
    "inset-x-2 bottom-2 max-h-[85dvh] data-[state=open]:animate-wx-drawer-in-bottom data-[state=closed]:animate-wx-drawer-out-bottom",
} as const;

/** A panel that floats 8px off the edge of the screen. */
export function DrawerContent({
  className,
  children,
  side = "right",
  hideClose,
  closeLabel,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & {
  side?: keyof typeof drawerSides;
  hideClose?: boolean;
  closeLabel?: string;
}) {
  const scope = useScopeAttributes();
  const labels = useLabels();
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        {...scope}
        className={cn(
          "fixed z-(--wx-z-modal) flex flex-col overflow-hidden",
          "wx-plane-overlay rounded-xl border border-border bg-surface-overlay text-fg shadow-xl outline-none",
          drawerSides[side],
          className,
        )}
        {...props}
      >
        {children}
        {!hideClose && (
          <DialogPrimitive.Close asChild>
            <Button variant="ghost" size="icon-sm" className="absolute end-3 top-3 text-fg-muted" aria-label={closeLabel ?? labels.close}>
              <X />
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DrawerHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 border-b border-border p-5 pe-12", className)} {...props} />;
}

export function DrawerBody({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("min-h-0 flex-1 overflow-y-auto p-5", className)} {...props} />;
}

export function DrawerFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center justify-end gap-2 border-t border-border bg-bg-subtle px-5 py-3", className)}
      {...props}
    />
  );
}

export const DrawerTitle = DialogTitle;
export const DrawerDescription = DialogDescription;
