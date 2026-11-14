import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, PageHeader } from "wixzel-ui";
import { DownloadSimpleIcon, FileTextIcon } from "wixzel-ui/icons";
import { Markdown } from "@/components/markdown";
import { SkillInstall } from "@/components/skill-install";
import { docs } from "@/lib/docs";
import { readDoc } from "@/lib/read-doc";

export const dynamicParams = false;

export function generateStaticParams() {
  return docs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = docs.find((d) => d.slug === slug);
  return doc ? { title: doc.title } : {};
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = docs.find((d) => d.slug === slug);
  if (!doc) notFound();

  return (
    <article className="min-w-0">
      <PageHeader
        title={doc.title}
        description={doc.slug === "skill" ? "Install it once, then ask Claude to convert any project to Wixzel UI." : undefined}
        actions={
          doc.slug === "skill" && (
            <>
              <Button asChild iconStart={<FileTextIcon />}>
                <a href="/SKILL.md" download>
                  Download SKILL.md
                </a>
              </Button>
              <Button asChild variant="primary" iconStart={<DownloadSimpleIcon />}>
                <a href="/wixzel-ui-skill.zip" download>
                  Download .zip
                </a>
              </Button>
            </>
          )
        }
      />
      {doc.slug === "skill" && (
        <>
          <SkillInstall className="mt-8" />
          <h2 className="mt-14 mb-2 text-heading-lg">What the skill tells Claude</h2>
          <p className="mb-8 text-body-md text-fg-muted">The skill&apos;s SKILL.md, as Claude reads it.</p>
        </>
      )}
      <div className={doc.slug === "skill" ? "" : "mt-8"}>
        <Markdown>{readDoc(doc)}</Markdown>
      </div>
    </article>
  );
}
