import { execFileSync } from "node:child_process";
import { join } from "node:path";

const site = process.cwd();

/**
 * When a page's content last changed: the newest commit touching any of its
 * source files. Never the build date, which would claim every page changed on
 * every deploy. Undefined outside a git checkout, so the field is left out.
 */
export function lastModified(paths: string[]): string | undefined {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...paths.map((p) => join(site, p))], {
      cwd: site,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return out || undefined;
  } catch {
    return undefined;
  }
}

/** The source files behind each route, for lastModified. */
export const routeSources: Record<string, string[]> = {
  "/": ["app/page.tsx", "components/showcase.tsx", "components/theme-builder.tsx", "components/skill-install.tsx"],
  "/components/": ["app/components/page.tsx", "components/gallery.tsx"],
  "/facts/": ["app/facts/page.tsx", "lib/facts.ts"],
  "/docs/": ["app/docs/page.tsx", "lib/docs.ts"],
};

export const docSources = (file: string) => [join("..", "..", "skills", "wixzel-ui", file)];
