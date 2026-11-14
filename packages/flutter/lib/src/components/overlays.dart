import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';

import '../motion.dart';
import '../theme.dart';
import '../tokens.g.dart';
import 'button.dart';
import 'input.dart';
import 'navigation.dart';

/// A sheet that floats 8px off the edges of the screen, slides up and can be
/// dragged away. The builder's content is laid out inside it and doesn't need
/// its own safe area or keyboard padding.
Future<T?> showWxSheet<T>({
  required BuildContext context,
  required WidgetBuilder builder,
  bool useRootNavigator = false,
  bool isDismissible = true,
  bool enableDrag = true,
}) {
  return showModalBottomSheet<T>(
    context: context,
    useRootNavigator: useRootNavigator,
    isDismissible: isDismissible,
    enableDrag: enableDrag,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    elevation: 0,
    barrierColor: context.wx.overlay,
    showDragHandle: false,
    sheetAnimationStyle: const AnimationStyle(
      curve: WxEase.out,
      duration: WxDurations.slow,
      reverseCurve: WxEase.standard,
      reverseDuration: WxDurations.base,
    ),
    builder: (ctx) => _SheetPanel(child: Builder(builder: builder)),
  );
}

class _SheetPanel extends StatelessWidget {
  const _SheetPanel({required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final media = MediaQuery.of(context);
    final bottom = math.max(8.0, math.max(media.viewPadding.bottom, media.viewInsets.bottom + 8));
    return Padding(
      padding: EdgeInsets.fromLTRB(8, media.viewPadding.top + 8, 8, bottom),
      child: Align(
        alignment: Alignment.bottomCenter,
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: 560, maxHeight: (media.size.height - media.viewInsets.bottom) * 0.85),
          child: Container(
            clipBehavior: Clip.antiAlias,
            decoration: ShapeDecoration(
              color: c.surfaceOverlay,
              shape: context.wxShape.xl.copyWith(side: BorderSide(color: c.border)),
              shadows: context.wxShadows.xl,
            ),
            child: Material(
              type: MaterialType.transparency,
              child: MediaQuery.removePadding(
                context: context,
                removeBottom: true,
                removeTop: true,
                child: MediaQuery.removeViewInsets(
                  context: context,
                  removeBottom: true,
                  child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                    Center(
                      child: Container(
                        margin: const EdgeInsets.symmetric(vertical: 10),
                        width: 36,
                        height: 4,
                        decoration: ShapeDecoration(color: c.borderStrong, shape: const StadiumBorder()),
                      ),
                    ),
                    Flexible(child: child),
                  ]),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Bottom sheet list of choices. Returns the one picked, or null if dismissed.
Future<T?> showWxPicker<T>(
  BuildContext context, {
  required String title,
  required List<WxSelectOption<T>> options,
  T? selected,
}) {
  return showWxSheet<T>(
    context: context,
    useRootNavigator: true,
    builder: (ctx) {
      final c = ctx.wx;
      return Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
        if (title.isNotEmpty) Padding(padding: const EdgeInsets.fromLTRB(20, 2, 20, 8), child: Text(title, style: ctx.wxType.headingMd)),
        Flexible(
          child: ListView(shrinkWrap: true, padding: const EdgeInsets.only(bottom: 12), children: [
            for (final o in options)
              WxListRow(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                leading: o.leading,
                title: Text(o.label, textDirection: o.textDirection),
                subtitle: o.subtitle == null ? null : Text(o.subtitle!),
                trailing: o.value == selected ? PhosphorIcon(PhosphorIconsBold.check, size: 16, color: c.accentInk) : null,
                onTap: () => Navigator.pop(ctx, o.value),
              ),
          ]),
        ),
      ]);
    },
  );
}

/// Opens [builder]'s dialog, sharpening out of a blur over a plain scrim.
Future<T?> showWxDialog<T>({
  required BuildContext context,
  required WidgetBuilder builder,
  bool barrierDismissible = true,
  bool useRootNavigator = true,
}) {
  return showGeneralDialog<T>(
    context: context,
    useRootNavigator: useRootNavigator,
    barrierDismissible: barrierDismissible,
    barrierLabel: MaterialLocalizations.of(context).modalBarrierDismissLabel,
    barrierColor: context.wx.overlay,
    transitionDuration: WxDurations.enter,
    pageBuilder: (ctx, _, _) => builder(ctx),
    transitionBuilder: (ctx, animation, _, child) => WxBlurTransition(
      animation: CurvedAnimation(parent: animation, curve: WxEase.move, reverseCurve: WxEase.standard),
      blur: 10,
      rise: 6,
      child: child,
    ),
  );
}

/// A dialog panel: title, description, optional content, and a footer band a
/// shade off the dialog, so the actions read as a separate step.
class WxDialog extends StatelessWidget {
  const WxDialog({super.key, this.title, this.description, this.content, this.actions = const []});
  final String? title;
  final String? description;
  final Widget? content;
  final List<Widget> actions;

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final type = context.wxType;
    final media = MediaQuery.of(context);
    return Center(
      child: Padding(
        padding: EdgeInsets.fromLTRB(16, 16, 16, 16 + media.viewInsets.bottom),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 400),
          child: Container(
            clipBehavior: Clip.antiAlias,
            decoration: ShapeDecoration(
              color: c.surfaceOverlay,
              shape: context.wxShape.xl.copyWith(side: BorderSide(color: c.border)),
              shadows: context.wxShadows.xl,
            ),
            child: Material(
              type: MaterialType.transparency,
              child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                Flexible(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.fromLTRB(24, 24, 24, 20),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
                      if (title != null) Text(title!, style: type.headingMd),
                      if (description != null) ...[
                        if (title != null) const SizedBox(height: 6),
                        Text(description!, style: type.bodyMd.copyWith(color: c.fgMuted)),
                      ],
                      if (content != null) ...[
                        if (title != null || description != null) const SizedBox(height: 16),
                        content!,
                      ],
                    ]),
                  ),
                ),
                if (actions.isNotEmpty)
                  DecoratedBox(
                    decoration: BoxDecoration(color: c.bgSubtle, border: Border(top: BorderSide(color: c.border))),
                    child: Padding(
                      padding: const EdgeInsets.all(14),
                      // On a phone the actions stack, the main one on top.
                      child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                        for (var i = actions.length - 1; i >= 0; i--) ...[
                          actions[i],
                          if (i > 0) const SizedBox(height: 8),
                        ],
                      ]),
                    ),
                  ),
              ]),
            ),
          ),
        ),
      ),
    );
  }
}

/// Asks before doing something. True when confirmed, false otherwise.
Future<bool> showWxConfirm(
  BuildContext context, {
  required String title,
  required String description,
  required String action,
  String? cancel,
  bool destructive = false,
}) async {
  final ok = await showWxDialog<bool>(
    context: context,
    builder: (ctx) => WxDialog(
      title: title,
      description: description,
      actions: [
        WxButton(
          block: true,
          size: WxButtonSize.lg,
          label: cancel ?? MaterialLocalizations.of(ctx).cancelButtonLabel,
          onPressed: () => Navigator.pop(ctx, false),
        ),
        WxButton(
          block: true,
          size: WxButtonSize.lg,
          variant: destructive ? WxButtonVariant.danger : WxButtonVariant.primary,
          label: action,
          onPressed: () => Navigator.pop(ctx, true),
        ),
      ],
    ),
  );
  return ok ?? false;
}

enum WxToastTone { success, error, warning, info, plain }

/// A floating note that goes away on its own, carried by the nearest ScaffoldMessenger.
void showWxToast(BuildContext context, String message, {WxToastTone tone = WxToastTone.plain, Duration? duration}) {
  final c = context.wx;
  final (IconData? icon, Color color) = switch (tone) {
    WxToastTone.success => (PhosphorIconsDuotone.checkCircle, c.successInk),
    WxToastTone.error => (PhosphorIconsDuotone.warningCircle, c.dangerInk),
    WxToastTone.warning => (PhosphorIconsDuotone.warning, c.warningInk),
    WxToastTone.info => (PhosphorIconsDuotone.info, c.infoInk),
    WxToastTone.plain => (null, c.fgMuted),
  };
  ScaffoldMessenger.maybeOf(context)
    ?..hideCurrentSnackBar()
    ..showSnackBar(SnackBar(
      duration: duration ?? Duration(milliseconds: tone == WxToastTone.error ? 4500 : 2600),
      backgroundColor: Colors.transparent,
      elevation: 0,
      padding: EdgeInsets.zero,
      behavior: SnackBarBehavior.floating,
      margin: const EdgeInsets.fromLTRB(12, 0, 12, 12),
      content: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: ShapeDecoration(
          color: c.surfaceOverlay,
          shape: context.wxShape.lg.copyWith(side: BorderSide(color: c.border)),
          shadows: context.wxShadows.lg,
        ),
        child: Row(children: [
          if (icon != null) ...[PhosphorIcon(icon, size: 16, color: color), const SizedBox(width: 10)],
          Expanded(child: Text(message, style: context.wxType.bodySm.copyWith(fontWeight: FontWeight.w500))),
        ]),
      ),
    ));
}
