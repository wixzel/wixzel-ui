# Wixzel UI for Flutter

`wixzel_ui` needs Flutter 3.41+ (Dart 3.11+). It brings the same tokens as the
web packages, a `ThemeData` that stops stock Material from showing through (no
ripples, no elevation, no M3 tints), and `Wx*` widgets with the Wixzel details:
squircle corners, press-to-shrink, blur-in entrances, the ring spinner.

## Install

```bash
flutter pub add wixzel_ui
```

If the package isn't on pub.dev yet in the user's environment, depend on Git:

```yaml
dependencies:
  wixzel_ui:
    git:
      url: https://github.com/wixzel/wixzel-ui.git
      path: packages/flutter
```

It brings `google_fonts` (Manrope) and `phosphor_flutter` (icons) with it.

## Foundation

```dart
import 'package:flutter/material.dart';
import 'package:wixzel_ui/wixzel_ui.dart';

// The project's brand colour. One seed derives the whole palette, both themes.
final brand = wxDeriveProduct(const Color(0xFFE4572E));

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: WixzelTheme.custom(tokens: brand).toThemeData(),
      darkTheme: WixzelTheme.custom(tokens: brand, brightness: Brightness.dark).toThemeData(),
      themeMode: ThemeMode.system,
      builder: (context, child) => WxSystemBars(child: child!),
      home: const HomeScreen(),
    );
  }
}
```

`wxDeriveProduct(seed, {tint = 0.45, hue, radius = 1, fontFamily})` is the same
derivation as the web's `deriveProduct`, so a seed gives identical colours on
both. `fontFamily` must be a Google Fonts family name.

Replace any existing `ThemeData(colorScheme: ColorScheme.fromSeed(...))`,
`FlexColorScheme`, or hand-built theme with this. Delete per-widget
`style: ElevatedButton.styleFrom(...)` overrides as each screen moves over.

### Reading tokens in your own widgets

```dart
final c = context.wx;        // WxColors: bg, bgSubtle, card, bgMuted, fg, fgMuted, accent, accentInk, accentEdge, dangerInk …
final t = context.wxType;    // headingLg, headingMd, bodyMd, bodySm, caption, overline, mono …
final s = context.wxShape;   // squircle borders: xs, sm, md (controls), lg (panels), xl (dialogs)
final sh = context.wxShadows;

DecoratedBox(decoration: ShapeDecoration(color: c.card, shape: s.lg), child: …);
Text('Calls today', style: t.headingMd);
```

Spacing and sizes: `WxControl.md` (38), `WxRadius`, `WxSquircle`, durations in
`WxDurations` (`instant` 70ms, `fast` 110ms, `move` 150ms, `enter` 270ms) and
curves in `WxEase`.

### Icons

```dart
const PhosphorIcon(PhosphorIconsDuotone.gear)
```

Swap `Icons.*` (Material) and Cupertino icons for the Phosphor duotone
equivalent by meaning: `Icons.settings` → `PhosphorIconsDuotone.gear`,
`Icons.search` → `magnifyingGlass`, `Icons.delete` → `trash`, `Icons.add` →
`PhosphorIconsBold.plus` inside buttons.

## Widgets

| Need | Wixzel | Replaces |
|---|---|---|
| Button | `WxButton(label:, onPressed:, variant:, size:, loading:, iconStart:, iconEnd:, block:)` — variants `primary` `secondary` `ghost` `danger` `link` | `ElevatedButton`, `FilledButton`, `OutlinedButton`, `TextButton`, `CupertinoButton` |
| Icon button | `WxIconButton(icon:, onPressed:, tooltip:)` | `IconButton` |
| Text field | `WxInput(controller:, label:, placeholder:, hint:, error:, leading:, trailing:)` | `TextField`, `TextFormField` |
| Label + hint + error around any control | `WxField(label:, hint:, error:, child:)` | `InputDecorator` |
| Select | `WxSelect(options: [WxSelectOption(v, 'Label')], value:, onChanged:)`; free-form `showWxPicker` | `DropdownButton`, `DropdownMenu` |
| Checkbox, radio, switch | `WxCheckbox`, `WxRadio`, `WxSwitch` | `Checkbox`, `Radio`, `Switch` |
| Settings rows | `WxListRow`, `WxSwitchRow`, `WxCheckboxRow`, `WxRadioRow` | `ListTile`, `SwitchListTile`, `CheckboxListTile`, `RadioListTile` |
| Option cards | `WxRadioCard(selected:, onTap:, title:, description:)` | custom selectable cards |
| Filter chips | `WxChips(children: [WxChip(label:, selected:, onTap:, count:)])` | `FilterChip`, `ChoiceChip` |
| Card | `WxCard(child:, onTap:, selected:)` | `Card` (drop `elevation`) |
| Settings group | `WxSection(title:, description:, icon:, children:, tone:)` | `Card` of `ListTile`s |
| App bar | `WxAppBar(title:, actions:, bottom:)` | `AppBar`, `SliverAppBar` |
| Bottom navigation | `WxBottomNav(items: [WxBottomNavItem(icon:, label:)], currentIndex:, onTap:)` | `BottomNavigationBar`, `NavigationBar` |
| Tabs | `WxTabs(controller:, tabs:, variant: WxTabsVariant.line \| segment)` | `TabBar`, `CupertinoSegmentedControl` |
| Dialog | `showWxDialog(context: , builder: (_) => WxDialog(title:, description:, actions:))` | `showDialog` + `AlertDialog` |
| Bottom sheet | `showWxSheet(context:, builder:)` | `showModalBottomSheet` |
| Toast | `showWxToast(context, 'Saved', tone: WxToastTone.success)` | `ScaffoldMessenger.showSnackBar` |
| Alert | `WxAlert(tone: WxTone.warning, title:, body:, action:)` | `MaterialBanner` |
| Badge | `WxBadge` (tones `neutral` `accent` `success` `warning` `danger` `info`) | `Badge`, `Chip` used as status |
| Avatar | `WxAvatar(name:, size:, status:)` | `CircleAvatar` |
| Loading | `WxSpinner`, `WxSkeleton`, `WxRefresh` | `CircularProgressIndicator`, `RefreshIndicator` |
| Empty list | `WxEmptyState(icon:, title:, description:, actions:)` | ad-hoc centred columns |
| Metric | `WxStatCard(label:, value:, icon:, footer:)` | |
| Icon on a tile | `WxIconTile(icon:, tone:)` | `CircleAvatar` holding an icon |
| Secret, API key | `WxCopyField(value:, secret: true)` | |
| Chat bubble | `WxMessage(from: WxMessageFrom.agent \| person, child:, streaming:)` | |
| Divider | `WxSeparator` | `Divider` |

### Your own interactive widgets

Wrap them in `WxPressable(builder: (context, state) => …, onTap:)`: it shrinks
to 96% on press, eases back, and gives `state.hovered` / `state.focused` for the
one-shade-darker fill. Bring new content in with `WxBlurIn`. Clip panels with
`context.wxShape.lg`, never `BorderRadius.circular` on a `Container` with a
`BoxShadow`.
