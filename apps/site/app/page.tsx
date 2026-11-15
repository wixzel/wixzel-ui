import Link from "next/link";
import { Button, Card, CtaBand, Feature, FeatureGrid, Hero, HeroEyebrow, SiteContainer, SiteSection } from "wixzel-ui";
import {
  ArrowRightIcon,
  CodeIcon,
  CursorClickIcon,
  DeviceMobileIcon,
  DropIcon,
  GithubLogoIcon,
  HandTapIcon,
  PaletteIcon,
  SparkleIcon,
  SquaresFourIcon,
  StackIcon,
} from "wixzel-ui/icons";
import { CodeBlock } from "@/components/code-block";
import { GITHUB } from "@/components/header";
import { Showcase } from "@/components/showcase";
import { SkillInstall } from "@/components/skill-install";
import { ThemeBuilder } from "@/components/theme-builder";

const platforms = [
  { icon: <CodeIcon />, title: "React", body: "React 19 and Tailwind v4, on Radix primitives.", install: "npm i wixzel-ui", href: "/docs/react/", link: "React guide" },
  { icon: <DeviceMobileIcon />, title: "Flutter", body: "A ThemeData with no Material showing through, and Wx widgets.", install: "flutter pub add wixzel_ui", href: "/docs/flutter/", link: "Flutter guide" },
  { icon: <StackIcon />, title: "Vue, Svelte, HTML", body: "The tokens as CSS variables and a Tailwind theme, plus the class recipes.", install: "npm i wixzel-ui", href: "/docs/other-stacks/", link: "Other stacks" },
];

const code = "[&_pre]:rounded-lg [&_pre]:bg-bg [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-caption [&_pre]:text-fg [&_pre]:overflow-x-auto";

export default function Home() {
  return (
    <>
      <Hero
        align="center"
        eyebrow={<HeroEyebrow icon={<GithubLogoIcon />}>Open source · MIT</HeroEyebrow>}
        title="Calm screens, crafted components."
        description="Wixzel UI is the design system behind every Wixzel product. React and Flutter components, a whole palette from your brand colour, and a Claude skill that converts your project."
        actions={
          <>
            <Button asChild variant="primary" size="lg" iconEnd={<ArrowRightIcon />}>
              <Link href="/docs/skill/">Convert a project</Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/docs/react/">Read the docs</Link>
            </Button>
          </>
        }
      />

      <SiteSection
        id="components"
        title="Everything answers the hand"
        description="These are the real components. Press, hold, type, switch."
      >
        <Showcase />
        <div className="mt-8">
          <Button asChild variant="ghost" iconEnd={<ArrowRightIcon />}>
            <Link href="/components/">See every component</Link>
          </Button>
        </div>
      </SiteSection>

      <SiteSection
        id="theme"
        tone="subtle"
        title="Pick a colour. Get the whole palette."
        description="The page, the surfaces, the lines and the text all take its hue. Every text pair passes WCAG AA, in light and dark."
      >
        <ThemeBuilder />
      </SiteSection>

      <SiteSection title="React, Flutter, and the rest" description="Same tokens, same derivation, same hex values on every platform.">
        <div className="grid gap-4 md:grid-cols-3">
          {platforms.map((p) => (
            <Card key={p.title} className="flex flex-col gap-4 p-5">
              <span className="grid size-9 place-items-center rounded-md bg-surface text-fg-muted shadow-raised [&_svg]:size-5">{p.icon}</span>
              <div className="flex flex-col gap-1">
                <h3 className="text-heading-sm">{p.title}</h3>
                <p className="text-body-sm text-fg-muted">{p.body}</p>
              </div>
              <CodeBlock className={code}>{p.install}</CodeBlock>
              <Link href={p.href} className="mt-auto text-body-sm text-accent-ink underline underline-offset-[3px]">
                {p.link}
              </Link>
            </Card>
          ))}
        </div>
      </SiteSection>

      <SiteSection
        id="skill"
        tone="subtle"
        eyebrow="Claude skill"
        title="Convert a project in one request"
        description="The skill teaches Claude the design language, the components and the conversion steps: survey first, keep every logo and word, swap components screen by screen, then check both themes."
      >
        <SiteContainer className="max-w-3xl px-0">
          <SkillInstall />
        </SiteContainer>
      </SiteSection>

      <SiteSection title="The design language" description="Six rules every screen follows.">
        <FeatureGrid columns={3}>
          <Feature icon={<SquaresFourIcon />} title="Calm structure">
            Tinted paper, tinted ink, almost no lines. The craft lives inside the components.
          </Feature>
          <Feature icon={<HandTapIcon />} title="Everything responds">
            Presses shrink, hovers fill, new things sharpen out of a blur. Nothing overshoots.
          </Feature>
          <Feature icon={<PaletteIcon />} title="Tonal planes">
            Panels are tinted fills, not bordered boxes. Corners are squircles.
          </Feature>
          <Feature icon={<DropIcon />} title="Colour through everything">
            Your hue washes the whole product. Full accent is kept for the primary action.
          </Feature>
          <Feature icon={<SparkleIcon />} title="Approachable">
            Manrope, Phosphor duotone icons, plain words. No gloss, glass or gradients.
          </Feature>
          <Feature icon={<CursorClickIcon />} title="Compose, never restyle">
            Screens use the components as they are. What&apos;s missing goes into the library.
          </Feature>
        </FeatureGrid>
        <div className="mt-8">
          <Button asChild variant="ghost" iconEnd={<ArrowRightIcon />}>
            <Link href="/docs/design-language/">The full design language</Link>
          </Button>
        </div>
      </SiteSection>

      <CtaBand
        title="Bring Wixzel UI to your product"
        description="Add the package to your React or Flutter app, or let Claude convert it for you with the skill."
        actions={
          <>
            <Button asChild variant="primary" size="lg">
              <Link href="/docs/skill/">Get the skill</Link>
            </Button>
            <Button asChild size="lg" iconStart={<GithubLogoIcon />}>
              <a href={GITHUB}>Star on GitHub</a>
            </Button>
          </>
        }
      />
    </>
  );
}
