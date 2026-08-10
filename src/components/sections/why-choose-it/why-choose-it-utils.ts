/**
 * Small numeric helpers driving the "Por qué elegirla" scroll-linked scene.
 * Kept framework-free and pure so the scene's visuals are a deterministic
 * function of the current scroll `progress` (0→1) — never a
 * self-running/timed animation.
 */

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Smooth 0→1 ease between `edge0` and `edge1`, clamped outside that range. */
export function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * Piecewise-linear keyframes mapping overall section progress (0→1) to the
 * bottle's liquid fill percentage (0→100). Matches the requested scroll
 * story: nothing happens during "Cocos locales", the jet starts pouring
 * during "100% natural", and the bottle tops out exactly as "Refrigerada"
 * finishes.
 */
const FILL_KEYFRAMES: Array<[progress: number, fillPercent: number]> = [
  [0, 0],
  [0.2, 0],
  [0.4, 20],
  [0.6, 45],
  [0.8, 75],
  [1, 100],
];

export function getFillPercent(progress: number): number {
  const p = clamp01(progress);
  for (let i = 0; i < FILL_KEYFRAMES.length - 1; i += 1) {
    const [p0, f0] = FILL_KEYFRAMES[i];
    const [p1, f1] = FILL_KEYFRAMES[i + 1];
    if (p <= p1) {
      const t = p1 === p0 ? 1 : (p - p0) / (p1 - p0);
      return lerp(f0, f1, t);
    }
  }
  return 100;
}

const JET_FADE_IN_START = 0.16;
const JET_FADE_IN_END = 0.26;
const JET_FADE_OUT_START = 0.88;
const JET_FADE_OUT_END = 0.97;

/** Opacity (and growth) of the pouring water jet — fades in once the bottle
 * starts filling, and fades out again right as it reaches 100%. */
export function getJetOpacity(progress: number): number {
  const fadeIn = smoothstep(JET_FADE_IN_START, JET_FADE_IN_END, progress);
  const fadeOut = 1 - smoothstep(JET_FADE_OUT_START, JET_FADE_OUT_END, progress);
  return fadeIn * fadeOut;
}

export function getJetGrowth(progress: number): number {
  return smoothstep(JET_FADE_IN_START, JET_FADE_IN_END, progress);
}

/** True once the bottle has (visually) finished filling — used to trigger
 * the small closing "freshness" flourish. */
export function isFillComplete(progress: number): boolean {
  return progress >= 0.95;
}

export function getActiveAttributeIndex(progress: number, count: number): number {
  if (count <= 0) return 0;
  return Math.min(count - 1, Math.floor(clamp01(progress) * count));
}
