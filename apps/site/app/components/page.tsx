import type { Metadata } from "next";
import { PageHeader, SiteContainer, SiteSidebarLayout } from "wixzel-ui";
import { Gallery, GalleryNav } from "@/components/gallery";

export const metadata: Metadata = {
  title: "Components",
  description: "Every Wixzel UI component, live: buttons, forms, navigation, feedback, overlays, data and more, each with its code.",
};

export default function ComponentsPage() {
  return (
    <SiteContainer className="py-10 sm:py-14">
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
