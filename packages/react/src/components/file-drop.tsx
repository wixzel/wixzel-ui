import { FileArrowUp, X } from "@phosphor-icons/react";
import { type ComponentProps, type ReactNode, type Ref, useRef, useState } from "react";
import { cn } from "../lib/cn";
import { useFieldControl } from "./field";
import { useLabels } from "./labels";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * A file input as a filled drop zone: drop a file on it or press it to browse.
 * The chosen file shows by name and size with a button to clear it. A real
 * <input type="file"> sits underneath, so a form reads it as it always would,
 * through `ref`, `name` or onChange, and it joins a surrounding <Field>.
 *
 * `preview` shows what is there now (the current cover) until a new file is picked.
 */
export function FileDrop({
  ref,
  hint,
  preview,
  className,
  onChange,
  multiple,
  ...props
}: Omit<ComponentProps<"input">, "type" | "children"> & {
  ref?: Ref<HTMLInputElement>;
  /** What to drop, under the prompt: "PNG or JPG, 1180×600". */
  hint?: ReactNode;
  /** The current file or image, shown until a new one is chosen. */
  preview?: ReactNode;
}) {
  const labels = useLabels();
  const control = useFieldControl(props);
  const input = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [over, setOver] = useState(false);

  const setRef = (el: HTMLInputElement | null) => {
    input.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  };

  const sync = () => setFiles(Array.from(input.current?.files ?? []));

  const clear = () => {
    const el = input.current;
    if (!el) return;
    el.value = "";
    sync();
    el.dispatchEvent(new Event("change", { bubbles: true }));
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        data-over={over || undefined}
        data-invalid={control["aria-invalid"] ? "" : undefined}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const el = input.current;
          if (!el || !e.dataTransfer.files.length) return;
          // Hand the dropped files to the real input, so the form sees them as if browsed.
          const dt = new DataTransfer();
          for (const f of Array.from(e.dataTransfer.files).slice(0, multiple ? undefined : 1)) dt.items.add(f);
          el.files = dt.files;
          sync();
          el.dispatchEvent(new Event("change", { bubbles: true }));
        }}
        className={cn(
          "group/drop relative flex cursor-pointer items-center gap-3 rounded-md bg-bg-muted px-3.5 py-3 text-body-sm",
          "transition-[background-color,box-shadow] duration-(--wx-duration-fast) ease-standard",
          "hover:bg-[color-mix(in_oklab,var(--wx-color-bg-muted),var(--wx-color-fg)_4%)]",
          "has-focus-visible:shadow-[0_0_0_2px_var(--wx-color-focus)]",
          "data-over:bg-accent-subtle data-over:shadow-[0_0_0_2px_var(--wx-color-accent-edge)]",
          "data-invalid:shadow-[0_0_0_1px_var(--wx-color-danger)]",
          (props.disabled || control.disabled) && "pointer-events-none opacity-50",
        )}
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-sm bg-surface text-fg-muted transition-colors group-data-over/drop:text-accent-ink [&_svg]:size-4.5">
          <FileArrowUp />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-fg">
            {labels.dropFile} <span className="font-semibold text-accent-ink underline underline-offset-2">{labels.browse}</span>
          </span>
          {hint && <span className="text-caption text-fg-subtle">{hint}</span>}
        </span>
        <input
          {...props}
          {...control}
          ref={setRef}
          type="file"
          multiple={multiple}
          onChange={(e) => {
            sync();
            onChange?.(e);
          }}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
      </label>

      {files.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {files.map((f) => (
            <li key={f.name} className="flex animate-wx-fade-in items-center gap-2 rounded-sm bg-surface px-2.5 py-1.5 text-body-sm">
              <span className="min-w-0 flex-1 truncate font-medium">{f.name}</span>
              <span className="shrink-0 text-caption tabular-nums text-fg-subtle">{formatSize(f.size)}</span>
              <button
                type="button"
                onClick={clear}
                aria-label={labels.removeFile.replace("{name}", f.name)}
                className="grid size-6 shrink-0 place-items-center rounded-xs text-fg-subtle transition-colors hover:bg-bg-muted hover:text-fg wx-focus"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        preview
      )}
    </div>
  );
}
