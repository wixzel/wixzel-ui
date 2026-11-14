import { SiteContainer, SiteSidebarLayout } from "wixzel-ui";
import { DocsNav } from "@/components/docs-nav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteContainer className="py-10 sm:py-14">
      <SiteSidebarLayout sidebar={<DocsNav />}>{children}</SiteSidebarLayout>
    </SiteContainer>
  );
}
