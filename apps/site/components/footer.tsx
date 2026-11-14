import Link from "next/link";
import { FooterColumn, FooterLink, SiteFooter, ThemeMenu } from "wixzel-ui";
import { GITHUB } from "./header";
import { Logo } from "./logo";

const docs = [
  { label: "Components", href: "/components/" },
  { label: "React", href: "/docs/react/" },
  { label: "Flutter", href: "/docs/flutter/" },
  { label: "Vue, Svelte, HTML", href: "/docs/other-stacks/" },
  { label: "Design language", href: "/docs/design-language/" },
  { label: "Conversion checklist", href: "/docs/checklist/" },
];

const getIt = [
  { label: "GitHub", href: GITHUB },
  { label: "wixzel-ui on npm", href: "https://www.npmjs.com/package/wixzel-ui" },
  { label: "wixzel_ui on pub.dev", href: "https://pub.dev/packages/wixzel_ui" },
  { label: "Claude skill (.zip)", href: "/wixzel-ui-skill.zip" },
];

export function Footer() {
  return (
    <SiteFooter
      logo={<Logo className="h-7" />}
      preferences={<ThemeMenu align="start" options={["light", "dark"]} />}
      legal={
        <a href={`${GITHUB}/blob/main/LICENSE`} className="rounded-sm wx-focus transition-colors duration-(--wx-duration-fast) hover:text-fg">
          MIT License
        </a>
      }
    >
      <FooterColumn label="Docs">
        {docs.map((l) => (
          <FooterLink key={l.href} asChild>
            <Link href={l.href}>{l.label}</Link>
          </FooterLink>
        ))}
      </FooterColumn>
      <FooterColumn label="Get it">
        {getIt.map((l) => (
          <FooterLink key={l.href} href={l.href}>
            {l.label}
          </FooterLink>
        ))}
      </FooterColumn>
      <p className="max-w-[32ch] self-end text-pretty text-body-sm leading-relaxed text-fg-muted">
        The design system behind every Wixzel product, open for anyone to use.
      </p>
    </SiteFooter>
  );
}
