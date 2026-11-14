import 'package:flutter/material.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';

import '../color_mix.dart';
import '../motion.dart';
import '../theme.dart';
import '../tokens.g.dart';

/// A tinted panel: no border, no shadow. Give it [onTap] and it darkens a shade
/// and shrinks a little when pressed. Selected takes the accent wash, a solid
/// 2px accent ring and a check that pops in.
class WxCard extends StatelessWidget {
  const WxCard({super.key, required this.child, this.padding = const EdgeInsets.all(16), this.onTap, this.selected = false, this.showCheck = true, this.color});
  final Widget child;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onTap;
  final bool selected;

  /// Leave the check off a selected card whose end is taken by its own controls.
  final bool showCheck;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final shape = context.wxShape.lg;
    Widget panel(bool pressed) {
      final rest = color ?? c.card;
      final fill = selected ? c.accentSubtle : (pressed ? wxMix(rest, c.fg, 0.04) : rest);
      return AnimatedContainer(
        duration: WxDurations.move,
        curve: WxEase.move,
        clipBehavior: Clip.antiAlias,
        decoration: ShapeDecoration(
          color: fill,
          shape: shape.copyWith(
            side: BorderSide(color: selected ? c.accentEdge : c.accentEdge.withValues(alpha: 0), width: 2, strokeAlign: BorderSide.strokeAlignOutside),
          ),
        ),
        child: Stack(children: [
          Padding(padding: padding, child: child),
          if (selected && showCheck) const PositionedDirectional(end: 12, top: 12, child: _SelectedCheck()),
        ]),
      );
    }

    if (onTap == null) return panel(false);
    return WxPressable(onTap: onTap, scale: 0.99, shape: shape, selected: selected, builder: (_, s) => panel(s.pressed || s.hovered));
  }
}

class _SelectedCheck extends StatelessWidget {
  const _SelectedCheck();

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    return WxBlurIn(
      child: Container(
        width: 16,
        height: 16,
        decoration: ShapeDecoration(color: c.accent, shape: context.wxShape.xs),
        child: PhosphorIcon(PhosphorIconsBold.check, size: 10, color: c.accentFg),
      ),
    );
  }
}

enum WxSectionTone { normal, danger }

/// A panel of a settings page or editor: an icon tile, a title, a line of
/// description, then rows split by hairlines ([children]) or a padded [child].
class WxSection extends StatelessWidget {
  const WxSection({
    super.key,
    this.title,
    this.description,
    this.icon,
    this.trailing,
    this.children = const [],
    this.child,
    this.footer,
    this.tone = WxSectionTone.normal,
  });

  final String? title;
  final String? description;
  final IconData? icon;

  /// Actions on the end of the header.
  final Widget? trailing;
  final List<Widget> children;
  final Widget? child;

  /// A note under the rows.
  final String? footer;
  final WxSectionTone tone;

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final type = context.wxType;
    final danger = tone == WxSectionTone.danger;
    final hasHeader = title != null || description != null || trailing != null;
    return Container(
      clipBehavior: Clip.antiAlias,
      decoration: ShapeDecoration(
        color: danger ? wxMix(c.dangerSubtle, c.card, 0.35) : c.card,
        shape: context.wxShape.lg,
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, mainAxisSize: MainAxisSize.min, children: [
        if (hasHeader)
          Padding(
            padding: EdgeInsets.fromLTRB(16, 14, trailing == null ? 16 : 10, children.isEmpty && child == null ? 14 : 8),
            child: Row(crossAxisAlignment: CrossAxisAlignment.center, children: [
              if (icon != null) ...[
                WxIconTile(icon: icon!, size: 28, tone: danger ? WxIconTileTone.danger : WxIconTileTone.muted),
                const SizedBox(width: 10),
              ],
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
                  if (title != null) Text(title!, style: type.headingSm),
                  if (description != null) ...[
                    if (title != null) const SizedBox(height: 2),
                    Text(description!, style: type.bodySm.copyWith(color: c.fgMuted)),
                  ],
                ]),
              ),
              ?trailing,
            ]),
          ),
        if (child != null) Padding(padding: EdgeInsets.fromLTRB(16, hasHeader ? 4 : 16, 16, 16), child: child),
        for (var i = 0; i < children.length; i++) ...[
          if (i > 0) const WxSeparator(indent: 16),
          children[i],
        ],
        if (footer != null) Padding(padding: const EdgeInsets.fromLTRB(16, 8, 16, 14), child: Text(footer!, style: type.caption.copyWith(color: c.fgMuted))),
      ]),
    );
  }
}

/// A hairline, for dividing rows inside a panel.
class WxSeparator extends StatelessWidget {
  const WxSeparator({super.key, this.indent = 0});
  final double indent;

  @override
  Widget build(BuildContext context) => Divider(height: 1, thickness: 1, indent: indent, color: context.wx.border);
}

enum WxIconTileTone { surface, muted, accent, warning, danger }

/// An icon on a small tinted tile, as in a Section header or an EmptyState.
class WxIconTile extends StatelessWidget {
  const WxIconTile({super.key, required this.icon, this.size = 36, this.tone = WxIconTileTone.surface});
  final IconData icon;
  final double size;
  final WxIconTileTone tone;

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final (Color fill, Color ink) = switch (tone) {
      WxIconTileTone.surface => (c.surface, c.fgMuted),
      WxIconTileTone.muted => (c.bgMuted, c.fgMuted),
      WxIconTileTone.accent => (c.accentSubtle, c.accentInk),
      WxIconTileTone.warning => (c.warningSubtle, c.warningInk),
      WxIconTileTone.danger => (c.dangerSubtle, c.dangerInk),
    };
    return Container(
      width: size,
      height: size,
      decoration: ShapeDecoration(color: fill, shape: size < 32 ? context.wxShape.sm : context.wxShape.md),
      child: PhosphorIcon(icon, size: size * 0.55, color: ink),
    );
  }
}

enum WxTone { neutral, accent, success, warning, danger, info }

enum WxBadgeAppearance { soft, solid, outline }

enum WxBadgeSize { sm, md }

/// A status label. Soft by default. [dot] puts a status dot before the label;
/// [pulse] makes the dot send out a slow ring, for something happening right now.
class WxBadge extends StatelessWidget {
  const WxBadge(
    this.label, {
    super.key,
    this.tone = WxTone.neutral,
    this.appearance = WxBadgeAppearance.soft,
    this.dot = false,
    this.pulse = false,
    this.size = WxBadgeSize.md,
    this.icon,
  });

  final String label;
  final WxTone tone;
  final WxBadgeAppearance appearance;
  final bool dot;
  final bool pulse;
  final WxBadgeSize size;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final (Color subtle, Color ink, Color solid, Color onSolid) = switch (tone) {
      WxTone.neutral => (c.bgMuted, c.fgMuted, c.bgInverse, c.fgInverse),
      WxTone.accent => (c.accentSubtle, c.accentInk, c.accent, c.accentFg),
      WxTone.success => (c.successSubtle, c.successInk, c.success, c.successFg),
      WxTone.warning => (c.warningSubtle, c.warningInk, c.warning, c.warningFg),
      WxTone.danger => (c.dangerSubtle, c.dangerInk, c.danger, c.dangerFg),
      WxTone.info => (c.infoSubtle, c.infoInk, c.info, c.infoFg),
    };
    final (Color? fill, Color fg, BorderSide side) = switch (appearance) {
      WxBadgeAppearance.soft => (subtle, ink, BorderSide.none),
      WxBadgeAppearance.solid => (solid, onSolid, BorderSide.none),
      WxBadgeAppearance.outline => (null, ink, BorderSide(color: tone == WxTone.neutral ? c.borderStrong : ink)),
    };
    final md = size == WxBadgeSize.md;
    final style = (md ? context.wxType.caption : context.wxType.caption.copyWith(fontSize: 11, height: 1)).copyWith(
      color: fg,
      fontWeight: FontWeight.w500,
      fontFeatures: const [FontFeature.tabularFigures()],
    );
    return Container(
      height: md ? 20 : 16,
      padding: EdgeInsets.symmetric(horizontal: md ? 6 : 4),
      decoration: ShapeDecoration(color: fill, shape: context.wxShape.xs.copyWith(side: side)),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        if (dot || pulse) ...[_Dot(color: fg, pulse: pulse), const SizedBox(width: 6)],
        if (icon != null) ...[PhosphorIcon(icon!, size: 12, color: fg), const SizedBox(width: 4)],
        Text(label, style: style, maxLines: 1),
      ]),
    );
  }
}

class _Dot extends StatefulWidget {
  const _Dot({required this.color, required this.pulse});
  final Color color;
  final bool pulse;

  @override
  State<_Dot> createState() => _DotState();
}

class _DotState extends State<_Dot> with SingleTickerProviderStateMixin {
  // Made only when the dot pulses: most badges are still.
  AnimationController? _c;

  @override
  void initState() {
    super.initState();
    _sync();
  }

  @override
  void didUpdateWidget(_Dot old) {
    super.didUpdateWidget(old);
    _sync();
  }

  void _sync() {
    if (widget.pulse) {
      (_c ??= AnimationController(vsync: this, duration: const Duration(seconds: 2))).repeat();
    } else {
      _c?.stop();
    }
  }

  @override
  void dispose() {
    _c?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final dot = DecoratedBox(decoration: BoxDecoration(color: widget.color, shape: BoxShape.circle));
    final c = _c;
    return SizedBox.square(
      dimension: 6,
      child: Stack(clipBehavior: Clip.none, fit: StackFit.expand, children: [
        if (widget.pulse && c != null && !MediaQuery.disableAnimationsOf(context))
          AnimatedBuilder(
            animation: c,
            builder: (_, child) {
              final t = WxEase.out.transform((c.value / 0.7).clamp(0.0, 1.0));
              return Opacity(opacity: 0.55 * (1 - t), child: Transform.scale(scale: 1 + 1.6 * t, child: child));
            },
            child: dot,
          ),
        dot,
      ]),
    );
  }
}

/// When a list has nothing in it: say what will appear and how to add the first one.
class WxEmptyState extends StatelessWidget {
  const WxEmptyState({super.key, this.icon, required this.title, this.description, this.actions});
  final IconData? icon;
  final String title;
  final String? description;
  final Widget? actions;

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final type = context.wxType;
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 48),
        decoration: ShapeDecoration(color: c.card, shape: context.wxShape.lg),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          if (icon != null) ...[WxIconTile(icon: icon!, size: 44), const SizedBox(height: 12)],
          Text(title, style: type.headingSm, textAlign: TextAlign.center),
          if (description != null) ...[
            const SizedBox(height: 4),
            Text(description!, style: type.bodySm.copyWith(color: c.fgMuted), textAlign: TextAlign.center),
          ],
          if (actions != null) ...[const SizedBox(height: 16), actions!],
        ]),
      ),
    );
  }
}

/// A figure with its label and a line under it, on a tinted panel.
class WxStatCard extends StatelessWidget {
  const WxStatCard({super.key, required this.label, required this.value, this.footer, this.icon, this.onTap, this.valueColor});
  final String label;
  final String value;
  final String? footer;
  final IconData? icon;
  final VoidCallback? onTap;
  final Color? valueColor;

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final type = context.wxType;
    return WxCard(
      onTap: onTap,
      padding: const EdgeInsets.fromLTRB(14, 14, 14, 12),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
        Row(children: [
          if (icon != null) ...[PhosphorIcon(icon!, size: 14, color: c.fgSubtle), const SizedBox(width: 6)],
          Flexible(
            child: Text(label, style: type.caption.copyWith(color: c.fgSubtle, fontWeight: FontWeight.w500), maxLines: 1, overflow: TextOverflow.ellipsis),
          ),
        ]),
        const SizedBox(height: 8),
        FittedBox(
          fit: BoxFit.scaleDown,
          alignment: AlignmentDirectional.centerStart,
          child: Text(value, style: type.headingMd.copyWith(color: valueColor, fontFeatures: const [FontFeature.tabularFigures()]), maxLines: 1),
        ),
        if (footer != null) ...[
          const SizedBox(height: 4),
          Text(footer!, style: type.caption.copyWith(color: c.fgMuted), maxLines: 1, overflow: TextOverflow.ellipsis),
        ],
      ]),
    );
  }
}

/// A placeholder with a slow band of light passing over it.
class WxSkeleton extends StatefulWidget {
  const WxSkeleton({super.key, this.height = 16, this.width = double.infinity, this.radius});
  final double height;
  final double width;

  /// Defaults to the panel squircle for tall blocks and the small one for text lines.
  final double? radius;

  @override
  State<WxSkeleton> createState() => _WxSkeletonState();
}

class _WxSkeletonState extends State<WxSkeleton> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 1800));

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _c.stop();
    } else if (!_c.isAnimating) {
      _c.repeat();
    }
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final shape = context.wxShape.sm.copyWith(radius: widget.radius ?? (widget.height > 32 ? WxSquircle.lg : WxSquircle.sm));
    final band = c.surface.withValues(alpha: 0.6);
    return RepaintBoundary(
      child: AnimatedBuilder(
        animation: _c,
        builder: (_, _) {
          final x = 2 - 4 * WxEase.inOut.transform(_c.value);
          return Container(
            height: widget.height,
            width: widget.width,
            decoration: ShapeDecoration(
              shape: shape,
              color: null,
              gradient: LinearGradient(
                begin: Alignment(x - 1, 0),
                end: Alignment(x + 1, 0),
                colors: [c.bgMuted, Color.alphaBlend(band, c.bgMuted), c.bgMuted],
                stops: const [0.3, 0.5, 0.7],
              ),
            ),
          );
        },
      ),
    );
  }
}

enum WxAvatarSize { xs, sm, md, lg, xl }

enum WxAvatarShape { round, square }

enum WxPresence { online, busy, away, offline }

/// Initials on a soft gradient. Round for people; square for workspaces, teams and agents.
class WxAvatar extends StatelessWidget {
  const WxAvatar({super.key, required this.name, this.size = WxAvatarSize.md, this.shape = WxAvatarShape.round, this.status, this.child});
  final String name;
  final WxAvatarSize size;
  final WxAvatarShape shape;
  final WxPresence? status;

  /// A picture in place of the initials: a photo, a mascot.
  final Widget? child;

  static String _initials(String name) {
    final parts = name.trim().split(RegExp(r'\s+')).where((p) => p.isNotEmpty).toList();
    if (parts.isEmpty) return '?';
    final first = parts.first.characters.first;
    final last = parts.length > 1 ? parts.last.characters.first : '';
    return (first + last).toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final shapes = context.wxShape;
    final (double side, double font, ShapeBorder square) = switch (size) {
      WxAvatarSize.xs => (20.0, 9.0, shapes.xs),
      WxAvatarSize.sm => (24.0, 10.0, shapes.xs),
      WxAvatarSize.md => (32.0, 13.0, shapes.sm),
      WxAvatarSize.lg => (40.0, 14.0, shapes.md),
      WxAvatarSize.xl => (56.0, 17.0, shapes.lg),
    };
    final outline = shape == WxAvatarShape.round ? const CircleBorder() : square;
    final face = Container(
      width: side,
      height: side,
      clipBehavior: Clip.antiAlias,
      alignment: Alignment.center,
      decoration: ShapeDecoration(
        shape: outline,
        gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [c.bgMuted, wxMix(c.bgMuted, c.fg, 0.06)]),
      ),
      child: child ??
          Text(
            _initials(name),
            semanticsLabel: name,
            style: context.wxType.caption.copyWith(fontSize: font, height: 1, fontWeight: FontWeight.w600, letterSpacing: 0.3, color: c.fgMuted),
          ),
    );
    if (status == null) return face;
    final dot = switch (status!) {
      WxPresence.online => c.success,
      WxPresence.busy => c.danger,
      WxPresence.away => c.warning,
      WxPresence.offline => c.fgDisabled,
    };
    final d = side * 0.3 < 8 ? 8.0 : side * 0.3;
    return SizedBox.square(
      dimension: side,
      child: Stack(clipBehavior: Clip.none, children: [
        face,
        PositionedDirectional(
          end: -1,
          bottom: -1,
          child: Container(
            width: d,
            height: d,
            decoration: BoxDecoration(color: dot, shape: BoxShape.circle, border: Border.all(color: c.bg, width: 2, strokeAlign: BorderSide.strokeAlignOutside)),
          ),
        ),
      ]),
    );
  }
}

/// A tinted panel in its tone, for something the page needs to say.
class WxAlert extends StatelessWidget {
  const WxAlert({super.key, this.tone = WxTone.neutral, this.title, this.body, this.icon, this.action});
  final WxTone tone;
  final String? title;
  final String? body;
  final IconData? icon;
  final Widget? action;

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final type = context.wxType;
    final (Color fill, Color ink, IconData glyph) = switch (tone) {
      WxTone.success => (c.successSubtle, c.successInk, PhosphorIconsDuotone.checkCircle),
      WxTone.warning => (c.warningSubtle, c.warningInk, PhosphorIconsDuotone.warning),
      WxTone.danger => (c.dangerSubtle, c.dangerInk, PhosphorIconsDuotone.warningCircle),
      WxTone.info => (c.infoSubtle, c.infoInk, PhosphorIconsDuotone.info),
      _ => (c.bgSubtle, c.fgMuted, PhosphorIconsDuotone.info),
    };
    return WxBlurIn(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: ShapeDecoration(color: fill, shape: context.wxShape.md),
        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Padding(padding: const EdgeInsets.only(top: 2), child: PhosphorIcon(icon ?? glyph, size: 16, color: ink)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              if (title != null) Text(title!, style: type.bodySm.copyWith(fontWeight: FontWeight.w500)),
              if (body != null) Text(body!, style: type.bodySm.copyWith(color: title == null ? c.fg : c.fgMuted)),
            ]),
          ),
          if (action != null) ...[const SizedBox(width: 8), action!],
        ]),
      ),
    );
  }
}
