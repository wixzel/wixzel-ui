import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:wixzel_ui/wixzel_ui.dart';

void main() {
  test('voice is seeded from its lime in both themes', () {
    final voice = wxProducts[WixzelProduct.voice]!;
    expect(voice.light.accent, const Color(0xFFA0D425));
    expect(voice.dark.accent, const Color(0xFFA0D425));
  });

  test('aliases share their target', () {
    expect(wxProducts[WixzelProduct.one], same(wxProducts[WixzelProduct.wixzel]));
  });

  test('wxMix matches CSS at the ends', () {
    const a = Color(0xFF204060);
    const b = Color(0xFFE0D0C0);
    expect(wxMix(a, b, 0).toARGB32(), a.toARGB32());
    expect(wxMix(a, b, 1).toARGB32(), b.toARGB32());
  });

  test('the squircle stays inside its rect and clamps a large radius', () {
    final path = wxSquirclePath(const Rect.fromLTWH(0, 0, 100, 44), 60);
    final bounds = path.getBounds();
    expect(bounds.width, closeTo(100, 0.01));
    expect(bounds.height, closeTo(44, 0.01));
  });
}
