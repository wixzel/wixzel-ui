---
name: wixzel-ui
description: Convert any web or Flutter project to the Wixzel UI design language, using the open-source wixzel-ui (npm) and wixzel_ui (Flutter) packages. Use when the user asks to "convert to Wixzel UI", "use Wixzel UI", "make this look like Wixzel", restyle or redesign an app with Wixzel UI, migrate from shadcn/ui, MUI, Chakra, Bootstrap, Ant Design or stock Material to Wixzel UI, theme a project from one brand colour with Wixzel tokens, or build new screens in the Wixzel style. Covers React and Next.js (Tailwind v4), Vue, Svelte and plain HTML through the tokens, and Flutter.
---

# Wixzel UI

Wixzel UI is a design system built around two words: **simplicity** and
**customizability**. Pages are calm (tinted paper, tinted ink, almost no lines)
and the craft lives inside the components: buttons that press in, checks that
draw themselves, menus that sharpen out of a blur. A product sets **one seed
colour** and gets a whole palette from it, in light and dark, with every text
pair passing WCAG AA.

Docs and live components: https://ui.wixzel.com · Source: https://github.com/wixzel/wixzel-ui

| Package | For | Install |
|---|---|---|
| `wixzel-ui` (npm) | React 19 + Tailwind v4 components, plus the tokens as CSS, a Tailwind theme and JSON, and the seed CLI | `npm i wixzel-ui` |
| `wixzel_ui` (pub.dev) | Flutter widgets and theme | `flutter pub add wixzel_ui` |

## How to convert a project

Work through these in order. Do not skip step 1: it is what keeps a conversion
from deleting things the project owner cares about.

### 1. Survey before changing anything

- **Stack.** Framework, React version, Tailwind version (v3 or v4, or none),
  component library in use, CSS approach, Flutter or not. Read `package.json` /
  `pubspec.yaml`, the root layout, the global CSS and two or three real screens.
- **Brand assets.** List every logo, mark, illustration and custom control the
  project already renders, and where. These carry through the conversion
  untouched; Wixzel components take them in their slots (`SiteHeader`'s `brand`,
  `Wordmark`'s `mark`, `EmptyState`'s `icon`). Never replace a real logo with a
  text wordmark. Removing any brand element is a question for the owner, not a
  decision to make while converting.
- **Brand colour.** Find the primary colour the project already uses (CSS
  variable, Tailwind config, theme file, logo). That becomes the seed. If there
  is none, ask; if the user has no preference, pick a mid-lightness, saturated
  colour (not black, not grey).
- **Screen inventory.** List the screens and the components each uses, so the
  conversion can go screen by screen and nothing is missed.

### 2. Install and set the foundation

Follow the stack's reference:

- React, Next.js, Vite, Remix: [references/react.md](references/react.md)
- Flutter: [references/flutter.md](references/flutter.md)
- Vue, Svelte, Angular, Astro, plain HTML: [references/other-stacks.md](references/other-stacks.md)

The foundation is always the same four things: the tokens loaded, the seed
colour applied, Manrope as the typeface, and the theme (light, dark, or OS)
applied before first paint.

### 3. Convert screen by screen

For each screen, replace the project's own components with the Wixzel ones and
delete the styling they made redundant. Map components using the table in the
stack reference. Rules while converting:

- **Use the component; never restyle it.** If a screen needs something the
  library lacks, compose it from library parts and tokens. Don't override a
  component's colours, radius, borders or shadow with classes.
- **Keep every word, link, route, handler and data binding.** The conversion
  changes how things look and respond, never what they say or do.
- **Panels are tinted fills, not boxes.** Remove borders and drop shadows from
  cards, sections and tables; use `Card`, `Section`, `Table` (they sit on
  `bg-card`). Lines are only for dividing rows inside a panel.
- **One accent, used sparingly.** Full accent is for the primary action, the
  current selection and focus. Everything else carries the hue through the
  tinted neutrals. Status colours (success, warning, danger, info) are never
  accents and the accent is never a status.
- **Selection is ink.** The current tab, nav item and chip are a solid block of
  text colour with the label reversed out (the components do this).
- **Icons are Phosphor duotone.** Swap Lucide, Heroicons, Material Icons and
  Font Awesome for the Phosphor equivalent (`wixzel-ui/icons` on the web,
  `PhosphorIconsDuotone` in Flutter).
- **Words are plain.** Errors say how to fix them. Labels name what people
  recognise. Don't add marketing copy the project didn't have.

### 4. Verify

Run the checklist in [references/checklist.md](references/checklist.md): it
builds, types check, both themes look right, nothing the project had is gone,
and no off-system colour, border or shadow is left behind. Look at the result in
a browser or simulator; a conversion that only compiles is not done.

## The design language in one page

Read [references/design-language.md](references/design-language.md) before
building anything the library doesn't ship. The short version:

- **Colour through everything.** The page, surfaces, lines and text are all
  washed with the seed's hue. A Wixzel product is never grey.
- **Tonal planes.** `bg` (page) → `bg-subtle` (sidebars) → `card` (panels) →
  `bg-muted` (fields, tracks, hover). Overlays sit on `surface-overlay`.
- **Squircle corners.** Controls 14px, panels 26px, dialogs 30px (smaller round
  fallbacks where the browser can't draw squircles). Never one sharp corner,
  never cut corners.
- **Comfortable density.** Controls 38px by default (28, 32, 44 too). Body 15px,
  controls and tables 14px. Headings bold and tight.
- **Snappy motion.** Press shrinks to 96% in 70ms. Colour changes 110ms. Moves
  150ms with no overshoot. New things sharpen out of a blur in 270ms. Everything
  respects reduced motion.
- **Focus is a solid 2px edge** in the accent, never a glow.
- **No gloss, glass, gradients or AI sparkle.** No neon, no hatching, no mono
  uppercase instrument-panel labels.

## Branding: whose product is it?

The packages are MIT-licensed for anyone. The Wixzel *brand* is not part of
that. On a project that is not a Wixzel product:

- Don't render `SiteFooter` (it signs off "© Wixzel"), `ProductSwitcher`, or
  anything from `brandProducts` / `socials`. Build the footer from
  `SiteContainer`, `FooterColumn` and `FooterLink` with the project's own name.
- `SiteHeader` is fine with the project's own logo in `brand`. `Wordmark` is
  fine with `name="Acme"` when the project has no logo asset.
- Don't set `data-product` to a Wixzel product name to borrow its colour; use
  the project's own seed (the stack reference shows how).

## When something is not in the library

Compose it from tokens and the existing parts, following the design language,
and keep it in the project's own components folder. Use the token utility
classes (`bg-card`, `text-fg-muted`, `rounded-lg`, `text-heading-md`,
`h-control-md`, `duration-(--wx-duration-fast)`), never raw hex values or
Tailwind's default palette (`bg-gray-100`, `text-blue-600`). If it is generally
useful, suggest the user open an issue or pull request at
https://github.com/wixzel/wixzel-ui.
