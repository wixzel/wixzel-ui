import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:phosphor_flutter/phosphor_flutter.dart';

import '../color_mix.dart';
import '../motion.dart';
import '../theme.dart';
import '../tokens.g.dart';
import 'overlays.dart';

/// Label, control, hint and error. An error replaces the hint; say what to do,
/// not just what went wrong.
class WxField extends StatelessWidget {
  const WxField({super.key, this.label, this.hint, this.error, this.labelAside, this.required = false, required this.child});
  final String? label;
  final String? hint;
  final String? error;
  final String? labelAside;
  final bool required;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final type = context.wxType;
    return _FieldScope(
      invalid: error != null,
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, mainAxisSize: MainAxisSize.min, children: [
        if (label != null) ...[
          Row(crossAxisAlignment: CrossAxisAlignment.baseline, textBaseline: TextBaseline.alphabetic, children: [
            Expanded(
              child: Text.rich(TextSpan(text: label, style: type.bodySm.copyWith(fontWeight: FontWeight.w500), children: [
                if (required) TextSpan(text: ' *', style: TextStyle(color: c.dangerInk)),
              ])),
            ),
            if (labelAside != null) Text(labelAside!, style: type.caption.copyWith(color: c.fgSubtle)),
          ]),
          const SizedBox(height: 6),
        ],
        child,
        if (error != null)
          Padding(
            padding: const EdgeInsets.only(top: 6),
            child: WxBlurIn(
              child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Padding(padding: const EdgeInsets.only(top: 1), child: PhosphorIcon(PhosphorIconsDuotone.warningCircle, size: 14, color: c.dangerInk)),
                const SizedBox(width: 6),
                Expanded(child: Text(error!, style: type.caption.copyWith(color: c.dangerInk, fontWeight: FontWeight.w500))),
              ]),
            ),
          )
        else if (hint != null)
          Padding(padding: const EdgeInsets.only(top: 6), child: Text(hint!, style: type.caption.copyWith(color: c.fgMuted))),
      ]),
    );
  }
}

class _FieldScope extends InheritedWidget {
  const _FieldScope({required this.invalid, required super.child});
  final bool invalid;

  static bool of(BuildContext context) => context.dependOnInheritedWidgetOfExactType<_FieldScope>()?.invalid ?? false;

  @override
  bool updateShouldNotify(_FieldScope old) => old.invalid != invalid;
}

enum WxInputSize { sm, md, lg }

/// A filled field with no border. It takes a solid 2px accent edge on focus;
/// invalid fields keep a red edge. A leading icon takes the accent while the
/// field has focus. Large by default, since this is a finger, not a cursor.
///
/// [label], [hint] and [error] wrap it in a [WxField]. More than one line makes
/// it a textarea, growing with its content.
class WxInput extends StatefulWidget {
  const WxInput({
    super.key,
    this.controller,
    this.focusNode,
    this.label,
    this.placeholder,
    this.hint,
    this.error,
    this.labelAside,
    this.leading,
    this.trailing,
    this.size = WxInputSize.lg,
    this.enabled = true,
    this.readOnly = false,
    this.autofocus = false,
    this.obscureText = false,
    this.autocorrect = true,
    this.enableSuggestions = true,
    this.minLines,
    this.maxLines = 1,
    this.maxLength,
    this.keyboardType,
    this.textInputAction,
    this.textCapitalization = TextCapitalization.none,
    this.textDirection,
    this.textAlign = TextAlign.start,
    this.inputFormatters,
    this.autofillHints,
    this.onChanged,
    this.onSubmitted,
    this.onTap,
    this.style,
  });

  final TextEditingController? controller;
  final FocusNode? focusNode;
  final String? label;

  /// Shown inside the empty field.
  final String? placeholder;

  /// Help shown under the field until there is an error.
  final String? hint;
  final String? error;
  final String? labelAside;

  /// An icon or short text inside the start of the field.
  final Widget? leading;

  /// An icon, unit or button inside the end of the field.
  final Widget? trailing;
  final WxInputSize size;
  final bool enabled, readOnly, autofocus, obscureText, autocorrect, enableSuggestions;
  final int? minLines, maxLines, maxLength;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final TextCapitalization textCapitalization;
  final TextDirection? textDirection;
  final TextAlign textAlign;
  final List<TextInputFormatter>? inputFormatters;
  final Iterable<String>? autofillHints;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final VoidCallback? onTap;
  final TextStyle? style;

  @override
  State<WxInput> createState() => _WxInputState();
}

class _WxInputState extends State<WxInput> {
  FocusNode? _own;
  FocusNode get _focus => widget.focusNode ?? (_own ??= FocusNode());
  bool _focused = false;

  @override
  void initState() {
    super.initState();
    _focus.addListener(_onFocus);
  }

  @override
  void didUpdateWidget(WxInput old) {
    super.didUpdateWidget(old);
    if (old.focusNode != widget.focusNode) {
      (old.focusNode ?? _own)?.removeListener(_onFocus);
      _focus.addListener(_onFocus);
    }
  }

  @override
  void dispose() {
    _focus.removeListener(_onFocus);
    _own?.dispose();
    super.dispose();
  }

  void _onFocus() {
    if (_focus.hasFocus != _focused) setState(() => _focused = _focus.hasFocus);
  }

  bool get _multiline => widget.maxLines != 1 || (widget.minLines ?? 1) > 1;

  Widget _control(BuildContext context) {
    final c = context.wx;
    final type = context.wxType;
    final invalid = widget.error != null || _FieldScope.of(context);
    final (double height, TextStyle text, double padX) = switch (widget.size) {
      WxInputSize.sm => (WxControl.sm, type.bodySm, 10.0),
      WxInputSize.md => (WxControl.md, type.bodySm, 14.0),
      WxInputSize.lg => (WxControl.lg, type.bodyMd, 14.0),
    };
    final shape = context.wxShape.md;
    final style = text.merge(widget.style).copyWith(color: widget.enabled ? null : c.fgDisabled);
    final edge = invalid ? c.dangerInk : c.accentEdge;
    final field = TextField(
      controller: widget.controller,
      focusNode: _focus,
      enabled: widget.enabled,
      readOnly: widget.readOnly,
      autofocus: widget.autofocus,
      obscureText: widget.obscureText,
      autocorrect: widget.autocorrect,
      enableSuggestions: widget.enableSuggestions,
      minLines: widget.minLines,
      maxLines: widget.maxLines,
      maxLength: widget.maxLength,
      keyboardType: widget.keyboardType,
      textInputAction: widget.textInputAction,
      textCapitalization: widget.textCapitalization,
      textDirection: widget.textDirection,
      textAlign: widget.textAlign,
      inputFormatters: widget.inputFormatters,
      autofillHints: widget.autofillHints,
      onChanged: widget.onChanged,
      onSubmitted: widget.onSubmitted,
      onTap: widget.onTap,
      style: style,
      cursorColor: c.accentInk,
      cursorWidth: 1.5,
      buildCounter: (_, {required currentLength, required isFocused, maxLength}) => null,
      // The wrapper draws the box and the edge. Every border is off here, or the
      // theme's focused border would draw a second ring inside it.
      decoration: InputDecoration(
        isCollapsed: true,
        filled: false,
        contentPadding: EdgeInsets.zero,
        hintText: widget.placeholder,
        hintStyle: style.copyWith(color: c.fgSubtle),
        border: InputBorder.none,
        enabledBorder: InputBorder.none,
        focusedBorder: InputBorder.none,
        disabledBorder: InputBorder.none,
        errorBorder: InputBorder.none,
        focusedErrorBorder: InputBorder.none,
      ),
    );
    return GestureDetector(
      behavior: HitTestBehavior.translucent,
      onTap: () => _focus.requestFocus(),
      child: AnimatedContainer(
        duration: WxDurations.fast,
        curve: WxEase.standard,
        constraints: BoxConstraints(minHeight: _multiline ? 80 : height),
        padding: EdgeInsets.symmetric(vertical: _multiline ? 10 : 0),
        alignment: _multiline ? AlignmentDirectional.topStart : AlignmentDirectional.centerStart,
        decoration: ShapeDecoration(
          color: widget.enabled ? c.bgMuted : c.bgSubtle,
          shape: shape.copyWith(
            side: BorderSide(
              color: _focused || invalid ? edge : edge.withValues(alpha: 0),
              width: _focused ? 2 : 1,
              strokeAlign: BorderSide.strokeAlignCenter,
            ),
          ),
        ),
        child: Row(crossAxisAlignment: _multiline ? CrossAxisAlignment.start : CrossAxisAlignment.center, children: [
          if (widget.leading != null)
            Padding(
              padding: const EdgeInsetsDirectional.only(start: 12, end: 8),
              child: IconTheme.merge(
                data: IconThemeData(color: _focused ? c.accentInk : c.fgSubtle, size: 16),
                child: DefaultTextStyle.merge(style: TextStyle(color: c.fgSubtle), child: widget.leading!),
              ),
            ),
          Expanded(
            child: Padding(
              padding: EdgeInsetsDirectional.only(start: widget.leading == null ? padX : 0, end: widget.trailing == null ? padX : 4),
              child: field,
            ),
          ),
          if (widget.trailing != null)
            Padding(
              padding: const EdgeInsetsDirectional.only(end: 6),
              child: IconTheme.merge(
                data: IconThemeData(color: c.fgSubtle, size: 16),
                child: DefaultTextStyle.merge(style: type.bodySm.copyWith(color: c.fgSubtle), child: widget.trailing!),
              ),
            ),
        ]),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (widget.label == null && widget.hint == null && widget.error == null) return _control(context);
    return WxField(
      label: widget.label,
      hint: widget.hint,
      error: widget.error,
      labelAside: widget.labelAside,
      child: Builder(builder: _control),
    );
  }
}

/// A choice in a [WxSelect] or a picker sheet.
class WxSelectOption<T> {
  const WxSelectOption(this.value, this.label, {this.subtitle, this.leading, this.textDirection});
  final T value;
  final String label;
  final String? subtitle;
  final Widget? leading;

  /// For a value that reads one way in every language, like a phone number.
  final TextDirection? textDirection;
}

/// A field that opens a sheet of options: thumb-reachable, and room for a line
/// of explanation under each choice.
class WxSelect<T> extends StatelessWidget {
  const WxSelect({
    super.key,
    required this.options,
    required this.value,
    required this.onChanged,
    this.title,
    this.label,
    this.hint,
    this.error,
    this.placeholder,
    this.enabled = true,
  });

  final List<WxSelectOption<T>> options;
  final T? value;
  final ValueChanged<T>? onChanged;

  /// The sheet's title. Defaults to [label].
  final String? title;
  final String? label;
  final String? hint;
  final String? error;
  final String? placeholder;
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    final c = context.wx;
    final type = context.wxType;
    final current = options.where((o) => o.value == value).firstOrNull;
    final active = enabled && onChanged != null;
    final shape = context.wxShape.md;
    final control = Opacity(
      opacity: active ? 1 : 0.6,
      child: WxPressable(
        scale: 1,
        shape: shape,
        semanticLabel: label,
        onTap: active
            ? () async {
                final picked = await showWxPicker<T>(context, title: title ?? label ?? '', options: options, selected: value);
                if (picked != null) onChanged!(picked);
              }
            : null,
        builder: (_, s) => AnimatedContainer(
          height: WxControl.lg,
          padding: const EdgeInsetsDirectional.only(start: 14, end: 12),
          duration: WxDurations.fast,
          curve: WxEase.standard,
          decoration: ShapeDecoration(
            color: s.pressed || s.hovered ? wxMix(c.bgMuted, c.fg, 0.05) : c.bgMuted,
            shape: error == null ? shape : shape.copyWith(side: BorderSide(color: c.dangerInk)),
          ),
          child: Row(children: [
            if (current?.leading != null) ...[current!.leading!, const SizedBox(width: 8)],
            Expanded(
              child: Text(
                current?.label ?? placeholder ?? '',
                textDirection: current?.textDirection,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: type.bodyMd.copyWith(color: current == null ? c.fgSubtle : c.fg),
              ),
            ),
            PhosphorIcon(PhosphorIconsDuotone.caretUpDown, size: 16, color: c.fgSubtle),
          ]),
        ),
      ),
    );
    if (label == null && hint == null && error == null) return control;
    return WxField(label: label, hint: hint, error: error, child: control);
  }
}
