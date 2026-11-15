import type { Metadata } from "next";
import { brand, socials } from "wixzel-ui/utils";

export const SITE_URL = "https://ui.wixzel.com";
export const GITHUB_URL = "https://github.com/wixzel/wixzel-ui";

/**
 * The phrases the project owns. They are repeated word for word across pages,
 * structured data, the README and profiles, so search and answer engines bind
 * them to Wixzel UI. Change them here and nowhere else.
 */
export const CONCEPT = {
  name: "Wixzel UI",
  what: "the open-source design system behind every Wixzel product",
  oneSeed: "a whole palette from one seed colour",
  platforms: "React and Flutter",
  skill: "a Claude skill that converts any project to Wixzel UI",
} as const;

export const SITE_DESCRIPTION =
  "Wixzel UI is the open-source design system behind every Wixzel product: React and Flutter components, a whole palette from one seed colour with every text pair passing WCAG AA, and a Claude skill that converts any project to Wixzel UI.";

const OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: "Wixzel UI: calm screens, crafted components" };

/** A page's metadata: its own title, description and canonical URL, and a social preview to match. */
export function pageMetadata({ path, title, description }: { path: string; title?: string; description: string }): Metadata {
  const fullTitle = title ? `${title} | Wixzel UI` : undefined;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Wixzel UI",
      url: path,
      title: fullTitle ?? "Wixzel UI: calm screens, crafted components",
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle ?? "Wixzel UI: calm screens, crafted components",
      description,
      images: [OG_IMAGE.url],
    },
  };
}

const abs = (path: string) => new URL(path, SITE_URL).toString();

export const organization = {
  "@type": "Organization",
  "@id": `${brand.href}/#organization`,
  name: brand.name,
  url: brand.href,
  logo: abs("/wixzel_black.png"),
  sameAs: socials.map((s) => s.href),
};

export const website = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Wixzel UI",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  publisher: { "@id": organization["@id"] },
  inLanguage: "en",
};

/** The project itself: what a "what is Wixzel UI" answer should be built from. */
export const sourceCode = {
  "@type": "SoftwareSourceCode",
  "@id": `${SITE_URL}/#software`,
  name: "Wixzel UI",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  codeRepository: GITHUB_URL,
  license: "https://opensource.org/licenses/MIT",
  programmingLanguage: ["TypeScript", "Dart"],
  runtimePlatform: ["React", "Next.js", "Flutter"],
  keywords: ["design system", "React components", "Flutter widgets", "Tailwind CSS v4", "design tokens", "OKLCH", "WCAG AA", "Claude skill"],
  author: { "@id": organization["@id"] },
  publisher: { "@id": organization["@id"] },
};

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: abs(item.path) })),
  };
}

export function faqPage(faqs: readonly { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function techArticle({ path, title, description, modified }: { path: string; title: string; description: string; modified?: string }) {
  return {
    "@type": "TechArticle",
    headline: title,
    description,
    url: abs(path),
    ...(modified ? { dateModified: modified } : {}),
    about: { "@id": sourceCode["@id"] },
    author: { "@id": organization["@id"] },
    publisher: { "@id": organization["@id"] },
    isPartOf: { "@id": website["@id"] },
  };
}
