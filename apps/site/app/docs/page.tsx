import type { Metadata } from "next";
import Link from "next/link";
import { Card, PageHeader } from "wixzel-ui";
import { JsonLd } from "@/components/json-ld";
import { docs } from "@/lib/docs";
import { breadcrumbs, pageMetadata } from "@/lib/seo";

const description =
  "Wixzel UI documentation: the Claude skill, React and Next.js, Flutter, Vue, Svelte and HTML, the design language, and the checklist for finishing a conversion.";

export const metadata: Metadata = pageMetadata({ path: "/docs/", title: "Docs", description });

/** Every guide on one page, so /docs/ is a hub rather than a 404. */
export default function DocsIndex() {
  return (
    <article className="min-w-0">
      <JsonLd data={breadcrumbs([{ name: "Wixzel UI", path: "/" }, { name: "Docs", path: "/docs/" }])} />
      <PageHeader title="Wixzel UI docs" description="Everything you need to use Wixzel UI, or to have Claude convert a project to it." />
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {docs.map((d) => (
          <Card key={d.slug} interactive asChild className="flex flex-col gap-2 p-5">
            <Link href={`/docs/${d.slug}/`}>
              <h2 className="text-heading-sm text-fg">{d.title}</h2>
              <p className="text-body-sm text-fg-muted">{d.description}</p>
            </Link>
          </Card>
        ))}
      </div>
    </article>
  );
}
