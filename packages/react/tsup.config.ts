import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { defineConfig } from "tsup";

// The tokens are a workspace package bundled into wixzel-ui, so people install one thing.
const tokens = "../tokens/dist";

const shared = {
  format: ["esm"],
  dts: true,
  sourcemap: true,
  external: ["react", "react-dom", "tailwindcss"],
  noExternal: [/^@wixzel\/tokens/],
} as const;

// `pnpm build` empties dist first; the builds run side by side and must not clean each other's output.
export default defineConfig([
  {
    ...shared,
    entry: { index: "src/index.ts" },
    // Every component is a client component; Server Components can render them but not call them.
    banner: { js: '"use client";' },
    onSuccess: async () => {
      for (const file of ["tokens.css", "tailwind.css", "tokens.json"]) copyFileSync(`${tokens}/${file}`, `dist/${file}`);
      // In the workspace the stylesheet reads the tokens package; published, they sit beside it.
      const css = readFileSync("src/styles.css", "utf8").replace('@import "@wixzel/tokens/tailwind.css";', '@import "./tailwind.css";');
      writeFileSync("dist/styles.css", css);
    },
  },
  {
    ...shared,
    // No "use client": plain functions and strings for Server Components (utils, tokens),
    // and icons that draw duotone without context (icons).
    entry: { utils: "src/utils.ts", icons: "src/icons.ts", tokens: "src/tokens.ts" },
  },
  {
    ...shared,
    dts: false,
    sourcemap: false,
    entry: { cli: "../tokens/src/cli.ts" },
  },
]);
