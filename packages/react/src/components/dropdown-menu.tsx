import { CaretRight, Check } from "@phosphor-icons/react";
import { DropdownMenu as MenuPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/cn";
import { floatingPanel, menuItem, menuLabel, menuSeparator } from "../recipes/menu";
import { useScopeAttributes } from "./scope";

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuTrigger = MenuPrimitive.Trigger;
export const DropdownMenuGroup = MenuPrimitive.Group;
export const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup;
export const DropdownMenuSub = MenuPrimitive.Sub;

export function DropdownMenuContent({
  className,
  sideOffset = 6,
  align = "start",
  ...props
}: ComponentProps<typeof MenuPrimitive.Content>) {
  const scope = useScopeAttributes();
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        {...scope}
        sideOffset={sideOffset}
        align={align}
        className={cn(
          floatingPanel,
          "max-h-(--radix-dropdown-menu-content-available-height) origin-(--radix-dropdown-menu-content-transform-origin) overflow-y-auto",
          className,
        )}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({
  className,
  tone = "default",
  inset,
  ...props
}: ComponentProps<typeof MenuPrimitive.Item> & { tone?: "default" | "danger"; inset?: boolean }) {
  return (
    <MenuPrimitive.Item
      className={cn(
        menuItem,
        inset && "ps-8",
        tone === "danger" && "text-danger-ink data-highlighted:bg-danger-subtle [&_svg]:text-danger-ink",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
  return (
    <MenuPrimitive.CheckboxItem className={cn(menuItem, "ps-8", className)} {...props}>
      <MenuPrimitive.ItemIndicator className="absolute start-2 flex items-center">
        <Check className="size-4 text-accent-ink!" strokeWidth={2.25} />
      </MenuPrimitive.ItemIndicator>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

export function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof MenuPrimitive.RadioItem>) {
  return (
    <MenuPrimitive.RadioItem className={cn(menuItem, "ps-8", className)} {...props}>
      <MenuPrimitive.ItemIndicator className="absolute start-2 flex size-4 items-center justify-center">
        <span className="size-1.5 animate-wx-pop-in rounded-full bg-accent-ink" />
      </MenuPrimitive.ItemIndicator>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

export function DropdownMenuLabel({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Label>) {
  return <MenuPrimitive.Label className={cn(menuLabel, className)} {...props} />;
}

export function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator className={cn(menuSeparator, className)} {...props} />;
}

/** A keyboard shortcut at the end of an item, one keycap per key: <DropdownMenuShortcut keys={["⌘", "C"]} />. */
export function DropdownMenuShortcut({
  keys,
  className,
  ...props
}: ComponentProps<"span"> & { keys: string[] }) {
  return (
    <span className={cn("ms-auto flex items-center gap-0.5 ps-4", className)} {...props}>
      {keys.map((key) => (
        <kbd
          key={key}
          className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-xs bg-surface px-1 pb-px font-sans text-[0.6875rem] font-medium leading-none text-fg-subtle shadow-[0_0_0_1px_var(--wx-color-border),inset_0_-1.5px_0_var(--wx-color-border-strong)]"
        >
          {key}
        </kbd>
      ))}
    </span>
  );
}

export function DropdownMenuSubTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof MenuPrimitive.SubTrigger>) {
  return (
    <MenuPrimitive.SubTrigger className={cn(menuItem, "data-[state=open]:bg-bg-muted", className)} {...props}>
      {children}
      <CaretRight className="ms-auto rtl:rotate-180" />
    </MenuPrimitive.SubTrigger>
  );
}

export function DropdownMenuSubContent({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.SubContent>) {
  const scope = useScopeAttributes();
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent
        {...scope}
        className={cn(floatingPanel, "origin-(--radix-dropdown-menu-content-transform-origin)", className)}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
}
