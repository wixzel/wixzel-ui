import { cn } from "wixzel-ui/utils";

/** The Wixzel wordmark in ink: the black file on light, the white one on dark. */
export function Logo({ className, decorative }: { className?: string; decorative?: boolean }) {
  return (
    <>
      <img src="/wixzel_black.png" alt={decorative ? "" : "Wixzel"} width={96} height={22} className={cn("w-auto dark:hidden", className)} />
      <img src="/wixzel_white.png" alt="" aria-hidden width={96} height={22} className={cn("hidden w-auto dark:block", className)} />
    </>
  );
}
