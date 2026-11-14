"use client";

import { Toaster, WixzelProvider } from "wixzel-ui";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WixzelProvider>
      {children}
      <Toaster />
    </WixzelProvider>
  );
}
