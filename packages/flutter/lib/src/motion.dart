import 'dart:async';
import 'dart:ui' show ImageFilter;

import 'package:flutter/material.dart';

import 'theme.dart';
import 'tokens.g.dart';

/// What a control is doing right now.
@immutable
class WxPressState {
  const WxPressState({this.pressed = false, this.hovered = false, this.focused = false, this.enabled = true});
  final bool pressed, hovered, focused, enabled;
}

/// Everything that answers the hand is built on this: a press shrinks at once
/// and eases back on release, with no ripple. [builder] gets the state, so a
/// control can darken its own fill. [shape] is where a keyboard focus edge goes.
class WxPressable extends StatefulWidget {
  const WxPressable({
    super.key,
    required this.builder,
    this.onTap,
    this.onLongPress,
    this.scale = 0.96,
    this.shape,
    this.semanticLabel,
    this.button = true,
    this.selected,
  });

  final Widget Function(BuildContext context, WxPressState state) builder;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;
  final double scale;
  final ShapeBorder? shape;
  final String? semanticLabel;
  final bool button;
  final bool? selected;

  @override
  State<WxPressable> createState() => _WxPressableState();
}

class _WxPressableState extends State<WxPressable> {
  bool _pressed = false, _hovered = false, _focused = false;
  DateTime? _downAt;
  Timer? _release;

  bool get _enabled => widget.onTap != null || widget.onLongPress != null;

  @override
  void dispose() {
    _release?.cancel();
    super.dispose();
  }

  void _down() {
    _release?.cancel();
    _downAt = DateTime.now();
    setState(() => _pressed = true);
  }

  // A quick tap goes down and up in the same frame; hold it long enough to be seen.
  void _up() {
    final shown = DateTime.now().difference(_downAt ?? DateTime.now());
    final wait = WxDurations.instant - shown;
    _release?.cancel();
    if (wait <= Duration.zero) {
      if (mounted) setState(() => _pressed = false);
    } else {
      _release = Timer(wait, () {
        if (mounted) setState(() => _pressed = false);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final reduced = MediaQuery.disableAnimationsOf(context);
    final state = WxPressState(pressed: _pressed && _enabled, hovered: _hovered && _enabled, focused: _focused, enabled: _enabled);
    Widget child = widget.builder(context, state);
    final shape = widget.shape;
    if (_focused && shape != null) {
      child = DecoratedBox(
        position: DecorationPosition.foreground,
        decoration: ShapeDecoration(
          shape: shape is OutlinedBorder
              ? shape.copyWith(side: BorderSide(color: context.wx.focus, width: 2, strokeAlign: BorderSide.strokeAlignOutside))
              : shape,
        ),
        child: child,
      );
    }
    if (widget.scale != 1 && !reduced) {
      child = AnimatedScale(
        scale: state.pressed ? widget.scale : 1,
        duration: state.pressed ? WxDurations.instant : WxDurations.move,
        curve: state.pressed ? WxEase.standard : WxEase.move,
        child: child,
      );
    }
    return Semantics(
      button: widget.button,
      enabled: _enabled,
      selected: widget.selected,
      label: widget.semanticLabel,
      child: FocusableActionDetector(
        enabled: _enabled,
        mouseCursor: _enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onShowHoverHighlight: (v) => setState(() => _hovered = v),
        onShowFocusHighlight: (v) => setState(() => _focused = v),
        actions: {ActivateIntent: CallbackAction<ActivateIntent>(onInvoke: (_) => widget.onTap?.call())},
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          excludeFromSemantics: true,
          onTapDown: _enabled ? (_) => _down() : null,
          onTapUp: _enabled ? (_) => _up() : null,
          onTapCancel: _enabled ? _up : null,
          onTap: widget.onTap,
          onLongPress: widget.onLongPress,
          child: child,
        ),
      ),
    );
  }
}

/// New things arrive by sharpening out of a blur. Plays once, when first built.
class WxBlurIn extends StatefulWidget {
  const WxBlurIn({super.key, required this.child, this.blur = 8, this.rise = 0});
  final Widget child;
  final double blur;

  /// How far below its place it starts, in pixels.
  final double rise;

  @override
  State<WxBlurIn> createState() => _WxBlurInState();
}

class _WxBlurInState extends State<WxBlurIn> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: WxDurations.enter);
  late final Animation<double> _t = CurvedAnimation(parent: _c, curve: WxEase.move);

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_c.isDismissed) {
      if (MediaQuery.disableAnimationsOf(context)) {
        _c.value = 1;
      } else {
        _c.forward();
      }
    }
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => WxBlurTransition(animation: _t, blur: widget.blur, rise: widget.rise, child: widget.child);
}

/// The blur-in driven from outside, for routes and dialogs.
class WxBlurTransition extends AnimatedWidget {
  const WxBlurTransition({super.key, required Animation<double> animation, required this.child, this.blur = 8, this.rise = 0})
      : super(listenable: animation);
  final Widget child;
  final double blur;
  final double rise;

  @override
  Widget build(BuildContext context) {
    final v = (listenable as Animation<double>).value.clamp(0.0, 1.0);
    final sigma = blur * (1 - v);
    // The filter stays in the tree and is only switched off, so finishing the
    // animation doesn't rebuild what is inside.
    return ImageFiltered(
      enabled: v < 1 && sigma > 0.01,
      imageFilter: ImageFilter.blur(sigmaX: sigma, sigmaY: sigma, tileMode: TileMode.decal),
      child: Opacity(opacity: v, child: Transform.translate(offset: Offset(0, rise * (1 - v)), child: child)),
    );
  }
}

/// A page sharpens in over the one before; going back is a quick fade.
class WxPageTransitionsBuilder extends PageTransitionsBuilder {
  const WxPageTransitionsBuilder();

  @override
  Duration get transitionDuration => WxDurations.enter;

  @override
  Duration get reverseTransitionDuration => WxDurations.base;

  @override
  Widget buildTransitions<T>(
    PageRoute<T> route,
    BuildContext context,
    Animation<double> animation,
    Animation<double> secondaryAnimation,
    Widget child,
  ) {
    if (route.fullscreenDialog || MediaQuery.disableAnimationsOf(context)) {
      return FadeTransition(opacity: animation, child: child);
    }
    return _WxPageTransition(animation: animation, child: child);
  }
}

class _WxPageTransition extends AnimatedWidget {
  const _WxPageTransition({required Animation<double> animation, required this.child}) : super(listenable: animation);
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final a = listenable as Animation<double>;
    final reversing = a.status == AnimationStatus.reverse;
    final v = (reversing ? WxEase.standard : WxEase.move).transform(a.value);
    final sigma = reversing ? 0.0 : 6 * (1 - v);
    return ImageFiltered(
      enabled: sigma > 0.01,
      imageFilter: ImageFilter.blur(sigmaX: sigma, sigmaY: sigma, tileMode: TileMode.decal),
      child: Opacity(opacity: v, child: child),
    );
  }
}
