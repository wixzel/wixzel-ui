/** Structured data in the raw HTML, where crawlers that run no JavaScript still read it. */
export function JsonLd({ data }: { data: object | object[] }) {
  const graph = { "@context": "https://schema.org", "@graph": Array.isArray(data) ? data : [data] };
  // `<` escaped so no string inside can close the script tag.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />;
}
