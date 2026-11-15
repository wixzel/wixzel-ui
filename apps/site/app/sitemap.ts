import type { MetadataRoute } from "next";
import { docs } from "@/lib/docs";
import { docSources, lastModified, routeSources } from "@/lib/modified";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, sources: string[], priority: number): MetadataRoute.Sitemap[number] => {
    const modified = lastModified(sources);
    return { url: `${SITE_URL}${path}`, priority, ...(modified ? { lastModified: modified } : {}) };
  };
  return [
    entry("/", routeSources["/"]!, 1),
    entry("/components/", routeSources["/components/"]!, 0.9),
    entry("/facts/", routeSources["/facts/"]!, 0.8),
    entry("/docs/", routeSources["/docs/"]!, 0.7),
    ...docs.map((d) => entry(`/docs/${d.slug}/`, docSources(d.file), 0.8)),
  ];
}
