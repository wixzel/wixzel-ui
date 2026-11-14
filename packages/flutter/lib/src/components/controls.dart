import 'dart:ui' show PathMetric;

import 'package:flutter/material.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';

import '../color_mix.dart';
import '../motion.dart';
import '../theme.dart';
import '../tokens.g.dart';

const _black = Color(0xFF000000);

/// The check draws itself in along its path; unchecking draws it back out. The
/// box squeezes to 90% on press.
class WxCheckbox extends StatelessWidget {
  const WxCheckbox({super.key, required this.value, this.onChanged, this.semanticLabel});
  final bool value;
  final ValueChanged<bool>? onChanged;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final shape = context.wxShape.xs;
    return Opacity(
      opacity: onChanged == null ? 0.45 : 1,
      child: WxPressable(
        onTap: onChanged == null ? null : () => onChanged!(!value),
        scale: 0.9,
        shape: shape,
        button: false,
        selected: value,
        semanticLabel: semanticLabel,
        builder: (_, _) => AnimatedContainer(
          width: 20,
          height: 20,
          duration: WxDurations.move,
          curve: WxEase.move,
          decoration: ShapeDecoration(
            color: value ? c.accent : c.surface,
            shape: shape.copyWith(side: BorderSide(color: value ? wxMix(c.accent, _black, 0.22) : c.borderStrong, strokeAlign: BorderSide.strokeAlignOutside)),
          ),
          child: TweenAnimationBuilder<double>(
            tween: Tween(end: value ? 1 : 0),
            duration: WxDurations.base,
            curve: WxEase.out,
            builder: (_, t, _) => CustomPaint(painter: _CheckPainter(t, c.accentFg)),
          ),
        ),
      ),
    );
  }
}

class _CheckPainter extends CustomPainter {
  const _CheckPainter(this.t, this.color);
  final double t;
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    if (t <= 0) return;
    final u = size.width / 12;
    final path = Path()
      ..moveTo(2.5 * u, 6.3 * u)
      ..lineTo(4.8 * u, 8.6 * u)
      ..lineTo(9.5 * u, 3.6 * u);
    final PathMetric metric = path.computeMetrics().first;
    canvas.drawPath(
      metric.extractPath(0, metric.length * t),
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.75 * u
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round,
    );
  }

  @override
  bool shouldRepaint(_CheckPainter old) => old.t != t || old.color != color;
}

/// The dot grows in from nothing.
class WxRadio extends StatelessWidget {
  const WxRadio({super.key, required this.selected, this.onTap, this.semanticLabel});
  final bool selected;
  final VoidCallback? onTap;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    return Opacity(
      opacity: onTap == null ? 0.45 : 1,
      child: WxPressable(
        onTap: onTap,
        scale: 0.9,
        shape: const CircleBorder(),
        button: false,
        selected: selected,
        semanticLabel: semanticLabel,
        builder: (_, _) => AnimatedContainer(
          width: 20,
          height: 20,
          duration: WxDurations.move,
          curve: WxEase.move,
          alignment: Alignment.center,
          decoration: ShapeDecoration(
            color: selected ? c.accent : c.surface,
            shape: CircleBorder(side: BorderSide(color: selected ? wxMix(c.accent, _black, 0.22) : c.borderStrong, strokeAlign: BorderSide.strokeAlignOutside)),
          ),
          child: AnimatedScale(
            scale: selected ? 1 : 0,
            duration: WxDurations.move,
            curve: WxEase.move,
            child: Container(width: 8, height: 8, decoration: BoxDecoration(color: c.accentFg, shape: BoxShape.circle)),
          ),
        ),
      ),
    );
  }
}

/// A pill track and a round thumb. The thumb stretches while it is held, the
/// way a finger squashes it, then slides across. The track's colour crossfades
/// underneath.
class WxSwitch extends StatelessWidget {
  const WxSwitch({super.key, required this.value, this.onChanged, this.semanticLabel});
  final bool value;
  final ValueChanged<bool>? onChanged;
  final String? semanticLabel;

  static const _width = 42.0, _height = 24.0, _thumb = 20.0, _held = 24.0, _gap = 2.0;

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    return Opacity(
      opacity: onChanged == null ? 0.45 : 1,
      child: Semantics(
        toggled: value,
        child: WxPressable(
          onTap: onChanged == null ? null : () => onChanged!(!value),
          scale: 1,
          shape: const StadiumBorder(),
          button: false,
          semanticLabel: semanticLabel,
          builder: (_, s) {
            final thumb = s.pressed ? _held : _thumb;
            return AnimatedContainer(
              width: _width,
              height: _height,
              duration: WxDurations.base,
              curve: WxEase.standard,
              decoration: ShapeDecoration(color: value ? c.accent : c.borderStrong, shape: const StadiumBorder()),
              child: Stack(children: [
                AnimatedPositionedDirectional(
                  top: _gap,
                  start: value ? _width - _gap - thumb : _gap,
                  width: thumb,
                  height: _thumb,
                  duration: WxDurations.move,
                  curve: WxEase.move,
                  child: AnimatedContainer(
                    duration: WxDurations.move,
                    curve: WxEase.move,
                    decoration: ShapeDecoration(
                      // On the accent the thumb takes the colour made to sit on it; a white thumb vanishes on a light accent.
                      color: value ? c.accentFg : const Color(0xFFFFFFFF),
                      shape: const StadiumBorder(),
                      shadows: const [
                        BoxShadow(color: Color(0x24000000), spreadRadius: 0.5),
                        BoxShadow(color: Color(0x4D000000), offset: Offset(0, 1), blurRadius: 2),
                      ],
                    ),
                  ),
                ),
              ]),
            );
          },
        ),
      ),
    );
  }
}

/// Filter chips. A chosen chip is inked, like the current tab.
class WxChip extends StatelessWidget {
  const WxChip({super.key, required this.label, this.selected = false, this.onTap, this.icon, this.count});
  final String label;
  final bool selected;
  final VoidCallback? onTap;
  final IconData? icon;
  final int? count;

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final shape = context.wxShape.md;
    return Opacity(
      opacity: onTap == null ? 0.45 : 1,
      child: WxPressable(
        onTap: onTap,
        shape: shape,
        selected: selected,
        builder: (context, s) {
          final fg = selected ? c.bg : (s.pressed ? c.fg : c.fgMuted);
          return AnimatedContainer(
            height: WxControl.sm,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            duration: WxDurations.fast,
            curve: WxEase.standard,
            decoration: ShapeDecoration(
              color: selected ? c.fg : (s.pressed || s.hovered ? c.bgMuted : c.bgMuted.withValues(alpha: 0)),
              shape: shape.copyWith(side: BorderSide(color: selected ? c.fg : c.border, strokeAlign: BorderSide.strokeAlignOutside)),
            ),
            child: Row(mainAxisSize: MainAxisSize.min, children: [
              if (icon != null) ...[PhosphorIcon(icon!, size: 14, color: fg), const SizedBox(width: 6)],
              AnimatedDefaultTextStyle(
                duration: WxDurations.fast,
                style: context.wxType.bodySm.copyWith(color: fg, fontWeight: FontWeight.w500),
                child: Text(label, maxLines: 1),
              ),
              if (count != null) ...[
                const SizedBox(width: 6),
                Text(
                  '$count',
                  style: context.wxType.caption.copyWith(
                    color: selected ? c.bg.withValues(alpha: 0.7) : c.fgSubtle,
                    fontFeatures: const [FontFeature.tabularFigures()],
                  ),
                ),
              ],
            ]),
          );
        },
      ),
    );
  }
}

/// A row of chips that wraps.
class WxChips extends StatelessWidget {
  const WxChips({super.key, required this.children});
  final List<Widget> children;

  @override
  Widget build(BuildContext context) => Wrap(spacing: 6, runSpacing: 6, children: children);
}

/// One option as a card: an engine, a licence, a top-up amount. A light fill on
/// its panel; the chosen one takes the accent wash, a solid 2px ring and a
/// check that pops in. Round for one choice, square for many.
class WxRadioCard extends StatelessWidget {
  const WxRadioCard({
    super.key,
    required this.selected,
    required this.onTap,
    this.title,
    this.description,
    this.aside,
    this.icon,
    this.leading,
    this.child,
    this.round = true,
  });

  final bool selected;
  final VoidCallback? onTap;
  final String? title;
  final String? description;

  /// A price or figure on the end of the title row.
  final String? aside;
  final IconData? icon;

  /// A picture in place of [icon], such as a brand mark.
  final Widget? leading;
  final Widget? child;
  final bool round;

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final type = context.wxType;
    final shape = context.wxShape.md;
    final hasLead = leading != null || icon != null;
    return Opacity(
      opacity: onTap == null ? 0.45 : 1,
      child: WxPressable(
        onTap: onTap,
        scale: 0.985,
        shape: shape,
        selected: selected,
        builder: (_, s) => AnimatedContainer(
          duration: WxDurations.move,
          curve: WxEase.move,
          width: double.infinity,
          padding: const EdgeInsets.all(14),
          decoration: ShapeDecoration(
            color: selected ? c.accentSubtle : (s.pressed || s.hovered ? wxMix(c.surface, c.fg, 0.04) : c.surface),
            shape: shape.copyWith(side: BorderSide(color: selected ? c.accentEdge : c.accentEdge.withValues(alpha: 0), width: 2, strokeAlign: BorderSide.strokeAlignOutside)),
          ),
          child: Stack(children: [
            Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
              Padding(
                padding: const EdgeInsetsDirectional.only(end: 24),
                child: Row(children: [
                  if (hasLead) ...[
                    Container(
                      width: 24,
                      height: 24,
                      alignment: Alignment.center,
                      decoration: ShapeDecoration(color: selected ? c.surface : c.bgMuted, shape: context.wxShape.sm),
                      child: leading ?? PhosphorIcon(icon!, size: 14, color: c.fgMuted),
                    ),
                    const SizedBox(width: 8),
                  ],
                  if (title != null)
                    Expanded(child: Text(title!, style: type.bodySm.copyWith(fontWeight: FontWeight.w600), maxLines: 1, overflow: TextOverflow.ellipsis)),
                  if (aside != null)
                    Text(aside!, style: type.bodySm.copyWith(fontWeight: FontWeight.w500, fontFeatures: const [FontFeature.tabularFigures()])),
                ]),
              ),
              if (description != null) ...[const SizedBox(height: 4), Text(description!, style: type.caption.copyWith(color: c.fgMuted))],
              ?child,
            ]),
            PositionedDirectional(top: 2, end: 0, child: _OptionMark(selected: selected, round: round)),
          ]),
        ),
      ),
    );
  }
}

class _OptionMark extends StatelessWidget {
  const _OptionMark({required this.selected, required this.round});
  final bool selected, round;

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final side = BorderSide(color: selected ? wxMix(c.accent, _black, 0.24) : c.borderStrong, strokeAlign: BorderSide.strokeAlignOutside);
    return AnimatedContainer(
      width: 16,
      height: 16,
      duration: WxDurations.fast,
      alignment: Alignment.center,
      decoration: ShapeDecoration(
        color: selected ? c.accent : Colors.transparent,
        shape: round ? CircleBorder(side: side) : context.wxShape.xs.copyWith(side: side),
      ),
      child: AnimatedScale(
        scale: selected ? 1 : 0,
        duration: WxDurations.move,
        curve: WxEase.move,
        child: PhosphorIcon(PhosphorIconsBold.check, size: 10, color: c.accentFg),
      ),
    );
  }
}
