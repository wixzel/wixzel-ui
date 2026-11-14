import { Slot } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../lib/cn";
import { slottable } from "../lib/slot";
import { useLabels } from "./labels";

/**
 * A product's cover in a squircle frame of a fixed shape, so a grid of covers
 * lines up whatever their source size. The image goes in as the child and
 * fills the frame (a router's image with `fill`, or an <img>). With no image
 * the frame shows the fallback, such as the product's initial, on a soft tint.
 */
export function ProductCover({
  ratio = "590 / 300",
  fallback,
  className,
  children,
  style,
  ...props
}: ComponentProps<"div"> & {
  /** Width over height, as CSS aspect-ratio takes it. */
  ratio?: string;
  /** Shown when there is no image. */
  fallback?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative isolate grid place-items-center overflow-hidden rounded-md bg-bg-muted",
        "[&>img]:absolute [&>img]:inset-0 [&>img]:size-full [&>img]:object-cover",
        className,
      )}
      style={{ aspectRatio: ratio, ...style }}
      {...props}
    >
      {children ?? (
        <span aria-hidden className="text-heading-xl font-bold text-fg-disabled select-none">
          {fallback}
        </span>
      )}
    </div>
  );
}

/**
 * A price in a product's currency, from an amount in minor units (cents), as
 * payment APIs keep money. Tabular, so prices line up in a column. A null
 * amount reads "Price on request"; `from` marks the lowest of several tiers.
 */
export function Price({
  amount,
  currency = "USD",
  locale = "en-US",
  from,
  size = "md",
  className,
  ...props
}: Omit<ComponentProps<"span">, "children"> & {
  /** Minor units: 4900 is $49.00. */
  amount: number | null;
  currency?: string;
  locale?: string;
  /** Prefix "From", for the lowest of several prices. */
  from?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const labels = useLabels();
  if (amount == null) {
    return (
      <span className={cn("text-caption font-medium text-fg-muted", className)} {...props}>
        {labels.priceOnRequest}
      </span>
    );
  }
  const text = new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount / 100);
  return (
    <span className={cn("inline-flex items-baseline gap-1 whitespace-nowrap", className)} {...props}>
      {from && <span className="text-caption font-medium text-fg-subtle">{labels.priceFrom}</span>}
      <span
        className={cn(
          "font-bold tabular-nums tracking-tight",
          size === "sm" && "text-body-sm",
          size === "md" && "text-heading-sm",
          size === "lg" && "text-heading-lg",
        )}
      >
        {text}
      </span>
    </span>
  );
}

/**
 * One product in a storefront grid: the cover, the product's icon and name,
 * who made it, the price on the end, a line or two of tagline and a quiet meta
 * line (category, sales). Pass a Link as the child with `asChild` and the whole
 * card goes there, darkening a shade on hover and shrinking a little on press.
 *
 * With `actions` (an owner's Edit, Analytics) the card itself stays put: the
 * preview is the link and the actions sit in a footer band under it.
 */
export function ProductCard({
  cover,
  coverFallback,
  icon,
  title,
  byline,
  price,
  badge,
  description,
  meta,
  actions,
  asChild,
  className,
  children,
  ...props
}: Omit<ComponentProps<"div">, "title"> & {
  /** The cover image, filling the frame. */
  cover?: ReactNode;
  /** What the frame shows without a cover, such as the initial. */
  coverFallback?: ReactNode;
  /** The product's own icon, shown beside its name. */
  icon?: ReactNode;
  title: ReactNode;
  /** Who made it: "by Wixzel". */
  byline?: ReactNode;
  /** A <Price>, or anything on the end of the title row. */
  price?: ReactNode;
  /** A status over the cover's corner, such as Showcase or Draft. */
  badge?: ReactNode;
  description?: ReactNode;
  /** Short facts, joined by dots. */
  meta?: ReactNode[];
  actions?: ReactNode;
  /** The child (a router's Link) becomes the card, or the preview when there are actions. */
  asChild?: boolean;
}) {
  const facts = meta?.filter((m) => m != null && m !== false && m !== "");
  const body = (content: ReactNode) => (
    <>
      <div className="relative">
        <ProductCover fallback={coverFallback}>{cover}</ProductCover>
        {badge && <div className="absolute start-2 top-2 flex gap-1">{badge}</div>}
      </div>
      <div className="flex flex-col gap-1.5 px-2 pt-3 pb-2">
        <div className="flex items-center gap-2.5">
          {icon && (
            <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-sm bg-surface [&>img]:size-full [&>img]:object-cover">
              {icon}
            </span>
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            <h3 className="truncate text-heading-sm">{title}</h3>
            {byline && <p className="flex min-w-0 items-center gap-1 truncate text-caption text-fg-muted [&_svg]:size-3 [&_svg]:shrink-0">{byline}</p>}
          </div>
          {price && <div className="shrink-0 ps-1">{price}</div>}
        </div>
        {description && <p className="line-clamp-2 text-body-sm text-fg-muted">{description}</p>}
        {facts && facts.length > 0 && (
          <p className="flex min-w-0 items-center gap-1.5 text-caption text-fg-subtle [&_svg]:size-3.5 [&_svg]:shrink-0">
            {facts.map((fact, i) => (
              <span key={i} className={cn("flex min-w-0 items-center gap-1.5", i > 0 && "shrink-0")}>
                {i > 0 && <span aria-hidden>·</span>}
                <span className="flex min-w-0 items-center gap-1 truncate">{fact}</span>
              </span>
            ))}
          </p>
        )}
        {content}
      </div>
    </>
  );

  const pressable = [
    "flex flex-col rounded-lg p-1.5 text-fg wx-focus",
    "transition-[background-color,scale] duration-(--wx-duration-move) ease-move",
    "hover:bg-[color-mix(in_oklab,var(--wx-color-card),var(--wx-color-fg)_4%)] active:scale-[0.99] active:duration-(--wx-duration-instant)",
  ];

  if (actions) {
    const Preview = asChild ? Slot.Root : "div";
    return (
      <div className={cn("flex flex-col rounded-lg bg-card", className)} {...props}>
        <Preview className={cn(asChild && pressable, !asChild && "flex flex-col p-1.5")}>
          {slottable(asChild, children, body)}
        </Preview>
        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border px-3.5 py-2.5">{actions}</div>
      </div>
    );
  }

  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp className={cn("bg-card", asChild ? pressable : "flex flex-col rounded-lg p-1.5", className)} {...props}>
      {slottable(asChild, children, body)}
    </Comp>
  );
}

/**
 * One order, purchase or sale in a list: the product's icon, what it is, the
 * facts under it, the amount and the actions on the end. Anything passed as
 * children (a licence key, a version picker) sits in a band underneath. On a
 * phone the actions wrap under the text.
 */
export function OrderLine({
  icon,
  title,
  description,
  aside,
  actions,
  className,
  children,
  ...props
}: Omit<ComponentProps<"div">, "title"> & {
  icon?: ReactNode;
  title: ReactNode;
  /** Facts under the title: licence, date, version. */
  description?: ReactNode;
  /** A <Price> or a status badge, before the actions. */
  aside?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col rounded-lg bg-card", className)} {...props}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5 p-3.5">
        {icon && (
          <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-md bg-surface text-fg-muted [&>img]:size-full [&>img]:object-cover [&>svg]:size-5">
            {icon}
          </span>
        )}
        <div className="flex min-w-0 flex-1 basis-48 flex-col gap-0.5">
          <div className="truncate text-body-md font-semibold">{title}</div>
          {description && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-fg-muted">{description}</div>
          )}
        </div>
        {(aside || actions) && (
          <div className="flex shrink-0 flex-wrap items-center gap-2 max-sm:w-full max-sm:justify-between">
            {aside}
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </div>
        )}
      </div>
      {children && <div className="flex flex-col gap-3 border-t border-border px-3.5 py-3">{children}</div>}
    </div>
  );
}
