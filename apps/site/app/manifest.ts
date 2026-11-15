import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wixzel UI",
    short_name: "Wixzel UI",
    description: "The open-source design system behind every Wixzel product, for React and Flutter.",
    start_url: "/",
    display: "standalone",
    background_color: "#FCFCFB",
    theme_color: "#FCFCFB",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
