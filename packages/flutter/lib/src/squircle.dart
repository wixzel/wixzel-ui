import 'dart:math' as math;

import 'package:flutter/widgets.dart';

// A single cubic per corner fits |x|^4 + |y|^4 = 1 to within a percent of the
// radius: the handle length that puts the curve's midpoint on the true curve.
const _handle = 0.9091;

/// The outline the web gets from `corner-shape: squircle` (`superellipse(2)`):
/// the curve eases into the straight edge instead of meeting it at a tangent.
/// A radius too large for the rectangle is clamped to half its short side.
Path wxSquirclePath(Rect rect, double radius) {
  final r = math.min(radius, rect.shortestSide / 2);
  if (r <= 0) return Path()..addRect(rect);
  final k = r * _handle;
  final (left, top, right, bottom) = (rect.left, rect.top, rect.right, rect.bottom);
  return Path()
    ..moveTo(left + r, top)
    ..lineTo(right - r, top)
    ..cubicTo(right - r + k, top, right, top + r - k, right, top + r)
    ..lineTo(right, bottom - r)
    ..cubicTo(right, bottom - r + k, right - r + k, bottom, right - r, bottom)
    ..lineTo(left + r, bottom)
    ..cubicTo(left + r - k, bottom, left, bottom - r + k, left, bottom - r)
    ..lineTo(left, top + r)
    ..cubicTo(left, top + r - k, left + r - k, top, left + r, top)
    ..close();
}

/// A squircle as a Flutter shape: for ShapeDecoration, ClipPath and Material.
@immutable
class WxSquircleBorder extends OutlinedBorder {
  const WxSquircleBorder({required this.radius, super.side});

  final double radius;

  @override
  EdgeInsetsGeometry get dimensions => EdgeInsets.all(math.max(side.strokeInset, 0));

  @override
  Path getInnerPath(Rect rect, {TextDirection? textDirection}) =>
      wxSquirclePath(rect.deflate(side.strokeInset), math.max(0, radius - side.strokeInset));

  @override
  Path getOuterPath(Rect rect, {TextDirection? textDirection}) => wxSquirclePath(rect, radius);

  @override
  void paint(Canvas canvas, Rect rect, {TextDirection? textDirection}) {
    if (side.style == BorderStyle.none || side.width == 0) return;
    final offset = side.strokeOffset / 2;
    canvas.drawPath(wxSquirclePath(rect.inflate(offset), math.max(0, radius + offset)), side.toPaint());
  }

  @override
  WxSquircleBorder copyWith({BorderSide? side, double? radius}) =>
      WxSquircleBorder(radius: radius ?? this.radius, side: side ?? this.side);

  @override
  ShapeBorder scale(double t) => WxSquircleBorder(radius: radius * t, side: side.scale(t));

  @override
  ShapeBorder? lerpFrom(ShapeBorder? a, double t) {
    if (a is WxSquircleBorder) {
      return WxSquircleBorder(radius: a.radius + (radius - a.radius) * t, side: BorderSide.lerp(a.side, side, t));
    }
    return super.lerpFrom(a, t);
  }

  @override
  ShapeBorder? lerpTo(ShapeBorder? b, double t) {
    if (b is WxSquircleBorder) {
      return WxSquircleBorder(radius: radius + (b.radius - radius) * t, side: BorderSide.lerp(side, b.side, t));
    }
    return super.lerpTo(b, t);
  }

  @override
  bool operator ==(Object other) => other is WxSquircleBorder && other.radius == radius && other.side == side;

  @override
  int get hashCode => Object.hash(radius, side);
}
