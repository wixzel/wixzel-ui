import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { themeScript } from "wixzel-ui/utils";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { Providers } from "@/components/providers";
import { organization, SITE_DESCRIPTION, SITE_URL, website } from "@/lib/seo";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FCFCFB" },
    { media: "(prefers-color-scheme: dark)", color: "#0F0E0C" },
  ],
};

// Search Console and Bing verification, from repository variables at build
// time. Unset, no tag is written.
const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const bing = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Wixzel UI: one colour, a whole design system", template: "%s | Wixzel UI" },
  description: SITE_DESCRIPTION,
  applicationName: "Wixzel UI",
  authors: [{ name: "Wixzel", url: "https://wixzel.com" }],
  creator: "Wixzel",
  publisher: "Wixzel",
  category: "technology",
  keywords: ["Wixzel UI", "design system", "React components", "Flutter widgets", "Tailwind CSS v4", "design tokens", "one seed colour", "WCAG AA", "Claude skill", "open source"],
  openGraph: {
    siteName: "Wixzel UI",
    type: "website",
    url: "/",
    title: "Wixzel UI: calm screens, crafted components",
    description: SITE_DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Wixzel UI: calm screens, crafted components" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  ...(google || bing ? { verification: { ...(google ? { google } : {}), ...(bing ? { other: { "msvalidate.01": bing } } : {}) } } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Follows the system until someone picks a theme; themeScript applies that choice before first paint.
  return (
    <html lang="en" data-product="wixzel" className={manrope.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh bg-bg font-sans text-fg antialiased">
        <JsonLd data={[organization, website]} />
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
