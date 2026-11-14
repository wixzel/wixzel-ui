# Is the conversion done?

Go through every line. Report anything you could not check, rather than ticking it.

## It still works

- [ ] The project builds, type-checks and passes its tests and lint, as before.
- [ ] Every route and screen from the survey still renders; nothing 404s.
- [ ] Every form still submits, every handler still fires, every link still goes
      where it went.
- [ ] No copy was rewritten, removed or added beyond component labels the
      library writes itself.

## Nothing the project had is gone

- [ ] Every logo, mark and illustration from the survey is still on screen, in
      the same places (now inside Wixzel slots).
- [ ] Custom controls that had no Wixzel equivalent are still there, restyled
      with tokens, not deleted.
- [ ] On a project that isn't Wixzel's: no `SiteFooter`, `ProductSwitcher`,
      `brandProducts`, `socials` or "© Wixzel" anywhere.

## It is Wixzel

Search the code, then look at the running app.

- [ ] No raw colours in components: search for `#[0-9a-fA-F]{3,8}`, `rgb(`,
      `hsl(`, and Tailwind palette classes (`gray-`, `slate-`, `zinc-`,
      `neutral-`, `blue-`, `indigo-`, `red-`… followed by a number). Only the
      generated `brand.css` holds hex values. In Flutter: no `Colors.*` and no
      `Color(0x…)` outside the seed.
- [ ] No borders or drop shadows on panels (`border`, `shadow-sm`, `shadow-md`
      on cards, sections, tables; `elevation` in Flutter).
- [ ] No old component library left in `package.json` / `pubspec.yaml`, and
      no imports of it.
- [ ] Icons are Phosphor duotone everywhere; no Lucide, Heroicons, Material
      Icons or Font Awesome left.
- [ ] Text is Manrope (or the brand font passed to the seed), body 14–15px.
- [ ] At most one `primary` button per view; everything else `secondary`,
      `ghost` or `link`.
- [ ] Current tab, nav item and chip are inked (solid text-colour block), not
      accent-coloured.
- [ ] Status uses status tones; the accent never signals success or error.
- [ ] Empty lists use `EmptyState` with the action that adds the first item.
- [ ] Loading uses `Spinner` / `Skeleton` / button `loading`, not text like
      "Loading…".

## Both themes, both sizes

- [ ] Light and dark both look intentional: switch with the theme control (or
      `data-theme` on `<html>`, `ThemeMode` in Flutter) and look at every screen.
      Dark surfaces should be tinted, not black; nothing should vanish.
- [ ] Phone width (375px) has no horizontal scroll; the sidebar collapses; the
      header's actions stay on the end.
- [ ] Keyboard: Tab reaches every control and shows the solid focus edge;
      menus and dialogs open, move and close with the keyboard.
- [ ] With reduced motion turned on, nothing slides or bounces; spinners slow
      down.

Take screenshots of a few key screens in both themes and show them to the user
with a short list of what changed.
