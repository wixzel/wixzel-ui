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
}

export const docs: Doc[] = [
  { slug: "skill", title: "The Claude skill", label: "Claude skill", group: "Start", file: "SKILL.md" },
  { slug: "react", title: "Wixzel UI for React", label: "React", group: "Platforms", file: "references/react.md" },
  { slug: "flutter", title: "Wixzel UI for Flutter", label: "Flutter", group: "Platforms", file: "references/flutter.md" },
  { slug: "other-stacks", title: "Wixzel UI without React", label: "Vue, Svelte, HTML", group: "Platforms", file: "references/other-stacks.md" },
  { slug: "design-language", title: "The design language", label: "Design language", group: "Design", file: "references/design-language.md" },
  { slug: "checklist", title: "Is the conversion done?", label: "Checklist", group: "Design", file: "references/checklist.md" },
];

/** A link between skill files (`references/react.md`, `flutter.md`) as a docs URL. */
export function docHref(href: string): string {
  const match = href.match(/([a-z-]+)\.md(#.*)?$/i);
  if (!match) return href;
  const file = match[1]!.toLowerCase();
  const doc = docs.find((d) => d.file.endsWith(`${file}.md`) && d.file !== "SKILL.md");
  return doc ? `/docs/${doc.slug}/${match[2] ?? ""}` : href;
}
