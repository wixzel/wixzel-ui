import type { NextConfig } from "next";

// A static site: GitHub Pages serves the `out` folder at ui.wixzel.com.
const nextConfig: NextConfig = {
  output: "export",
  // Each page is a folder with index.html, which Pages serves at /docs/react/.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
