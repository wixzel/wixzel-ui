"use client";

import { useRef, useState } from "react";
import { Button } from "wixzel-ui";
import { CheckIcon, CopyIcon } from "wixzel-ui/icons";
import { cn } from "wixzel-ui/utils";

/** A code block with a copy button that turns into a check for a moment. */
export function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = ref.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text.replace(/\n$/, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard refused: select the text so it can be copied by hand.
      const range = document.createRange();
      if (ref.current) range.selectNodeContents(ref.current);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
    }
  }

  return (
    <div className={cn("group/code relative", className)}>
      <pre ref={ref} className="pe-12">
        {children}
      </pre>
      <Button
        size="icon-sm"
        variant="ghost"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy"}
        className="absolute end-2 top-2 opacity-70 transition-opacity group-hover/code:opacity-100 focus-visible:opacity-100"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  );
}
