# Wixzel UI for React

`wixzel-ui` needs **React 19** and **Tailwind CSS v4**. Components are built
on Radix primitives, styled with Tailwind utilities generated from the Wixzel
tokens, and ship as one client bundle (`"use client"` included).

## Install

```bash
npm i wixzel-ui
# Tailwind v4, if the project doesn't have it yet:
npm i -D tailwindcss @tailwindcss/postcss   # Next.js / PostCSS
npm i -D tailwindcss @tailwindcss/vite      # Vite
```

**Tailwind v3 projects:** upgrade to v4 first (`npx @tailwindcss/upgrade`), then
continue. Wixzel's theme is a v4 `@theme` block and does not load into a v3
`tailwind.config.js`.

**No Tailwind at all (CSS modules, styled-components, Emotion):** add Tailwind v4
alongside; the existing styles keep working while screens move over, and get
deleted as each screen is converted.

## Foundation

### 1. CSS

In the app's global stylesheet, replacing any previous design-system import:

```css
@import "tailwindcss";
@import "wixzel-ui/styles.css";
@import "./brand.css"; /* your seed colour, see below */
```

Delete the old theme: shadcn's `:root { --background … }` block, MUI's
`createTheme`, Chakra's `extendTheme`, Bootstrap's Sass variables, and any
`tailwind.config` colour palette. Wixzel's tokens replace all of them.

### 2. The seed colour

Generate the palette from the project's brand colour once and commit it:

```bash
npx wixzel-ui --seed "#E4572E" > src/brand.css
```

Options: `--tint 0.45` (how strongly the hue washes the page; 0 is grey),
`--hue 250` (tint with a hue other than the seed's, for a black or grey brand),
`--font "Inter, sans-serif"` (only if the brand has a typeface of its own).

When the colour is only known at runtime (white-label apps, a user-picked theme),
derive it in code instead and set it on `<html>` or any region:

```tsx
import { colorVariables, deriveProduct } from "wixzel-ui/tokens";

const brand = colorVariables(deriveProduct({ seed: org.brandColor }));
<html lang="en" style={brand as React.CSSProperties}>…</html>
```

### 3. Font

Manrope. In Next.js:

```tsx
import { Manrope } from "next/font/google";
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
<html className={manrope.variable}>
```

Anywhere else, the Google Fonts `<link>` for Manrope (400, 500, 600, 700) is
enough: the token falls back to the family named "Manrope".

### 4. Provider, theme and toasts

```tsx
import { Toaster, WixzelProvider } from "wixzel-ui";
import { themeScript } from "wixzel-ui/utils";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <head>
        {/* Applies the saved light/dark choice before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-bg font-sans text-fg antialiased">
        <WixzelProvider>
          {children}
          <Toaster />
        </WixzelProvider>
      </body>
    </html>
  );
}
```

`WixzelProvider` sets Phosphor duotone as the icon style, tooltip timing, reading
direction (`dir="rtl"`), the built-in words (`labels`), and hosts `useConfirm()`.

Theme: `useTheme()` returns `[theme, setTheme]` with `"light" | "dark" | "system"`,
and `<ThemeMenu />` is the ready-made control. A project already using
`next-themes` keeps it and passes `value` / `onValueChange` to `ThemeMenu`, with
`next-themes` set to `attribute="data-theme"`. Any region can carry its own theme
with `<ThemeScope theme="dark">`.

### 5. Icons

```tsx
import { GearIcon, MagnifyingGlassIcon, PlusIcon } from "wixzel-ui/icons";
```

Every Phosphor icon, already duotone, and safe in Server Components. Swap
Lucide / Heroicons / react-icons imports for the Phosphor equivalent by meaning
(Lucide `Settings` → `GearIcon`, `Search` → `MagnifyingGlassIcon`, `Trash2` →
`TrashIcon`, `ChevronDown` → `CaretDownIcon`, `X` → `XIcon`, `Loader2` →
`<Spinner />`). Size icons through the component they sit in; don't add
`h-4 w-4` everywhere.

## Components

Import everything from `wixzel-ui`. Server Components that only need class
names or plain helpers import from `wixzel-ui/utils`
(`buttonVariants`, `inputVariants`, `cn`, `themeScript`).

| Need | Wixzel | Notes |
|---|---|---|
| Button | `Button` | `variant`: `primary` · `secondary` (default) · `ghost` · `danger` · `link`. `size`: `xs` `sm` `md` `lg` `icon-xs` `icon-sm` `icon` `icon-lg`. `loading`, `iconStart`, `iconEnd`, `shortcut="⌘↵"`, `block`, `asChild` for links. One `primary` per view. |
| Text input | `Input`, `Textarea` | `leading` / `trailing` slots for icons or units. `size`: `sm` `md` `lg`. Textareas grow with content. |
| Label, hint, error | `Field` | `label`, `hint`, `error`, `required`, `labelAside`. Wraps one control and wires the a11y attributes. |
| Select | `Select` + `SelectTrigger` `SelectValue` `SelectContent` `SelectItem` | Radix API. Searchable: `Combobox` with `options`. |
| Checkbox, radio, switch, slider | `Checkbox`, `RadioGroup` + `RadioGroupItem`, `Switch`, `Slider` | |
| Option cards | `RadioCards` + `RadioCard`, `CheckboxCards` + `CheckboxCard` | Plans, engines, amounts. |
| Filter chips | `Chips` + `Chip` | `type="single"` or `"multiple"`, `count`. |
| Card | `Card` + `CardHeader` `CardTitle` `CardDescription` `CardContent` `CardFooter` | `interactive`, `selected`. No border, no shadow. |
| Settings panel | `Section` | `title`, `description`, `icon`, `actions`, `tone="danger"`. |
| Tabs | `Tabs` + `TabsList` `TabsTrigger` `TabsContent` | Route tabs: `NavTabs` + `NavTab`. |
| Menu | `DropdownMenu` + `…Trigger` `…Content` `…Item` `…Label` `…Separator` `…Shortcut` `…CheckboxItem` `…RadioItem` `…Sub*` | |
| Dialog, sheet | `Dialog` + `DialogContent` `DialogHeader` `DialogTitle` `DialogDescription` `DialogFooter`; `Drawer` + `DrawerContent` … | Confirmation: `const confirm = useConfirm(); if (await confirm({ title, tone: "danger" }))`. |
| Popover, tooltip | `Popover` + `PopoverTrigger` `PopoverContent`; `Tooltip content="…" shortcut={["⌘","K"]}` | Inline help next to a title: `InfoTip`. |
| Toast | `toast("Saved")`, `toast.success`, `toast.error`, `toast.promise` | Mount `<Toaster />` once. |
| Alert, banner | `Alert` | `tone`: `neutral` `info` `success` `warning` `danger`; `title`, `action`. |
| Badge, status | `Badge` | `tone`, `appearance`: `soft` (default) `solid` `outline`; `dot`; `pulse` for live states. |
| Avatar | `Avatar`, `AvatarGroup` | `name` makes initials; `src`; `status`. |
| Table | `Table` + `TableHeader` `TableBody` `TableRow` `TableHead` `TableCell` | Sits on a tinted panel; tabular numbers. Paging: `Pagination`. |
| Loading | `Spinner`, `Skeleton` | Buttons take `loading` instead of a spinner beside them. |
| Empty list | `EmptyState` | `icon`, `title`, `description`, `actions` (the action that adds the first one). |
| Metrics | `StatCard` (`value`, `delta`, `goodWhen`, `trend`), `Sparkline`, `Delta`, `Progress`, `SplitBar`, `BarList`, `ColumnChart` | |
| Details | `DescriptionList`, `Timeline`, `Accordion` | |
| Secret, API key | `CopyField` | `secret` masks to the last four. |
| File upload | `FileDrop` | |
| Steps | `Stepper` | |
| Chat, transcript | `Transcript` + `Message` (`from="agent" \| "person"`, `streaming`) | |
| Quick actions | `Tile` | |
| Unsaved changes bar | `ActionBar` | |
| Keyboard keys | `Kbd` | |
| Divider | `Separator` | |

### App layout (dashboards, admin, SaaS)

```tsx
<AppShell
  sidebar={
    <Sidebar>
      <SidebarHeader><img src="/logo.svg" alt="Acme" className="h-6" /></SidebarHeader>
      <SidebarSection label="Workspace">
        <SidebarItem asChild icon={<HouseIcon />} active={path === "/"}><Link href="/">Home</Link></SidebarItem>
        <SidebarItem asChild icon={<UsersIcon />} aside={<Badge>12</Badge>}><Link href="/team">Team</Link></SidebarItem>
      </SidebarSection>
      <SidebarFooter>…</SidebarFooter>
    </Sidebar>
  }
  header={<AppHeader><SidebarToggle /><Breadcrumb>…</Breadcrumb></AppHeader>}
>
  <PageHeader title="Team" description="People who can sign in to Acme." actions={<Button variant="primary" iconStart={<PlusIcon />}>Invite</Button>} />
  …
</AppShell>
```

`SidebarItem` takes its icon as the `icon` prop. Passing it as a child puts it
inside the label, which hides when the sidebar collapses to a rail.

### Marketing and docs sites

`SiteHeader` (`brand`, `nav` of `SiteNavLink`s with the icon as a child,
`actions`), `SiteContainer`, `Hero`, `SiteSection`, `FeatureGrid` + `Feature`,
`FeatureRow`, `Showcase`, `ScreenFrame`, `StatBand` + `Stat`, `Quote`,
`LogoWall`, `PricingGrid` + `PricingTier`, `StepRow` + `StepCard`, `FaqList`,
`CtaBand`, `Reveal`, `Prose` for long text, and `SiteSidebarLayout` +
`SiteSidebar` + `SiteSidebarSection` + `SiteSidebarLink` for docs.

Footer for a non-Wixzel project (don't use `SiteFooter`, which signs off for
Wixzel):

```tsx
<footer className="bg-bg-subtle py-16">
  <SiteContainer className="grid gap-10 sm:grid-cols-3">
    <FooterColumn label="Product"><FooterLink href="/pricing">Pricing</FooterLink></FooterColumn>
    <FooterColumn label="Company"><FooterLink href="/about">About</FooterLink></FooterColumn>
  </SiteContainer>
  <SiteContainer className="mt-12 text-caption text-fg-subtle">© {new Date().getFullYear()} Acme Inc.</SiteContainer>
</footer>
```

## Mapping from other libraries

| From | Wixzel |
|---|---|
| shadcn/ui `Button variant="default"` / `outline` / `ghost` / `destructive` / `link` | `primary` / `secondary` / `ghost` / `danger` / `link` |
| shadcn `Card` with `border shadow-sm` | `Card` (drop the border and shadow classes) |
| shadcn `Form` + `FormField` + `FormItem` + `FormLabel` + `FormMessage` | keep `react-hook-form`'s `Controller`; render `Field label error={fieldState.error?.message}` around the control |
| shadcn `Sonner` / `useToast` | `toast` from `wixzel-ui` |
| shadcn `AlertDialog` | `useConfirm()` |
| shadcn `Sheet` | `Drawer` |
| shadcn `Command` in a popover | `Combobox` |
| MUI `Button variant="contained"` / `outlined` / `text` | `primary` / `secondary` / `ghost` |
| MUI `TextField` | `Field` + `Input` |
| MUI `Paper` / `Card` (`elevation`) | `Card` (no elevation) |
| MUI `Snackbar` | `toast` |
| MUI `CircularProgress` / `LinearProgress` | `Spinner` / `Progress` |
| MUI `Chip` | `Badge` (status) or `Chip` (filter) |
| MUI `Drawer` (navigation) | `AppShell` + `Sidebar` |
| Chakra `Box` / `Stack` / `Flex` | plain `div` with Tailwind (`flex flex-col gap-4`) |
| Chakra `useDisclosure` + `Modal` | `Dialog` with `open` / `onOpenChange` |
| Bootstrap `.btn-primary` / `.card` / `.form-control` / `.alert` / `.badge` | `Button variant="primary"` / `Card` / `Input` / `Alert` / `Badge` |
| Ant Design `Table` | `Table` primitives (keep the data and sorting logic; render rows yourself) |

Remove the old library from `package.json` once nothing imports it.

## Token utilities

For anything you write yourself. Never raw hex or Tailwind's default palette.

- **Surfaces:** `bg-bg` (page), `bg-bg-subtle` (sidebar, quiet band), `bg-card`
  (panel), `bg-bg-muted` (field, hover, track), `bg-surface` (raised control),
  `bg-surface-overlay` (menu, dialog), `bg-accent-subtle` (selected wash).
- **Text:** `text-fg`, `text-fg-muted`, `text-fg-subtle`, `text-fg-disabled`,
  `text-accent-ink` (accent as text), `text-{success,warning,danger,info}-ink`.
- **Lines:** `border-border` (row dividers), `border-border-strong`,
  `border-accent-edge` (selected).
- **Accent:** `bg-accent text-accent-fg hover:bg-accent-hover`.
- **Type:** `text-display-{xl,lg,md}`, `text-heading-{xl,lg,md,sm}`,
  `text-body-{lg,md,sm}`, `text-caption`, `text-overline`, `font-mono`.
- **Shape:** `rounded-{xs,sm,md,lg,xl,full}` (squircle-aware), controls `md`,
  panels `lg`, dialogs `xl`.
- **Size:** `h-control-{xs,sm,md,lg}`.
- **Depth:** `shadow-raised`, `shadow-pressed`, `shadow-field`, `shadow-{xs…xl}`
  (overlays only; panels have none).
- **Motion:** `duration-(--wx-duration-fast)` for colour,
  `duration-(--wx-duration-move) ease-move` for movement.
- **Focus:** the `wx-focus` utility gives any custom control the standard
  solid-edge ring.
