# The Wixzel design language

What a Wixzel screen looks like and how it behaves. Read this before building
anything the library doesn't ship, and when judging whether a converted screen
is finished.

Two words run through every decision: **simplicity** and **customizability**.
Simple, so each screen does one thing clearly with as little chrome as possible.
Customizable, so one colour gives a project a whole, accessible look.

A Wixzel product is not recognised by a logo shape stamped on every button. It is
recognised by colour that runs through the whole product, and by how its
components are built and how they respond.

## Principles

### 1. Calm structure, crafted components

Pages stay quiet: tinted paper, tinted ink, almost no lines, comfortable spacing. The
craft lives inside the components, where people touch the product. A button, a
switch or a menu should hold up to close inspection.

### 2. Everything responds

Every control answers the hand, quickly and physically:

- Presses shrink to 96% at once (70ms) and ease back on release.
- Hover fills a control a shade darker; nothing jumps or glows.
- Motion is snappy: moving parts start fast and land softly in about 150ms, with
  no overshoot. Colour changes take about 110ms.
- New things arrive by sharpening out of a blur: menus, dialogs, tooltips, the
  save bar, tab content.
- Nothing waits for an animation to be usable, and everything respects
  `prefers-reduced-motion`.

### 3. Tonal planes, squircle corners

Panels are tinted fills on a lighter page, not boxes drawn with borders or lifted
on shadows. Fields are filled the same way. Lines are kept for dividing rows inside a
panel. Corners are squircles: the curve eases into the edge, so even large radii stay
crisp. The current tab, nav item or chip is inked, a solid block of text colour with
the label reversed out of it; full accent is kept for the primary action. Filled
buttons keep their darker rim and top highlight. Focus is a solid edge, never a glow.

### 4. Colour through everything

A Wixzel product is never grey. Its colour washes the page, the surfaces, the lines
and the text, so Voice is unmistakably lime and IntelliCall violet before you read a
word. Full-strength accent still marks only the primary action, the current selection
and focus; everything else carries the hue quietly. Status colours are never accents.

A project customizes by setting one seed colour (`npx wixzel-ui --seed` on the
web, `wxDeriveProduct` in Flutter), and optionally how strong the wash is, a corner
scale and a font. The rest is derived in OKLCH, so lightness and contrast are the same
in every hue and every text pair passes WCAG AA in both themes.

### 5. Approachable, never premium

One typeface, Manrope: open, friendly, bold in headings. Icons are Phosphor
duotone, a line drawing with a soft fill of the same colour behind it. Plain words that name what
people recognize. Errors say how to fix them. No gloss, no glass, no AI gradients.

### 6. Compose, never restyle

A component is built once in the library and used everywhere. Screens compose
components but never restyle them. If a screen needs something the library lacks,
build it from tokens following these principles, and offer it back upstream.

## The details, component by component

| Component | Details |
|---|---|
| Button | Shrinks to 96% on press and eases back. Filled: darker rim, top highlight, hard bottom edge. Secondary: a light raised face. End icons slide 2px forward on hover. Shortcut keycaps inside (`⌘↵`). Loading swaps the start icon for the spinner and keeps the width. |
| Input, Textarea, Select | Filled with a tint, no border. Darken a shade on hover. Focus: a solid 2px accent edge. Invalid: red edge, solid red on focus. A leading icon takes the accent while the field has focus. Textareas grow with their content. |
| Field | Label, hint and error wired for screen readers. Errors fade in with an icon and say what to do. |
| Checkbox | The check draws itself in along its path and draws back out. The box squeezes to 90% on press. |
| Radio | The dot grows in from nothing. |
| Switch | A pill track and a round thumb. The thumb stretches while held, then slides across; the track crossfades underneath. |
| Slider | A thin track that fills with the accent. The round thumb stretches while held, like the Switch. |
| Tabs | The current tab is inked, and one ink block slides between tabs. The first placement doesn't animate. |
| Menu, Select list | Sharpen out of a blur as they drift a few pixels from their trigger. Icons darken on the highlighted row. Shortcuts are keycaps, one per key. |
| Tooltip | Waits 400ms the first time, then opens instantly as you move along. Can show keycaps. |
| Dialog | Sharpens out of a blur over a plain scrim. Actions sit in a footer band, a shade off the dialog. |
| Card | A tinted panel: no border, no shadow. Interactive cards darken a shade on hover and shrink a little when pressed. Selected: the accent wash, a solid 2px accent ring and a check that pops in. |
| Table | Sits on a tinted panel. Tabular numbers. Hover tints the row. Selected rows take the accent wash and an accent edge on the leading cell. |
| Badge | Soft by default. `pulse` sends out a slow ring for live states (a call in progress). |
| Avatar | Initials on a soft gradient. Presence dot ringed in the page colour. Groups fan out on hover. |
| Spinner | A ring: a quarter arc with round ends turning over a faint track. With reduced motion it slows down instead of stopping. |
| Kbd | A keycap: an even 1px edge on all four sides, no lip. |
| Skeleton | A slow band of light passes over it. |
| AppShell, Sidebar | A tinted sidebar beside a lighter page, no dividing line. Grouped nav with section labels. The current page is inked. Counts and live badges sit on the end. |
| Breadcrumb, PageHeader | Caret trail, current page in full ink. Title with an optional InfoTip, a line of description, actions on the end. |
| StatCard, Sparkline, Delta | Label with icon, a tabular value, a delta chip that is green when the move is good (spend going down, calls going up), and a trend line with a soft area and the latest point marked. |
| Progress, SplitBar, BarList | Thin rounded bars on a tinted track that slide to their value. Split bars keep a 2px gap between parts and carry a legend. |
| RadioCards | Options as light cards on their panel (engines, licences, amounts). Arrow keys move between them. The chosen card takes the accent wash, a solid 2px ring and a check that pops in. |
| Chips | Filter chips, single or multiple choice, with an optional count. Chosen chips are inked, like the current tab. They squeeze slightly on press. |
| Section | A settings panel on a tinted fill: icon tile, title, description, actions. A danger tone washes destructive settings red. |
| Accordion | Rows on one tinted panel split by hairlines (a call, its transcript). Height opens smoothly; the chevron turns. |
| ActionBar | Sticks to the bottom of an editor while there are unsaved changes and sharpens in from a blur. |
| Tile | A quick action on a tinted panel: icon tile and label. Darkens a shade on hover; the icon tile takes the accent wash. |
| EmptyState | A tinted panel, an icon on a light tile, what will appear here, and the action that adds the first one. |
| CopyField | Masks secrets to their last four characters until revealed. Copy morphs into a check for 1.6s. If the clipboard is refused, the text is selected instead. |
| DescriptionList, Timeline | Aligned label and value rows. Events joined by a hairline, each on a tinted marker, latest can carry a tone. |
| Popover | A floating panel that sharpens in from a blur toward its trigger's side. Follows the theme and product of where it was opened. |
| Message, Transcript | Agent turns on a neutral bubble from the start side, the person's on the accent wash from the end side. The corner nearest the speaker is tight. Streaming text ends in a blinking block caret. |

## Foundations

| | |
|---|---|
| Radius | Squircles where the browser supports `corner-shape`: 7, 9, 14, 26, 30px. Controls 14px, panels 26px, dialogs 30px. Elsewhere round corners of 5, 6, 10, 16, 20px. |
| Control heights | 28, 32, 38 (default), 44px. Comfortable density. |
| Type | Manrope. 15px body, 14px in controls and tables, bold headings drawn in tight. |
| Icons | Phosphor duotone, set once by `WixzelProvider`. |
| Motion | 70ms press, 110ms colour, 150ms moves, 270ms blur-in entrances. No overshoot. |
| Themes | Light, dark, or the OS. Any region can carry its own theme or product with `<ThemeScope>`; menus and dialogs opened inside it follow. |

## Looks that are not Wixzel

These have been tried and rejected. Don't introduce them, and remove them when
converting:

- The generic component-kit look: every card a white box with a 1px grey border
  and a soft shadow, separated by gaps.
- One sharp corner on an otherwise rounded box (it reads as a chat bubble), 45°
  cut corners, flags, diamonds, hatching.
- Keycap-style buttons with a thick bottom lip.
- The instrument-panel look: mono uppercase labels everywhere, LEDs, numbered
  panels, segmented meters.
- Gloss, glassmorphism, glow focus rings, neon, purple-to-blue "AI" gradients,
  sparkle icons.
- Grey, untinted neutrals. Pure `#FFFFFF` pages and `#E5E7EB` borders are the
  tell of a screen that wasn't converted.
- Springy, bouncing motion and animations that block input.
