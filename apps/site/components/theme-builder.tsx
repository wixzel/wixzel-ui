"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Field,
  Input,
  Label,
  Slider,
  StatCard,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ThemeScope,
} from "wixzel-ui";
import { colorVariables, deriveProduct } from "wixzel-ui/tokens";
import { ChartLineUpIcon, MoonIcon, PlusIcon, SunIcon } from "wixzel-ui/icons";
import { cn } from "wixzel-ui/utils";
import { CodeBlock } from "./code-block";

const presets = ["#E4572E", "#A0D425", "#7C3AED", "#02BBFF", "#15803D", "#E11D48", "#D97706", "#0D9488", "#4F46E5"];
const hexPattern = /^#[0-9a-f]{6}$/i;

const codeClass = "[&_pre]:rounded-lg [&_pre]:bg-card [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-body-sm [&_pre]:text-fg [&_pre]:overflow-x-auto";

/** Pick a seed, see every component take it in both themes, and copy the code for your stack. */
export function ThemeBuilder() {
  const [seed, setSeed] = useState("#E4572E");
  const [draft, setDraft] = useState(seed);
  const [tint, setTint] = useState(0.45);
  const [dark, setDark] = useState(false);

  const vars = useMemo(() => colorVariables(deriveProduct({ seed, tint })), [seed, tint]);

  function choose(hex: string) {
    setSeed(hex.toUpperCase());
    setDraft(hex.toUpperCase());
  }

  const tintFlag = tint === 0.45 ? "" : ` --tint ${tint}`;
  const tintArg = tint === 0.45 ? "" : `, tint: ${tint}`;
  const dartColor = `Color(0xFF${seed.slice(1).toUpperCase()})`;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
      <Card className="flex flex-col gap-6 p-5">
        <Field label="Seed colour" hint="Your brand colour. Everything else is derived from it.">
          <Input
            value={draft}
            onChange={(e) => {
              const next = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
              setDraft(next);
              if (hexPattern.test(next)) setSeed(next.toUpperCase());
            }}
            leading={
              <input
                type="color"
                value={seed}
                onChange={(e) => choose(e.target.value)}
                aria-label="Pick a colour"
                className="size-5 cursor-pointer rounded-xs border-0 bg-transparent p-0 [&::-webkit-color-swatch]:rounded-xs [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
              />
            }
            spellCheck={false}
            aria-invalid={!hexPattern.test(draft)}
          />
        </Field>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Example colours">
          {presets.map((hex) => (
            <button
              key={hex}
              type="button"
              onClick={() => choose(hex)}
              aria-label={hex}
              aria-pressed={seed === hex}
              className={cn(
                "size-8 rounded-sm wx-focus transition-[scale] duration-(--wx-duration-instant) active:scale-90",
                seed === hex && "ring-2 ring-fg ring-offset-2 ring-offset-card",
              )}
              style={{ background: hex }}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label>Wash</Label>
            <span className="text-caption tabular-nums text-fg-subtle">{tint.toFixed(2)}</span>
          </div>
          <Slider value={[tint]} min={0} max={1} step={0.05} onValueChange={([v]) => setTint(v ?? 0.45)} aria-label="Wash" />
          <p className="text-caption text-fg-subtle">How strongly the hue tints the page, surfaces and text. 0 is grey.</p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="tb-dark" className="flex items-center gap-2">
            {dark ? <MoonIcon /> : <SunIcon />}
            Dark preview
          </Label>
          <Switch id="tb-dark" checked={dark} onCheckedChange={setDark} />
        </div>
      </Card>

      <div className="flex min-w-0 flex-col gap-6">
        <ThemeScope theme={dark ? "dark" : "light"}>
          <div data-brand-preview style={vars as React.CSSProperties} className="rounded-xl bg-bg p-4 sm:p-6">
            <Preview />
          </div>
        </ThemeScope>

        <Tabs defaultValue="css">
          <TabsList>
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="react">React, at runtime</TabsTrigger>
            <TabsTrigger value="flutter">Flutter</TabsTrigger>
          </TabsList>
          <TabsContent value="css" className="mt-4">
            <CodeBlock className={codeClass}>{`npx wixzel-ui --seed "${seed}"${tintFlag} > src/brand.css`}</CodeBlock>
          </TabsContent>
          <TabsContent value="react" className="mt-4">
            <CodeBlock className={codeClass}>
              {`import { colorVariables, deriveProduct } from "wixzel-ui/tokens";\n\nconst brand = colorVariables(deriveProduct({ seed: "${seed}"${tintArg} }));\n<html style={brand}>…</html>`}
            </CodeBlock>
          </TabsContent>
          <TabsContent value="flutter" className="mt-4">
            <CodeBlock className={codeClass}>
              {`final brand = wxDeriveProduct(const ${dartColor}${tintArg});\n\nMaterialApp(\n  theme: WixzelTheme.custom(tokens: brand).toThemeData(),\n  darkTheme: WixzelTheme.custom(tokens: brand, brightness: Brightness.dark).toThemeData(),\n);`}
            </CodeBlock>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/** A small screen in the chosen colour. */
function Preview() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-heading-md">Campaigns</p>
          <p className="text-body-sm text-fg-muted">Three running this week.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm">Export</Button>
          <Button size="sm" variant="primary" iconStart={<PlusIcon />}>
            New campaign
          </Button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Replies" icon={<ChartLineUpIcon />} value="842" delta={8.1} trend={[4, 6, 5, 8, 7, 9, 12]} />
        <Card className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <span className="text-body-sm font-semibold">Spring launch</span>
            <Badge tone="accent">Running</Badge>
          </div>
          <Input placeholder="Subject line" size="sm" />
          <div className="flex items-center justify-between text-body-sm text-fg-muted">
            Follow up automatically
            <Switch defaultChecked size="sm" />
          </div>
        </Card>
      </div>
      <p className="text-body-sm text-fg-muted">
        Read the <a className="text-accent-ink underline underline-offset-[3px]" href="#">delivery report</a> for last week.
      </p>
    </div>
  );
}
