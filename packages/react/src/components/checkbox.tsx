import { Checkbox as CheckboxPrimitive, RadioGroup as RadioGroupPrimitive, Slider as SliderPrimitive, Switch as SwitchPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn";
import { useFieldControl } from "./field";

const toggleBase = [
  "peer shrink-0 bg-surface shadow-raised wx-focus",
  "transition-[background-color,box-shadow,scale] duration-(--wx-duration-move) ease-move",
  "active:scale-90 active:duration-(--wx-duration-instant)",
  "hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--wx-color-border-strong),var(--wx-color-fg)_30%),0_1px_3px_rgb(24_22_10/0.08)]",
  "aria-invalid:shadow-[0_0_0_1px_var(--wx-color-danger-ink)]",
  "disabled:cursor-not-allowed disabled:opacity-45",
];

/** The check draws itself in; unchecking draws it back out. Supports checked="indeterminate". */
export function Checkbox({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) {
  const control = useFieldControl(props);
  return (
    <CheckboxPrimitive.Root
      {...props}
      {...control}
      className={cn(
        toggleBase,
        "group/check grid size-4 place-items-center rounded-xs",
        "data-[state=checked]:bg-accent data-[state=checked]:text-accent-fg data-[state=indeterminate]:bg-accent data-[state=indeterminate]:text-accent-fg",
        "data-[state=checked]:shadow-[0_0_0_1px_color-mix(in_oklab,var(--wx-color-accent)_78%,black),inset_0_1px_0_rgb(255_255_255/0.2)]",
        "data-[state=indeterminate]:shadow-[0_0_0_1px_color-mix(in_oklab,var(--wx-color-accent)_78%,black),inset_0_1px_0_rgb(255_255_255/0.2)]",
        className,
      )}
    >
      <CheckboxPrimitive.Indicator forceMount className="grid place-items-center">
        <svg viewBox="0 0 12 12" fill="none" aria-hidden className="col-start-1 row-start-1 size-3">
          <path
            d="M2.5 6.3 4.8 8.6 9.5 3.6"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] duration-(--wx-duration-base) ease-out group-data-[state=checked]/check:[stroke-dashoffset:0] group-data-[state=checked]/check:delay-50"
          />
        </svg>
        <svg viewBox="0 0 12 12" fill="none" aria-hidden className="col-start-1 row-start-1 size-3">
          <path
            d="M3 6h6"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            pathLength={1}
            className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] duration-(--wx-duration-base) ease-out group-data-[state=indeterminate]/check:[stroke-dashoffset:0]"
          />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export function RadioGroup({ className, ...props }: ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn("grid gap-2.5", className)} {...props} />;
}

/** The dot grows in from nothing. */
export function RadioGroupItem({ className, ...props }: ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        toggleBase,
        "group/radio grid size-4 place-items-center rounded-full",
        "data-[state=checked]:bg-accent",
        "data-[state=checked]:shadow-[0_0_0_1px_color-mix(in_oklab,var(--wx-color-accent)_78%,black),inset_0_1px_0_rgb(255_255_255/0.2)]",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        forceMount
        className="size-1.5 scale-0 rounded-full bg-accent-fg shadow-[0_1px_1px_rgb(0_0_0/0.2)] transition-[scale] duration-(--wx-duration-move) ease-move group-data-[state=checked]/radio:scale-100"
      />
    </RadioGroupPrimitive.Item>
  );
}

const switchSizes = {
  sm: "h-4 w-7 [--thumb:12px] [--thumb-held:15px]",
  md: "h-5 w-9 [--thumb:16px] [--thumb-held:20px]",
} as const;

/**
 * A pill track and a round thumb. The thumb stretches while it is held, the
 * way a finger squashes it, then slides across. The track's colour crossfades
 * underneath.
 */
export function Switch({
  className,
  size = "md",
  ...props
}: ComponentProps<typeof SwitchPrimitive.Root> & { size?: keyof typeof switchSizes }) {
  const control = useFieldControl(props);
  return (
    <SwitchPrimitive.Root
      {...props}
      {...control}
      className={cn(
        "group/switch peer relative inline-flex shrink-0 rounded-full wx-focus",
        "bg-border-strong",
        "transition-colors duration-(--wx-duration-base) ease-standard",
        "hover:bg-[color-mix(in_oklab,var(--wx-color-border-strong),var(--wx-color-fg)_14%)]",
        "data-[state=checked]:bg-accent data-[state=checked]:hover:bg-accent-hover",
        "disabled:cursor-not-allowed disabled:opacity-45",
        switchSizes[size],
        className,
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none absolute top-0.5 block h-(--thumb) w-(--thumb) rounded-full bg-white",
          // On the accent the thumb takes the colour made to sit on it; a white thumb vanishes on a light accent.
          "data-[state=checked]:bg-accent-fg",
          "shadow-[0_0_0_0.5px_rgb(0_0_0/0.14),0_1px_2px_rgb(0_0_0/0.3)]",
          "start-0.5 transition-[inset-inline-start,width,background-color] duration-(--wx-duration-move) ease-move",
          "group-active/switch:w-(--thumb-held)",
          "data-[state=checked]:start-[calc(100%-2px-var(--thumb))] group-active/switch:data-[state=checked]:start-[calc(100%-2px-var(--thumb-held))]",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

/**
 * A thin track that fills with the accent up to the value. The thumb stretches
 * while it is held, like the Switch. Pass `aria-label` to name the thumb; a
 * range slider takes two values and gets a thumb for each.
 */
export function Slider({
  className,
  "aria-label": label,
  ...props
}: ComponentProps<typeof SliderPrimitive.Root>) {
  const control = useFieldControl(props);
  const thumbs = props.value ?? props.defaultValue ?? [props.min ?? 0];
  return (
    <SliderPrimitive.Root
      {...props}
      disabled={control.disabled}
      className={cn(
        "group/slider relative flex h-5 w-full touch-none select-none items-center",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45",
        className,
      )}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-border-strong">
        <SliderPrimitive.Range className="absolute h-full bg-accent" />
      </SliderPrimitive.Track>
      {thumbs.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          aria-label={label}
          aria-describedby={control["aria-describedby"]}
          aria-invalid={control["aria-invalid"]}
          className={cn(
            "block h-4 w-4 rounded-full bg-white wx-focus",
            "shadow-[0_0_0_0.5px_rgb(0_0_0/0.14),0_1px_2px_rgb(0_0_0/0.3)]",
            "transition-[width] duration-(--wx-duration-move) ease-move active:w-5",
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}
