import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prose, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "wixzel-ui";
import { docHref } from "@/lib/docs";
import { CodeBlock } from "./code-block";

export function Markdown({ children }: { children: string }) {
  return (
    <Prose className="max-w-none [&_table_code]:whitespace-nowrap">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href = "", children }) => {
            const to = docHref(href);
            return to.startsWith("/") ? <Link href={to}>{children}</Link> : <a href={to}>{children}</a>;
          },
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
          // Wide tables scroll inside their panel instead of pushing the page sideways.
          table: ({ children }) => (
            <div className="-mx-1 overflow-x-auto px-1">
              <Table className="text-body-sm">{children}</Table>
            </div>
          ),
          thead: ({ children }) => <TableHeader>{children}</TableHeader>,
          tbody: ({ children }) => <TableBody>{children}</TableBody>,
          tr: ({ children }) => <TableRow>{children}</TableRow>,
          th: ({ children }) => <TableHead>{children}</TableHead>,
          td: ({ children }) => <TableCell className="align-top">{children}</TableCell>,
          input: ({ checked }) => (
            <span aria-hidden className="me-2 inline-block size-3.5 translate-y-0.5 rounded-xs bg-bg-muted" data-checked={checked} />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </Prose>
  );
}
