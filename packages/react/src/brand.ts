/**
 * The Wixzel product directory: the one list every product website reads for
 * its own name and for the family it belongs to. The switcher in the header,
 * the family row in the footer and any "other Wixzel products" grid all come
 * from here, so adding a product makes it appear on every site at once.
 *
 * Plain data, no React: a Server Component can import it from
 * `wixzel-ui/utils` and render the header on the server.
 *
 * Taglines and domains live here and nowhere else. Correct them in this file.
 */
import type { Product } from "@wixzel/tokens";

export interface BrandProduct {
  /** The product token, the same name `data-product` takes. */
  product: Product;
  /** How the name is written after the wordmark: "Wixzel Voice". */
  name: string;
  /** One line, under ten words, in plain language. Used in the switcher and the family row. */
  tagline: string;
  /** The product's own site, absolute, so links work from any other product's site. */
  href: string;
  /** Left out of the switcher and the family row (the master brand, internal tools). */
  unlisted?: boolean;
}

export const brandProducts: readonly BrandProduct[] = [
  {
    product: "voice",
    name: "Wixzel Voice",
    tagline: "One API for every voice engine and carrier.",
    href: "https://voice.wixzel.com",
  },
  {
    product: "store",
    name: "Wixzel Store",
    tagline: "Zero-commission marketplace for digital products.",
    href: "https://store.wixzel.com",
  },
  {
    product: "intellicall",
    name: "IntelliCallAI",
    tagline: "White-label voice agents that call, qualify and book.",
    href: "https://intellicallai.wixzel.com",
  },
  {
    product: "feedkraft",
    name: "Feedkraft",
    tagline: "Social posts written, scheduled and published.",
    href: "https://feedkraft.wixzel.com",
  },
  {
    product: "one",
    name: "Wixzel One",
    tagline: "One account for every Wixzel product.",
    href: "https://wixzel.com/products/wixzelone",
  },
  {
    product: "autopilot",
    name: "AutoPilotAI",
    tagline: "Automation across the browser and the desktop.",
    href: "https://wixzel.com/products/autopilotai",
  },
  {
    product: "whatsagent",
    name: "WhatsAgentAI",
    tagline: "An agent on your WhatsApp business number.",
    href: "https://wixzel.com/products/whatsagentai",
  },
  {
    product: "edu",
    name: "WixzelEdu",
    tagline: "A learning platform under your own name.",
    href: "https://wixzel.com/products/wixzeledu",
  },
  // No seed of their own in tokens.ts yet, so they wear the master brand's ink.
  // Give either one a seed there and its dot and site take its own colour.
  {
    product: "wixzel",
    name: "BookraftAI",
    tagline: "Print-ready books from a prompt.",
    href: "https://wixzel.com/products/bookraftai",
  },
  {
    product: "wixzel",
    name: "RevDroid",
    tagline: "Android APK analysis that never uploads the APK.",
    href: "https://wixzel.com/products/revdroid",
  },
  {
    product: "untimed",
    name: "Untimed",
    tagline: "Plan by what matters, not by the clock.",
    href: "https://wixzel.com/products",
    // Has its colour but no site of its own yet: list it once it has one.
    unlisted: true,
  },
  {
    product: "wixzel",
    name: "Wixzel",
    tagline: "The company behind all of it.",
    href: "https://wixzel.com",
    unlisted: true,
  },
];

/** Everything the switcher and the family row show, in the order they show it. */
export const listedProducts: readonly BrandProduct[] = brandProducts.filter((p) => !p.unlisted);

/** One product by its token, for a site that only knows which product it is. */
export function brandProduct(product: Product): BrandProduct | undefined {
  return brandProducts.find((p) => p.product === product);
}

/** One product by the name it is written with, for the rows that share the master brand's token. */
export function brandProductByName(name: string): BrandProduct | undefined {
  return brandProducts.find((p) => p.name === name);
}

/**
 * The company's own accounts. Every product site links to these, never to a
 * product's own: there is one Wixzel voice in public.
 */
export const socials = [
  { name: "X", href: "https://x.com/wixzelhq" },
  { name: "GitHub", href: "https://github.com/wixzel" },
  { name: "YouTube", href: "https://www.youtube.com/@wixzel" },
  { name: "LinkedIn", href: "https://linkedin.com/company/wixzel" },
  { name: "Instagram", href: "https://instagram.com/wixzel" },
] as const satisfies readonly { name: string; href: string }[];

/**
 * The company. Every site's legal line is built from this and the current year
 * — "© 2026 Wixzel. All rights reserved." — so no product ever claims the
 * copyright for itself.
 */
export const brand = {
  name: "Wixzel",
  href: "https://wixzel.com",
} as const;
