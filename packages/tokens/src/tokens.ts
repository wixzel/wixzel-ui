/**
 * Wixzel UI design tokens. The one source of truth: scripts/build.ts turns this
 * file into CSS variables, a Tailwind v4 theme and JSON, and scripts/check.ts
 * verifies every contrast pair below in both themes and for every product.
 *
 * Colours are [light, dark] pairs. They compile to CSS `light-dark()`, so a
 * `data-theme="dark"` island inside a light page (or the reverse) just works.
 */
import { contrast, oklch, toOklch } from "./color.ts";

export type Pair = readonly [light: string, dark: string];

/**
 * A product's accent. Six roles, because one colour cannot do every job:
 * a lime that is a great fill is unreadable as text on paper.
 */
export interface Accent {
  /** The fill of the primary action. */
  accent: Pair;
  accentHover: Pair;
  /** Text and icons sitting ON the accent fill. */
  accentFg: Pair;
  /** A wash for selected rows and soft buttons, a step stronger than the tinted page. */
  accentSubtle: Pair;
  /** The accent as text on the page (links, soft button labels). 4.5:1. */
  accentInk: Pair;
  /** The accent as a line that must be seen: focus rings, selected borders, indicators. 3:1. */
  accentEdge: Pair;
}

/**
 * What a product team sets. One seed colour is enough: the page, surfaces,
 * lines and text are all tinted with its hue, and the accent roles are derived
 * from it until each one passes contrast. A Wixzel product is never grey; it is
 * washed in its own colour.
 */
export interface ProductSpec {
  /** The product's colour. */
  seed: string;
  /** How strongly the hue washes the neutrals. 0 is grey; the default 0.45 is a subtle wash. */
  tint?: number;
  /** Tint with this hue instead of the seed's (for a seed with no hue, like ink). */
  hue?: number;
  /** Corner scale. 1 is standard; below 1 is sharper, above is rounder. */
  radius?: number;
  /** A different sans-serif, as a CSS font-family list. */
  font?: string;
  /** Hand-tuned roles that win over the derived ones. */
  accent?: Partial<Accent>;
}

export const productSpecs = {
  /** The Wixzel master brand: ink on warm paper. Also Wixzel One. */
  wixzel: {
    seed: "#0A0A0A",
    hue: 95,
    tint: 0.16,
    accent: {
      accent: ["#0A0A0A", "#F4F4F2"],
      accentHover: ["#2B2B28", "#FFFFFF"],
      accentSubtle: ["#EDEDE8", "#232321"],
      accentFg: ["#FAFAF8", "#0E0E0D"],
      accentInk: ["#0A0A0A", "#F4F4F2"],
      accentEdge: ["#0A0A0A", "#F4F4F2"],
    },
  },
  voice: { seed: "#A0D425" },
  intellicall: { seed: "#7C3AED" },
  whatsagent: { seed: "#15803D" },
  autopilot: { seed: "#02BBFF" },
  feedkraft: { seed: "#4F46E5" },
  edu: { seed: "#2563EB" },
  untimed: { seed: "#2FBD8B" },
} as const satisfies Record<string, ProductSpec>;

/** Aliases: products that share another's look. */
export const productAliases = { one: "wixzel", store: "wixzel" } as const;

export type Product = keyof typeof productSpecs | keyof typeof productAliases;

/**
 * The neutral ramp as OKLCH lightness and chroma at a tint of 1. Lightness is
 * the same in every product, so contrast holds; only the hue changes.
 */
const ramp = {
  /** The page: the lightest plane in light mode, the deepest in dark. */
  bg: [[0.99, 0.008], [0.165, 0.032]],
  /** Sidebars and quiet bands. */
  "bg-subtle": [[0.955, 0.024], [0.19, 0.036]],
  /** Fields, hover fills, tracks, skeletons. */
  "bg-muted": [[0.925, 0.03], [0.255, 0.042]],
  /** Panels: a tinted fill instead of a border. Cards, sections, tables, tiles. */
  card: [[0.958, 0.022], [0.205, 0.04]],
  /** Raised controls that sit on a panel: the secondary button, a checkbox. */
  surface: [[0.997, 0.004], [0.245, 0.042]],
  /** Menus, popovers, dialogs. */
  "surface-overlay": [[0.997, 0.004], [0.25, 0.045]],
  border: [[0.895, 0.032], [0.29, 0.045]],
  /** Dividers and outlines that must read as edges. */
  "border-strong": [[0.81, 0.04], [0.385, 0.05]],
  fg: [[0.21, 0.035], [0.965, 0.012]],
  "fg-muted": [[0.44, 0.045], [0.79, 0.03]],
  "fg-subtle": [[0.51, 0.045], [0.69, 0.035]],
  "fg-disabled": [[0.74, 0.03], [0.46, 0.03]],
} as const satisfies Record<string, readonly [light: readonly [number, number], dark: readonly [number, number]]>;

export type NeutralRole = keyof typeof ramp | "fg-inverse" | "bg-inverse" | "overlay";

export interface ProductTheme {
  neutral: Record<NeutralRole, Pair>;
  accent: Accent;
  radius: number;
  font?: string;
}

function deriveNeutral(hue: number, strength: number): Record<NeutralRole, Pair> {
  const out = {} as Record<NeutralRole, Pair>;
  for (const [role, [[ll, lc], [dl, dc]]] of Object.entries(ramp)) {
    out[role as keyof typeof ramp] = [oklch(ll, lc * strength, hue), oklch(dl, dc * strength, hue)];
  }
  out["fg-inverse"] = out.bg;
  out["bg-inverse"] = out.fg;
  // The scrim is a deep shade of the hue, so dimming the page doesn't turn it grey.
  out.overlay = [`${oklch(0.18, 0.03 * strength, hue)}6B`, `${oklch(0.06, 0.01 * strength, hue)}A0`];
  return out;
}

/** Walks lightness away from the grounds until the colour clears `min` against all of them. */
function readable(seed: { c: number; h: number }, from: number, step: number, grounds: string[], min: number): string {
  for (let l = from; l >= 0 && l <= 1; l += step) {
    const hex = oklch(l, seed.c, seed.h);
    if (grounds.every((g) => contrast(hex, g) >= min)) return hex;
  }
  return step < 0 ? "#000000" : "#FFFFFF";
}

/**
 * Fills lighter than this take a dark label (lime, sky, mint); darker ones take
 * a light label. WCAG 2's formula alone would put dark text on mid-tone fills
 * like teal, orange and amber, where it passes on paper and reads poorly.
 */
const LIGHT_LABEL_BELOW = 0.7;

function deriveAccent(spec: ProductSpec, n: Record<NeutralRole, Pair>): Accent {
  const s = toOklch(spec.seed);
  const light = oklch(0.985, 0.01, s.h);
  const deep = oklch(0.17, 0.02, s.h);
  // A fill that takes a light label is darkened just enough for it to reach 4.5:1.
  const fillFor = (fill: string): string => {
    const o = toOklch(fill);
    if (o.l >= LIGHT_LABEL_BELOW) return fill;
    let out = fill;
    for (let l = o.l; contrast(light, out) < 4.5 && l > 0; ) {
      l -= 0.01;
      out = oklch(l, o.c, o.h);
    }
    return out;
  };
  const dark = s.l < 0.45 ? oklch(0.62, s.c, s.h) : spec.seed;
  const accent: Pair = [fillFor(spec.seed), fillFor(dark)];
  const onFill = (fill: string): string => {
    if (toOklch(fill).l < LIGHT_LABEL_BELOW) return light;
    return contrast(light, fill) >= contrast(deep, fill) ? light : deep;
  };
  const accentFg: Pair = [onFill(accent[0]), onFill(accent[1])];
  const shift = (hex: string, by: number) => {
    const o = toOklch(hex);
    return oklch(o.l + by, o.c, o.h);
  };
  // Hover moves away from the text on it, so the label only gets clearer.
  const hover = (fill: string, fg: string) => shift(fill, toOklch(fg).l > 0.5 ? -0.04 : 0.04);
  const accentHover: Pair = [hover(accent[0], accentFg[0]), hover(accent[1], accentFg[1])];
  const accentSubtle: Pair = [oklch(0.94, Math.min(s.c, 0.07), s.h), oklch(0.27, Math.min(s.c, 0.06), s.h)];
  const grounds = (i: 0 | 1) =>
    [n.bg[i], n["bg-subtle"][i], n.card[i], n.surface[i], n["surface-overlay"][i], accentSubtle[i]];
  const accentInk: Pair = [
    readable(s, Math.min(s.l, 0.62), -0.01, grounds(0), 4.5),
    readable(s, Math.max(s.l, 0.7), 0.01, grounds(1), 4.5),
  ];
  const accentEdge: Pair = [
    readable(s, Math.min(s.l, 0.7), -0.01, grounds(0), 3),
    readable(s, Math.max(s.l, 0.6), 0.01, grounds(1), 3),
  ];
  return { accent, accentHover, accentFg, accentSubtle, accentInk, accentEdge, ...spec.accent };
}

/** A whole theme from one seed, the way every product above gets its own. */
export function deriveProduct(spec: ProductSpec): ProductTheme {
  const s = toOklch(spec.seed);
  const hue = spec.hue ?? s.h;
  // A greyish seed washes less: the tint follows how much colour the seed has.
  const strength = (spec.tint ?? 0.45) * (spec.hue === undefined ? Math.min(1, s.c / 0.08) : 1);
  const neutral = deriveNeutral(hue, strength);
  return { neutral, accent: deriveAccent(spec, neutral), radius: spec.radius ?? 1, font: spec.font };
}

/**
 * A theme's colours as the same --wx-color-* variables tokens.css declares for
 * each product, for a colour that is only known at runtime: a white-label
 * product whose owner picks its brand colour. Set them as inline style on
 * <html> (or any region) and the whole tree takes that colour.
 */
export function colorVariables(theme: ProductTheme): Record<string, string> {
  const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
  const ld = ([light, dark]: Pair) => (light === dark ? light : `light-dark(${light}, ${dark})`);
  const vars: Record<string, string> = {};
  for (const [role, pair] of Object.entries(theme.neutral)) vars[`--wx-color-${role}`] = ld(pair);
  for (const [role, pair] of Object.entries(theme.accent)) vars[`--wx-color-${kebab(role)}`] = ld(pair);
  vars["--wx-color-focus"] = "var(--wx-color-accent-edge)";
  return vars;
}

/** Every product's resolved theme. */
export const products = Object.fromEntries(
  Object.entries(productSpecs).map(([name, spec]) => [name, deriveProduct(spec)]),
) as Record<keyof typeof productSpecs, ProductTheme>;

/** The master brand's neutrals: the page every product falls back to. */
export const neutral = products.wixzel.neutral;

/** Status. Never used as an accent, never replaced by one. */
export const status = {
  success: {
    solid: ["#15803D", "#22C55E"],
    onSolid: ["#FFFFFF", "#0E0E0D"],
    subtle: ["#E7F4EB", "#0F2418"],
    ink: ["#166534", "#4ADE80"],
  },
  warning: {
    solid: ["#F2AE16", "#F2AE16"],
    onSolid: ["#1A1200", "#1A1200"],
    subtle: ["#FCF3DB", "#2A210A"],
    ink: ["#8A5300", "#F5C451"],
  },
  danger: {
    solid: ["#D92D20", "#D92D20"],
    onSolid: ["#FFFFFF", "#FFFFFF"],
    subtle: ["#FDECEA", "#2D1412"],
    ink: ["#B42318", "#F97066"],
  },
  info: {
    solid: ["#2563EB", "#2563EB"],
    onSolid: ["#FFFFFF", "#FFFFFF"],
    subtle: ["#E9EFFD", "#14203A"],
    ink: ["#1D4ED8", "#93B4FB"],
  },
} as const satisfies Record<string, Record<"solid" | "onSolid" | "subtle" | "ink", Pair>>;

/**
 * Chart series. Red and green are left out on purpose: they belong to status,
 * and a chart that spends red on "series two" can no longer say "this is wrong".
 */
export const chart = {
  "chart-1": ["#2563EB", "#5B8DEF"],
  "chart-2": ["#EA580C", "#F2803F"],
  "chart-3": ["#7C3AED", "#9F7AF8"],
  "chart-4": ["#0D9488", "#2DB8AB"],
  "chart-5": ["#B45309", "#D9862E"],
} as const satisfies Record<string, Pair>;

/**
 * Radius. Corners are squircles: the curve eases into the straight edge
 * instead of meeting it at a tangent, so even large radii stay crisp. Browsers
 * with CSS corner-shape get `squircle` below; others fall back to `radius`,
 * smaller round corners that read about the same size.
 */
export const radius = {
  xs: "5px",
  sm: "6px",
  md: "10px",
  lg: "16px",
  xl: "20px",
  full: "9999px",
} as const;

/** Squircle radii, used where `corner-shape: squircle` is supported. Controls 14px, panels 26px, dialogs 30px. */
export const squircle = {
  xs: "7px",
  sm: "9px",
  md: "14px",
  lg: "26px",
  xl: "30px",
} as const;

/**
 * Depth is hard-edged: hairline rings and 1px drops with no blur on controls,
 * tight shadows on overlays. Dark mode swaps the drops for light hairlines.
 */
export const shadow = {
  xs: [
    ["0 1px 2px", "rgb(24 22 10 / 0.06)", "rgb(0 0 0 / 0)"],
    ["0 0 0 1px", "rgb(0 0 0 / 0)", "rgb(255 255 255 / 0.05)"],
  ],
  sm: [
    ["0 1px 3px", "rgb(24 22 10 / 0.08)", "rgb(0 0 0 / 0.5)"],
    ["0 0 0 1px", "rgb(0 0 0 / 0)", "rgb(255 255 255 / 0.06)"],
  ],
  md: [
    ["0 4px 10px -3px", "rgb(24 22 10 / 0.12)", "rgb(0 0 0 / 0.55)"],
    ["0 1px 2px", "rgb(24 22 10 / 0.06)", "rgb(0 0 0 / 0)"],
    ["0 0 0 1px", "rgb(0 0 0 / 0)", "rgb(255 255 255 / 0.07)"],
  ],
  lg: [
    ["0 10px 24px -8px", "rgb(24 22 10 / 0.18)", "rgb(0 0 0 / 0.65)"],
    ["0 1px 3px", "rgb(24 22 10 / 0.05)", "rgb(0 0 0 / 0)"],
    ["0 0 0 1px", "rgb(0 0 0 / 0)", "rgb(255 255 255 / 0.08)"],
  ],
  xl: [
    ["0 20px 44px -12px", "rgb(24 22 10 / 0.26)", "rgb(0 0 0 / 0.75)"],
    ["0 1px 3px", "rgb(24 22 10 / 0.06)", "rgb(0 0 0 / 0)"],
    ["0 0 0 1px", "rgb(0 0 0 / 0)", "rgb(255 255 255 / 0.09)"],
  ],
  /** A surface that sits on the page: one firm hairline, the same weight on all four sides, and a soft shadow below. */
  raised: [
    ["0 0 0 1px", "rgb(24 22 10 / 0.17)", "rgb(255 255 255 / 0.13)"],
    ["0 1px 3px", "rgb(24 22 10 / 0.07)", "rgb(0 0 0 / 0.45)"],
  ],
  /** The same control held down: the drop goes and a shadow falls inside. */
  pressed: [
    ["0 0 0 1px", "rgb(24 22 10 / 0.2)", "rgb(255 255 255 / 0.1)"],
    ["inset 0 1px 1px", "rgb(24 22 10 / 0.12)", "rgb(0 0 0 / 0.55)"],
  ],
  /** A field you type into sits a hair below the page. */
  field: [["inset 0 1px 2px", "rgb(24 22 10 / 0.05)", "rgb(0 0 0 / 0.2)"]],
} as const satisfies Record<string, ReadonlyArray<readonly [geometry: string, light: string, dark: string]>>;

/** One family: Manrope. Load it with next/font (variable --font-manrope) or Google Fonts. */
export const font = {
  sans: 'var(--font-manrope, "Manrope"), ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  mono: 'var(--font-mono-face, "JetBrains Mono"), ui-monospace, "SF Mono", Menlo, Consolas, monospace',
} as const;

/**
 * [size, line-height, letter-spacing, weight]. Comfortable density: body text
 * is 14-15px. Headings are bold and drawn in tight.
 */
export const text = {
  "display-xl": ["3.5rem", "4rem", "-0.035em", "700"],
  "display-lg": ["2.75rem", "3.25rem", "-0.03em", "700"],
  "display-md": ["2.25rem", "2.75rem", "-0.028em", "700"],
  "heading-xl": ["1.875rem", "2.375rem", "-0.024em", "700"],
  "heading-lg": ["1.5rem", "2rem", "-0.02em", "700"],
  "heading-md": ["1.1875rem", "1.625rem", "-0.016em", "700"],
  "heading-sm": ["1.0625rem", "1.5rem", "-0.012em", "700"],
  "body-lg": ["1.0625rem", "1.75rem", "-0.003em", "400"],
  "body-md": ["0.9375rem", "1.5rem", "0em", "400"],
  "body-sm": ["0.875rem", "1.375rem", "0em", "400"],
  caption: ["0.8125rem", "1.125rem", "0.003em", "400"],
  /** Uppercase eyebrows and table group labels. */
  overline: ["0.75rem", "1rem", "0.06em", "600"],
} as const satisfies Record<string, readonly [string, string, string, string]>;

/**
 * Motion is snappy: moving parts start fast and land softly in about 150ms,
 * with no overshoot. Colour changes are quicker still. Things arrive by
 * sharpening out of a blur.
 */
export const motion = {
  duration: { instant: "70ms", fast: "110ms", base: "150ms", slow: "220ms", move: "150ms", enter: "270ms" },
  ease: {
    out: "cubic-bezier(0.16, 1, 0.3, 1)",
    inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    move: "cubic-bezier(0.2, 0.9, 0.25, 1)",
  },
} as const;

/** Control heights. Comfortable: a default control is 38px. */
export const control = { xs: "28px", sm: "32px", md: "38px", lg: "44px" } as const;

export const z = {
  sticky: "40",
  dropdown: "50",
  overlay: "60",
  modal: "70",
  popover: "80",
  toast: "90",
  tooltip: "100",
} as const;

