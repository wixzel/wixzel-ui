import type { Metadata } from "next";
import { PageHeader, SiteContainer, SiteSidebarLayout } from "wixzel-ui";
import { Gallery, GalleryNav } from "@/components/gallery";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbs, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/components/",
  title: "Components",
  description:
    "Every Wixzel UI component, live, with its code: buttons, inputs, selects, tabs, dialogs, toasts, tables, charts, stat cards, avatars and more, for React with Tailwind CSS v4.",
});

export default function ComponentsPage() {
  return (
    <SiteContainer className="py-10 sm:py-14">
      <JsonLd data={breadcrumbs([{ name: "Wixzel UI", path: "/" }, { name: "Components", path: "/components/" }])} />
      <SiteSidebarLayout sidebar={<GalleryNav />}>
        <div className="min-w-0">
          <PageHeader
            title="Components"
            description="Every component here is the real one. Press, type, open and switch the theme to see how each responds."
          />
          <div className="mt-10">
            <Gallery />
          </div>
        </div>
      </SiteSidebarLayout>
    </SiteContainer>
  );
}
