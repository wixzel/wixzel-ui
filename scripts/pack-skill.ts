/**
 * Zips skills/wixzel-ui into dist/wixzel-ui-skill.zip, the file people upload
 * to Claude or unzip into ~/.claude/skills, and copies it into the site so
 * ui.wixzel.com serves the same file the GitHub release carries.
 *
 * The zip holds one folder, wixzel-ui/, with SKILL.md at its top.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const zip = join(root, "dist", "wixzel-ui-skill.zip");

mkdirSync(dirname(zip), { recursive: true });
rmSync(zip, { force: true });
execFileSync("zip", ["-rqX", zip, "wixzel-ui", "-x", "*.DS_Store"], { cwd: join(root, "skills") });
copyFileSync(zip, join(root, "apps", "site", "public", "wixzel-ui-skill.zip"));

console.log(`skill: wrote ${zip.slice(root.length + 1)}`);
