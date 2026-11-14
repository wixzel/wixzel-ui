"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, SiteHeader, SiteNavLink, ThemeMenu } from "wixzel-ui";
import { BookOpenIcon, DeviceMobileIcon, GithubLogoIcon, HouseIcon, PaletteIcon, SparkleIcon } from "wixzel-ui/icons";
import { Logo } from "./logo";

export const GITHUB = "https://github.com/wixzel/wixzel-ui";

const nav = [
  { href: "/", label: "Home", icon: <HouseIcon />, match: (p: string) => p === "/" },
  { href: "/docs/react/", label: "React", icon: <BookOpenIcon />, match: (p: string) => p.startsWith("/docs/react") || p.startsWith("/docs/other-stacks") },
  { href: "/docs/flutter/", label: "Flutter", icon: <DeviceMobileIcon />, match: (p: string) => p.startsWith("/docs/flutter") },
  { href: "/docs/design-language/", label: "Design language", icon: <PaletteIcon />, match: (p: string) => p.startsWith("/docs/design-language") || p.startsWith("/docs/checklist") },
  { href: "/docs/skill/", label: "Claude skill", icon: <SparkleIcon />, match: (p: string) => p.startsWith("/docs/skill") },
];

export function Header() {
  const pathname = usePathname();
  return (
    <SiteHeader
      brand={
        <Link href="/" aria-label="Wixzel UI home" className="flex shrink-0 items-center gap-2 rounded-xs wx-focus">
          <Logo className="h-[22px]" />
          <span className="text-heading-sm font-bold tracking-[-0.03em] text-fg-muted">UI</span>
        </Link>
      }
      nav={nav.map((item) => (
        <SiteNavLink key={item.href} asChild current={item.match(pathname)}>
          <Link href={item.href}>
            {item.icon}
            {item.label}
          </Link>
        </SiteNavLink>
      ))}
      actions={
        <>
          <ThemeMenu options={["light", "dark"]} />
          <Button asChild variant="secondary" size="sm" iconStart={<GithubLogoIcon />} className="hidden md:inline-flex">
            <a href={GITHUB}>GitHub</a>
          </Button>
        </>
      }
    />
  );
}
