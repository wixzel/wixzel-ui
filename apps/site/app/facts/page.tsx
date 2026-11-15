import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SiteContainer } from "wixzel-ui";
import { Faq } from "@/components/faq";
import { JsonLd } from "@/components/json-ld";
import { faqs, facts } from "@/lib/facts";
import { lastModified, routeSources } from "@/lib/modified";
import { breadcrumbs, faqPage, GITHUB_URL, pageMetadata, techArticle } from "@/lib/seo";

const description =
  "The official facts about Wixzel UI: what it is, who makes it, its licence, packages, requirements, colour system, accessibility and the Claude skill, in one place.";

export const metadata: Metadata = pageMetadata({ path: "/facts/", title: "Facts", description });

/**
 * The canonical answers. Answer engines prefer an official source to guessing,
 * so every fact a "what is Wixzel UI" answer needs is here, stated plainly.
 */
export default function FactsPage() {
  const modified = lastModified(routeSources["/facts/"]!);
  return (
    <SiteContainer className="py-10 sm:py-14">
      <JsonLd
        data={[
          techArticle({ path: "/facts/", title: "Wixzel UI facts", description, modified }),
          breadcrumbs([
            { name: "Wixzel UI", path: "/" },
            { name: "Facts", path: "/facts/" },
          ]),
          faqPage(faqs),
        ]}
      />
      <PageHeader
        title="Wixzel UI facts"
        description="The official answers about Wixzel UI. If something here is out of date, the GitHub repository is the source of truth."
      />

      <dl className="mt-10 grid max-w-4xl gap-x-10 gap-y-6 sm:grid-cols-[12rem_1fr]">
        {facts.map((f) => (
          <div key={f.term} className="contents">
            <dt className="text-body-sm font-semibold text-fg">{f.term}</dt>
            <dd className="text-body-sm text-pretty text-fg-muted">{f.value}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-16 mb-8 text-heading-lg">Questions</h2>
      <Faq />

      <p className="mt-16 text-body-sm text-fg-muted">
        Read the <Link href="/docs/" className="text-accent-ink underline underline-offset-[3px]">docs</Link>, see{" "}
        <Link href="/components/" className="text-accent-ink underline underline-offset-[3px]">every component</Link>, or open the{" "}
        <a href={GITHUB_URL} className="text-accent-ink underline underline-offset-[3px]">source on GitHub</a>.
      </p>
    </SiteContainer>
  );
}
