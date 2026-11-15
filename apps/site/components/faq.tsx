import { faqs } from "@/lib/facts";

/**
 * Questions and answers, always open. An accordion would leave closed answers
 * out of the HTML, where crawlers that run no JavaScript never see them.
 */
export function Faq() {
  return (
    <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
      {faqs.map((f) => (
        <div key={f.q} className="flex flex-col gap-2">
          <h3 className="text-heading-sm">{f.q}</h3>
          <p className="max-w-[60ch] text-pretty text-body-sm text-fg-muted">{f.a}</p>
        </div>
      ))}
    </div>
  );
}
