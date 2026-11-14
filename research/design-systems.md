# How the leading design systems look, and where Wixzel fits

Research from November 2026. Values come from each system's published token
packages and component source on GitHub, or from its official docs. Anything
not verified from a primary source is marked *(unverified)*.

## 1. The comparison

| System | Typeface | Control height | Button / card / dialog radius | Primary button | Neutrals | Depth | What gives it away |
|---|---|---|---|---|---|---|---|
| **Material 3** | Roboto | 40dp (fields 56) | pill / 12 / 28 | Pill, tonal or purple fill | Tinted toward the brand colour (lavender) | Tonal surfaces | Pills on pastel containers; Expressive adds blob shapes, morphing and bouncy springs |
| **Fluent 2** | Segoe UI | 32 | 4 / 4 / 8 | Blue #0F6CBD, semibold label | Pure grey | 2-layer shadows, Mica, Acrylic | 4px everywhere; darker input bottom edge with a brand underline on focus |
| **Apple HIG** | SF Pro | 44pt targets | capsule / — / — | One accent fill | System greys | Liquid Glass on navigation | Glass bars over content, 34pt bold titles, SF Symbols |
| **Carbon** | IBM Plex | 48 | 0 / 0 / 0 | Square blue #0F62FE, label left, icon right | Pure grey | Flat grey layers | Square corners, grey fields with only a bottom border, Plex with positive tracking |
| **Polaris** | Inter (13px body) | 28 | 8 / 12 / 16 | Near-black #303030 with bevel and sheen | Pure grey #F1F1F1 | Stacked inset bevel shadows | Black buttons that press in; weights 450/550/650 |
| **Atlassian** | Atlassian Sans | 32 | 6 / 8 / 12 | Flat blue #1868DB | Alpha greys | Raised/overlay shadows | 4px lozenges, sunken board columns, bold weight 653 |
| **Primer** | Mona Sans | 32 | 6 / 6 / 12 | Green #1F883D | Cool blue-grey #F6F8FA | Hairline borders | Green CTA, orange tab underline, bordered boxes |
| **Spectrum 2** | Adobe Clean | 32 | pill / 10 / 16 | Pill, blue #3B63FB or ink | Pure grey | 3-layer shadows | Pill buttons, extra-bold headings, 3D squish on press |
| **Ant Design** | System stack | 32 | 6 / 8 / 8 | Blue #1677FF, regular weight, 2px tinted underglow | Black-alpha text, #F5F5F5 | Soft 3-layer shadows | That blue, the underglow, the click ripple |
| **Geist (Vercel)** | Geist Sans + Mono | ~32–40 *(unverified)* | 6 / 6–12 / 12 | Black or white | Pure grey | Hairline borders | Monochrome, mono labels, grid crosses |
| **Linear** | Inter + Inter Display | ~28–32 *(unverified)* | ~6 *(unverified)* | Accent fill | Warm grey since Mar 2026 | Lightness steps, few dividers | Drawn status glyphs, ⌘K, dense muted lists |
| **Stripe** | Söhne (marketing) | — | — | Blurple #635BFF | Blue-grey | Blue-tinted multi-layer shadows | Mesh gradient, −12° diagonal sections |
| **Nothing OS** | Ndot, then Geist (2026) | — | round widgets | — | Monochrome | — | Dot-matrix numerals, one red dot |
| **Raycast** | System | compact | — | — | Dark vibrancy | Blur | Keycap shortcut chips, bottom action bar |

### shadcn/ui, the look every AI-built app ships with

These are the exact defaults from `registry/new-york-v4`. Avoiding them is the first requirement:

- 10px radius everywhere; cards `rounded-xl` with a hairline border and `shadow-sm`.
- 36px buttons and inputs, `text-sm font-medium`, outline buttons with `shadow-xs`.
- Neutral greys in OKLCH with chroma 0 and a near-black primary.
- 3px soft grey focus ring (`ring-ring/50`), `opacity-50` for disabled.
- lucide icons at 16px with round caps.
- Inter or Geist; Card / CardHeader / CardTitle / CardDescription anatomy.
- Around it: purple-to-blue gradients, glow blobs, bento grids, "New ✨" pills, glass.

The first Wixzel build matched almost every line of this list. That is why it looked like shadcn.

## 2. What each system owns

| Lever | Already owned by |
|---|---|
| Pill buttons | Material, Spectrum 2 |
| Square 0px corners | Carbon |
| Uniform 4px | Fluent |
| 6–10px with a hairline border | Atlassian, Primer, Ant, Polaris, shadcn |
| Brand-tinted neutrals | Material |
| Blue primary | Fluent, Carbon, Atlassian, Ant, Spectrum |
| Near-black primary | Polaris, Vercel, shadcn |
| Bevel / inset button shadows | Polaris |
| Glass and blur | Apple, Fluent Acrylic |
| Bouncy springs, morphing shapes | Material 3 Expressive |
| Mono labels and grid crosses | Vercel |
| Status glyph system | Linear (circles and pies) |
| Keycap chips | Raycast |
| Diagonal sections | Stripe (−12°) |
| Dot-matrix type | Nothing |

## 3. Where the field is going (2024–2026)

| Movement | Evidence | Verdict for Wixzel |
|---|---|---|
| Emphasis on the one key action | Google's study of 18,000 people: key elements found up to 4× faster | **Adopt.** A bigger, bolder primary action; calm everything else. |
| Warmer neutrals | Linear, Mar 2026; Spectrum 2 | **Adopt.** Low chroma, so they never look muddy. |
| Own variable typeface + a mono | Atlassian Sans/Mono, Mona Sans, Adobe Clean, Geist | **Adopt the habit now** (Sora + a mono for data); consider a custom face later. |
| Spring motion | Material 3 Expressive, Apple | **Adopt, without overshoot** on product surfaces. |
| Tactile press feedback | Polaris, Spectrum 2, Primer, Ant | **Adopt in our own form,** not Polaris's bevel. |
| AI marked clearly | Carbon AI label, Atlassian Rovo | **Adopt.** People should always know when an agent acts. |
| Voice and agent states as components | **Nobody ships them** | **Own it.** Wixzel sells voice and chat agents. |
| DTCG tokens (stable Oct 2025) | Style Dictionary, Tokens Studio | **Adopt** for the token source. |
| OKLCH and wide-gamut colour | Tailwind v4, Linear | **Adopt.** |
| Native CSS: `light-dark()`, popover, `<dialog>`, anchor positioning, `field-sizing` | Baseline 2024–2026 | **Adopt.** |
| Machine-readable systems (MCP, Code Connect, AGENTS.md) | Figma, shadcn | **Adopt,** so AI tools build on-brand Wixzel screens. |
| Glass and blur on text | Apple added opacity controls after usability criticism | **Avoid.** |
| AI purple gradients and sparkles | Everywhere | **Avoid.** |
| `corner-shape` squircles | Chromium only | **Avoid as a dependency.** |
| Grain, noise, bevels | Marketing sites only | **Avoid in product UI.** |

## 4. The open ground

No system above owns any of these:

1. **The 45° cut.** No one uses a chamfered corner as a control shape. It comes straight from the Wixzel mark: a square cut by diagonals. Unlike a rounded shape with one sharp corner, a chamfer reads as cut and engineered, not as a speech bubble.
2. **Square-based glyphs.** Linear's glyphs are circles. A Wixzel set drawn from squares and 45° cuts (queued, ringing, live, done, failed) would be unmistakable.
3. **Live agent signals.** Listening, thinking and speaking states as real components, drawn with the bars from the Voice mark.
4. **A crisp 2–4px radius combined with warm paper.** Fluent's 4px sits on pure grey and Carbon's 0px on cold grey.
5. **A distinctive press.** Polaris uses bevels and Spectrum a squish. A cut-corner press, where the chamfer deepens as the button sinks, belongs to no one.
6. **Diagonal hatching** for empty, disabled and placeholder states. Stripe's diagonal is a page section, not a state.

## 5. Sources

- Material: github.com/material-components/material-web (tokens v0_192); androidx compose material3 tokens; design.google/library/expressive-material-design-google-research
- Fluent: github.com/microsoft/fluentui `packages/tokens`, `react-components`; fluent2.microsoft.design
- Apple: developer.apple.com/design/human-interface-guidelines; apple.com/newsroom (9 Jun 2025); NN/g "Liquid Glass Is Cracked" (Oct 2025)
- Carbon: github.com/carbon-design-system/carbon `packages/layout`, `motion`, `type`, `styles`, `colors`; carbondesignsystem.com/guidelines/carbon-for-ai
- Polaris: github.com/Shopify/polaris-react-archive tokens and components; shopify.dev changelog
- Atlassian: atlassian.design (radius, typography, elevation, iconography, rovo-ui); npm @atlaskit/tokens 20.9.1
- Primer: github.com/primer/primitives 11.10.0; primer/react ButtonBase
- Spectrum 2: github.com/adobe/spectrum-design-data; react-spectrum `@react-spectrum/s2`
- Ant Design: github.com/ant-design/ant-design 5.x-stable `components/theme`
- Geist: vercel.com/geist, vercel.com/font
- Linear: linear.app/now/how-we-redesigned-the-linear-ui; linear.app/blog/behind-the-latest-design-refresh
- Stripe: stripe.com/blog/accessible-color-systems; docs.stripe.com/stripe-apps/style
- shadcn: github.com/shadcn-ui/ui `registry/new-york-v4`; ui.shadcn.com/docs/changelog
- Nothing: androidauthority.com/nothing-os-5-0-3702682
- Raycast: raycast.com/blog/a-fresh-look-and-feel
- Platform: w3.org/community/design-tokens (DTCG 2025.10); web.dev Baseline posts (Dec 2025 – Jun 2026)
