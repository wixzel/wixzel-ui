import { Tooltip as TooltipPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";
import { useScopeAttributes } from "./scope";

/**
 * The first tooltip waits 400ms; moving to the next one within 300ms opens it
 * instantly. Mounted for you by <WixzelProvider>.
 */
export function TooltipProvider({
  delayDuration = 400,
  skipDelayDuration = 300,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration} {...props} />;
}

export const TooltipRoot = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export function TooltipContent({
  className,
  sideOffset = 6,
  children,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) {
  const scope = useScopeAttributes();
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        {...scope}
        sideOffset={sideOffset}
        className={cn(
          "z-(--wx-z-tooltip) max-w-64 rounded-md bg-bg-inverse px-2 py-1 text-caption font-medium text-fg-inverse",
          "shadow-[0_0_0_1px_rgb(255_255_255/0.06),0_4px_10px_-4px_rgb(0_0_0/0.3)]",
          "origin-(--radix-tooltip-content-transform-origin)",
          "data-[side=bottom]:[--wx-pop-y:-3px] data-[side=top]:[--wx-pop-y:3px]",
          "data-[state=delayed-open]:animate-wx-pop-in data-[state=instant-open]:animate-wx-fade-in data-[state=closed]:animate-wx-fade-out",
          className,
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

/** The short form: <Tooltip content="Copy link"><Button …/></Tooltip>. */
export function Tooltip({
  content,
  children,
  side = "top",
  align,
  shortcut,
  ...props
}: Omit<ComponentProps<typeof TooltipPrimitive.Root>, "children"> & {
  content: ReactNode;
  children: ReactNode;
  side?: ComponentProps<typeof TooltipPrimitive.Content>["side"];
  align?: ComponentProps<typeof TooltipPrimitive.Content>["align"];
  /** Keys shown after the label as keycaps, such as ["⌘", "K"]. */
  shortcut?: string[];
}) {
  return (
    <TooltipPrimitive.Root {...props}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipContent side={side} align={align}>
        <span className="flex items-center gap-2">
          {content}
          {shortcut && (
            <span className="-me-1 flex items-center gap-0.5">
              {shortcut.map((key) => (
                <kbd
                  key={key}
                  className="inline-flex h-4 min-w-4 items-center justify-center rounded-[3px] bg-[color-mix(in_oklab,currentColor,transparent_84%)] px-1 font-sans text-[0.625rem] leading-none"
                >
                  {key}
                </kbd>
              ))}
            </span>
          )}
        </span>
      </TooltipContent>
    </TooltipPrimitive.Root>
  );
}
