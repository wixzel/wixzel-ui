import Link from "next/link";
import { Button, SiteContainer } from "wixzel-ui";
import { docs } from "@/lib/docs";

/**
 * A missing page, often one an AI answer guessed at. Say so plainly and offer
 * the pages that were probably meant.
 */
export default function NotFound() {
  return (
    <SiteContainer className="flex flex-col items-start gap-6 py-24">
      <p className="text-overline text-fg-subtle uppercase">404</p>
      <h1 className="text-heading-xl">This page isn&apos;t here</h1>
      <p className="max-w-[56ch] text-body-md text-fg-muted">
        The address may be mistyped, or the page may never have existed. These are the pages Wixzel UI has:
      </p>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="primary">
          <Link href="/">Home</Link>
        </Button>
        <Button asChild>
          <Link href="/components/">Components</Link>
        </Button>
        <Button asChild>
          <Link href="/facts/">Facts</Link>
        </Button>
        {docs.map((d) => (
          <Button key={d.slug} asChild variant="ghost">
            <Link href={`/docs/${d.slug}/`}>{d.label}</Link>
          </Button>
        ))}
      </div>
    </SiteContainer>
  );
}
