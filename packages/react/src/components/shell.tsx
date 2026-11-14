import { CaretRight, Info, List, SidebarSimple } from "@phosphor-icons/react";
import { Dialog as DialogPrimitive, Slot } from "radix-ui";
import {
  Children,
  type ComponentProps,
  createContext,
  isValidElement,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { cn } from "../lib/cn";
import { slotContent, slottable } from "../lib/slot";
import { Button } from "./button";
import { DialogOverlay } from "./dialog";
import { useLabels } from "./labels";
import { useScopeAttributes } from "./scope";
import { Tooltip } from "./tooltip";

// ---------------------------------------------------------------- AppShell

interface AppShellState {
  /** The sidebar can fold down to a rail of icons on wide screens. */
  collapsible: boolean;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  /** The phone drawer that holds the sidebar below the md breakpoint. */
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const AppShellContext = createContext<AppShellState | null>(null);
/** True inside the phone drawer, where the sidebar is always full width. */
const InMenuContext = createContext(false);
/** True while the sidebar is folded to its rail. */
const RailContext = createContext(false);

/** The AppShell around this component: its rail and phone-menu state. Null outside an AppShell. */
export function useAppShell() {
  return useContext(AppShellContext);
}

// Matches Tailwind's md breakpoint, where the sidebar leaves the page for the drawer.
const WIDE = "(min-width: 48rem)";

/**
 * The console frame: a tinted sidebar on the start side, the content filling
 * the rest. With `collapsible`, the sidebar folds to a rail of icons, the
 * column narrowing in one snappy move while labels fade; hovering an icon
 * names it. Below the md breakpoint the sidebar leaves the page and opens as
 * a drawer from the start edge. Put a <SidebarToggle> in the header for both.
 */
export function AppShell({
  sidebar,
  header,
  collapsible = false,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  children,
  className,
  ...props
}: ComponentProps<"div"> & {
  sidebar: ReactNode;
  header?: ReactNode;
  collapsible?: boolean;
  /** Controlled rail state. Pair with onCollapsedChange, for instance to save it in a cookie. */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}) {
  const labels = useLabels();
  const scope = useScopeAttributes();
  const [uncontrolled, setUncontrolled] = useState(defaultCollapsed);
  const collapsed = collapsible && (collapsedProp ?? uncontrolled);
  const setCollapsed = useCallback(
    (next: boolean) => {
      setUncontrolled(next);
      onCollapsedChange?.(next);
    },
    [onCollapsedChange],
  );
  const [menuOpen, setMenuOpen] = useState(false);

  // Widening the window past the breakpoint puts the sidebar back on the page; the drawer goes.
  useEffect(() => {
    if (!menuOpen) return;
    const wide = window.matchMedia(WIDE);
    const close = () => wide.matches && setMenuOpen(false);
    close();
    wide.addEventListener("change", close);
    return () => wide.removeEventListener("change", close);
  }, [menuOpen]);

  const state = useMemo(
    () => ({ collapsible, collapsed, setCollapsed, menuOpen, setMenuOpen }),
    [collapsible, collapsed, setCollapsed, menuOpen],
  );

  return (
    <AppShellContext.Provider value={state}>
      <div
        data-collapsed={collapsed || undefined}
        className={cn(
          "grid min-h-dvh grid-cols-[var(--wx-sidebar-width)_minmax(0,1fr)] bg-bg text-fg max-md:grid-cols-1",
          "[--wx-sidebar-width:256px] data-collapsed:[--wx-sidebar-width:62px]",
          "transition-[grid-template-columns] duration-(--wx-duration-move) ease-move",
          className,
        )}
        {...props}
      >
        <div className="sticky top-0 h-dvh overflow-x-hidden max-md:hidden">
          <RailContext.Provider value={collapsed}>{sidebar}</RailContext.Provider>
        </div>
        <div className="flex min-w-0 flex-col">
          {header}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>

      <DialogPrimitive.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogPrimitive.Portal>
          <DialogOverlay className="md:hidden" />
          <DialogPrimitive.Content
            {...scope}
            aria-describedby={undefined}
            className={cn(
              "fixed inset-y-2 start-2 z-(--wx-z-modal) flex w-[min(calc(100vw-16px),288px)] flex-col overflow-hidden md:hidden",
              "rounded-xl bg-bg-subtle text-fg shadow-xl outline-none",
              "data-[state=open]:animate-wx-drawer-in-left data-[state=closed]:animate-wx-drawer-out-left",
              "rtl:data-[state=open]:animate-wx-drawer-in-right rtl:data-[state=closed]:animate-wx-drawer-out-right",
            )}
          >
            <DialogPrimitive.Title className="sr-only">{labels.navigation}</DialogPrimitive.Title>
            <InMenuContext.Provider value={true}>{sidebar}</InMenuContext.Provider>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </AppShellContext.Provider>
  );
}

/**
 * One button for both sidebar moves: on a phone it opens the sidebar drawer;
 * on a wide screen it folds the sidebar to its rail and back (when the
 * AppShell is `collapsible`). Each case is its own button, so the right name
 * is read out without knowing the screen size on the server.
 */
export function SidebarToggle({ className, ...props }: Omit<ComponentProps<"button">, "children">) {
  const shell = useAppShell();
  const labels = useLabels();
  if (!shell) return null;
  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={labels.openMenu}
        aria-expanded={shell.menuOpen}
        onClick={() => shell.setMenuOpen(true)}
        className={cn("md:hidden", className)}
        {...props}
      >
        <List />
      </Button>
      {shell.collapsible && (
        <Tooltip content={shell.collapsed ? labels.expandSidebar : labels.collapseSidebar}>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={shell.collapsed ? labels.expandSidebar : labels.collapseSidebar}
            aria-expanded={!shell.collapsed}
            onClick={() => shell.setCollapsed(!shell.collapsed)}
            className={cn("max-md:hidden", className)}
            {...props}
          >
            <SidebarSimple className="rtl:-scale-x-100" />
          </Button>
        </Tooltip>
      )}
    </>
  );
}

/** A thin bar along the top of the content: breadcrumb on the start, actions on the end. */
export function AppHeader({ className, ...props }: ComponentProps<"header">) {
  return (
    <header
      className={cn(
        "sticky top-0 z-(--wx-z-sticky) flex h-14 items-center gap-3 bg-bg px-6 max-md:px-4",
        className,
      )}
      {...props}
    />
  );
}

// ---------------------------------------------------------------- Sidebar

export function Sidebar({ className, ...props }: ComponentProps<"nav">) {
  const folded = useContext(RailContext);
  const inMenu = useContext(InMenuContext);
  const rail = folded && !inMenu;
  return (
    <RailContext.Provider value={rail}>
      <nav
        data-rail={rail || undefined}
        className={cn("group/sidebar flex h-full flex-col gap-0.5 overflow-y-auto overflow-x-hidden bg-bg-subtle px-3 py-4 text-body-sm", className)}
        {...props}
      />
    </RailContext.Provider>
  );
}

/** True while the sidebar is folded to its rail, so a header or footer can show its compact form. */
export function useSidebarRail() {
  return useContext(RailContext);
}

export function SidebarHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2 px-1 pb-2", className)} {...props} />;
}

/** A labelled group of items. On the rail the label fades and keeps its space, so the icons don't shift. */
export function SidebarSection({
  label,
  className,
  children,
  ...props
}: ComponentProps<"div"> & { label?: ReactNode }) {
  return (
    <div role="group" className={cn("flex flex-col gap-px pt-3 first:pt-0", className)} {...props}>
      {label && (
        <div className="truncate px-2 pb-1 text-caption font-medium text-fg-subtle transition-opacity duration-(--wx-duration-fast) group-data-rail/sidebar:opacity-0">
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * A nav item. The current page is inked: a solid block of text colour with
 * the label reversed out of it. With asChild, a router's Link becomes the item
 * and keeps the icon, label and aside. On the rail only the icon shows, and
 * hovering it names the page.
 */
export function SidebarItem({
  icon,
  active,
  asChild,
  aside,
  className,
  children,
  onClick,
  ...props
}: ComponentProps<"a"> & {
  icon?: ReactNode;
  active?: boolean;
  asChild?: boolean;
  /** A count, badge or shortcut on the end. */
  aside?: ReactNode;
}) {
  const rail = useContext(RailContext);
  const inMenu = useContext(InMenuContext);
  const shell = useAppShell();
  const Comp = asChild ? Slot.Root : "a";

  const item = (
    <Comp
      aria-current={active ? "page" : undefined}
      data-active={active || undefined}
      className={cn(
        "group/item relative flex h-9 items-center gap-2.5 rounded-md px-2.5 font-medium text-fg-muted outline-none wx-focus",
        "transition-colors duration-(--wx-duration-fast) hover:bg-bg-muted hover:text-fg",
        "data-active:bg-fg data-active:text-bg data-active:hover:bg-fg",
        "[&_svg]:size-[18px] [&_svg]:shrink-0 [&_svg]:text-fg-subtle data-active:[&_svg]:text-bg",
        className,
      )}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);
        // Following a link from the phone drawer closes it.
        if (inMenu && !event.defaultPrevented) shell?.setMenuOpen(false);
      }}
      {...props}
    >
      {icon}
      {slottable(asChild, children, (content) => (
        <span className="min-w-0 flex-1 truncate transition-opacity duration-(--wx-duration-fast) group-data-rail/sidebar:text-clip group-data-rail/sidebar:opacity-0">
          {content}
        </span>
      ))}
      {aside && (
        <span className="ms-auto flex shrink-0 items-center text-caption text-fg-subtle transition-opacity duration-(--wx-duration-fast) group-data-active/item:text-bg group-data-rail/sidebar:opacity-0">
          {aside}
        </span>
      )}
    </Comp>
  );

  return rail ? (
    <Tooltip content={slotContent(asChild, children)} side="right">
      {item}
    </Tooltip>
  ) : (
    item
  );
}

export function SidebarFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mt-auto flex flex-col gap-2 px-1 pt-3", className)} {...props} />;
}

// ---------------------------------------------------------------- Breadcrumb

const CrumbContext = createContext(false);

/**
 * Where you are: links separated by carets, the current page in full ink.
 * Pass `items` for plain links, or BreadcrumbItem children to use a router's
 * Link: <BreadcrumbItem asChild><Link href="/agents">Agents</Link></BreadcrumbItem>.
 * The last crumb is the current page.
 */
export function Breadcrumb({
  items,
  label,
  className,
  children,
  ...props
}: ComponentProps<"nav"> & {
  items?: { label: ReactNode; href?: string }[];
  /** The landmark's name. Defaults to the provider's label. */
  label?: string;
}) {
  const labels = useLabels();
  const crumbs = items
    ? items.map((item, i) => (
        <BreadcrumbItem key={i} href={item.href}>
          {item.label}
        </BreadcrumbItem>
      ))
    : Children.toArray(children).filter(isValidElement);
  return (
    <nav aria-label={label ?? labels.breadcrumb} className={cn("min-w-0", className)} {...props}>
      <ol className="flex min-w-0 items-center gap-1 text-body-sm">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={crumb.key ?? i} className="flex min-w-0 items-center gap-1">
              <CrumbContext.Provider value={last}>{crumb}</CrumbContext.Provider>
              {!last && <CaretRight aria-hidden className="size-3.5 shrink-0 text-fg-disabled rtl:rotate-180" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** One crumb. A link when it has an href or a Link child, plain text when it is the current page. */
export function BreadcrumbItem({
  href,
  asChild,
  className,
  children,
  ...props
}: ComponentProps<"a"> & { asChild?: boolean }) {
  const current = useContext(CrumbContext);
  if (current || (!href && !asChild)) {
    return (
      <span
        aria-current={current ? "page" : undefined}
        className={cn("truncate", current ? "font-medium text-fg" : "text-fg-subtle", className)}
      >
        {slotContent(asChild, children)}
      </span>
    );
  }
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      href={href}
      className={cn("truncate rounded-xs text-fg-subtle transition-colors hover:text-fg wx-focus", className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

// ---------------------------------------------------------------- Page header

/** A small "i" that explains a term on hover or focus. */
export function InfoTip({
  children,
  label,
  className,
}: {
  children: ReactNode;
  /** The button's name for screen readers. Defaults to the provider's label. */
  label?: string;
  className?: string;
}) {
  const labels = useLabels();
  return (
    <Tooltip content={<span className="block max-w-56 font-normal leading-snug">{children}</span>}>
      <button
        type="button"
        aria-label={label ?? labels.moreInformation}
        className={cn("inline-grid size-4 place-items-center rounded-full text-fg-subtle transition-colors hover:text-fg wx-focus", className)}
      >
        <Info className="size-3.5" />
      </button>
    </Tooltip>
  );
}

/** The top of a page: title (with an optional InfoTip), a line of description, and actions on the end. */
export function PageHeader({
  title,
  description,
  info,
  actions,
  eyebrow,
  className,
  ...props
}: Omit<ComponentProps<"div">, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  info?: ReactNode;
  actions?: ReactNode;
  eyebrow?: ReactNode;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-6 gap-y-3", className)} {...props}>
      <div className="flex min-w-0 flex-col gap-1">
        {eyebrow && <div className="text-caption font-medium text-fg-subtle">{eyebrow}</div>}
        <h1 className="flex items-center gap-1.5 text-heading-xl text-balance">
          {title}
          {info && <InfoTip>{info}</InfoTip>}
        </h1>
        {description && <p className="max-w-[65ch] text-body-md text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
