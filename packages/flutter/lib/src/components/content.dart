import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';

import '../motion.dart';
import '../theme.dart';
import '../tokens.g.dart';
import 'button.dart';

/// A value people copy: an API key, a token, a webhook URL. Secrets are masked
/// down to their last four characters until revealed. Copying swaps the icon
/// for a check for 1.6s.
class WxCopyField extends StatefulWidget {
  const WxCopyField({super.key, required this.value, this.secret = false, this.copyLabel, this.revealLabel, this.hideLabel, this.onCopied});
  final String value;
  final bool secret;
  final String? copyLabel;
  final String? revealLabel;
  final String? hideLabel;
  final VoidCallback? onCopied;

  @override
  State<WxCopyField> createState() => _WxCopyFieldState();
}

class _WxCopyFieldState extends State<WxCopyField> {
  bool _revealed = false;
  bool _copied = false;
  Timer? _timer;

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _copy() async {
    await Clipboard.setData(ClipboardData(text: widget.value));
    if (!mounted) return;
    setState(() => _copied = true);
    widget.onCopied?.call();
    _timer?.cancel();
    _timer = Timer(const Duration(milliseconds: 1600), () {
      if (mounted) setState(() => _copied = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final v = widget.value;
    final dots = '•' * (v.length - 4).clamp(8, 16);
    final shown = widget.secret && !_revealed ? '$dots${v.length > 4 ? v.substring(v.length - 4) : v}' : v;
    return Container(
      height: WxControl.lg,
      padding: const EdgeInsetsDirectional.only(start: 14, end: 4),
      decoration: ShapeDecoration(color: c.bgMuted, shape: context.wxShape.md),
      child: Row(children: [
        Expanded(child: Text(shown, maxLines: 1, overflow: TextOverflow.ellipsis, style: context.wxType.mono, textDirection: TextDirection.ltr)),
        if (widget.secret)
          WxIconButton(
            size: WxButtonSize.icon,
            tooltip: _revealed ? widget.hideLabel : widget.revealLabel,
            icon: PhosphorIcon(_revealed ? PhosphorIconsDuotone.eyeSlash : PhosphorIconsDuotone.eye, size: 16),
            onPressed: () => setState(() => _revealed = !_revealed),
          ),
        WxIconButton(
          size: WxButtonSize.icon,
          tooltip: widget.copyLabel ?? MaterialLocalizations.of(context).copyButtonLabel,
          onPressed: _copy,
          icon: AnimatedSwitcher(
            duration: WxDurations.move,
            switchInCurve: WxEase.move,
            transitionBuilder: (child, a) => ScaleTransition(scale: Tween(begin: 0.5, end: 1.0).animate(a), child: FadeTransition(opacity: a, child: child)),
            child: _copied
                ? PhosphorIcon(PhosphorIconsBold.check, key: const ValueKey('done'), size: 16, color: c.successInk)
                : PhosphorIcon(PhosphorIconsDuotone.copy, key: const ValueKey('copy'), size: 16),
          ),
        ),
      ]),
    );
  }
}

enum WxMessageFrom { agent, person }

/// One turn of a conversation. The agent speaks from the start side on a
/// neutral bubble; the person answers from the end side on the accent wash. A
/// streaming message ends in a blinking block caret.
class WxMessage extends StatelessWidget {
  const WxMessage({super.key, required this.from, required this.child, this.name, this.time, this.streaming = false, this.footer});
  final WxMessageFrom from;
  final Widget child;
  final String? name;
  final String? time;
  final bool streaming;

  /// Something under the bubble, such as a report link.
  final Widget? footer;

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final type = context.wxType;
    final agent = from == WxMessageFrom.agent;
    final align = agent ? CrossAxisAlignment.start : CrossAxisAlignment.end;
    final bubble = WxBlurIn(
      child: Column(crossAxisAlignment: align, mainAxisSize: MainAxisSize.min, children: [
        if (name != null || time != null)
          Padding(
            padding: const EdgeInsets.fromLTRB(4, 0, 4, 4),
            child: Row(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.baseline, textBaseline: TextBaseline.alphabetic, children: [
              if (name != null) Text(name!, style: type.caption.copyWith(color: c.fgMuted, fontWeight: FontWeight.w500)),
              if (name != null && time != null) const SizedBox(width: 8),
              if (time != null) Text(time!, style: type.caption.copyWith(color: c.fgSubtle, fontFeatures: const [FontFeature.tabularFigures()])),
            ]),
          ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: ShapeDecoration(color: agent ? c.bgMuted : c.accentSubtle, shape: context.wxShape.md),
          child: DefaultTextStyle(
            style: type.bodySm.copyWith(height: 1.6),
            child: streaming ? Row(mainAxisSize: MainAxisSize.min, children: [Flexible(child: child), const _Caret()]) : child,
          ),
        ),
        ?footer,
      ]),
    );
    return LayoutBuilder(
      builder: (_, box) => Align(
        alignment: agent ? AlignmentDirectional.centerStart : AlignmentDirectional.centerEnd,
        child: ConstrainedBox(constraints: BoxConstraints(maxWidth: box.maxWidth * 0.85), child: bubble),
      ),
    );
  }
}

class _Caret extends StatefulWidget {
  const _Caret();

  @override
  State<_Caret> createState() => _CaretState();
}

class _CaretState extends State<_Caret> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(seconds: 1))..repeat();

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: _c,
        builder: (context, _) => Opacity(
          // Blinks hard, on and off, like a terminal.
          opacity: _c.value < 0.5 ? 0.7 : 0,
          child: Container(margin: const EdgeInsetsDirectional.only(start: 2), width: 7, height: 15, color: DefaultTextStyle.of(context).style.color),
        ),
      );
}
