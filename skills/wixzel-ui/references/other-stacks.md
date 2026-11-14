# Wixzel UI without React

Vue, Nuxt, Svelte, SvelteKit, Angular, Astro, Solid, Laravel Blade, Django
templates, plain HTML. The components are React, but the design language lives
in the tokens, and the class recipes behind the components are plain functions
with no React in them. Prefer React components where an Astro or similar island
can host them; otherwise build on the tokens and recipes as below.

## With Tailwind v4 (recommended)

```bash
npm i wixzel-ui
npx wixzel-ui --seed "#E4572E" > src/brand.css
```

```css
/* the global stylesheet */
@import "tailwindcss";
@import "wixzel-ui/tailwind.css";
@import "./brand.css";
/* Let Tailwind see the class names inside the recipes. */
@source "../node_modules/wixzel-ui/dist/utils.js";
```

`tailwind.css` replaces Tailwind's default colour palette with the Wixzel roles
(`bg-card`, `text-fg-muted`, `bg-accent`…) and adds the type scale, radii,
shadows, motion and `control-*` sizes. See the "Token utilities" list in
[react.md](react.md). Tailwind's own colours (`bg-gray-100`, `text-blue-600`)
no longer exist, so every leftover use shows up as an unstyled element: search
for them and convert each one.

### The recipes

```ts
import { buttonVariants, inputVariants, cn, floatingPanel, menuItem } from "wixzel-ui/utils";
```

```vue
<!-- Vue -->
<button :class="buttonVariants({ variant: 'primary', size: 'md' })">Save</button>
<input :class="inputVariants({ size: 'md' })" placeholder="Search" />
```

```svelte
<!-- Svelte -->
<button class={buttonVariants({ variant: "ghost" })}>Cancel</button>
```

Recipes give the look and the static states (hover fill, focus edge, disabled).
The behaviours React components add on top are yours to supply:

- **Press:** `active:scale-[0.96]` with `transition-transform
  duration-(--wx-duration-instant)` (the button recipe already includes it).
- **Menus, popovers, dialogs:** use the framework's headless primitives (Radix
  Vue / Reka UI, Bits UI or Melt UI for Svelte, Angular CDK, Headless UI), style
  the panel with `floatingPanel` and items with `menuItem`, and bring it in
  sharpening out of a blur: `animate-wx-pop-in` for menus and popovers,
  `animate-wx-fade-in` for dialogs and scrims, `animate-wx-rise-in` for toasts
  and bars, with the matching `-out` on close.
- **Theme:** set `data-theme="light" | "dark"` on `<html>`, or leave it off to
  follow the OS. Save the choice in `localStorage` under `wx-theme` and apply it
  in an inline `<head>` script before first paint (copy `themeScript` from
  `wixzel-ui/utils`).
- **Icons:** Phosphor in duotone weight (`@phosphor-icons/vue`,
  `phosphor-svelte`, `@phosphor-icons/web` with the `ph-duotone` class).

## Without Tailwind

```css
@import "wixzel-ui/tokens.css";
@import "./brand.css";
```

Every role is a CSS variable: `--wx-color-bg`, `--wx-color-card`,
`--wx-color-fg-muted`, `--wx-color-accent`, `--wx-color-accent-fg`,
`--wx-color-accent-edge`, `--wx-radius-md`, `--wx-shadow-raised`,
`--wx-duration-fast`, `--wx-ease-out`, `--wx-font-sans`… Colours are
`light-dark()` pairs, so they follow `color-scheme` and `data-theme` on their own.
`wixzel-ui/tokens.json` has the raw values for scripts and native apps.

A button in plain CSS, as an example of applying the language by hand:

```css
.btn-primary {
  height: 38px;
  padding: 0 12px;
  border: 0;
  border-radius: var(--wx-radius-md);
  corner-shape: squircle;
  background: var(--wx-color-accent);
  color: var(--wx-color-accent-fg);
  font: 500 14px/1 var(--wx-font-sans);
  transition: background-color var(--wx-duration-fast), scale var(--wx-duration-instant);
}
.btn-primary:hover { background: var(--wx-color-accent-hover); }
.btn-primary:active { scale: 0.96; }
.btn-primary:focus-visible { outline: 2px solid var(--wx-color-focus); outline-offset: 2px; }
```

Check the real recipe in `wixzel-ui`'s source for the rim and highlight
shadows when matching a component exactly.
