import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { themeScript } from "wixzel-ui/utils";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FCFCFB" },
    { media: "(prefers-color-scheme: dark)", color: "#0F0E0C" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ui.wixzel.com"),
  title: { default: "Wixzel UI: one colour, a whole design system", template: "%s | Wixzel UI" },
  description:
    "The open-source design system behind every Wixzel product. React and Flutter components, a full palette from one seed colour, and a Claude skill that converts any project.",
  openGraph: { siteName: "Wixzel UI", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Follows the system until someone picks a theme; themeScript applies that choice before first paint.
  return (
    <html lang="en" data-product="wixzel" className={manrope.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh bg-bg font-sans text-fg antialiased">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
