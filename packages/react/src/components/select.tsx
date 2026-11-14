import { CaretDown, CaretUp, CaretUpDown, Check } from "@phosphor-icons/react";
import { Select as SelectPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn";
import { useFieldControl } from "./field";
import { controlSurface, inputVariants } from "../recipes/input";
import { floatingPanel, menuItem, menuLabel, menuSeparator } from "../recipes/menu";
import { useScopeAttributes } from "./scope";

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({
  className,
  size,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger> & { size?: "sm" | "md" | "lg" }) {
  const control = useFieldControl(props);
  return (
    <SelectPrimitive.Trigger
      {...props}
      {...control}
      className={cn(
        inputVariants({ size }),
        controlSurface,
        "flex items-center justify-between gap-2 pe-2.5 text-start outline-none focus-visible:border-accent-edge focus-visible:shadow-[0_0_0_1px_var(--wx-color-focus)]",
        "data-placeholder:text-fg-subtle data-[state=open]:border-accent-edge data-[state=open]:shadow-[0_0_0_1px_var(--wx-color-focus)]",
        "[&>span]:truncate",
        className,
      )}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <CaretUpDown className="size-3.5 shrink-0 text-fg-subtle" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  position = "popper",
  sideOffset = 6,
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  const scope = useScopeAttributes();
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        {...scope}
        position={position}
        sideOffset={sideOffset}
        className={cn(
          floatingPanel,
          "max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin)",
          position === "popper" && "w-full",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex h-6 items-center justify-center text-fg-subtle">
          <CaretUp className="size-4" />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport
          className={cn(position === "popper" && "min-w-(--radix-select-trigger-width)")}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex h-6 items-center justify-center text-fg-subtle">
          <CaretDown className="size-4" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(menuItem, "pe-8 data-[state=checked]:font-medium", className)}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute end-2 flex items-center">
        <Check className="size-4 animate-wx-pop-in text-accent-ink!" strokeWidth={2.25} />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export function SelectLabel({ className, ...props }: ComponentProps<typeof SelectPrimitive.Label>) {
  return <SelectPrimitive.Label className={cn(menuLabel, className)} {...props} />;
}

export function SelectSeparator({ className, ...props }: ComponentProps<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator className={cn(menuSeparator, className)} {...props} />;
}
