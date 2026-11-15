// A whole product palette from one seed colour, for an app whose colour is not
// one of the products in tokens.g.dart. This is a line-for-line port of
// deriveProduct in packages/tokens/src/tokens.ts and color.ts, so a seed gives
// the same hex values in Flutter as it does on the web; test/derive_test.dart
// checks it against every generated product.
import 'dart:math' as math;
import 'dart:ui' show Color;

import 'tokens.g.dart';

class _Lch {
  const _Lch(this.l, this.c, this.h);
  final double l;
  final double c;
  final double h;
}

double _toLinear(double c) => c <= 0.04045 ? c / 12.92 : math.pow((c + 0.055) / 1.055, 2.4).toDouble();
double _toGamma(double c) => c <= 0.0031308 ? 12.92 * c : 1.055 * math.pow(c, 1 / 2.4).toDouble() - 0.055;
double _cbrt(double x) => x < 0 ? -math.pow(-x, 1 / 3).toDouble() : math.pow(x, 1 / 3).toDouble();

// Channels as the web reads them from a hex string: whole bytes over 255.
List<double> _channels(Color c) {
  final v = c.toARGB32();
  return [(v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF].map((b) => b / 255).toList();
}

_Lch _toOklch(Color color) {
  final [r, g, b] = _channels(color).map(_toLinear).toList();
  final l = _cbrt(0.4122214708 * r + 0.5363329272 * g + 0.0514459929 * b);
  final m = _cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  final s = _cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  final bigL = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  final bigA = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  final bigB = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return _Lch(bigL, math.sqrt(bigA * bigA + bigB * bigB), (math.atan2(bigB, bigA) * 180 / math.pi + 360) % 360);
}

List<double> _linearRgb(double lightness, double c, double h) {
  final a = c * math.cos(h * math.pi / 180);
  final b = c * math.sin(h * math.pi / 180);
  double cube(double x) => x * x * x;
  final l = cube(lightness + 0.3963377774 * a + 0.2158037573 * b);
  final m = cube(lightness - 0.1055613458 * a - 0.0638541728 * b);
  final s = cube(lightness - 0.0894841775 * a - 1.291485548 * b);
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

bool _inGamut(List<double> rgb) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);

/// OKLCH to an opaque colour. Out of gamut keeps lightness and hue and loses chroma until it fits.
Color _oklch(double l, double c, double h) {
  final lightness = l.clamp(0.0, 1.0);
  var chroma = c;
  if (!_inGamut(_linearRgb(lightness, chroma, h))) {
    var lo = 0.0;
    var hi = c;
    for (var i = 0; i < 24; i++) {
      final mid = (lo + hi) / 2;
      if (_inGamut(_linearRgb(lightness, mid, h))) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    chroma = lo;
  }
  final [r, g, b] = _linearRgb(lightness, chroma, h).map((v) => (_toGamma(v.clamp(0.0, 1.0)) * 255).round()).toList();
  return Color.fromARGB(255, r, g, b);
}

double _luminance(Color c) {
  final [r, g, b] = _channels(c).map(_toLinear).toList();
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

double _contrast(Color a, Color b) {
  final la = _luminance(a), lb = _luminance(b);
  return (math.max(la, lb) + 0.05) / (math.min(la, lb) + 0.05);
}

// The neutral ramp as OKLCH lightness and chroma at a tint of 1: [light, dark].
const _ramp = <String, List<List<double>>>{
  'bg': [[0.99, 0.008], [0.165, 0.032]],
  'bgSubtle': [[0.955, 0.024], [0.19, 0.036]],
  'bgMuted': [[0.925, 0.03], [0.255, 0.042]],
  'card': [[0.958, 0.022], [0.205, 0.04]],
  'surface': [[0.997, 0.004], [0.245, 0.042]],
  'surfaceOverlay': [[0.997, 0.004], [0.25, 0.045]],
  'border': [[0.895, 0.032], [0.29, 0.045]],
  'borderStrong': [[0.81, 0.04], [0.385, 0.05]],
  'fg': [[0.21, 0.035], [0.965, 0.012]],
  'fgMuted': [[0.44, 0.045], [0.79, 0.03]],
  'fgSubtle': [[0.51, 0.045], [0.69, 0.035]],
  'fgDisabled': [[0.74, 0.03], [0.46, 0.03]],
};

/// Fills lighter than this take a dark label (lime, sky, mint); darker ones take
/// a light label. WCAG 2's formula alone would put dark text on mid-tone fills
/// like teal, orange and amber, where it passes on paper and reads poorly.
const _lightLabelBelow = 0.7;

Color _readable(_Lch seed, double from, double step, List<Color> grounds, double min) {
  for (var l = from; l >= 0 && l <= 1; l += step) {
    final c = _oklch(l, seed.c, seed.h);
    if (grounds.every((g) => _contrast(c, g) >= min)) return c;
  }
  return step < 0 ? const Color(0xFF000000) : const Color(0xFFFFFFFF);
}

/// A whole product from one seed colour: the page, surfaces, lines and text
/// washed with its hue, and accent roles that pass WCAG AA in both themes.
///
/// [tint] is how strongly the hue washes the neutrals (0 is grey). [hue] tints
/// with another hue, for a seed with none of its own. [radius] scales every
/// corner. [fontFamily] is a Google Fonts family; Manrope when left out.
///
/// ```dart
/// final brand = wxDeriveProduct(const Color(0xFFE4572E));
/// MaterialApp(
///   theme: WixzelTheme.custom(tokens: brand).toThemeData(),
///   darkTheme: WixzelTheme.custom(tokens: brand, brightness: Brightness.dark).toThemeData(),
/// );
/// ```
WxProductTokens wxDeriveProduct(Color seed, {double tint = 0.45, double? hue, double radius = 1, String? fontFamily}) {
  final opaque = seed.withAlpha(255);
  final s = _toOklch(opaque);
  final h = hue ?? s.h;
  // A greyish seed washes less: the tint follows how much colour the seed has.
  final strength = tint * (hue == null ? math.min(1.0, s.c / 0.08) : 1.0);

  final n = <String, List<Color>>{
    for (final MapEntry(key: role, value: [light, dark]) in _ramp.entries)
      role: [_oklch(light[0], light[1] * strength, h), _oklch(dark[0], dark[1] * strength, h)],
  };
  final overlay = [
    _oklch(0.18, 0.03 * strength, h).withAlpha(0x6B),
    _oklch(0.06, 0.01 * strength, h).withAlpha(0xA0),
  ];

  final light = _oklch(0.985, 0.01, s.h);
  final deep = _oklch(0.17, 0.02, s.h);
  // A fill that takes a light label is darkened just enough for it to reach 4.5:1.
  Color fillFor(Color fill) {
    final o = _toOklch(fill);
    if (o.l >= _lightLabelBelow) return fill;
    var out = fill;
    for (var l = o.l; _contrast(light, out) < 4.5 && l > 0;) {
      l -= 0.01;
      out = _oklch(l, o.c, o.h);
    }
    return out;
  }

  final accent = [fillFor(opaque), fillFor(s.l < 0.45 ? _oklch(0.62, s.c, s.h) : opaque)];
  Color onFill(Color fill) {
    if (_toOklch(fill).l < _lightLabelBelow) return light;
    return _contrast(light, fill) >= _contrast(deep, fill) ? light : deep;
  }

  final accentFg = accent.map(onFill).toList();
  // Hover moves away from the text on it, so the label only gets clearer.
  Color hover(Color fill, Color fg) {
    final o = _toOklch(fill);
    return _oklch(o.l + (_toOklch(fg).l > 0.5 ? -0.04 : 0.04), o.c, o.h);
  }

  final accentHover = [hover(accent[0], accentFg[0]), hover(accent[1], accentFg[1])];
  final accentSubtle = [_oklch(0.94, math.min(s.c, 0.07), s.h), _oklch(0.27, math.min(s.c, 0.06), s.h)];
  List<Color> grounds(int i) =>
      [n['bg']![i], n['bgSubtle']![i], n['card']![i], n['surface']![i], n['surfaceOverlay']![i], accentSubtle[i]];
  final accentInk = [
    _readable(s, math.min(s.l, 0.62), -0.01, grounds(0), 4.5),
    _readable(s, math.max(s.l, 0.7), 0.01, grounds(1), 4.5),
  ];
  final accentEdge = [
    _readable(s, math.min(s.l, 0.7), -0.01, grounds(0), 3),
    _readable(s, math.max(s.l, 0.6), 0.01, grounds(1), 3),
  ];

  // Status and chart colours are the same in every product.
  final base = wxProducts[WixzelProduct.wixzel]!;
  WxColors at(WxColors from, int i) => from.copyWith(
        bg: n['bg']![i],
        bgSubtle: n['bgSubtle']![i],
        bgMuted: n['bgMuted']![i],
        card: n['card']![i],
        surface: n['surface']![i],
        surfaceOverlay: n['surfaceOverlay']![i],
        border: n['border']![i],
        borderStrong: n['borderStrong']![i],
        fg: n['fg']![i],
        fgMuted: n['fgMuted']![i],
        fgSubtle: n['fgSubtle']![i],
        fgDisabled: n['fgDisabled']![i],
        fgInverse: n['bg']![i],
        bgInverse: n['fg']![i],
        overlay: overlay[i],
        accent: accent[i],
        accentHover: accentHover[i],
        accentFg: accentFg[i],
        accentSubtle: accentSubtle[i],
        accentInk: accentInk[i],
        accentEdge: accentEdge[i],
      );

  return WxProductTokens(light: at(base.light, 0), dark: at(base.dark, 1), radiusScale: radius, fontFamily: fontFamily);
}
