import 'dart:math' as math;
import 'dart:ui' show Color;

double _toLinear(double c) => c <= 0.04045 ? c / 12.92 : math.pow((c + 0.055) / 1.055, 2.4).toDouble();
double _toGamma(double c) => c <= 0.0031308 ? 12.92 * c : 1.055 * math.pow(c, 1 / 2.4).toDouble() - 0.055;
double _cbrt(double x) => x < 0 ? -math.pow(-x, 1 / 3).toDouble() : math.pow(x, 1 / 3).toDouble();

List<double> _toOklab(Color c) {
  final r = _toLinear(c.r), g = _toLinear(c.g), b = _toLinear(c.b);
  final l = _cbrt(0.4122214708 * r + 0.5363329272 * g + 0.0514459929 * b);
  final m = _cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  final s = _cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

Color _fromOklab(double lightness, double a, double b, double alpha) {
  final l = math.pow(lightness + 0.3963377774 * a + 0.2158037573 * b, 3).toDouble();
  final m = math.pow(lightness - 0.1055613458 * a - 0.0638541728 * b, 3).toDouble();
  final s = math.pow(lightness - 0.0894841775 * a - 1.291485548 * b, 3).toDouble();
  double channel(double v) => _toGamma(v.clamp(0.0, 1.0)).clamp(0.0, 1.0);
  return Color.from(
    alpha: alpha,
    red: channel(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    green: channel(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    blue: channel(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  );
}

/// `color-mix(in oklab, a, b amount)`, so a shade computed here is the same
/// shade the web computes. [amount] is the share of [b], from 0 to 1.
Color wxMix(Color a, Color b, double amount) {
  final x = _toOklab(a), y = _toOklab(b);
  double at(int i) => x[i] + (y[i] - x[i]) * amount;
  return _fromOklab(at(0), at(1), at(2), a.a + (b.a - a.a) * amount);
}
