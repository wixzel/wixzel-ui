import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Monitor,
  Moon,
  Sun,
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  List,
  X,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import { Dialog as DialogPrimitive, Slot } from "radix-ui";
import { type ComponentProps, type ReactNode, useEffect, useState } from "react";
import { brand, type BrandProduct, listedProducts, socials } from "../brand";
import { cn } from "../lib/cn";
import { slottable } from "../lib/slot";
import { buttonVariants } from "../recipes/button";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./layout";
import { ThemeScope } from "./scope";
import { type Theme, useTheme } from "./provider";

/**
 * The marketing side of a Wixzel product: the pages people read before they
 * sign in. Those pages carry the recognition, so they are built from the same
 * pieces in the same order on every product site — the same lockup in the same
 * corner, the same switcher listing the family, the same page measure, the same
 * section rhythm, the same footer. Only the colour changes, from
 * `data-product` on <html>, and with it the whole page.
 *
 * A product site never restyles these. If it needs a section this file lacks,
 * this file gets it.
 */

/** The page measure. Every band on every site lines up to it. */
export function SiteContainer({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[75rem] px-5 sm:px-8", className)} {...props} />;
}

// ------------------------------------------------------------------ Wordmark

/**
 * The lockup in type, for a product with no logo asset of its own: the company
 * in full ink, the product beside it in the product's own ink. A product that
 * HAS a logo passes that to SiteHeader's `brand` instead — this is the
 * fallback, not the standard.
 *
 * Pass the product's name; with none it is the master brand alone. `asChild`
 * makes a link the whole lockup, which is what a header does.
 */
export function Wordmark({
  product,
  name,
  size = "md",
  mark,
  asChild,
  className,
  children,
  ...props
}: ComponentProps<"span"> & {
  /** The part after "Wixzel": "Voice" reads "Wixzel Voice", in the product's own ink. */
  product?: string;
  /** A product with a name of its own: "Feedkraft", "IntelliCallAI". Stands alone, without "Wixzel". */
  name?: string;
  size?: "sm" | "md" | "lg";
  /** The product's glyph, before the words. Optional: colour carries the brand, not a mark. */
  mark?: ReactNode;
  /** Render the child as the lockup, such as the link home in a header. */
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "span";
  const lockup = (
    <>
      {mark && (
        <span
          aria-hidden
          className={cn(
            "grid shrink-0 place-items-center rounded-sm bg-accent-subtle text-accent-ink",
            size === "sm" ? "size-6 [&_svg]:size-4" : size === "md" ? "size-7 [&_svg]:size-4.5" : "size-9 [&_svg]:size-5",
          )}
        >
          {mark}
        </span>
      )}
      <span className="font-bold tracking-[-0.03em]">
        {name ?? (
          <>
            {brand.name}
            {product && <span className="text-accent-ink">{` ${product}`}</span>}
          </>
        )}
      </span>
    </>
  );
  return (
    <Comp
      className={cn(
        "inline-flex items-center gap-2 font-sans whitespace-nowrap text-fg wx-focus",
        "transition-opacity duration-(--wx-duration-fast) hover:opacity-80",
        size === "sm" && "text-heading-sm",
        size === "md" && "text-heading-md",
        size === "lg" && "text-heading-lg",
        className,
      )}
      {...props}
    >
      {/* With asChild the child (a Link) becomes the lockup and the words go inside it. */}
      {slottable(asChild, children, () => lockup)}
    </Comp>
  );
}

// ------------------------------------------------------------ ProductSwitcher

/**
 * The family, one menu away from every page. A dot in each product's own
 * accent, its name and its line, all read from the brand directory, so the
 * list is the same list on every site and a new product appears on all of
 * them at once. The product you are on is marked and does not link away.
 */
export function ProductSwitcher({
  current,
  label = "Products",
  items = listedProducts,
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, "children"> & {
  /** This site's own name, exactly as the directory writes it ("Wixzel Voice"), so its row reads as the current one. */
  current?: string;
  label?: ReactNode;
  items?: readonly BrandProduct[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={className} {...props}>
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80 p-1.5">
        <DropdownMenuLabel>{`Wixzel products`}</DropdownMenuLabel>
        {items.map((item) => {
          const here = item.name === current;
          return (
            <a
              key={item.name}
              href={here ? undefined : item.href}
              aria-current={here ? "page" : undefined}
              className={cn(
                "group/row flex items-start gap-2.5 rounded-md p-2 outline-none",
                "transition-colors duration-(--wx-duration-fast)",
                here ? "bg-bg-muted" : "hover:bg-bg-muted focus-visible:bg-bg-muted",
              )}
            >
              {/* The dot is the product's accent: the switcher is a row of the family's colours. */}
              <ThemeScope product={item.product} asChild>
                <span aria-hidden className="mt-1 size-2.5 shrink-0 rounded-full bg-accent" />
              </ThemeScope>
              <span className="flex min-w-0 flex-col">
                <span className="flex items-center gap-1 text-body-sm font-medium">
                  {item.name}
                  {here ? (
                    <span className="text-caption font-normal text-fg-subtle">{` — you are here`}</span>
                  ) : (
                    <ArrowUpRight
                      aria-hidden
                      className="size-3.5 -translate-x-0.5 text-fg-subtle opacity-0 transition-[opacity,translate] duration-(--wx-duration-move) ease-move group-hover/row:translate-x-0 group-hover/row:opacity-100"
                    />
                  )}
                </span>
                <span className="text-caption text-fg-muted">{item.tagline}</span>
              </span>
            </a>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---------------------------------------------------------------- SiteHeader

/**
 * The header every product site wears: the lockup on the start, the product's
 * own links in the middle, sign in and the primary action on the end. It sits
 * on the page with no line until you scroll, then a hairline fades in under
 * it and the band goes translucent. On a phone the links move into a sheet.
 */
export function SiteHeader({
  brand: lockup,
  nav,
  navPlacement = "center",
  sheetFooter,
  actions,
  labels,
  className,
  ...props
}: Omit<ComponentProps<"header">, "children"> & {
  /**
   * The lockup: the product's own logo, linking home. Pass the asset from the
   * site's public folder, swapped for the theme. Use <Wordmark> only where a
   * product has no logo to show — a site that has one and sets type instead
   * has thrown away the thing people recognise it by.
   */
  brand: ReactNode;
  /** The product's links, as <SiteNavLink>s. They also fill the phone sheet. */
  nav?: ReactNode;
  /**
   * Where the nav sits on the band. "center" everywhere, except on a site
   * whose cluster carries a search box or a value chip — Store today — where
   * "start" puts it beside the lockup, because a short nav centred against
   * that much weight on the end reads as a mistake rather than as a centre.
   */
  navPlacement?: "center" | "start";
  /** The bottom of the phone sheet: the preferences, and links that live there alone. */
  sheetFooter?: ReactNode;
  /** Sign in, and the one primary action. */
  actions?: ReactNode;
  /** The words the header writes itself. A localized site passes its own. */
  labels?: Partial<typeof headerLabels>;
}) {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const words = { ...headerLabels, ...labels };
  return (
    <header
      data-scrolled={scrolled || undefined}
      className={cn(
        // A tinted plane, not a floating pill: no glass, no shadow, nothing to look at
        // until the page moves under it and a hairline appears.
        "sticky top-0 z-(--wx-z-sticky) transition-[background-color,box-shadow] duration-(--wx-duration-base)",
        scrolled &&
          "bg-[color-mix(in_oklab,var(--wx-color-bg),transparent_25%)] shadow-[0_1px_0_var(--wx-color-border)] backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      <SiteContainer className="flex h-18 items-center gap-3">
        {lockup}
        {/* Centred in the room the two ends leave it, not on the page: fixed
            columns would reserve the cluster's width on the empty side too,
            and a heavy cluster would squeeze the nav until it clipped. The
            band carries the nav only while it fits whole — below 1280px the
            whole thing moves into the sheet rather than shrinking. */}
        {nav && (
          <nav
            aria-label={words.nav}
            className={cn(
              "hidden min-w-0 items-center gap-0.5 xl:flex",
              navPlacement === "center" ? "mx-auto" : "ms-2 me-auto",
            )}
          >
            {nav}
          </nav>
        )}
        {/* ms-auto in both placements: below 1280px the nav is hidden, so its
            own me-auto pushes nothing and the cluster would sit against the
            lockup. Beside a "start" nav the two auto margins share one gap,
            so the band on a desktop is unchanged. */}
        <div className="ms-auto flex items-center gap-2">
          {actions}
          {nav && (
            <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
              <DialogPrimitive.Trigger
                aria-label={words.menu}
                className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "xl:hidden")}
              >
                <List />
              </DialogPrimitive.Trigger>
              <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-(--wx-z-overlay) bg-overlay data-[state=closed]:animate-wx-fade-out data-[state=open]:animate-wx-fade-in xl:hidden" />
                <DialogPrimitive.Content className="wx-plane-overlay fixed inset-x-3 top-3 z-(--wx-z-modal) flex max-h-[calc(100dvh-1.5rem)] flex-col gap-1 overflow-y-auto rounded-lg bg-surface-overlay p-3 shadow-xl outline-none data-[state=closed]:animate-wx-pop-out data-[state=open]:animate-wx-pop-in xl:hidden">
                  <div className="flex items-center justify-between gap-3 px-1 pb-2">
                    <DialogPrimitive.Title className="text-body-sm font-medium text-fg-muted">{words.menu}</DialogPrimitive.Title>
                    <DialogPrimitive.Close aria-label={words.close} className={buttonVariants({ variant: "ghost", size: "icon-sm" })}>
                      <X />
                    </DialogPrimitive.Close>
                  </div>
                  {/* The same links, one per row: a phone gets the whole nav, not a shortened one.
                      Choosing one closes the sheet: a route would unmount it anyway, but an
                      in-page anchor would leave it sitting over the section it just scrolled to. */}
                  <nav
                    aria-label={words.nav}
                    onClick={(event) => {
                      if ((event.target as HTMLElement).closest("a,button")) setOpen(false);
                    }}
                    className="flex flex-col gap-0.5 [&>*]:h-11 [&>*]:justify-start [&>*]:text-body-md"
                  >
                    {nav}
                  </nav>
                  {sheetFooter && (
                    <div
                      onClick={(event) => {
                        // A menu inside the sheet (the theme, the locales) keeps it open;
                        // a link or a plain button is a destination, so the sheet gets out of the way.
                        const hit = (event.target as HTMLElement).closest("a,button");
                        if (hit && !hit.closest("[data-slot='dropdown-menu-trigger'],[aria-haspopup]")) setOpen(false);
                      }}
                      className="mt-2 flex flex-col gap-1 border-t border-border pt-2"
                    >
                      {sheetFooter}
                    </div>
                  )}
                </DialogPrimitive.Content>
              </DialogPrimitive.Portal>
            </DialogPrimitive.Root>
          )}
        </div>
      </SiteContainer>
    </header>
  );
}

/** What the header says for itself, in English. A localized site passes its own through `labels`. */
export const headerLabels = {
  /** The accessible name of the navigation landmark. */
  nav: "Primary",
  /** The phone menu's button and its title. */
  menu: "Menu",
  close: "Close",
};

/** A header link. The page you are on is inked, the way the current tab and nav item are inside the app. */
export function SiteNavLink({
  current,
  asChild,
  className,
  children,
  ...props
}: ComponentProps<"a"> & { current?: boolean; asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      aria-current={current ? "page" : undefined}
      className={cn(
        "inline-flex h-control-sm items-center gap-1.5 rounded-md px-2.5 text-body-sm font-medium wx-focus",
        "transition-colors duration-(--wx-duration-fast)",
        current ? "bg-fg text-fg-inverse" : "text-fg-muted hover:bg-bg-muted hover:text-fg",
        className,
      )}
      {...props}
    >
      {slottable(asChild, children)}
    </Comp>
  );
}

/** True once the page has moved off the top. Drives the header's hairline. */
function useScrolled(at = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const read = () => setScrolled(window.scrollY > at);
    read();
    window.addEventListener("scroll", read, { passive: true });
    return () => window.removeEventListener("scroll", read);
  }, [at]);
  return scrolled;
}

// ------------------------------------------------------------------- Sections

/**
 * One band of a marketing page, and the rhythm every site keeps: the same
 * vertical room, the same measure, the same heading block. The tone picks
 * which plane the band sits on — tinted planes, never lines.
 */
export function SiteSection({
  eyebrow,
  title,
  description,
  actions,
  align = "start",
  tone = "page",
  className,
  children,
  ...props
}: Omit<ComponentProps<"section">, "title"> & {
  /** A short uppercase line above the title. */
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  align?: "start" | "center";
  /** page: the page itself. subtle: a quiet band. ink: the page's colour reversed, for a break. */
  tone?: "page" | "subtle" | "ink";
}) {
  const inked = tone === "ink";
  return (
    <ThemeScope
      asChild
      // An inked band flips the whole region, so everything inside it — buttons,
      // cards, a menu opened in it — comes back readable on its own.
      theme={inked ? "dark" : undefined}
    >
      <section
        className={cn(
          "py-16 sm:py-24",
          tone === "subtle" && "bg-bg-subtle",
          inked && "bg-bg text-fg",
          className,
        )}
        {...props}
      >
        <SiteContainer className="flex flex-col gap-10">
          {(eyebrow || title || description || actions) && (
            <header
              className={cn(
                "flex flex-col gap-3",
                align === "center" && "items-center text-center",
              )}
            >
              {eyebrow && <p className="text-overline uppercase text-accent-ink">{eyebrow}</p>}
              {title && <h2 className="max-w-[28ch] text-balance text-heading-xl sm:text-display-md">{title}</h2>}
              {description && (
                <p className="max-w-[58ch] text-pretty text-body-lg text-fg-muted">{description}</p>
              )}
              {actions && <div className="mt-2 flex flex-wrap items-center gap-2.5">{actions}</div>}
            </header>
          )}
          {children}
        </SiteContainer>
      </section>
    </ThemeScope>
  );
}

/**
 * The first screen: an eyebrow, the one sentence the product is, a line of
 * explanation, the two actions, and the product itself on the end or below.
 * The page's colour washes in behind it, quietly.
 */
export function Hero({
  eyebrow,
  title,
  trail,
  description,
  actions,
  note,
  aside,
  align = aside ? "start" : "center",
  className,
  children,
  ...props
}: Omit<ComponentProps<"section">, "title"> & {
  eyebrow?: ReactNode;
  /** The line that lands first. Few words: "Any model." */
  title: ReactNode;
  /** The quieter second line: "Any carrier." Never a third. */
  trail?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** The small print under the actions: "No card. 100 free minutes." */
  note?: ReactNode;
  /** A screenshot or demo. With one the hero splits in two from `lg`. */
  aside?: ReactNode;
  align?: "start" | "center";
}) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-24",
        className,
      )}
      {...props}
    >
      {/* The wash: the product's accent, almost gone, fading out before the next band. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(70%_60%_at_50%_0%,color-mix(in_oklab,var(--wx-color-accent-subtle),transparent_25%),transparent_75%)]"
      />
      <SiteContainer
        className={cn(
          "flex flex-col gap-12",
          aside && "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14",
        )}
      >
        <div
          className={cn(
            "flex animate-wx-rise-in flex-col gap-5",
            align === "center" && "items-center text-center",
          )}
        >
          {eyebrow && <div className="flex">{eyebrow}</div>}
          <Headline as="h1" size="lg" lead={title} trail={trail} />
          {description && (
            <p className="max-w-[54ch] text-pretty text-body-lg text-fg-muted">{description}</p>
          )}
          {actions && (
            <div className={cn("mt-1 flex flex-wrap items-center gap-2.5", align === "center" && "justify-center")}>
              {actions}
            </div>
          )}
          {note && <p className="text-caption text-fg-subtle">{note}</p>}
          {children}
        </div>
        {aside}
      </SiteContainer>
    </section>
  );
}

/**
 * A pill above the hero's title: what is new, or what the product is in three
 * words. A quiet panel, the accent only on its dot or icon.
 */
export function HeroEyebrow({
  icon,
  asChild,
  className,
  children,
  ...props
}: ComponentProps<"span"> & { icon?: ReactNode; asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";
  return (
    <Comp
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full bg-card px-3 text-caption font-medium text-fg-muted wx-focus",
        "transition-colors duration-(--wx-duration-fast)",
        asChild && "hover:bg-bg-muted hover:text-fg",
        className,
      )}
      {...props}
    >
      {slottable(asChild, children, (content) => (
        <>
          {icon ? (
            <span className="text-accent-ink [&_svg]:size-3.5">{icon}</span>
          ) : (
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
          )}
          {content}
        </>
      ))}
    </Comp>
  );
}

/**
 * A product screenshot, framed: a tinted panel with the image inset on its
 * own surface, so a screenshot of any size sits on the page the same way. No
 * perspective, no glass, no browser chrome drawn around it.
 */
export function ScreenFrame({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "animate-wx-rise-in rounded-xl bg-card p-2 shadow-[0_0_0_1px_var(--wx-color-border)]",
        className,
      )}
      {...props}
    >
      <div className="overflow-hidden rounded-lg bg-surface [&_img]:block [&_img]:h-auto [&_img]:w-full [&_video]:block [&_video]:w-full">
        {children}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ Features

/** A grid of features. Three across by default, two on a tablet, one on a phone. */
export function FeatureGrid({
  columns = 3,
  className,
  ...props
}: ComponentProps<"div"> & { columns?: 2 | 3 | 4 }) {
  return (
    <div
      className={cn(
        "grid gap-3 sm:grid-cols-2",
        columns === 3 && "lg:grid-cols-3",
        columns === 4 && "lg:grid-cols-4",
        className,
      )}
      {...props}
    />
  );
}

/** One feature: an icon tile, what it is, and what it does for you. A panel, not a box. */
export function Feature({
  icon,
  title,
  className,
  children,
  ...props
}: Omit<ComponentProps<"div">, "title"> & { icon?: ReactNode; title: ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-lg bg-card p-5", className)} {...props}>
      {icon && (
        <span className="grid size-9 place-items-center rounded-md bg-accent-subtle text-accent-ink [&_svg]:size-5">
          {icon}
        </span>
      )}
      <h3 className="text-heading-sm text-balance">{title}</h3>
      <p className="text-pretty text-body-sm text-fg-muted">{children}</p>
    </div>
  );
}

/** The numbers that matter, side by side on one band. Tabular, so they line up. */
export function StatBand({ className, ...props }: ComponentProps<"dl">) {
  return (
    <dl
      className={cn(
        "grid gap-px overflow-hidden rounded-lg bg-border sm:grid-cols-2 lg:grid-cols-4",
        "[&>div]:flex [&>div]:flex-col [&>div]:gap-1 [&>div]:bg-card [&>div]:p-5",
        className,
      )}
      {...props}
    />
  );
}

export function Stat({ label, value, className, ...props }: ComponentProps<"div"> & { label: ReactNode; value: ReactNode }) {
  return (
    <div className={className} {...props}>
      <dd className="text-heading-xl tabular-nums">{value}</dd>
      <dt className="text-body-sm text-fg-muted">{label}</dt>
    </div>
  );
}

/**
 * What a customer said, on a tinted panel: the words first and large, the
 * person under them. No portrait wall, no logo grid behind it.
 */
export function Quote({
  author,
  role,
  avatar,
  className,
  children,
  ...props
}: ComponentProps<"figure"> & { author: ReactNode; role?: ReactNode; avatar?: ReactNode }) {
  return (
    <figure className={cn("flex flex-col gap-5 rounded-lg bg-card p-6", className)} {...props}>
      <blockquote className="text-pretty text-heading-sm font-normal leading-relaxed">{children}</blockquote>
      <figcaption className="flex items-center gap-2.5">
        {avatar}
        <span className="flex flex-col">
          <span className="text-body-sm font-medium">{author}</span>
          {role && <span className="text-caption text-fg-muted">{role}</span>}
        </span>
      </figcaption>
    </figure>
  );
}

/** The quiet row of customer or integration logos. Ink, not colour, so it never competes. */
export function LogoWall({ label, className, children, ...props }: ComponentProps<"div"> & { label?: ReactNode }) {
  return (
    <div className={cn("flex flex-col items-center gap-5", className)} {...props}>
      {label && <p className="text-overline uppercase text-fg-subtle">{label}</p>}
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 text-fg-muted [&_img]:h-6 [&_img]:w-auto [&_img]:opacity-70 [&_svg]:h-6 [&_svg]:w-auto">
        {children}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------- Pricing

/** The tiers, side by side on one row, the recommended one marked. */
export function PricingGrid({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("grid items-start gap-3 lg:grid-cols-3", className)} {...props} />;
}

/**
 * One plan: what it is called, what it costs, who it is for, what you get,
 * and the one action. The recommended plan takes the accent wash and a solid
 * accent ring, the same way a selected card does in the app.
 */
export function PricingTier({
  name,
  price,
  period,
  description,
  features,
  action,
  featured,
  badge = "Recommended",
  className,
  children,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  name: ReactNode;
  /** The amount, already formatted: "$29", "Free", "Let's talk". */
  price: ReactNode;
  /** What the amount is per: "per month". */
  period?: ReactNode;
  description?: ReactNode;
  /** What you get, one line each. */
  features?: readonly ReactNode[];
  action?: ReactNode;
  featured?: boolean;
  badge?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-5 rounded-lg p-6",
        featured ? "bg-accent-subtle shadow-[0_0_0_2px_var(--wx-color-accent-edge)]" : "bg-card",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-heading-sm">{name}</h3>
          {featured && badge && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-caption font-medium text-accent-fg">{badge}</span>
          )}
        </div>
        <p className="flex items-baseline gap-1.5">
          <span className="text-display-md tabular-nums">{price}</span>
          {period && <span className="text-body-sm text-fg-muted">{period}</span>}
        </p>
        {description && <p className="text-pretty text-body-sm text-fg-muted">{description}</p>}
      </div>
      {action}
      {features && features.length > 0 && (
        <ul className="flex flex-col gap-2.5">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-body-sm">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-ink" />
              <span className="text-fg-muted">{feature}</span>
            </li>
          ))}
        </ul>
      )}
      {children}
    </div>
  );
}

// ----------------------------------------------------------------------- CTA

/**
 * The band at the end of a page: one line, one action. Inked by default — the
 * page's own colour reversed — so it reads as the end without a new colour.
 */
export function CtaBand({
  title,
  description,
  actions,
  tone = "ink",
  className,
  ...props
}: Omit<ComponentProps<"section">, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  tone?: "ink" | "accent";
}) {
  const accent = tone === "accent";
  return (
    <ThemeScope asChild theme={accent ? undefined : "dark"}>
      <section className={cn("py-16 sm:py-20", accent ? "bg-accent-subtle" : "bg-bg", className)} {...props}>
        <SiteContainer className="flex flex-col items-center gap-5 text-center">
          <h2 className="max-w-[28ch] text-balance text-heading-xl sm:text-display-md">{title}</h2>
          {description && <p className="max-w-[52ch] text-pretty text-body-lg text-fg-muted">{description}</p>}
          {actions && <div className="mt-1 flex flex-wrap items-center justify-center gap-2.5">{actions}</div>}
        </SiteContainer>
      </section>
    </ThemeScope>
  );
}

// -------------------------------------------------------------------- Footer

/**
 * The footer every product site wears, and the other half of the recognition:
 * the product's own columns, then the family — every other Wixzel product,
 * each with its own colour — then the legal line. A visitor who came for one
 * product leaves knowing there are eight.
 */
export function SiteFooter({
  logo,
  lede,
  preferences,
  legal,
  socialLinks = socials,
  className,
  children,
  ...props
}: ComponentProps<"footer"> & {
  /**
   * The company's own logo, which every product site ends with — the way an
   * Xbox page ends with Microsoft's. The product named itself in the header;
   * the foot of the page says whose it is. Pass the asset from the site's
   * public folder (wixzel_white.png on a dark theme, wixzel_black.png on a
   * light one); the library frames it and never recolours it.
   */
  logo?: ReactNode;
  /**
   * A line above the columns: the product's own wordmark and the sentence it
   * leads its footer with. The band below carries the company, so this is the
   * product's place to speak.
   */
  lede?: ReactNode;
  /** Theme and, where a site has them, locales: the same controls as the header. */
  preferences?: ReactNode;
  /** Privacy, Terms, Trademarks — the few links that sit beside the copyright. */
  legal?: ReactNode;
  /** The company's accounts. Products do not substitute their own. */
  socialLinks?: readonly { name: string; href: string }[];
}) {
  // One wording on every Wixzel site: the company's name, never the product's.
  const year = new Date().getFullYear();
  return (
    <footer className={cn("bg-bg-subtle py-14", className)} {...props}>
      <SiteContainer className="flex flex-col">
        {/* The site's own columns lead; the company signs off underneath. */}
        {lede && <div className="mb-10 flex flex-col gap-3">{lede}</div>}
        {children && <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{children}</div>}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-border pt-6">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {logo && (
              <a href={brand.href} aria-label={brand.name} className="flex shrink-0 rounded-sm wx-focus [&_img]:h-5.5 [&_img]:w-auto">
                {logo}
              </a>
            )}
            {preferences}
            {socialLinks.length > 0 && (
              <span className="flex items-center gap-0.5">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    aria-label={s.name}
                    className="grid size-8 place-items-center rounded-md text-fg-muted wx-focus transition-colors duration-(--wx-duration-fast) hover:bg-bg-muted hover:text-fg [&_svg]:size-4.5"
                  >
                    {socialIcons[s.name] ?? s.name}
                  </a>
                ))}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-fg-subtle">
            {legal}
            <p>{`© ${year} ${brand.name}. All rights reserved.`}</p>
          </div>
        </div>
      </SiteContainer>
    </footer>
  );
}

/** Phosphor's brand marks, drawn at their own weight: a logo is not a duotone icon. */
const socialIcons: Record<string, ReactNode> = {
  X: <XLogo weight="regular" />,
  GitHub: <GithubLogo weight="regular" />,
  LinkedIn: <LinkedinLogo weight="regular" />,
  Instagram: <InstagramLogo weight="regular" />,
  YouTube: <YoutubeLogo weight="regular" />,
};

/** One column of footer links: a label and the links under it. */
export function FooterColumn({ label, className, children, ...props }: ComponentProps<"div"> & { label: ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      <p className="text-overline uppercase text-fg-subtle">{label}</p>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

/** A footer link. Quiet until you point at it. */
export function FooterLink({ asChild, className, children, ...props }: ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <li>
      <Comp
        className={cn(
          "rounded-sm text-body-sm text-fg-muted wx-focus transition-colors duration-(--wx-duration-fast) hover:text-fg",
          className,
        )}
        {...props}
      >
        {slottable(asChild, children)}
      </Comp>
    </li>
  );
}

/**
 * The link that ends a page of prose and the one in a feature card: the
 * accent as text, with the arrow sliding forward as you point at it.
 */
export function TextLink({ asChild, className, children, ...props }: ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      className={cn(
        "group/textlink inline-flex items-center gap-1 rounded-sm text-body-sm font-medium text-accent-ink wx-focus",
        className,
      )}
      {...props}
    >
      {slottable(asChild, children, (content) => (
        <>
          {content}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-(--wx-duration-move) ease-move group-hover/textlink:translate-x-0.5"
          />
        </>
      ))}
    </Comp>
  );
}

// ----------------------------------------------------------------------- FAQ

/**
 * The questions every product site answers at the bottom of a page. Rows on
 * one tinted panel, opening in place, as the app's Accordion does — so the FAQ
 * is not a second accordion invented per site.
 */
export function FaqList({
  items,
  className,
  ...props
}: {
  items: readonly { question: ReactNode; answer: ReactNode }[];
  className?: string;
  /** Open one question when the page loads: its index. */
  defaultValue?: string;
}) {
  return (
    <Accordion type="single" collapsible className={cn("flex flex-col", className)} {...props}>
      {items.map((item, i) => (
        <AccordionItem key={i} value={`q${i}`}>
          <AccordionTrigger className="text-body-md">{item.question}</AccordionTrigger>
          <AccordionContent className="max-w-[70ch] text-body-sm text-fg-muted">{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

// ------------------------------------------------------- Docs and long pages

/**
 * The shape of every page that is a list of pages: docs, guides, the policies.
 * A tinted sidebar beside a lighter page with no line between them, exactly as
 * the app's AppShell does it, so documentation feels like the product it
 * documents. The sidebar sticks under the header and collapses to a sheet on
 * a phone.
 */
export function SiteSidebarLayout({
  sidebar,
  className,
  children,
  ...props
}: ComponentProps<"div"> & { sidebar: ReactNode }) {
  return (
    <SiteContainer
      className={cn("flex flex-col gap-10 py-10 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12", className)}
      {...props}
    >
      <div className="lg:sticky lg:top-24 lg:self-start">{sidebar}</div>
      <div className="min-w-0">{children}</div>
    </SiteContainer>
  );
}

/** The nav column of a docs or policy page: a tinted panel, scrolling on its own when it is long. */
export function SiteSidebar({ className, ...props }: ComponentProps<"nav">) {
  return (
    <nav
      className={cn(
        "flex flex-col gap-6 rounded-lg bg-card p-4 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto",
        className,
      )}
      {...props}
    />
  );
}

/** A group of sidebar links under a quiet label. */
export function SiteSidebarSection({
  label,
  className,
  children,
  ...props
}: ComponentProps<"div"> & { label?: ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      {label && <p className="px-2 pb-1 text-overline uppercase text-fg-subtle">{label}</p>}
      {children}
    </div>
  );
}

/** A sidebar link. The page you are on is inked, as it is in the app's sidebar. */
export function SiteSidebarLink({
  current,
  asChild,
  className,
  children,
  ...props
}: ComponentProps<"a"> & { current?: boolean; asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      aria-current={current ? "page" : undefined}
      className={cn(
        "flex min-h-8 items-center gap-2 rounded-sm px-2 text-body-sm wx-focus",
        "transition-colors duration-(--wx-duration-fast)",
        current ? "bg-fg font-medium text-fg-inverse" : "text-fg-muted hover:bg-bg-muted hover:text-fg",
        className,
      )}
      {...props}
    >
      {slottable(asChild, children)}
    </Comp>
  );
}

/**
 * Long-form text: a guide, a changelog entry, a policy. One measure, the
 * heading scale the rest of the system uses, and links in the product's ink,
 * so a terms page is recognisably the same company as the home page.
 */
export function Prose({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "max-w-[72ch] text-body-md text-fg-muted",
        "[&>*+*]:mt-4",
        "[&_h2]:mt-10 [&_h2]:text-heading-lg [&_h2]:text-fg [&_h3]:mt-8 [&_h3]:text-heading-sm [&_h3]:text-fg",
        "[&_p]:text-pretty [&_strong]:font-semibold [&_strong]:text-fg",
        "[&_a]:text-accent-ink [&_a]:underline [&_a]:decoration-[color-mix(in_oklab,currentColor,transparent_65%)] [&_a]:underline-offset-[3px] [&_a:hover]:decoration-current",
        "[&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:ps-5 [&_ul]:list-disc [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:ps-5 [&_ol]:list-decimal",
        "[&_code]:rounded-xs [&_code]:bg-bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.875em]",
        "[&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-card [&_pre]:p-4 [&_pre]:text-body-sm [&_pre_code]:bg-transparent [&_pre_code]:p-0",
        "[&_hr]:border-border [&_blockquote]:border-s-2 [&_blockquote]:border-accent-edge [&_blockquote]:ps-4",
        className,
      )}
      {...props}
    />
  );
}

// ------------------------------------------------------- Show, don't explain

/**
 * Everything below is the visual half of a Wixzel page. A visitor should get
 * the idea from the first screen without reading: a headline of a few words, a
 * visual that shows the mechanism, and something they can touch. Paragraphs are
 * the last resort, not the first.
 */

/**
 * Entrances as you scroll, in the system's own motion: a band sharpens out of
 * a blur once as it comes into view, and never again. Reduced motion skips it
 * entirely — the content is there from the start either way.
 */
export function Reveal({
  delay = 0,
  className,
  children,
  ref,
  ...props
}: ComponentProps<"div"> & { /** Stagger a row of cards: 60–90ms apart, no more. */ delay?: number }) {
  const [shown, setShown] = useState(false);
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setShown(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [node]);
  return (
    <div
      // The ref is taken apart from the props: a parent rendering this with
      // asChild passes its own ref down, and a bare spread would overwrite
      // this one — the observer would never attach and the band would stay
      // blurred out for good.
      ref={(el) => {
        setNode(el);
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      data-shown={shown || undefined}
      style={{ transitionDelay: shown && delay ? `${delay}ms` : undefined }}
      className={cn(
        "opacity-0 blur-[10px] transition-[opacity,filter,translate] duration-(--wx-duration-enter) ease-move translate-y-2",
        "data-shown:translate-y-0 data-shown:opacity-100 data-shown:blur-none",
        "motion-reduce:opacity-100 motion-reduce:blur-none motion-reduce:translate-y-0 motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * A headline that says the thing in a breath. Two lines at most, the second one
 * tonal, so the eye reads the first line and the rest arrives for free. The
 * shortest true headline wins: a number ("29 MB in. 474 KB out.") beats a
 * sentence about speed.
 */
export function Headline({
  lead,
  trail,
  as: As = "h2",
  size = "md",
  className,
  ...props
}: Omit<ComponentProps<"h2">, "children"> & {
  /** The line that lands first, in full ink. */
  lead: ReactNode;
  /** The second line, a tone quieter. Optional, and never a third. */
  trail?: ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: "md" | "lg";
}) {
  return (
    <As
      className={cn(
        "max-w-[20ch] text-balance",
        size === "lg" ? "text-display-md sm:text-display-lg lg:text-display-xl" : "text-heading-xl sm:text-display-md",
        className,
      )}
      {...props}
    >
      {lead}
      {trail && (
        <>
          <br />
          <span className="text-fg-muted">{trail}</span>
        </>
      )}
    </As>
  );
}

/**
 * One claim, shown rather than argued: a short eyebrow, a headline of a few
 * words, at most three lines of body, and the visual that proves it filling the
 * other half. Rows alternate down the page, so the eye zigzags instead of
 * sliding down a wall of text.
 */
export function FeatureRow({
  eyebrow,
  title,
  trail,
  media,
  note,
  actions,
  flip,
  className,
  children,
  ...props
}: Omit<ComponentProps<"div">, "title"> & {
  eyebrow?: ReactNode;
  title: ReactNode;
  /** The headline's quieter second line. */
  trail?: ReactNode;
  /**
   * The proof, and the half that does the work: the product's own live piece
   * where it has one (Voice's engine switcher, Store's catalogue), otherwise a
   * screenshot or a short loop in a <Showcase>. The library never invents the
   * visual; it gives it the room.
   */
  media: ReactNode;
  /** The one line of small print a claim sometimes needs ("9 photos, 188 MB down to 2.2 MB"). */
  note?: ReactNode;
  actions?: ReactNode;
  /** Put the media on the start side. Alternate it down the page. */
  flip?: boolean;
}) {
  return (
    <div
      className={cn("grid items-center gap-8 lg:grid-cols-2 lg:gap-16", className)}
      {...props}
    >
      <Reveal className={cn("flex flex-col gap-4", flip && "lg:order-2")}>
        {eyebrow && <p className="text-overline uppercase text-accent-ink">{eyebrow}</p>}
        <Headline lead={title} trail={trail} />
        {children && <div className="max-w-[46ch] text-pretty text-body-md text-fg-muted">{children}</div>}
        {note && <p className="max-w-[46ch] text-caption text-fg-subtle">{note}</p>}
        {actions && <div className="mt-1 flex flex-wrap items-center gap-2.5">{actions}</div>}
      </Reveal>
      <Reveal delay={60} className={cn("min-w-0", flip && "lg:order-1")}>
        {media}
      </Reveal>
    </div>
  );
}

/**
 * The visual itself, framed the one way every Wixzel site frames one: a tinted
 * panel with the thing inset on its own surface. Full-bleed widens it past the
 * page measure for a hero scene, the way a film still runs wide.
 */
export function Showcase({
  bleed,
  caption,
  className,
  children,
  ...props
}: ComponentProps<"figure"> & { bleed?: boolean; caption?: ReactNode }) {
  return (
    <figure className={cn("flex flex-col gap-2", bleed && "lg:-mx-10", className)} {...props}>
      <div className="overflow-hidden rounded-xl bg-card p-2 shadow-[0_0_0_1px_var(--wx-color-border)]">
        <div className="overflow-hidden rounded-lg bg-surface [&_img]:block [&_img]:h-auto [&_img]:w-full [&_video]:block [&_video]:w-full">
          {children}
        </div>
      </div>
      {caption && <figcaption className="text-center text-caption text-fg-subtle">{caption}</figcaption>}
    </figure>
  );
}

/**
 * How it works, in three pictures: a numbered label, three or four words, one
 * line, and a picture of the step above each. If a step needs a paragraph, the
 * product needs a simpler step. (The app's own `Step` is the one inside a
 * Stepper; this is its marketing-page cousin.)
 */
export function StepRow({ className, ...props }: ComponentProps<"ol">) {
  return <ol className={cn("grid gap-8 sm:grid-cols-3 sm:gap-6", className)} {...props} />;
}

export function StepCard({
  step,
  title,
  media,
  className,
  children,
  ...props
}: Omit<ComponentProps<"li">, "title"> & { step: ReactNode; title: ReactNode; media?: ReactNode }) {
  return (
    <li className={cn("flex flex-col gap-3 text-center", className)} {...props}>
      {media && <div className="[&_img]:block [&_img]:w-full">{media}</div>}
      <p className="text-overline uppercase text-accent-ink">{step}</p>
      <h3 className="text-heading-sm text-balance">{title}</h3>
      {children && <p className="mx-auto max-w-[32ch] text-pretty text-body-sm text-fg-muted">{children}</p>}
    </li>
  );
}

/**
 * The small facts that would otherwise become a paragraph: three or four of
 * them in a row, each a bold phrase and two lines. The place for detail on a
 * page that otherwise shows rather than tells.
 */
export function NoteGrid({ className, ...props }: ComponentProps<"dl">) {
  return <dl className={cn("grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4", className)} {...props} />;
}

export function Note({ title, className, children, ...props }: Omit<ComponentProps<"div">, "title"> & { title: ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      <dt className="flex items-center gap-1.5 text-body-sm font-medium">
        <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent" />
        {title}
      </dt>
      <dd className="text-pretty text-caption text-fg-muted">{children}</dd>
    </div>
  );
}

// --------------------------------------------------------------- Preferences

/**
 * The theme control every Wixzel site wears. It ships here rather than being
 * described in a spec because the first time it was only described, each site
 * reached for its own glyph — a sun on one, a half-filled circle on another —
 * and the chrome stopped matching across products.
 *
 * The trigger shows the theme in force rather than a fixed symbol, so the
 * control answers "what is it now" before it is opened: the sun for light, the
 * moon for dark, the monitor for following the OS.
 *
 * A site with locales passes them as `children`; they appear under the theme
 * in the same menu, because both are preferences and one control is enough.
 */
export function ThemeMenu({
  align = "end",
  labels,
  value,
  onValueChange,
  options = ["light", "dark", "system"],
  children,
  ...props
}: Omit<ComponentProps<typeof Button>, "children" | "value"> & {
  align?: "start" | "center" | "end";
  /** The menu's own words, for a localized site. */
  labels?: Partial<typeof themeLabels>;
  /**
   * The theme in force, when something else owns it. A site running
   * next-themes (or any provider that writes `data-theme` itself) passes its
   * own value and setter, and the library keeps only the trigger, the glyphs
   * and the menu — two owners of one attribute fight, and the loser is
   * whichever wrote first, which only shows on the next reload.
   */
  value?: Theme;
  onValueChange?: (theme: Theme) => void;
  /** Narrow the rows: a site without OS-following support passes ["light", "dark"]. */
  options?: readonly Theme[];
  /** A site's locales, shown as a second group under the theme. */
  children?: ReactNode;
}) {
  const words = { ...themeLabels, ...labels };
  // Always called, never conditionally: when the site controls the value this
  // hook's state is simply unused.
  const [ownTheme, setOwnTheme] = useTheme();
  // A site is in control the moment it passes a setter, even before its own
  // provider has a value to give: next-themes returns undefined until it
  // mounts, and treating that first render as uncontrolled would let a click
  // land in the library's own store — the very thing control exists to stop.
  const controlled = onValueChange !== undefined || value !== undefined;
  const theme = controlled ? (value ?? options[0] ?? "system") : ownTheme;
  const setTheme = controlled ? (onValueChange ?? (() => {})) : setOwnTheme;
  // The saved theme is only known in the browser; until then the trigger shows
  // the system icon, so the server HTML and the first render agree.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Before mount the trigger shows the first row rather than a saved value the
  // server could not know, so the server HTML and the first render agree.
  const current = mounted ? theme : (options[0] ?? "system");
  const icons = { light: <Sun />, dark: <Moon />, system: <Monitor /> } as const;
  const rows = options.map((option) => ({ value: option, label: words[option] }));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* The caller's own aria-label wins: `labels.theme` titles the menu, and a
            site that wants its translated "Toggle theme" on the trigger should not
            have to retitle the heading to get it. */}
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={props["aria-label"] ?? `${words.theme}: ${words[current]}`}
          {...props}
        >
          {icons[current]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuLabel>{words.theme}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)}>
          {rows.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {icons[option.value]}
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** The preference menu's words, in English. A localized site passes its own. */
export const themeLabels = {
  theme: "Theme",
  light: "Light",
  dark: "Dark",
  system: "System",
};
