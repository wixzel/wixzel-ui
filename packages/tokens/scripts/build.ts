/**
 * Compiles src/tokens.ts into:
 *   dist/tokens.css    CSS variables (--wx-*), both themes, every product
 *   dist/tailwind.css  the Tailwind v4 theme, utilities and keyframes on top of them
 *   dist/tokens.json   the raw values, for native apps and scripts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as t from "../src/tokens.ts";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
mkdirSync(dist, { recursive: true });

const ld = ([light, dark]: t.Pair) => (light === dark ? light : `light-dark(${light}, ${dark})`);
const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

// The focus alias is redeclared with every accent: a custom property's var() is
// resolved where it is declared, so a :root-only alias would keep the master
// brand's ring inside a data-product island.
function accentVars(a: t.Accent): string[] {
  return [
    ...Object.entries(a).map(([role, pair]) => `--wx-color-${kebab(role)}: ${ld(pair)};`),
    "--wx-color-focus: var(--wx-color-accent-edge);",
  ];
}

const radiusVars = (scale: Record<string, string>, by = 1) =>
  Object.entries(scale)
    .filter(([k]) => k !== "full")
    .map(([k, v]) => `--wx-radius-${k}: ${parseFloat(v) * by}px;`);

// Squircle radii where the browser can draw them, scaled per product like the fallback.
const squircleBlock = [
  `:root {\n  ${radiusVars(t.squircle).join("\n  ")}\n}`,
  ...Object.entries(t.products)
    .filter(([, p]) => p.radius !== 1)
    .map(([name, p]) => `[data-product="${name}"] {\n  ${radiusVars(t.squircle, p.radius).join("\n  ")}\n}`),
].join("\n");

// A product block carries the whole palette (its hue washes every neutral),
// and its corner scale and font when the product changes them.
function productVars(p: t.ProductTheme): string[] {
  return [
    ...Object.entries(p.neutral).map(([k, v]) => `--wx-color-${k}: ${ld(v)};`),
    ...accentVars(p.accent),
    ...(p.radius === 1 ? [] : radiusVars(t.radius, p.radius)),
    ...(p.font ? [`--wx-font-sans: ${p.font};`] : []),
  ];
}

// ---------------------------------------------------------------- tokens.css
const root: string[] = [
  "color-scheme: light dark;",
  ...Object.entries(t.neutral).map(([k, v]) => `--wx-color-${k}: ${ld(v)};`),
  ...accentVars(t.products.wixzel.accent),
  ...Object.entries(t.status).flatMap(([name, roles]) => [
    `--wx-color-${name}: ${ld(roles.solid)};`,
    `--wx-color-${name}-fg: ${ld(roles.onSolid)};`,
    `--wx-color-${name}-subtle: ${ld(roles.subtle)};`,
    `--wx-color-${name}-ink: ${ld(roles.ink)};`,
  ]),
  ...Object.entries(t.chart).map(([k, v]) => `--wx-color-${k}: ${ld(v)};`),
  ...Object.entries(t.radius).map(([k, v]) => `--wx-radius-${k}: ${v};`),
  ...Object.entries(t.shadow).map(
    ([k, layers]) =>
      `--wx-shadow-${k}: ${layers.map(([geo, l, d]) => `${geo} light-dark(${l}, ${d})`).join(", ")};`,
  ),
  `--wx-font-sans: ${t.font.sans};`,
  `--wx-font-mono: ${t.font.mono};`,
  ...Object.entries(t.text).flatMap(([k, [size, lh, ls, fw]]) => [
    `--wx-text-${k}: ${size};`,
    `--wx-text-${k}-lh: ${lh};`,
    `--wx-text-${k}-ls: ${ls};`,
    `--wx-text-${k}-fw: ${fw};`,
  ]),
  ...Object.entries(t.motion.duration).map(([k, v]) => `--wx-duration-${k}: ${v};`),
  ...Object.entries(t.motion.ease).map(([k, v]) => `--wx-ease-${kebab(k)}: ${v};`),
  ...Object.entries(t.control).map(([k, v]) => `--wx-control-${k}: ${v};`),
  ...Object.entries(t.z).map(([k, v]) => `--wx-z-${k}: ${v};`),
];

const productBlocks = [
  ...Object.entries(t.products)
    .filter(([name]) => name !== "wixzel")
    .map(([name, p]) => `[data-product="${name}"] {\n  ${productVars(p).join("\n  ")}\n}`),
  ...Object.entries(t.productAliases).map(
    ([alias, target]) =>
      `[data-product="${alias}"] {\n  ${productVars(t.products[target]).join("\n  ")}\n}`,
  ),
  // Resetting to the master brand inside another product's island.
  `[data-product="wixzel"] {\n  ${productVars(t.products.wixzel).join("\n  ")}\n}`,
];

// A themed island redeclares its colours: Chrome resolves light-dark() inside a
// custom property where the property is declared, so values inherited from
// :root keep the page's scheme and a light island on a dark page stays dark.
// :where() keeps these at zero specificity, so .wx-plane-overlay still wins.
const isColour = (decl: string) => decl.startsWith("--wx-color-") || decl.startsWith("--wx-shadow-");
const shared = root.filter((d) => /^--wx-(color-(success|warning|danger|info|chart)|shadow-)/.test(d));
// The master brand and its aliases first: <html> usually carries one of them,
// and a product region inside it must win, since all these rules tie at zero.
const islandProducts: [string, t.ProductTheme][] = [
  ["wixzel", t.products.wixzel],
  ...Object.entries(t.productAliases).map(([alias, target]): [string, t.ProductTheme] => [alias, t.products[target]]),
  ...Object.entries(t.products).filter(([name]) => name !== "wixzel"),
];
const islandBlock = [
  `:where([data-theme]:not([data-product])) {\n  ${root.filter(isColour).join("\n  ")}\n}`,
  `:where([data-theme][data-product]) {\n  ${shared.join("\n  ")}\n}`,
  ...islandProducts.map(
    ([name, p]) => `:where([data-product="${name}"] [data-theme]:not([data-product])) {\n  ${productVars(p).filter(isColour).join("\n  ")}\n}`,
  ),
].join("\n");

const tokensCss = `/* Wixzel UI tokens. Generated by packages/tokens/scripts/build.ts; edit src/tokens.ts. */
:root {
  ${root.join("\n  ")}
}

/* Theme: no attribute follows the OS; an attribute forces it, on <html> or any island. */
[data-theme="light"] { color-scheme: light; }
[data-theme="dark"] { color-scheme: dark; }

/* Squircle corners. Browsers without corner-shape keep the round fallback radii above. */
@supports (corner-shape: squircle) {
${squircleBlock}
}

/* Products. Each one's hue washes the page, surfaces, lines and text, not only the accent. */
${productBlocks.join("\n\n")}

/* Themed islands, so a light region on a dark page (or the reverse) takes its own colours. */
${islandBlock}
`;

// -------------------------------------------------------------- tailwind.css
const colorNames = [
  ...Object.keys(t.neutral),
  ...Object.keys(t.products.wixzel.accent).map(kebab),
  "focus",
  ...Object.keys(t.status).flatMap((s) => [s, `${s}-fg`, `${s}-subtle`, `${s}-ink`]),
  ...Object.keys(t.chart),
];

const theme = [
  "--color-*: initial;",
  "--color-transparent: transparent;",
  "--color-current: currentColor;",
  "--color-white: #fff;",
  "--color-black: #000;",
  ...colorNames.map((n) => `--color-${n}: var(--wx-color-${n});`),
  "--radius-*: initial;",
  ...Object.keys(t.radius).map((k) => `--radius-${k}: var(--wx-radius-${k});`),
  "--shadow-*: initial;",
  ...Object.keys(t.shadow).map((k) => `--shadow-${k}: var(--wx-shadow-${k});`),
  "--font-sans: var(--wx-font-sans);",
  "--font-mono: var(--wx-font-mono);",
  ...Object.keys(t.text).flatMap((k) => [
    `--text-${k}: var(--wx-text-${k});`,
    `--text-${k}--line-height: var(--wx-text-${k}-lh);`,
    `--text-${k}--letter-spacing: var(--wx-text-${k}-ls);`,
    `--text-${k}--font-weight: var(--wx-text-${k}-fw);`,
  ]),
  ...Object.keys(t.motion.ease).map((k) => `--ease-${kebab(k)}: var(--wx-ease-${kebab(k)});`),
  ...Object.keys(t.control).map((k) => `--spacing-control-${k}: var(--wx-control-${k});`),
];

const tailwindCss = `/* Wixzel UI for Tailwind v4. Generated by packages/tokens/scripts/build.ts.
   Usage:  @import "tailwindcss";  @import "@wixzel/tokens/tailwind.css"; */
@import "./tokens.css";

/* dark: follows data-theme when it is set, and the OS when it is not. */
@custom-variant dark {
  &:where([data-theme="dark"], [data-theme="dark"] *) { @slot; }
  @media (prefers-color-scheme: dark) {
    &:where(:not([data-theme="light"], [data-theme="light"] *)) { @slot; }
  }
}

@theme inline {
  ${theme.join("\n  ")}

  --animate-wx-fade-in: wx-fade-in var(--wx-duration-enter) var(--wx-ease-move);
  --animate-wx-fade-out: wx-fade-out var(--wx-duration-fast) var(--wx-ease-standard);
  --animate-wx-pop-in: wx-pop-in var(--wx-duration-enter) var(--wx-ease-move);
  --animate-wx-pop-out: wx-pop-out var(--wx-duration-fast) var(--wx-ease-standard);
  --animate-wx-rise-in: wx-rise-in var(--wx-duration-enter) var(--wx-ease-move);
  --animate-wx-rise-out: wx-rise-out var(--wx-duration-base) var(--wx-ease-standard);
  --animate-wx-shimmer: wx-shimmer 1.8s var(--wx-ease-in-out) infinite;
  --animate-wx-spin: wx-spin 0.8s linear infinite;
  --animate-wx-pulse: wx-pulse 2s var(--wx-ease-out) infinite;
}

/* Everything arrives by sharpening out of a blur; it leaves with a quick fade. */
@keyframes wx-fade-in { from { opacity: 0; filter: blur(8px); } }
@keyframes wx-fade-out { to { opacity: 0; } }
/* Floating surfaces also drift a few pixels from their trigger (Radix sets --wx-pop-y). */
@keyframes wx-pop-in { from { opacity: 0; filter: blur(8px); transform: translateY(var(--wx-pop-y, -2px)); } }
@keyframes wx-pop-out { to { opacity: 0; filter: blur(4px); } }
@keyframes wx-rise-in { from { opacity: 0; filter: blur(10px); transform: translateY(6px); } }
@keyframes wx-rise-out { to { opacity: 0; filter: blur(4px); } }
@keyframes wx-shimmer { from { background-position: 100% 0; } to { background-position: -100% 0; } }
@keyframes wx-spin { to { transform: rotate(360deg); } }

/* A live signal: a ring that expands and fades. */
@keyframes wx-pulse { 0% { opacity: 0.55; transform: scale(1); } 70%, 100% { opacity: 0; transform: scale(2.6); } }

/* Keyboard focus: a 2px accent ring with a 2px gap that follows the shape. */
@utility wx-focus {
  &:focus-visible {
    outline: 2px solid var(--wx-color-focus);
    outline-offset: 2px;
  }
}

@layer base {
  html {
    font-family: var(--wx-font-sans);
    background: var(--wx-color-bg);
    color: var(--wx-color-fg);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
  ::selection {
    background: var(--wx-color-accent);
    color: var(--wx-color-accent-fg);
  }
  :focus-visible {
    outline: 2px solid var(--wx-color-focus);
    outline-offset: 2px;
  }
  /* Squircle corners everywhere they are supported; full rounding stays a true circle. */
  @supports (corner-shape: squircle) {
    *, ::before, ::after { corner-shape: squircle; }
    :where([class*="rounded-full"]) { corner-shape: round; }
  }
  /* Reduced motion cuts animations to their last frame, except status motion
     that would otherwise vanish (the spinner), which slows down instead. */
  @media (prefers-reduced-motion: reduce) {
    :where(*:not(.wx-motion-essential, .wx-motion-essential *)), :where(*:not(.wx-motion-essential))::before, :where(*:not(.wx-motion-essential))::after {
      animation-duration: 1ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 1ms !important;
    }
  }
}
`;

writeFileSync(join(dist, "tokens.css"), tokensCss);
writeFileSync(join(dist, "tailwind.css"), tailwindCss);
writeFileSync(
  join(dist, "tokens.json"),
  JSON.stringify(
    {
      neutral: t.neutral,
      productSpecs: t.productSpecs,
      products: t.products,
      productAliases: t.productAliases,
      status: t.status,
      chart: t.chart,
      radius: t.radius,
      shadow: t.shadow,
      font: t.font,
      text: t.text,
      motion: t.motion,
      control: t.control,
      z: t.z,
    },
    null,
    2,
  ),
);
console.log("tokens: wrote dist/tokens.css, dist/tailwind.css, dist/tokens.json");
