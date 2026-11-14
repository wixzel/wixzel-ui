import { type ComponentProps, type CSSProperties, type RefObject, useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";

/**
 * Scenes: a small picture that shows how the product works, drawn by the
 * browser rather than played as a video.
 *
 * The rule is that nothing remembers anything. Every part of a scene is a
 * function of one number — the seconds since it started — so a frame can be
 * drawn at any moment without replaying what came before, a loop can be
 * scrubbed or restarted, and a dropped frame costs nothing. One clock drives
 * every part, which is what makes separate pieces look like one machine.
 *
 * What this gives a product is the clock, the stage and the maths. The
 * artwork, and what happens in the scene, belong to the product: Voice's scene
 * is a call going out over a carrier, and it should look like nothing any other
 * product shows.
 */

/**
 * The shared clock. The callback runs once per animation frame with the
 * seconds since the scene started, and writes straight to the DOM through refs
 * — never through state, which would re-render the page sixty times a second.
 *
 * The loop runs only while the stage is on screen, and a visitor who asked for
 * reduced motion gets one still frame at `stillAt` and no loop at all.
 */
export function useSceneClock(
  onFrame: (seconds: number) => void,
  {
    stillAt = 0,
    paused,
  }: {
    /** The moment the still frame shows: pick the pose that explains the scene. */
    stillAt?: number;
    /** Hold the scene where it is (a tab behind a dialog, a demo waiting on a click). */
    paused?: boolean;
  } = {},
): RefObject<HTMLDivElement | null> {
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef(onFrame);
  frame.current = onFrame;

  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frame.current(stillAt);
      return;
    }
    if (paused) return;

    let raf = 0;
    let last = 0;
    let elapsed = 0;
    let visible = false;

    const tick = (now: number) => {
      if (!last) last = now;
      // A capped delta: coming back to a backgrounded tab resumes the scene
      // rather than teleporting it through a minute of animation.
      elapsed += Math.min(0.1, (now - last) / 1000);
      last = now;
      frame.current(elapsed);
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      const now = !!entry?.isIntersecting;
      if (now === visible) return;
      visible = now;
      if (visible) {
        last = 0;
        raf = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(raf);
      }
    });
    io.observe(node);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [paused, stillAt]);

  return stage;
}

/**
 * The stage a scene is drawn on: a tinted panel of a fixed shape that measures
 * itself and publishes one unit, `--wx-scene-unit`, as a hundredth of its
 * width. Parts are then placed in the scene's own coordinates and the whole
 * thing scales with the page without a media query.
 */
export function Scene({
  ratio = 16 / 9,
  stageRef,
  className,
  style,
  children,
  ref,
  ...props
}: ComponentProps<"div"> & {
  /** The shape of the picture. Keep it the same across a row of scenes. */
  ratio?: number;
  /** The ref from useSceneClock. */
  stageRef?: RefObject<HTMLDivElement | null>;
}) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!node) return;
    const ro = new ResizeObserver(([entry]) => {
      const width = entry?.contentRect.width ?? 0;
      node.style.setProperty("--wx-scene-unit", `${width / 100}px`);
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, [node]);

  return (
    <div
      // Composed, not spread: a parent using asChild passes its own ref, and
      // letting the spread win would silently unhook the clock.
      ref={(el) => {
        setNode(el);
        if (stageRef) stageRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      style={{ aspectRatio: String(ratio), ...style } as CSSProperties}
      className={cn("relative isolate w-full overflow-hidden rounded-lg bg-card", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * A part of a scene: a character, a panel, a line of type. Placed in scene
 * coordinates — 0 to 100 across the stage, and up is positive, as it is on
 * paper — and then moved every frame by writing a transform onto its ref.
 */
export function ScenePart({
  x = 0,
  y = 0,
  width,
  className,
  style,
  ...props
}: ComponentProps<"div"> & {
  /** Where it sits before the clock moves it, in scene units. */
  x?: number;
  y?: number;
  /** Its width in scene units. Height follows the content. */
  width?: number;
}) {
  return (
    <div
      style={
        {
          left: `calc(${x} * var(--wx-scene-unit))`,
          bottom: `calc(${y} * var(--wx-scene-unit))`,
          width: width === undefined ? undefined : `calc(${width} * var(--wx-scene-unit))`,
          ...style,
        } as CSSProperties
      }
      className={cn("absolute will-change-transform", className)}
      {...props}
    />
  );
}

/**
 * Move a part, in scene units, writing the transform only when it changed: a
 * frame that computes the same pose as the last one should cost nothing.
 */
export function moveTo(el: HTMLElement | null, x: number, y: number, extra = ""): void {
  if (!el) return;
  const unit = "var(--wx-scene-unit)";
  const transform = `translate3d(calc(${x.toFixed(3)} * ${unit}), calc(${(-y).toFixed(3)} * ${unit}), 0)${extra}`;
  if (el.dataset.wxTransform === transform) return;
  el.dataset.wxTransform = transform;
  el.style.transform = transform;
}

/** Fade a part, with the same guard against writing an unchanged value. */
export function fadeTo(el: HTMLElement | null, opacity: number): void {
  if (!el) return;
  const value = opacity.toFixed(3);
  if (el.dataset.wxOpacity === value) return;
  el.dataset.wxOpacity = value;
  el.style.opacity = value;
}

export { clamp01, ease, lerp, phase, spriteOffset } from "../lib/motion";
