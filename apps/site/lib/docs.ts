/**
 * The docs are the skill's own files, so what a person reads here and what
 * Claude reads while converting a project are the same words.
 */
export interface Doc {
  slug: string;
  title: string;
  /** Shorter name for the sidebar. */
  label: string;
  group: "Start" | "Platforms" | "Design";
  file: string;
  /** The search result snippet and the answer an engine can lift: what this page tells you. */
  description: string;
}

export const docs: Doc[] = [
  { slug: "skill", title: "The Claude skill", label: "Claude skill", group: "Start", file: "SKILL.md", description: "Install the Wixzel UI Claude skill in Claude Code, the Claude app or any agent, then ask Claude to convert any React, Next.js, Vue, Svelte, HTML or Flutter project to Wixzel UI." },
  { slug: "react", title: "Wixzel UI for React", label: "React", group: "Platforms", file: "references/react.md", description: "Use Wixzel UI in React and Next.js: install wixzel-ui, set your brand colour with one seed, load Manrope and the provider, and map shadcn/ui, MUI, Chakra or Bootstrap components to Wixzel UI." },
  { slug: "flutter", title: "Wixzel UI for Flutter", label: "Flutter", group: "Platforms", file: "references/flutter.md", description: "Use Wixzel UI in Flutter: add wixzel_ui, derive a whole theme from your brand colour with wxDeriveProduct, and replace Material widgets with Wx widgets." },
  { slug: "other-stacks", title: "Wixzel UI without React", label: "Vue, Svelte, HTML", group: "Platforms", file: "references/other-stacks.md", description: "Use Wixzel UI without React: the tokens as CSS variables and a Tailwind v4 theme, plus class recipes for Vue, Svelte, Angular, Astro and plain HTML." },
  { slug: "design-language", title: "The design language", label: "Design language", group: "Design", file: "references/design-language.md", description: "The Wixzel UI design language: calm structure, tonal planes, squircle corners, colour through everything, snappy motion, and the details of every component." },
  { slug: "checklist", title: "Is the conversion done?", label: "Checklist", group: "Design", file: "references/checklist.md", description: "The checklist for finishing a conversion to Wixzel UI: it still works, nothing the project had is gone, it looks like Wixzel UI, and both themes hold at every size." },
];

/** A link between skill files (`references/react.md`, `flutter.md`) as a docs URL. */
export function docHref(href: string): string {
  const match = href.match(/([a-z-]+)\.md(#.*)?$/i);
  if (!match) return href;
  const file = match[1]!.toLowerCase();
  const doc = docs.find((d) => d.file.endsWith(`${file}.md`) && d.file !== "SKILL.md");
  return doc ? `/docs/${doc.slug}/${match[2] ?? ""}` : href;
}
