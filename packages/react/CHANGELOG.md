# Changelog

## 0.1.1

- Mid-tone seed colours (teal, orange, amber and the like) now get a light
  label on the primary fill, which is darkened just enough to keep 4.5:1. They
  used to get a dark label that passed WCAG AA but read poorly. Light seeds
  such as lime and mint keep their dark label, and the built-in products are
  unchanged. Applies to `npx wixzel-ui --seed` and `deriveProduct`.
- A region with its own `data-theme` (`ThemeScope`) now keeps its theme in
  Chrome. It used to take the page's colours, because Chrome resolves
  `light-dark()` in a custom property where the property is declared. Themed
  regions now redeclare their colours, following the product they sit in.
- The README shows the components.

## 0.1.0

- First public release: React components, the design tokens, a Tailwind CSS v4
  theme and the seed colour CLI.
