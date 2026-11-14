"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteSidebar, SiteSidebarLink, SiteSidebarSection } from "wixzel-ui";
import { docs, type Doc } from "@/lib/docs";

const groups: Doc["group"][] = ["Start", "Platforms", "Design"];

export function DocsNav() {
  const pathname = usePathname();
  return (
    <SiteSidebar aria-label="Docs">
      {groups.map((group) => (
        <SiteSidebarSection key={group} label={group}>
          {docs
            .filter((d) => d.group === group)
            .map((d) => (
              <SiteSidebarLink key={d.slug} asChild current={pathname.startsWith(`/docs/${d.slug}`)}>
                <Link href={`/docs/${d.slug}/`}>{d.label}</Link>
              </SiteSidebarLink>
            ))}
        </SiteSidebarSection>
      ))}
    </SiteSidebar>
  );
}
