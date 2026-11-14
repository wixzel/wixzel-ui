import 'package:flutter/material.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';

import '../color_mix.dart';
import '../motion.dart';
import '../squircle.dart';
import '../theme.dart';
import '../tokens.g.dart';
import 'spinner.dart';

enum WxButtonVariant { primary, secondary, ghost, danger, link }

enum WxButtonSize { xs, sm, md, lg, iconXs, iconSm, icon, iconLg }

/// Details every button carries:
/// - Press shrinks to 96% at once and eases back on release.
/// - Filled buttons have a 1px darker rim, a top highlight and a hard bottom edge.
/// - Secondary buttons are raised and go concave while held.
/// - An end icon (an arrow, say) slides 2px forward on hover.
/// - Loading swaps the start icon for a spinner and stops accepting taps.
class WxButton extends StatelessWidget {
  const WxButton({
    super.key,
    this.label,
    this.onPressed,
    this.variant = WxButtonVariant.secondary,
    this.size = WxButtonSize.md,
    this.block = false,
    this.loading = false,
    this.iconStart,
    this.iconEnd,
    this.leading,
    this.child,
    this.semanticLabel,
  });

  final String? label;
  final VoidCallback? onPressed;
  final WxButtonVariant variant;
  final WxButtonSize size;

  /// Fills the width it is given.
  final bool block;
  final bool loading;
  final IconData? iconStart;

  /// Slides forward on hover. Use for arrows and chevrons that lead somewhere.
  final IconData? iconEnd;

  /// A picture before the label in place of [iconStart], such as a brand mark
  /// that must keep its own colours.
  final Widget? leading;

  /// Content in place of [label]. Icon-only buttons take their icon here or in [iconStart].
  final Widget? child;
  final String? semanticLabel;

  bool get _iconOnly => switch (size) {
        WxButtonSize.iconXs || WxButtonSize.iconSm || WxButtonSize.icon || WxButtonSize.iconLg => true,
        _ => false,
      };

  @override
  Widget build(BuildContext context) {
    final type = context.wxType;
    final shapes = context.wxShape;
    final link = variant == WxButtonVariant.link;
    final (double height, double padX, double gap, WxSquircleBorder shape, TextStyle text, double icon) = switch (size) {
      WxButtonSize.xs => (WxControl.xs, 8.0, 4.0, shapes.sm, type.caption, 14.0),
      WxButtonSize.sm => (WxControl.sm, 10.0, 6.0, shapes.md, type.bodySm, 16.0),
      WxButtonSize.md => (WxControl.md, 12.0, 6.0, shapes.md, type.bodySm, 16.0),
      // Large is the everyday size on a phone, so it keeps the control radius
      // the web's default buttons have, not the panel radius.
      WxButtonSize.lg => (WxControl.lg, 16.0, 8.0, shapes.md, type.bodyMd, 16.0),
      WxButtonSize.iconXs => (WxControl.xs, 0.0, 0.0, shapes.sm, type.caption, 14.0),
      WxButtonSize.iconSm => (WxControl.sm, 0.0, 0.0, shapes.md, type.bodySm, 16.0),
      WxButtonSize.icon => (WxControl.md, 0.0, 0.0, shapes.md, type.bodySm, 16.0),
      WxButtonSize.iconLg => (WxControl.lg, 0.0, 0.0, shapes.md, type.bodyMd, 20.0),
    };
    final enabled = onPressed != null && !loading;
    final style = text.copyWith(
      fontWeight: FontWeight.w500,
      decoration: link ? TextDecoration.underline : null,
      decorationColor: link ? context.wx.accentInk.withValues(alpha: 0.35) : null,
    );

    return Opacity(
      opacity: onPressed == null && !loading ? 0.45 : 1,
      child: WxPressable(
        onTap: enabled ? onPressed : null,
        scale: link ? 1 : 0.96,
        shape: shape,
        semanticLabel: semanticLabel,
        builder: (context, state) => TweenAnimationBuilder<_Face>(
          tween: _FaceTween(end: _face(context, state)),
          duration: state.pressed ? WxDurations.instant : WxDurations.move,
          curve: WxEase.move,
          builder: (context, face, content) => CustomPaint(
            painter: _FacePainter(face, shape.radius),
            child: DefaultTextStyle(
              style: style.copyWith(color: face.fg),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              child: IconTheme.merge(data: IconThemeData(color: face.fg, size: icon), child: content!),
            ),
          ),
          child: SizedBox(
            height: link ? null : height,
            width: _iconOnly ? height : (block ? double.infinity : null),
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: link ? 0 : padX),
              child: _content(gap, state.hovered, size == WxButtonSize.lg || size == WxButtonSize.iconLg),
            ),
          ),
        ),
      ),
    );
  }

  Widget _content(double gap, bool hovered, bool large) {
    final hasText = label != null || child != null;
    final start = loading
        ? WxSpinner(size: large ? WxSpinnerSize.lg : WxSpinnerSize.md)
        : (leading ?? (iconStart == null ? null : PhosphorIcon(iconStart!)));
    final body = child ?? (label == null ? null : Text(label!));
    final hideBody = loading && _iconOnly;
    final row = Row(mainAxisSize: MainAxisSize.min, mainAxisAlignment: MainAxisAlignment.center, children: [
      ?start,
      if (start != null && hasText && !hideBody) SizedBox(width: gap),
      if (body != null && !hideBody) Flexible(child: body),
      if (iconEnd != null) ...[
        SizedBox(width: gap),
        AnimatedSlide(
          offset: Offset(hovered ? 0.125 : 0, 0),
          duration: WxDurations.move,
          curve: WxEase.move,
          child: PhosphorIcon(iconEnd!),
        ),
      ],
    ]);
    return Center(widthFactor: 1, child: row);
  }

  _Face _face(BuildContext context, WxPressState s) {
    final c = context.wx;
    final dark = Theme.of(context).brightness == Brightness.dark;
    const none = Colors.transparent;
    const black = Color(0xFF000000);
    const white = Color(0xFFFFFFFF);
    const drop = Color(0x3D18160A);
    switch (variant) {
      case WxButtonVariant.primary:
        return s.pressed
            ? _Face(fill: c.accentHover, rim: wxMix(c.accent, black, 0.26), top: const Color(0x33000000), drop: none, fg: c.accentFg)
            : _Face(fill: s.hovered ? c.accentHover : c.accent, rim: wxMix(c.accent, black, 0.24), top: const Color(0x38FFFFFF), drop: drop, fg: c.accentFg);
      case WxButtonVariant.danger:
        final held = wxMix(c.danger, black, 0.1);
        return s.pressed
            ? _Face(fill: held, rim: wxMix(c.danger, black, 0.26), top: const Color(0x33000000), drop: none, fg: c.dangerFg)
            : _Face(fill: s.hovered ? held : c.danger, rim: wxMix(c.danger, black, 0.24), top: const Color(0x38FFFFFF), drop: drop, fg: c.dangerFg);
      case WxButtonVariant.secondary:
        final ink = dark ? white : const Color(0xFF18160A);
        return s.pressed
            ? _Face(fill: c.bgSubtle, rim: ink.withValues(alpha: dark ? 0.09 : 0.18), top: (dark ? black : ink).withValues(alpha: dark ? 0.5 : 0.1), drop: none, fg: c.fg)
            : _Face(
                fill: s.hovered ? c.bgSubtle : c.surface,
                rim: ink.withValues(alpha: dark ? 0.11 : 0.15),
                top: dark ? white.withValues(alpha: 0.06) : none,
                drop: dark ? black.withValues(alpha: 0.6) : ink.withValues(alpha: 0.1),
                fg: c.fg,
              );
      case WxButtonVariant.ghost:
        final fill = s.pressed ? wxMix(c.bgMuted, c.fg, 0.06) : (s.hovered ? c.bgMuted : c.bgMuted.withValues(alpha: 0));
        return _Face(fill: fill, rim: none, top: none, drop: none, fg: s.pressed || s.hovered ? c.fg : c.fgMuted);
      case WxButtonVariant.link:
        return _Face(fill: none, rim: none, top: none, drop: none, fg: c.accentInk);
    }
  }
}

/// A square icon button, ghost unless told otherwise. [tooltip] is also its
/// name for screen readers.
class WxIconButton extends StatelessWidget {
  const WxIconButton({
    super.key,
    required this.icon,
    this.onPressed,
    this.tooltip,
    this.variant = WxButtonVariant.ghost,
    this.size = WxButtonSize.iconLg,
    this.loading = false,
  });

  final Widget icon;
  final VoidCallback? onPressed;
  final String? tooltip;
  final WxButtonVariant variant;
  final WxButtonSize size;
  final bool loading;

  @override
  Widget build(BuildContext context) {
    final button = WxButton(onPressed: onPressed, variant: variant, size: size, loading: loading, semanticLabel: tooltip, child: icon);
    return tooltip == null ? button : Tooltip(message: tooltip!, excludeFromSemantics: true, child: button);
  }
}

@immutable
class _Face {
  const _Face({required this.fill, required this.rim, required this.top, required this.drop, required this.fg});
  final Color fill, rim, top, drop, fg;
}

class _FaceTween extends Tween<_Face> {
  _FaceTween({required _Face end}) : super(end: end);

  @override
  _Face lerp(double t) {
    final a = begin ?? end!, b = end!;
    return _Face(
      fill: Color.lerp(a.fill, b.fill, t)!,
      rim: Color.lerp(a.rim, b.rim, t)!,
      top: Color.lerp(a.top, b.top, t)!,
      drop: Color.lerp(a.drop, b.drop, t)!,
      fg: Color.lerp(a.fg, b.fg, t)!,
    );
  }
}

class _FacePainter extends CustomPainter {
  const _FacePainter(this.face, this.radius);
  final _Face face;
  final double radius;

  @override
  void paint(Canvas canvas, Size size) {
    final rect = Offset.zero & size;
    final body = wxSquirclePath(rect, radius);
    final p = Paint()..isAntiAlias = true;
    if (face.drop.a > 0) canvas.drawPath(body.shift(const Offset(0, 1)), p..color = face.drop);
    if (face.rim.a > 0) canvas.drawPath(wxSquirclePath(rect.inflate(1), radius + 1), p..color = face.rim);
    if (face.fill.a > 0) canvas.drawPath(body, p..color = face.fill);
    if (face.top.a > 0) {
      canvas.drawPath(Path.combine(PathOperation.difference, body, body.shift(const Offset(0, 1))), p..color = face.top);
    }
  }

  @override
  bool shouldRepaint(_FacePainter old) => old.face != face || old.radius != radius;
}
