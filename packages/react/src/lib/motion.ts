/**
 * The maths a scene is computed from. Pure functions, no React and no DOM, so
 * a Server Component or a test can call them: `wixzel-ui/utils` exports
 * them too.
 */

/** A value between `a` and `b` at `s`, where `s` runs 0 to 1. */
export function lerp(a: number, b: number, s: number): number {
  return a + (b - a) * s;
}

/** `s` clamped to 0–1, for a phase that has run past its window. */
export function clamp01(s: number): number {
  return s < 0 ? 0 : s > 1 ? 1 : s;
}

/**
 * How far through a window `[from, to]` the time `t` is, 0 before it and 1
 * after. A scene is written as a list of these, so each part says when it
 * happens and nothing has to remember what the last frame did.
 */
export function phase(t: number, from: number, to: number): number {
  return to === from ? (t < from ? 0 : 1) : clamp01((t - from) / (to - from));
}

/**
 * Easing, in the system's own terms: things start fast and land softly, and
 * nothing overshoots. `inOut` for something that walks or carries, `out` for
 * something settling into place, `in` for something being lifted away.
 */
export const ease = {
  in: (s: number) => s * s * s,
  out: (s: number) => 1 - (1 - s) ** 3,
  inOut: (s: number) => -(Math.cos(Math.PI * s) - 1) / 2,
} as const;

/**
 * Which frame of a sprite strip to show, from distance travelled rather than
 * from time, so feet land where the character actually moves instead of
 * sliding. Returns the percentage to shift the strip by.
 */
export function spriteOffset(distance: number, stride: number, frames: number): number {
  const f = Math.floor(Math.abs(distance) / stride + 1e-6) % frames;
  return -f * (100 / frames);
}
