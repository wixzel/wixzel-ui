import {
  Checkbox as CheckboxPrimitive,
  RadioGroup as RadioGroupPrimitive,
  ToggleGroup as ToggleGroupPrimitive,
} from "radix-ui";
import { type ComponentProps, createContext, type ReactNode, useContext, useState } from "react";
import { cn } from "../lib/cn";

type Columns = 1 | 2 | 3 | 4;

const cardGrid = (columns?: Columns) => [
  "grid gap-2",
  columns === 2 && "sm:grid-cols-2",
  columns === 3 && "sm:grid-cols-3",
  columns === 4 && "grid-cols-2 sm:grid-cols-4",
];

// RadioCard and CheckboxCard are one object: a light fill on its panel that
// takes the accent wash and a solid 2px ring once chosen.
const optionCard = [
  "group/card relative flex w-full flex-col items-start gap-1 rounded-md bg-surface p-3.5 text-start wx-focus",
  "transition-[box-shadow,background-color,scale] duration-(--wx-duration-move) ease-move",
  "hover:bg-[color-mix(in_oklab,var(--wx-color-surface),var(--wx-color-fg)_4%)] active:scale-[0.985] active:duration-(--wx-duration-instant)",
  "data-[state=checked]:bg-accent-subtle data-[state=checked]:shadow-[0_0_0_2px_var(--wx-color-accent-edge)]",
  "disabled:cursor-not-allowed disabled:opacity-45",
];

interface OptionCardContent {
  title?: ReactNode;
  description?: ReactNode;
  /** A price or figure on the end of the title row. */
  aside?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
}

function OptionCardBody({ title, description, aside, icon, children, round }: OptionCardContent & { round: boolean }) {
  return (
    <>
      <span className="flex w-full items-center gap-2 pe-6">
        {icon && (
          <span className="grid size-6 shrink-0 place-items-center rounded-sm bg-bg-muted text-fg-muted group-data-[state=checked]/card:bg-surface [&_svg]:size-3.5">
            {icon}
          </span>
        )}
        {title && <span className="min-w-0 flex-1 truncate text-body-sm font-semibold">{title}</span>}
        {aside && <span className="shrink-0 text-body-sm font-medium tabular-nums">{aside}</span>}
      </span>
      {description && <span className="text-caption text-fg-muted">{description}</span>}
      {children}
      {/* Round for one choice, square for many, as with radios and checkboxes. The check pops in. */}
      <span
        aria-hidden
        className={cn(
          "absolute end-3 top-3 grid size-4 place-items-center shadow-[0_0_0_1px_var(--wx-color-border-strong)]",
          round ? "rounded-full" : "rounded-xs",
          "group-data-[state=checked]/card:bg-accent group-data-[state=checked]/card:text-accent-fg group-data-[state=checked]/card:shadow-[0_0_0_1px_color-mix(in_oklab,var(--wx-color-accent)_76%,black)]",
          "transition-[background-color,box-shadow] duration-(--wx-duration-fast)",
        )}
      >
        <svg viewBox="0 0 12 12" fill="none" className="size-2.5 scale-0 transition-[scale] duration-(--wx-duration-move) ease-move group-data-[state=checked]/card:scale-100">
          <path d="M2.5 6.3 4.8 8.6 9.5 3.6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </>
  );
}

/**
 * Options as cards: an engine, a licence, a top-up amount. Built on a radio
 * group, so arrow keys move between them. Each option is a light fill on its
 * panel; the chosen one takes the accent wash, a solid 2px accent ring and a
 * check that pops in.
 */
export function RadioCards({
  className,
  columns,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Root> & { columns?: Columns }) {
  return <RadioGroupPrimitive.Root className={cn(cardGrid(columns), className)} {...props} />;
}

export function RadioCard({
  title,
  description,
  aside,
  icon,
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof RadioGroupPrimitive.Item>, "title"> & OptionCardContent) {
  return (
    <RadioGroupPrimitive.Item className={cn(optionCard, className)} {...props}>
      <OptionCardBody title={title} description={description} aside={aside} icon={icon} round>
        {children}
      </OptionCardBody>
    </RadioGroupPrimitive.Item>
  );
}

// ---------------------------------------------------------------- CheckboxCards

interface CheckboxCardsState {
  value: string[];
  toggle: (value: string, checked: boolean) => void;
  disabled?: boolean;
}

const CheckboxCardsContext = createContext<CheckboxCardsState | null>(null);

/**
 * RadioCards for any number of choices: the tools an agent may use, the
 * channels it answers on. Each card is a checkbox, so Tab and Space work as
 * people expect; a chosen card looks exactly like a chosen RadioCard, with a
 * square check in place of the round one.
 */
export function CheckboxCards({
  value: valueProp,
  defaultValue = [],
  onValueChange,
  columns,
  disabled,
  className,
  ...props
}: Omit<ComponentProps<"div">, "defaultValue"> & {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  columns?: Columns;
  disabled?: boolean;
}) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = valueProp ?? uncontrolled;
  const toggle = (item: string, checked: boolean) => {
    const next = checked ? [...value.filter((v) => v !== item), item] : value.filter((v) => v !== item);
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };
  return (
    <CheckboxCardsContext.Provider value={{ value, toggle, disabled }}>
      <div role="group" className={cn(cardGrid(columns), className)} {...props} />
    </CheckboxCardsContext.Provider>
  );
}

/** One card. Inside CheckboxCards give it a value; on its own it takes checked and onCheckedChange like a Checkbox. */
export function CheckboxCard({
  value,
  title,
  description,
  aside,
  icon,
  checked,
  onCheckedChange,
  disabled,
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof CheckboxPrimitive.Root>, "title" | "value" | "checked"> &
  OptionCardContent & {
    value?: string;
    checked?: boolean;
  }) {
  const group = useContext(CheckboxCardsContext);
  const inGroup = group && value !== undefined;
  return (
    <CheckboxPrimitive.Root
      value={value}
      checked={inGroup ? group.value.includes(value) : checked}
      onCheckedChange={(next) => {
        if (inGroup) group.toggle(value, next === true);
        onCheckedChange?.(next);
      }}
      disabled={disabled ?? group?.disabled}
      className={cn(optionCard, className)}
      {...props}
    >
      <OptionCardBody title={title} description={description} aside={aside} icon={icon} round={false}>
        {children}
      </OptionCardBody>
    </CheckboxPrimitive.Root>
  );
}

/**
 * Filter chips. type="single" for one choice (All / Completed / Failed),
 * type="multiple" for any number. A chosen chip is inked, like the current tab.
 */
export function Chips({ className, ...props }: ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return <ToggleGroupPrimitive.Root className={cn("flex flex-wrap items-center gap-1.5", className)} {...props} />;
}

export function Chip({
  className,
  icon,
  count,
  children,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Item> & { icon?: ReactNode; count?: number }) {
  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        "group/chip inline-flex h-control-xs select-none items-center gap-1.5 rounded-md px-3 text-body-sm font-medium text-fg-muted wx-focus",
        "shadow-[0_0_0_1px_var(--wx-color-border)] transition-[background-color,color,box-shadow,scale] duration-(--wx-duration-fast) ease-standard",
        "hover:bg-bg-muted hover:text-fg active:scale-[0.96]",
        "data-[state=on]:bg-fg data-[state=on]:text-bg data-[state=on]:shadow-[0_0_0_1px_var(--wx-color-fg)]",
        "disabled:pointer-events-none disabled:opacity-45",
        "[&_svg]:size-3.5 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
      {count !== undefined && (
        <span className="min-w-4 text-center text-caption tabular-nums text-fg-subtle group-data-[state=on]/chip:text-bg/70">{count}</span>
      )}
    </ToggleGroupPrimitive.Item>
  );
}
