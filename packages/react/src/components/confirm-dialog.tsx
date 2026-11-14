import { Warning } from "@phosphor-icons/react";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import {
  createContext,
  type FormEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn";
import { dialogDescription, dialogPanel, dialogScrim, dialogTitle, dialogWidths } from "../lib/dialog-styles";
import { Button } from "./button";
import { DialogFooter } from "./dialog";
import { Input } from "./input";
import { useLabels } from "./labels";
import { useScopeAttributes } from "./scope";

export interface ConfirmOptions {
  title: ReactNode;
  description?: ReactNode;
  /** The confirm button's words, such as "Delete agent". Defaults to the provider's "Confirm". */
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  /** danger: a red confirm button and a warning tile, for what can't be undone. */
  tone?: "default" | "danger";
  /** An icon on a tile beside the title. Danger dialogs get a warning by default. */
  icon?: ReactNode;
  /** Make people type this (a workspace's name, say) before the confirm button wakes up. */
  confirmText?: string;
}

/**
 * Asks before something happens: a dialog with the question, what it will do,
 * and Cancel beside the action. Focus starts on Cancel, and clicking the scrim
 * doesn't dismiss it. With confirmText, the action stays off until the phrase
 * is typed exactly.
 *
 * onConfirm may return a promise: the button shows its spinner, the dialog
 * stays put until it settles and closes when it resolves. If it rejects, the
 * dialog stays open so the person can try again (show the reason in a toast).
 */
export function ConfirmDialog({
  open: openProp,
  defaultOpen,
  onOpenChange,
  trigger,
  onConfirm,
  children,
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone = "default",
  icon,
  confirmText,
}: ConfirmOptions & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The control that opens it, such as a Button. */
  trigger?: ReactNode;
  onConfirm?: () => unknown;
  /** Anything more between the description and the actions. */
  children?: ReactNode;
}) {
  const labels = useLabels();
  const scope = useScopeAttributes();
  const inputId = useId();
  const [uncontrolled, setUncontrolled] = useState(defaultOpen ?? false);
  const open = openProp ?? uncontrolled;
  const [pending, setPending] = useState(false);
  const [typed, setTyped] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const setOpen = (next: boolean) => {
    if (pending && !next) return;
    if (openProp === undefined) setUncontrolled(next);
    onOpenChange?.(next);
    if (!next) setTyped("");
  };

  const ready = !confirmText || typed.trim() === confirmText;
  const danger = tone === "danger";
  const tile = icon ?? (danger ? <Warning /> : null);

  const confirm = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!ready || pending) return;
    try {
      setPending(true);
      await onConfirm?.();
      if (!alive.current) return;
      setPending(false);
      if (openProp === undefined) setUncontrolled(false);
      onOpenChange?.(false);
      setTyped("");
    } catch {
      if (alive.current) setPending(false);
    }
  };

  // "Type {text} to confirm", with the phrase set as a code chip.
  const [before, after] = labels.typeToConfirm.split("{text}");

  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={setOpen}>
      {trigger && <AlertDialogPrimitive.Trigger asChild>{trigger}</AlertDialogPrimitive.Trigger>}
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay {...scope} className={cn(dialogScrim)} />
        <AlertDialogPrimitive.Content
          {...scope}
          // No description: say so, rather than point at one that isn't there.
          {...(description ? {} : { "aria-describedby": undefined })}
          onEscapeKeyDown={(event) => pending && event.preventDefault()}
          // With a phrase to type, start in its field rather than on Cancel.
          onOpenAutoFocus={(event) => {
            if (!confirmText) return;
            event.preventDefault();
            input.current?.focus();
          }}
          className={cn(dialogPanel, dialogWidths.sm)}
        >
          <form onSubmit={confirm} className="flex flex-col gap-5">
            <div className="flex items-start gap-3">
              {tile && (
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-md [&_svg]:size-5",
                    danger ? "bg-danger-subtle text-danger-ink" : "bg-bg-muted text-fg-muted",
                  )}
                >
                  {tile}
                </span>
              )}
              <div className={cn("flex min-w-0 flex-col gap-1.5", tile && "pt-1")}>
                <AlertDialogPrimitive.Title className={dialogTitle}>{title}</AlertDialogPrimitive.Title>
                {description && (
                  <AlertDialogPrimitive.Description className={dialogDescription}>{description}</AlertDialogPrimitive.Description>
                )}
              </div>
            </div>

            {children}

            {confirmText && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor={inputId} className="text-body-sm text-fg-muted">
                  {before}
                  <code className="rounded-xs bg-bg-muted px-1 py-px font-mono text-[0.8125rem] font-medium text-fg select-all">
                    {confirmText}
                  </code>
                  {after}
                </label>
                <Input
                  ref={input}
                  id={inputId}
                  value={typed}
                  onChange={(event) => setTyped(event.target.value)}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  disabled={pending}
                />
              </div>
            )}

            <DialogFooter>
              <AlertDialogPrimitive.Cancel asChild>
                <Button variant="secondary" disabled={pending}>
                  {cancelLabel ?? labels.cancel}
                </Button>
              </AlertDialogPrimitive.Cancel>
              <Button type="submit" variant={danger ? "danger" : "primary"} disabled={!ready} loading={pending}>
                {confirmLabel ?? labels.confirm}
              </Button>
            </DialogFooter>
          </form>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}

// ---------------------------------------------------------------- useConfirm

type Ask = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<Ask | null>(null);

/**
 * The Wixzel window.confirm: `if (await confirm({ title: "Delete key?", tone: "danger" })) …`.
 * Resolves true on confirm, false on cancel. Needs <WixzelProvider>, which
 * hosts the dialog.
 */
export function useConfirm(): Ask {
  const ask = useContext(ConfirmContext);
  if (!ask) throw new Error("useConfirm needs <WixzelProvider> above it.");
  return ask;
}

/** Mounted by WixzelProvider. Shows one confirmation at a time; asking again while one is open answers the first with false. */
export function ConfirmHost({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<{ options: ConfirmOptions; resolve: (ok: boolean) => void } | null>(null);
  const [open, setOpen] = useState(false);
  const answered = useRef(false);

  const ask = useCallback<Ask>(
    (options) =>
      new Promise<boolean>((resolve) => {
        setRequest((previous) => {
          previous?.resolve(false);
          return { options, resolve };
        });
        answered.current = false;
        setOpen(true);
      }),
    [],
  );

  return (
    <ConfirmContext.Provider value={ask}>
      {children}
      {request && (
        <ConfirmDialog
          {...request.options}
          open={open}
          onConfirm={() => {
            answered.current = true;
            request.resolve(true);
          }}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next && !answered.current) request.resolve(false);
          }}
        />
      )}
    </ConfirmContext.Provider>
  );
}
