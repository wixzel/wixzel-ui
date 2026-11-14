import { Check, Copy, Eye, EyeSlash } from "@phosphor-icons/react";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";
import { useLabels } from "./labels";
import { Tooltip } from "./tooltip";

/**
 * A value people copy: an API key, a token, a webhook URL. Secrets are masked
 * down to their last four characters until revealed. Copying swaps the icon
 * for a check for 1.6s. If the clipboard is refused, the text is selected so
 * the person can copy it themselves.
 */
export function CopyField({
  value,
  secret,
  label,
  className,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  value: string;
  /** Mask everything but the last four characters until revealed. */
  secret?: boolean;
  /** The copy button's name, such as "Copy API key". Defaults to the provider's "Copy". */
  label?: string;
}) {
  const labels = useLabels();
  const copyLabel = label ?? labels.copy;
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const text = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const shown = secret && !revealed ? `${"•".repeat(Math.min(16, Math.max(8, value.length - 4)))}${value.slice(-4)}` : value;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      setRevealed(true);
      requestAnimationFrame(() => {
        const node = text.current;
        if (!node) return;
        const range = document.createRange();
        range.selectNodeContents(node);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      });
    }
  };

  return (
    <div
      className={cn(
        "flex h-control-md min-w-0 items-center gap-1 rounded-md bg-bg-muted ps-3.5 pe-1.5",
        className,
      )}
      {...props}
    >
      <span ref={text} className="min-w-0 flex-1 truncate font-mono text-[0.8125rem] tracking-tight text-fg select-all">
        {shown}
      </span>
      {secret && (
        <Tooltip content={revealed ? labels.hide : labels.reveal}>
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            aria-label={revealed ? labels.hide : labels.reveal}
            className="grid size-7 shrink-0 place-items-center rounded-sm text-fg-subtle transition-colors hover:bg-surface hover:text-fg wx-focus"
          >
            {revealed ? <EyeSlash className="size-4" /> : <Eye className="size-4" />}
          </button>
        </Tooltip>
      )}
      <Tooltip content={copied ? labels.copied : copyLabel} open={copied ? true : undefined}>
        <button
          type="button"
          onClick={copy}
          aria-label={copyLabel}
          className={cn(
            "grid size-7 shrink-0 place-items-center rounded-sm transition-colors wx-focus",
            copied ? "text-success-ink" : "text-fg-subtle hover:bg-surface hover:text-fg",
          )}
        >
          <span className="grid *:col-start-1 *:row-start-1">
            <Copy className={cn("size-4 transition-[scale,opacity] duration-(--wx-duration-move) ease-move", copied && "scale-50 opacity-0")} />
            <Check className={cn("size-4 transition-[scale,opacity] duration-(--wx-duration-move) ease-move", !copied && "scale-50 opacity-0")} />
          </span>
        </button>
      </Tooltip>
    </div>
  );
}
