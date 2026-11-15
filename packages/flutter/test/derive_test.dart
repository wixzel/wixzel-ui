import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:wixzel_ui/wixzel_ui.dart';

// The seeds in packages/tokens/src/tokens.ts. Each generated product must come
// out of the Dart port byte for byte, or web and mobile would drift.
const _seeds = {
  WixzelProduct.voice: Color(0xFFA0D425),
  WixzelProduct.intellicall: Color(0xFF7C3AED),
  WixzelProduct.whatsagent: Color(0xFF15803D),
  WixzelProduct.autopilot: Color(0xFF02BBFF),
  WixzelProduct.feedkraft: Color(0xFF4F46E5),
  WixzelProduct.edu: Color(0xFF2563EB),
  WixzelProduct.untimed: Color(0xFF2FBD8B),
};

Map<String, int> _hex(WxColors c) => {
      'bg': c.bg.toARGB32(),
      'bgSubtle': c.bgSubtle.toARGB32(),
      'bgMuted': c.bgMuted.toARGB32(),
      'card': c.card.toARGB32(),
      'surface': c.surface.toARGB32(),
      'surfaceOverlay': c.surfaceOverlay.toARGB32(),
      'border': c.border.toARGB32(),
      'borderStrong': c.borderStrong.toARGB32(),
      'fg': c.fg.toARGB32(),
      'fgMuted': c.fgMuted.toARGB32(),
      'fgSubtle': c.fgSubtle.toARGB32(),
      'fgDisabled': c.fgDisabled.toARGB32(),
      'fgInverse': c.fgInverse.toARGB32(),
      'bgInverse': c.bgInverse.toARGB32(),
      'overlay': c.overlay.toARGB32(),
      'accent': c.accent.toARGB32(),
      'accentHover': c.accentHover.toARGB32(),
      'accentFg': c.accentFg.toARGB32(),
      'accentSubtle': c.accentSubtle.toARGB32(),
      'accentInk': c.accentInk.toARGB32(),
      'accentEdge': c.accentEdge.toARGB32(),
      'danger': c.danger.toARGB32(),
      'chart1': c.chart1.toARGB32(),
    };

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  // Building a theme names Manrope; nothing is drawn, so nothing needs fetching.
  GoogleFonts.config.allowRuntimeFetching = false;

  for (final MapEntry(key: product, value: seed) in _seeds.entries) {
    test('${product.name} derives the same palette as the web', () {
      final derived = wxDeriveProduct(seed);
      final generated = wxProducts[product]!;
      expect(_hex(derived.light), _hex(generated.light));
      expect(_hex(derived.dark), _hex(generated.dark));
    });
  }

  // Mid-tone seeds take a light label on a fill darkened to 4.5:1, matching the
  // web's deriveProduct (values from packages/tokens).
  const midTones = [
    [Color(0xFFE4572E), Color(0xFFCB3F10), Color(0xFFFFF8F7), Color(0xFFBB3400)],
    [Color(0xFF0D9488), Color(0xFF008076), Color(0xFFF3FCFB), Color(0xFF00736A)],
    [Color(0xFFD97706), Color(0xFFAF5E00), Color(0xFFFFF9F4), Color(0xFF9E5500)],
  ];
  for (final [seed, fill, label, hover] in midTones) {
    test('${seed.toARGB32().toRadixString(16)} gets a light label on a fill that passes AA', () {
      final t = wxDeriveProduct(seed);
      for (final c in [t.light, t.dark]) {
        expect(c.accent.toARGB32(), fill.toARGB32());
        expect(c.accentFg.toARGB32(), label.toARGB32());
        expect(c.accentHover.toARGB32(), hover.toARGB32());
        final hi = c.accentFg.computeLuminance(), lo = c.accent.computeLuminance();
        expect((hi + 0.05) / (lo + 0.05), greaterThanOrEqualTo(4.5));
      }
    });
  }

  test('the master brand neutrals derive from its hue and tint', () {
    final derived = wxDeriveProduct(const Color(0xFF0A0A0A), hue: 95, tint: 0.16);
    final generated = wxProducts[WixzelProduct.wixzel]!;
    expect(derived.light.bg, generated.light.bg);
    expect(derived.dark.fgMuted, generated.dark.fgMuted);
  });

  test('a custom theme carries its own colour and corners', () {
    final tokens = wxDeriveProduct(const Color(0xFFE4572E), radius: 0.5);
    final theme = WixzelTheme.custom(tokens: tokens).toThemeData();
    expect(theme.colorScheme.primary, tokens.light.accent);
    expect(theme.extension<WxShapes>()!.scale, 0.5);
  });
}
