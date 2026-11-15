/**
 * Writes the site's files for language models and agents into
 * apps/site/public: llms.txt (what Wixzel UI is and where its docs are),
 * llms-full.txt (every doc in one file), and each doc as plain markdown at
 * /docs/<slug>.md. All of it comes from the skill's own files, so it never
 * drifts from what the site and the skill say.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { docs } from "../apps/site/lib/docs.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skill = join(root, "skills", "wixzel-ui");
const pub = join(root, "apps", "site", "public");
const SITE = "https://ui.wixzel.com";

const read = (file: string) =>
  readFileSync(join(skill, file), "utf8")
    .replace(/^---\n[\s\S]*?\n---\n/, "")
    // Links between skill files become links to the site's markdown copies.
    .replace(/\]\((?:references\/)?([a-z-]+)\.md\)/g, (_, name: string) => {
      const doc = docs.find((d) => d.file.endsWith(`/${name}.md`));
      return doc ? `](${SITE}/docs/${doc.slug}.md)` : `](${name}.md)`;
    });

mkdirSync(join(pub, "docs"), { recursive: true });
for (const d of docs) writeFileSync(join(pub, "docs", `${d.slug}.md`), `# ${d.title}\n\n${read(d.file).replace(/^\s*# .*\n/, "")}`);

const llms = `# Wixzel UI

> Wixzel UI is the open-source design system behind every Wixzel product: React and Flutter components, a whole palette from one seed colour with every text pair passing WCAG AA, and a Claude skill that converts any project to Wixzel UI. MIT-licensed, made by Wixzel.

- Web package: wixzel-ui on npm (React 19, Tailwind CSS v4). Seed colour CLI: npx wixzel-ui --seed "#RRGGBB"
- Flutter package: wixzel_ui on pub.dev (Flutter 3.41+). Theme from a seed: wxDeriveProduct(Color(0xFFRRGGBB))
- Source: https://github.com/wixzel/wixzel-ui
- Claude Code: /plugin marketplace add wixzel/wixzel-ui, then /plugin install wixzel-ui@wixzel

## Docs

${docs.map((d) => `- [${d.title}](${SITE}/docs/${d.slug}.md): ${d.description}`).join("\n")}

## Optional

- [Wixzel UI facts](${SITE}/facts/): the official answers in one place
- [Every component, live](${SITE}/components/)
- [All docs in one file](${SITE}/llms-full.txt)
- [The Claude skill's SKILL.md](${SITE}/SKILL.md)
`;
writeFileSync(join(pub, "llms.txt"), llms);

const full = [
  "# Wixzel UI: all docs\n\n> " + llms.split("\n> ")[1]!.split("\n")[0],
  ...docs.map((d) => `\n\n---\n\n# ${d.title}\n\nSource: ${SITE}/docs/${d.slug}/\n\n${read(d.file).replace(/^\s*# .*\n/, "").trim()}`),
].join("");
writeFileSync(join(pub, "llms-full.txt"), `${full}\n`);

console.log(`llms: wrote llms.txt, llms-full.txt and ${docs.length} docs as markdown`);
