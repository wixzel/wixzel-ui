import { CaretUpDown, Check, MagnifyingGlass } from "@phosphor-icons/react";
import { Popover as PopoverPrimitive } from "radix-ui";
import {
  Fragment,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn";
import { controlSurface, inputVariants } from "../recipes/input";
import { floatingPanel, menuItem, menuLabel, menuSeparator } from "../recipes/menu";
import { useFieldControl } from "./field";
import { useLabels } from "./labels";
import { useScopeAttributes } from "./scope";

export interface ComboboxOption {
  value: string;
  label: ReactNode;
  /** A second line under the label. */
  description?: ReactNode;
  icon?: ReactNode;
  /** Extra words search should match, such as a language's own name. Needed when the label isn't a string. */
  keywords?: string[];
  disabled?: boolean;
}

export interface ComboboxGroup {
  label: ReactNode;
  options: ComboboxOption[];
}

export type ComboboxItem = ComboboxOption | ComboboxGroup;

const isGroup = (item: ComboboxItem): item is ComboboxGroup => "options" in item;

// Case and accents don't matter: "espanol" finds "Español".
const fold = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

function matches(option: ComboboxOption, query: string) {
  const words = [typeof option.label === "string" ? option.label : "", option.value, ...(option.keywords ?? [])];
  return words.some((word) => fold(word).includes(query));
}

export interface ComboboxProps {
  options: ComboboxItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: ReactNode;
  /** Placeholder of the search box. Defaults to the provider's label. */
  searchPlaceholder?: string;
  /** Shown when nothing matches. Defaults to the provider's label. */
  emptyText?: ReactNode;
  /** Replace the built-in search, which matches label, value and keywords, ignoring case and accents. */
  filter?: (option: ComboboxOption, query: string) => boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  /** Submits the value with a form, through a hidden input. */
  name?: string;
  required?: boolean;
  id?: string;
  className?: string;
  contentClassName?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

/**
 * A Select you can type into, for long lists: 97 languages, a hundred voices.
 * The trigger is the same filled field as Select. The list sharpens out of a
 * blur with a search box on top; typing filters it, arrow keys move the
 * highlight and Enter picks. Typing on the closed trigger opens it with those
 * letters already in the search.
 */
export function Combobox({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyText,
  filter,
  size,
  disabled,
  name,
  required,
  id,
  className,
  contentClassName,
  ...aria
}: ComboboxProps) {
  const labels = useLabels();
  const scope = useScopeAttributes();
  const control = useFieldControl({ id, disabled, required, ...aria });
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = valueProp ?? uncontrolled;
  const list = useRef<HTMLDivElement>(null);

  const all = useMemo(() => options.flatMap((item) => (isGroup(item) ? item.options : [item])), [options]);
  const selected = all.find((option) => option.value === value);

  // The groups as they stand after filtering, empty groups dropped.
  const shown = useMemo(() => {
    const q = fold(query.trim());
    const keep = (option: ComboboxOption) => !q || (filter ? filter(option, query.trim()) : matches(option, q));
    return options
      .map((item) => (isGroup(item) ? { ...item, options: item.options.filter(keep) } : item))
      .filter((item) => (isGroup(item) ? item.options.length > 0 : keep(item)));
  }, [options, query, filter]);
  const choosable = useMemo(
    () => shown.flatMap((item) => (isGroup(item) ? item.options : [item])).filter((option) => !option.disabled),
    [shown],
  );

  const [active, setActive] = useState<string | undefined>();
  // Opening highlights the current value; a new search highlights the first match.
  useEffect(() => {
    if (!open) return;
    setActive((current) => (choosable.some((option) => option.value === current) ? current : choosable[0]?.value));
  }, [open, choosable]);

  useEffect(() => {
    if (!open || !active) return;
    list.current?.querySelector(`[data-value="${CSS.escape(active)}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const openWith = (seed = "") => {
    setQuery(seed);
    setActive(value);
    setOpen(true);
  };

  const choose = (next: string) => {
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next);
    setOpen(false);
  };

  const onSearchKey = (event: KeyboardEvent<HTMLInputElement>) => {
    const at = choosable.findIndex((option) => option.value === active);
    const move = (to: number) => {
      event.preventDefault();
      const next = choosable[Math.max(0, Math.min(choosable.length - 1, to))];
      if (next) setActive(next.value);
    };
    if (event.key === "ArrowDown") move(at + 1);
    else if (event.key === "ArrowUp") move(at - 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(choosable.length - 1);
    else if (event.key === "Enter" && active) {
      event.preventDefault();
      choose(active);
    }
  };

  const optionId = (v: string) => `${listId}-${v}`;

  const row = (option: ComboboxOption) => {
    const isActive = option.value === active;
    const isChosen = option.value === value;
    return (
      <div
        key={option.value}
        id={optionId(option.value)}
        role="option"
        aria-selected={isChosen}
        aria-disabled={option.disabled || undefined}
        data-value={option.value}
        data-highlighted={isActive ? "" : undefined}
        data-disabled={option.disabled ? "" : undefined}
        data-state={isChosen ? "checked" : undefined}
        // Keep focus in the search box while the pointer picks.
        onMouseDown={(event) => event.preventDefault()}
        onPointerMove={() => !option.disabled && setActive(option.value)}
        onClick={() => !option.disabled && choose(option.value)}
        className={cn(menuItem, "pe-8 data-[state=checked]:font-medium", option.description && "h-auto min-h-8 py-1.5")}
      >
        {option.icon}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate">{option.label}</span>
          {option.description && <span className="truncate text-caption font-normal text-fg-muted">{option.description}</span>}
        </span>
        {isChosen && <Check className="absolute end-2 size-4 animate-wx-pop-in text-accent-ink!" strokeWidth={2.25} />}
      </div>
    );
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={(next) => (next ? openWith() : setOpen(false))}>
      <PopoverPrimitive.Trigger
        type="button"
        {...control}
        aria-haspopup="listbox"
        aria-required={required || undefined}
        data-placeholder={selected ? undefined : ""}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openWith();
          } else if (event.key.length === 1 && event.key !== " " && !event.metaKey && !event.ctrlKey && !event.altKey) {
            event.preventDefault();
            openWith(event.key);
          }
        }}
        className={cn(
          inputVariants({ size }),
          controlSurface,
          "flex items-center justify-between gap-2 pe-2.5 text-start outline-none focus-visible:border-accent-edge focus-visible:shadow-[0_0_0_1px_var(--wx-color-focus)]",
          "data-placeholder:text-fg-subtle data-[state=open]:border-accent-edge data-[state=open]:shadow-[0_0_0_1px_var(--wx-color-focus)]",
          "[&_svg:not([class*='size-'])]:size-4",
          className,
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          {selected?.icon}
          <span className="truncate">{selected ? selected.label : placeholder}</span>
        </span>
        <CaretUpDown aria-hidden className="size-3.5 shrink-0 text-fg-subtle" />
      </PopoverPrimitive.Trigger>
      {name && <input type="hidden" name={name} value={value ?? ""} />}

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          {...scope}
          sideOffset={6}
          align="start"
          className={cn(
            floatingPanel,
            "flex w-(--radix-popover-trigger-width) min-w-56 flex-col p-0",
            "max-h-[min(22rem,var(--radix-popover-content-available-height))] origin-(--radix-popover-content-transform-origin)",
            contentClassName,
          )}
        >
          <label className="group/search flex h-10 shrink-0 items-center gap-2 border-b border-border px-3">
            <MagnifyingGlass
              aria-hidden
              className="size-4 shrink-0 text-fg-subtle transition-colors duration-(--wx-duration-fast) group-focus-within/search:text-accent-ink"
            />
            <input
              role="combobox"
              aria-expanded
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={active ? optionId(active) : undefined}
              aria-label={searchPlaceholder ?? labels.search}
              placeholder={searchPlaceholder ?? labels.search}
              autoComplete="off"
              spellCheck={false}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(undefined);
              }}
              onKeyDown={onSearchKey}
              className="h-full min-w-0 flex-1 bg-transparent text-body-sm text-fg outline-none placeholder:text-fg-subtle"
            />
          </label>
          <div ref={list} id={listId} role="listbox" className="min-h-0 flex-1 overflow-y-auto p-1">
            {shown.length === 0 ? (
              <div className="px-2 py-6 text-center text-body-sm text-fg-subtle">{emptyText ?? labels.noResults}</div>
            ) : (
              shown.map((item, i) =>
                isGroup(item) ? (
                  <Fragment key={i}>
                    {i > 0 && <div role="separator" className={menuSeparator} />}
                    <div role="group" aria-label={typeof item.label === "string" ? item.label : undefined}>
                      <div className={menuLabel}>{item.label}</div>
                      {item.options.map(row)}
                    </div>
                  </Fragment>
                ) : (
                  row(item)
                ),
              )
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
