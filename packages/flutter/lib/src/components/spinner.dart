import 'dart:math' as math;

import 'package:flutter/widgets.dart';

enum WxSpinnerSize { sm, md, lg, xl }

/// The ring spinner: a quarter arc with round ends turning over a faint track.
/// With reduced motion it turns at a third of the speed rather than stopping,
/// since a still frame would show nothing. Inherits the text colour.
class WxSpinner extends StatefulWidget {
  const WxSpinner({super.key, this.size = WxSpinnerSize.md, this.color, this.semanticLabel});
  final WxSpinnerSize size;
  final Color? color;
  final String? semanticLabel;

  @override
  State<WxSpinner> createState() => _WxSpinnerState();
}

class _WxSpinnerState extends State<WxSpinner> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this);
  Duration? _period;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final period = Duration(milliseconds: MediaQuery.disableAnimationsOf(context) ? 2400 : 800);
    if (period != _period) {
      _period = period;
      _c.repeat(period: period);
    }
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final side = switch (widget.size) {
      WxSpinnerSize.sm => 14.0,
      WxSpinnerSize.md => 16.0,
      WxSpinnerSize.lg => 20.0,
      WxSpinnerSize.xl => 32.0,
    };
    final color = widget.color ?? DefaultTextStyle.of(context).style.color ?? const Color(0xFF808080);
    return Semantics(
      label: widget.semanticLabel,
      child: SizedBox.square(
        dimension: side,
        child: RotationTransition(turns: _c, child: CustomPaint(painter: _RingPainter(color))),
      ),
    );
  }
}

class _RingPainter extends CustomPainter {
  const _RingPainter(this.color);
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final unit = size.width / 16;
    final rect = Rect.fromCircle(center: size.center(Offset.zero), radius: 6.25 * unit);
    final stroke = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.75 * unit
      ..strokeCap = StrokeCap.round;
    canvas.drawOval(rect, stroke..color = color.withValues(alpha: 0.18));
    canvas.drawArc(rect, -math.pi / 2, math.pi / 2, false, stroke..color = color);
  }

  @override
  bool shouldRepaint(_RingPainter old) => old.color != color;
}
