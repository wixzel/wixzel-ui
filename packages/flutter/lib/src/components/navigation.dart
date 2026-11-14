import 'package:flutter/material.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';

import '../color_mix.dart';
import '../motion.dart';
import '../theme.dart';
import '../tokens.g.dart';
import 'button.dart';
import 'controls.dart';
import 'spinner.dart';

/// The bar at the top of a page: a title on the page's own colour, no line and
/// no shadow. A page that can go back gets a back button and a smaller title.
/// Takes AppBar's main arguments.
class WxAppBar extends StatelessWidget implements PreferredSizeWidget {
  const WxAppBar({super.key, this.title, this.leading, this.actions, this.bottom, this.automaticallyImplyLeading = true});
  final Widget? title;
  final Widget? leading;
  final List<Widget>? actions;
  final PreferredSizeWidget? bottom;
  final bool automaticallyImplyLeading;

  static const _height = 56.0;

  @override
  Size get preferredSize => Size.fromHeight(_height + (bottom?.preferredSize.height ?? 0));

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final type = context.wxType;
    final canPop = automaticallyImplyLeading && (ModalRoute.of(context)?.impliesAppBarDismissal ?? false);
    final rtl = Directionality.of(context) == TextDirection.rtl;
    final back = leading ??
        (canPop
            ? WxIconButton(
                tooltip: MaterialLocalizations.of(context).backButtonTooltip,
                icon: PhosphorIcon(rtl ? PhosphorIconsDuotone.arrowRight : PhosphorIconsDuotone.arrowLeft, size: 20),
                onPressed: () => Navigator.maybePop(context),
              )
            : null);
    return ColoredBox(
      color: c.bg,
      child: SafeArea(
        bottom: false,
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          SizedBox(
            height: _height,
            child: Padding(
              padding: EdgeInsetsDirectional.only(start: back == null ? 16 : 6, end: actions == null ? 16 : 6),
              child: Row(children: [
                if (back != null) ...[back, const SizedBox(width: 4)],
                Expanded(
                  child: DefaultTextStyle(
                    style: back == null ? type.headingLg : type.headingMd,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    child: title ?? const SizedBox.shrink(),
                  ),
                ),
                ...?actions,
              ]),
            ),
          ),
          ?bottom,
        ]),
      ),
    );
  }
}

class WxBottomNavItem {
  const WxBottomNavItem({required this.icon, required this.label});
  final IconData icon;
  final String label;
}

/// A tinted bar beside the page's lighter fill, with no dividing line. The
/// current destination is inked, and one ink block slides between them.
class WxBottomNav extends StatelessWidget {
  const WxBottomNav({super.key, required this.items, required this.currentIndex, required this.onTap});
  final List<WxBottomNavItem> items;
  final int currentIndex;
  final ValueChanged<int> onTap;

  static const _height = 64.0;
  static const _pad = 6.0;

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final type = context.wxType;
    return ColoredBox(
      color: c.bgSubtle,
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: _height,
          child: Padding(
            padding: const EdgeInsets.all(_pad),
            child: LayoutBuilder(
              builder: (context, box) {
                final w = box.maxWidth / items.length;
                return Stack(children: [
                  AnimatedPositionedDirectional(
                    top: 0,
                    bottom: 0,
                    start: currentIndex * w,
                    width: w,
                    duration: WxDurations.move,
                    curve: WxEase.move,
                    child: DecoratedBox(decoration: ShapeDecoration(color: c.fg, shape: context.wxShape.md)),
                  ),
                  Row(children: [
                    for (var i = 0; i < items.length; i++)
                      Expanded(
                        child: WxPressable(
                          onTap: () => onTap(i),
                          selected: i == currentIndex,
                          semanticLabel: items[i].label,
                          builder: (_, _) {
                            final fg = i == currentIndex ? c.bg : c.fgMuted;
                            return ExcludeSemantics(
                              child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                                PhosphorIcon(items[i].icon, size: 22, color: fg),
                                const SizedBox(height: 2),
                                AnimatedDefaultTextStyle(
                                  duration: WxDurations.fast,
                                  curve: WxEase.standard,
                                  style: type.caption.copyWith(fontSize: 11, height: 14 / 11, fontWeight: FontWeight.w500, color: fg),
                                  child: Text(items[i].label, maxLines: 1, overflow: TextOverflow.ellipsis),
                                ),
                              ]),
                            );
                          },
                        ),
                      ),
                  ]),
                ]);
              },
            ),
          ),
        ),
      ),
    );
  }
}

enum WxTabsVariant { line, segment }

/// The current tab is inked, and one ink block slides between tabs, following
/// the finger when the pages under a TabController are swiped. line: sections
/// of a page. segment: switching a view in place.
class WxTabs extends StatelessWidget implements PreferredSizeWidget {
  const WxTabs({super.key, required this.controller, required this.tabs, this.variant = WxTabsVariant.line});
  final TabController controller;
  final List<String> tabs;
  final WxTabsVariant variant;

  double get _height => variant == WxTabsVariant.line ? WxControl.lg : WxControl.md;

  @override
  Size get preferredSize => Size.fromHeight(_height + (variant == WxTabsVariant.line ? 9 : 8));

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final type = context.wxType;
    final line = variant == WxTabsVariant.line;
    final inner = line ? 6.0 : 2.0;
    final animation = controller.animation!;
    return Padding(
      padding: EdgeInsets.fromLTRB(16, 0, 16, line ? 0 : 8),
      child: DecoratedBox(
        decoration: line
            ? BoxDecoration(border: Border(bottom: BorderSide(color: c.border)))
            : ShapeDecoration(color: c.bgMuted, shape: context.wxShape.md),
        child: Padding(
          padding: line ? const EdgeInsets.only(bottom: 8) : const EdgeInsets.all(2),
          child: SizedBox(
            height: line ? _height : _height - 4,
            child: LayoutBuilder(
              builder: (context, box) {
                final w = box.maxWidth / tabs.length;
                return AnimatedBuilder(
                  animation: animation,
                  builder: (context, _) {
                    final at = animation.value;
                    return Stack(children: [
                      PositionedDirectional(
                        top: line ? inner : 0,
                        bottom: line ? inner : 0,
                        start: at * w,
                        width: w,
                        child: DecoratedBox(decoration: ShapeDecoration(color: c.fg, shape: line ? context.wxShape.md : context.wxShape.sm)),
                      ),
                      Row(children: [
                        for (var i = 0; i < tabs.length; i++)
                          Expanded(
                            child: WxPressable(
                              scale: 1,
                              selected: controller.index == i,
                              onTap: () => controller.animateTo(i, duration: WxDurations.move, curve: WxEase.move),
                              builder: (_, _) => Center(
                                child: Text(
                                  tabs[i],
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: type.bodySm.copyWith(
                                    fontWeight: FontWeight.w500,
                                    color: Color.lerp(c.bg, c.fgMuted, (at - i).abs().clamp(0.0, 1.0)),
                                  ),
                                ),
                              ),
                            ),
                          ),
                      ]),
                    ]);
                  },
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}

/// A row in a panel: leading, a title, a line under it, something on the end.
/// Darkens a shade when pressed and its icons deepen. Takes ListTile's main arguments.
class WxListRow extends StatelessWidget {
  const WxListRow({
    super.key,
    this.leading,
    this.title,
    this.subtitle,
    this.trailing,
    this.onTap,
    this.onLongPress,
    this.enabled = true,
    this.selected = false,
    this.padding = const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
    this.crossAxisAlignment = CrossAxisAlignment.center,
  });

  final Widget? leading;
  final Widget? title;
  final Widget? subtitle;
  final Widget? trailing;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;
  final bool enabled;
  final bool selected;
  final EdgeInsetsGeometry padding;
  final CrossAxisAlignment crossAxisAlignment;

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final type = context.wxType;
    final active = enabled && (onTap != null || onLongPress != null);
    Widget row(bool pressed) => AnimatedContainer(
          duration: WxDurations.fast,
          curve: WxEase.standard,
          constraints: const BoxConstraints(minHeight: 52),
          padding: padding,
          color: pressed ? wxMix(c.card, c.fg, 0.05) : (selected ? c.accentSubtle : c.card.withValues(alpha: 0)),
          child: Row(crossAxisAlignment: crossAxisAlignment, children: [
            if (leading != null) ...[
              IconTheme.merge(data: IconThemeData(color: pressed ? c.fg : c.fgMuted, size: 20), child: leading!),
              const SizedBox(width: 12),
            ],
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
                if (title != null)
                  DefaultTextStyle(style: type.bodySm.copyWith(fontWeight: FontWeight.w500, color: enabled ? c.fg : c.fgDisabled), child: title!),
                if (subtitle != null) ...[
                  const SizedBox(height: 1),
                  DefaultTextStyle(style: type.caption.copyWith(color: enabled ? c.fgMuted : c.fgDisabled), child: subtitle!),
                ],
              ]),
            ),
            if (trailing != null) ...[
              const SizedBox(width: 10),
              IconTheme.merge(data: IconThemeData(color: c.fgSubtle, size: 16), child: DefaultTextStyle(style: type.bodySm.copyWith(color: c.fgMuted), child: trailing!)),
            ],
          ]),
        );
    if (!active) return Opacity(opacity: enabled ? 1 : 0.6, child: row(false));
    return WxPressable(onTap: onTap, onLongPress: onLongPress, scale: 1, selected: selected, builder: (_, s) => row(s.pressed || s.hovered));
  }
}

/// A row with a switch on the end. Tapping anywhere on it toggles.
class WxSwitchRow extends StatelessWidget {
  const WxSwitchRow({super.key, required this.value, required this.onChanged, this.title, this.subtitle, this.leading});
  final bool value;
  final ValueChanged<bool>? onChanged;
  final Widget? title;
  final Widget? subtitle;
  final Widget? leading;

  @override
  Widget build(BuildContext context) => WxListRow(
        leading: leading,
        title: title,
        subtitle: subtitle,
        enabled: onChanged != null,
        onTap: onChanged == null ? null : () => onChanged!(!value),
        trailing: WxSwitch(value: value, onChanged: onChanged),
      );
}

/// A row with a checkbox on the start. Tapping anywhere on it toggles.
class WxCheckboxRow extends StatelessWidget {
  const WxCheckboxRow({super.key, required this.value, required this.onChanged, this.title, this.subtitle});
  final bool value;
  final ValueChanged<bool>? onChanged;
  final Widget? title;
  final Widget? subtitle;

  @override
  Widget build(BuildContext context) => WxListRow(
        leading: WxCheckbox(value: value, onChanged: onChanged),
        title: title,
        subtitle: subtitle,
        enabled: onChanged != null,
        onTap: onChanged == null ? null : () => onChanged!(!value),
      );
}

/// A row with a radio on the start.
class WxRadioRow extends StatelessWidget {
  const WxRadioRow({super.key, required this.selected, required this.onTap, this.title, this.subtitle});
  final bool selected;
  final VoidCallback? onTap;
  final Widget? title;
  final Widget? subtitle;

  @override
  Widget build(BuildContext context) => WxListRow(
        leading: WxRadio(selected: selected, onTap: onTap),
        title: title,
        subtitle: subtitle,
        enabled: onTap != null,
        onTap: onTap,
      );
}

/// Pull to refresh with the ring spinner on a small floating disc.
class WxRefresh extends StatefulWidget {
  const WxRefresh({super.key, required this.onRefresh, required this.child});
  final Future<void> Function() onRefresh;
  final Widget child;

  @override
  State<WxRefresh> createState() => _WxRefreshState();
}

class _WxRefreshState extends State<WxRefresh> {
  bool _showing = false;

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    return Stack(children: [
      RefreshIndicator.noSpinner(
        onRefresh: widget.onRefresh,
        onStatusChange: (status) {
          final show = status == RefreshIndicatorStatus.drag ||
              status == RefreshIndicatorStatus.armed ||
              status == RefreshIndicatorStatus.snap ||
              status == RefreshIndicatorStatus.refresh;
          if (show != _showing && mounted) setState(() => _showing = show);
        },
        child: widget.child,
      ),
      PositionedDirectional(
        top: 8,
        start: 0,
        end: 0,
        child: IgnorePointer(
          child: AnimatedOpacity(
            opacity: _showing ? 1 : 0,
            duration: WxDurations.fast,
            curve: WxEase.standard,
            child: Center(
              child: Container(
                width: 36,
                height: 36,
                alignment: Alignment.center,
                decoration: ShapeDecoration(color: c.surfaceOverlay, shape: const CircleBorder(), shadows: context.wxShadows.md),
                child: _showing ? WxSpinner(size: WxSpinnerSize.lg, color: c.fgMuted) : null,
              ),
            ),
          ),
        ),
      ),
    ]);
  }
}
