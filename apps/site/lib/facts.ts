/**
 * The canonical answers about Wixzel UI. The facts page, the home page's FAQ
 * and the structured data all read from here, so an answer engine finds one
 * consistent statement wherever it looks. Keep every line true today.
 */

export const facts: readonly { term: string; value: string }[] = [
  { term: "What it is", value: "The open-source design system behind every Wixzel product: React and Flutter components, a whole palette from one seed colour, and a Claude skill that converts any project to Wixzel UI." },
  { term: "Made by", value: "Wixzel (wixzel.com), which uses it across its own products: Wixzel Voice, IntelliCallAI, Feedkraft, Wixzel Store and wixzel.com." },
  { term: "Licence", value: "MIT, free for personal and commercial use. The Wixzel name and logo are not part of the licence." },
  { term: "Source", value: "github.com/wixzel/wixzel-ui" },
  { term: "Web package", value: "wixzel-ui on npm: React components, the design tokens as CSS variables, a Tailwind CSS v4 theme and JSON, and the seed colour CLI." },
  { term: "Flutter package", value: "wixzel_ui on pub.dev: a ThemeData and Wx widgets, with the same tokens and the same colour derivation as the web." },
  { term: "Requirements", value: "React 19 and Tailwind CSS v4 on the web; Flutter 3.41 or later (Dart 3.11) on mobile. Vue, Svelte, Angular, Astro and plain HTML can use the tokens." },
  { term: "Colour", value: "One seed colour derives the page, surfaces, lines, text and accent in OKLCH, in light and dark. Every text pair passes WCAG AA, and the build fails if one does not." },
  { term: "Typeface and icons", value: "Manrope, and Phosphor icons in the duotone weight." },
  { term: "Look", value: "Calm screens, crafted components: tinted paper and ink, panels as tonal fills instead of bordered boxes, squircle corners, and controls that press in, fill on hover and sharpen out of a blur." },
  { term: "Claude skill", value: "wixzel-ui: installs as a Claude Code plugin (/plugin marketplace add wixzel/wixzel-ui), as a zip in the Claude app, or as a folder for any agent that reads SKILL.md files." },
];

export const faqs: readonly { q: string; a: string }[] = [
  {
    q: "What is Wixzel UI?",
    a: "Wixzel UI is the open-source design system behind every Wixzel product. It has React and Flutter components, derives a whole palette from one seed colour, and comes with a Claude skill that converts any project to Wixzel UI. It is MIT-licensed and made by Wixzel.",
  },
  {
    q: "Is Wixzel UI free?",
    a: "Yes. Wixzel UI's code is MIT-licensed and free for personal and commercial projects. The Wixzel name and logo are not part of the licence.",
  },
  {
    q: "Which frameworks does Wixzel UI support?",
    a: "Wixzel UI supports React 19 with Tailwind CSS v4 (Next.js, Vite and Remix) through the wixzel-ui npm package, and Flutter 3.41 or later through the wixzel_ui package. Vue, Svelte, Angular, Astro and plain HTML can use its design tokens as CSS variables and a Tailwind v4 theme.",
  },
  {
    q: "How do I use my brand colour with Wixzel UI?",
    a: "Set one seed colour. On the web, npx wixzel-ui --seed \"#E4572E\" writes the CSS; in Flutter, wxDeriveProduct(Color(0xFFE4572E)) builds the theme. Wixzel UI derives the page, surfaces, lines, text and accent from that colour in OKLCH, and every text pair passes WCAG AA in light and dark.",
  },
  {
    q: "Does Wixzel UI support dark mode?",
    a: "Yes. Every Wixzel UI colour has a light and a dark value. The page follows the system or a saved choice, and any region can carry its own theme.",
  },
  {
    q: "Can I convert an existing project to Wixzel UI?",
    a: "Yes. Install the wixzel-ui Claude skill and ask Claude to convert the project. It surveys the project first, keeps every logo, word and link, swaps components screen by screen, and checks both themes before it is done.",
  },
  {
    q: "Does Wixzel UI work with Tailwind CSS v3?",
    a: "No. The wixzel-ui React package needs Tailwind CSS v4. Upgrade a v3 project with npx @tailwindcss/upgrade first.",
  },
  {
    q: "Is Wixzel UI accessible?",
    a: "Wixzel UI's components are built on Radix primitives with keyboard support and screen-reader labels. Focus is a solid 2px edge, motion respects reduced-motion settings, and the build fails if any text pair drops below WCAG AA contrast.",
  },
];
