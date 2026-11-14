import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

import 'motion.dart';
import 'squircle.dart';
import 'tokens.g.dart';

const _defaultFont = 'Manrope';

/// The corner scale for this product, as ready-made squircle shapes.
@immutable
class WxShapes extends ThemeExtension<WxShapes> {
  const WxShapes(this.scale);
  final double scale;

  WxSquircleBorder _at(double radius) => WxSquircleBorder(radius: radius * scale);
  WxSquircleBorder get xs => _at(WxSquircle.xs);
  WxSquircleBorder get sm => _at(WxSquircle.sm);
  WxSquircleBorder get md => _at(WxSquircle.md);
  WxSquircleBorder get lg => _at(WxSquircle.lg);
  WxSquircleBorder get xl => _at(WxSquircle.xl);

  @override
  WxShapes copyWith({double? scale}) => WxShapes(scale ?? this.scale);

  @override
  WxShapes lerp(ThemeExtension<WxShapes>? other, double t) => t < 0.5 ? this : (other as WxShapes? ?? this);
}

/// The type scale in this product's font and ink.
class WxType extends ThemeExtension<WxType> with WxTypeScale {
  WxType({required this.color, required this.fontFamily});
  final Color color;
  final String fontFamily;
  final Map<WxTextSpec, TextStyle> _cache = {};

  static FontWeight _weight(int w) => FontWeight.values[(w ~/ 100) - 1];

  @override
  TextStyle style(WxTextSpec s) => _cache[s] ??= GoogleFonts.getFont(
        fontFamily,
        fontSize: s.size,
        height: s.lineHeight / s.size,
        letterSpacing: s.letterSpacing,
        fontWeight: _weight(s.weight),
        color: color,
      ).copyWith(leadingDistribution: TextLeadingDistribution.even);

  /// For values people copy: keys, tokens, URLs.
  TextStyle get mono => GoogleFonts.jetBrainsMono(fontSize: 13, height: 1.4, color: color);

  @override
  WxType copyWith({Color? color, String? fontFamily}) =>
      WxType(color: color ?? this.color, fontFamily: fontFamily ?? this.fontFamily);

  @override
  WxType lerp(ThemeExtension<WxType>? other, double t) => t < 0.5 ? this : (other as WxType? ?? this);
}

/// One product in one theme, and the [ThemeData] that goes with it.
///
/// The Material widgets a screen still uses (Scaffold, Slider, a TextField's
/// selection handles) take their look from here, so stock Material never shows
/// through: no ripples, no elevation, no M3 tints.
@immutable
class WixzelTheme {
  const WixzelTheme({required WixzelProduct this.product, this.brightness = Brightness.light}) : tokens = null;

  /// A product of your own, from [wxDeriveProduct] and your seed colour.
  const WixzelTheme.custom({required WxProductTokens this.tokens, this.brightness = Brightness.light}) : product = null;

  final WixzelProduct? product;
  final WxProductTokens? tokens;
  final Brightness brightness;

  WxProductTokens get _tokens => tokens ?? wxProducts[product]!;
  WxColors get colors => brightness == Brightness.dark ? _tokens.dark : _tokens.light;
  WxShadows get shadows => brightness == Brightness.dark ? WxShadows.dark : WxShadows.light;

  ThemeData toThemeData() {
    final c = colors;
    final type = WxType(color: c.fg, fontFamily: _tokens.fontFamily ?? _defaultFont);
    final shapes = WxShapes(_tokens.radiusScale);
    final muted = type.caption.copyWith(color: c.fgMuted);
    final label = type.caption.copyWith(color: c.fgSubtle, fontWeight: FontWeight.w500);
    final text = TextTheme(
      displayLarge: type.displayMd,
      displayMedium: type.headingXl,
      displaySmall: type.headingXl,
      headlineLarge: type.headingLg,
      headlineMedium: type.headingLg,
      headlineSmall: type.headingMd,
      titleLarge: type.headingMd,
      titleMedium: type.headingSm,
      titleSmall: type.bodySm.copyWith(fontWeight: FontWeight.w600),
      bodyLarge: type.bodyMd,
      bodyMedium: type.bodySm,
      bodySmall: muted,
      labelLarge: type.bodySm.copyWith(fontWeight: FontWeight.w500),
      labelMedium: label,
      labelSmall: label.copyWith(fontSize: 11, height: 16 / 11),
    );
    final scheme = ColorScheme(
      brightness: brightness,
      primary: c.accent,
      onPrimary: c.accentFg,
      secondary: c.accentSubtle,
      onSecondary: c.accentInk,
      error: c.dangerInk,
      onError: c.dangerFg,
      surface: c.bg,
      onSurface: c.fg,
      surfaceTint: Colors.transparent,
      surfaceContainerLowest: c.bg,
      surfaceContainerLow: c.bgSubtle,
      surfaceContainer: c.card,
      surfaceContainerHigh: c.card,
      surfaceContainerHighest: c.bgMuted,
      outline: c.borderStrong,
      outlineVariant: c.border,
      onSurfaceVariant: c.fgMuted,
      shadow: Colors.transparent,
      scrim: c.overlay,
    );
    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: scheme,
      textTheme: text,
      primaryTextTheme: text,
      extensions: [c, shapes, type],
      scaffoldBackgroundColor: c.bg,
      canvasColor: c.bg,
      cardColor: c.card,
      dividerColor: c.border,
      shadowColor: Colors.transparent,
      // Hover and pressed are fills on each control; nothing ripples.
      splashFactory: NoSplash.splashFactory,
      splashColor: Colors.transparent,
      highlightColor: Colors.transparent,
      hoverColor: Colors.transparent,
      focusColor: Colors.transparent,
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
      visualDensity: VisualDensity.standard,
      iconTheme: IconThemeData(color: c.fgMuted, size: 20),
      pageTransitionsTheme: const PageTransitionsTheme(builders: {
        TargetPlatform.android: WxPageTransitionsBuilder(),
        TargetPlatform.iOS: WxPageTransitionsBuilder(),
        TargetPlatform.macOS: WxPageTransitionsBuilder(),
        TargetPlatform.windows: WxPageTransitionsBuilder(),
        TargetPlatform.linux: WxPageTransitionsBuilder(),
      }),
      textSelectionTheme: TextSelectionThemeData(
        cursorColor: c.accentInk,
        selectionColor: c.accent.withValues(alpha: 0.4),
        selectionHandleColor: c.accentEdge,
      ),
      dividerTheme: DividerThemeData(color: c.border, thickness: 1, space: 1),
      tooltipTheme: TooltipThemeData(
        decoration: ShapeDecoration(color: c.bgInverse, shape: shapes.sm),
        textStyle: type.caption.copyWith(color: c.fgInverse, fontWeight: FontWeight.w500),
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      ),
      sliderTheme: SliderThemeData(
        trackHeight: 4,
        activeTrackColor: c.accent,
        inactiveTrackColor: c.bgMuted,
        thumbColor: c.fg,
        overlayColor: Colors.transparent,
        activeTickMarkColor: Colors.transparent,
        inactiveTickMarkColor: Colors.transparent,
        disabledActiveTrackColor: c.fgDisabled,
        disabledInactiveTrackColor: c.bgMuted,
        disabledThumbColor: c.fgDisabled,
        thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 9, elevation: 0, pressedElevation: 0),
        overlayShape: const RoundSliderOverlayShape(overlayRadius: 18),
        trackShape: const RoundedRectSliderTrackShape(),
      ),
      popupMenuTheme: PopupMenuThemeData(
        color: c.surfaceOverlay,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        shape: shapes.lg.copyWith(side: BorderSide(color: c.border)),
        textStyle: type.bodySm,
        labelTextStyle: WidgetStatePropertyAll(type.bodySm),
      ),
      scrollbarTheme: ScrollbarThemeData(thumbColor: WidgetStatePropertyAll(c.borderStrong)),
      progressIndicatorTheme: ProgressIndicatorThemeData(color: c.accentEdge, linearTrackColor: c.bgMuted, circularTrackColor: c.bgMuted),
      snackBarTheme: const SnackBarThemeData(behavior: SnackBarBehavior.floating, backgroundColor: Colors.transparent, elevation: 0),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: c.bgMuted,
        hintStyle: type.bodySm.copyWith(color: c.fgSubtle),
        labelStyle: type.bodySm.copyWith(color: c.fgMuted),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(WxRadius.md), borderSide: BorderSide.none),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(WxRadius.md),
          borderSide: BorderSide(color: c.accentEdge, width: 2),
        ),
      ),
    );
  }
}

extension WxBuildContext on BuildContext {
  WxColors get wx => Theme.of(this).extension<WxColors>()!;
  WxType get wxType => Theme.of(this).extension<WxType>()!;
  WxShapes get wxShape => Theme.of(this).extension<WxShapes>()!;
  WxShadows get wxShadows => Theme.of(this).brightness == Brightness.dark ? WxShadows.dark : WxShadows.light;
}

/// Tints the phone's status and navigation bars to the current page. Put it
/// around the app, in MaterialApp's `builder`.
class WxSystemBars extends StatelessWidget {
  const WxSystemBars({super.key, required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    final icons = dark ? Brightness.light : Brightness.dark;
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: icons,
        statusBarBrightness: dark ? Brightness.dark : Brightness.light,
        systemNavigationBarColor: context.wx.bgSubtle,
        systemNavigationBarIconBrightness: icons,
      ),
      child: child,
    );
  }
}
