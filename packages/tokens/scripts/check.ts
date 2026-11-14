/**
 * Contrast gate. Fails when any pair the components rely on drops below WCAG AA
 * in either theme, for any product. Run before touching a colour: pnpm check.
 */
import { contrast } from "../src/color.ts";
import * as t from "../src/tokens.ts";

const TEXT = 4.5;
const LINE = 3;
const failures: string[] = [];
let checked = 0;

function expect(label: string, fg: t.Pair, bg: t.Pair, min: number) {
  (["light", "dark"] as const).forEach((theme, i) => {
    const r = contrast(fg[i]!, bg[i]!);
    checked++;
    if (r < min) failures.push(`${theme.padEnd(5)} ${label}: ${r.toFixed(2)} < ${min}  (${fg[i]} on ${bg[i]})`);
  });
}

// Every product has its own tinted page, so every pair is checked per product.
for (const [name, { neutral: n, accent: a }] of Object.entries(t.products)) {
  const grounds = { bg: n.bg, "bg-subtle": n["bg-subtle"], card: n.card, surface: n.surface, "surface-overlay": n["surface-overlay"] };
  for (const [gName, g] of Object.entries(grounds)) {
    expect(`${name}: fg on ${gName}`, n.fg, g, TEXT);
    expect(`${name}: fg-muted on ${gName}`, n["fg-muted"], g, TEXT);
    expect(`${name}: fg-subtle on ${gName}`, n["fg-subtle"], g, TEXT);
    expect(`${name}: accent-ink on ${gName}`, a.accentInk, g, TEXT);
    expect(`${name}: accent-edge on ${gName}`, a.accentEdge, g, LINE);
  }
  expect(`${name}: fg-muted on bg-muted`, n["fg-muted"], n["bg-muted"], TEXT);
  expect(`${name}: fg-inverse on bg-inverse`, n["fg-inverse"], n["bg-inverse"], TEXT);
  expect(`${name}: accent-fg on accent`, a.accentFg, a.accent, TEXT);
  expect(`${name}: accent-fg on accent-hover`, a.accentFg, a.accentHover, TEXT);
  expect(`${name}: accent-ink on accent-subtle`, a.accentInk, a.accentSubtle, TEXT);
  for (const [status, st] of Object.entries(t.status)) {
    expect(`${name}: ${status} ink on bg`, st.ink, n.bg, TEXT);
    expect(`${name}: ${status} ink on surface`, st.ink, n.surface, TEXT);
  }
}

for (const [name, s] of Object.entries(t.status)) {
  expect(`${name}: fg on solid`, s.onSolid, s.solid, TEXT);
  expect(`${name}: ink on subtle`, s.ink, s.subtle, TEXT);
}

for (const [name, c] of Object.entries(t.chart)) expect(`${name} on surface`, c, t.neutral.surface, LINE);

if (failures.length) {
  console.error(`contrast: ${failures.length} of ${checked} pairs fail\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
console.log(`contrast: all ${checked} pairs pass AA`);
