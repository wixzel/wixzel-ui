import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Doc } from "./docs";

const skill = join(process.cwd(), "..", "..", "skills", "wixzel-ui");

/** The markdown, without frontmatter or its own top heading (the page draws the title). */
export function readDoc(doc: Doc): string {
  const raw = readFileSync(join(skill, doc.file), "utf8");
  return raw.replace(/^---\n[\s\S]*?\n---\n/, "").replace(/^\s*# .*\n/, "");
}
