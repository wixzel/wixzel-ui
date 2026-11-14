/**
 * Runs after tsup. The JavaScript already carries the tokens inside it; the
 * types still import "@wixzel/tokens", a workspace package that is never
 * published. Ship the tokens' own declarations as dist/tokens.d.ts and point
 * every other declaration file at it.
 */
import { copyFileSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dist = "dist";
copyFileSync(join("..", "tokens", "dist", "index.d.ts"), join(dist, "tokens.d.ts"));

for (const file of readdirSync(dist).filter((f) => f.endsWith(".d.ts") && f !== "tokens.d.ts")) {
  const path = join(dist, file);
  const src = readFileSync(path, "utf8");
  const out = src.replaceAll(/(["'])@wixzel\/tokens\1/g, '"./tokens.js"');
  if (out !== src) writeFileSync(path, out);
}
