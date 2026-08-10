/**
 * Temporary placeholder bottle used to visualize the liquid filling up as
 * the user scrolls.
 *
 * `/bottle.png` is a photo of the final, opaque, already-labeled product —
 * it has no transparent interior to reveal a rising liquid level, so this
 * draws a light glass-bottle silhouette in SVG instead and clips a liquid
 * rectangle to its body shape. `fillPercent` (0–100) is the only thing
 * driving the liquid's height, so swapping this out later for a real
 * "empty bottle" asset + mask only requires replacing this file — nothing
 * in `WhyChooseItScene`/`WhyChooseItExperience` needs to change.
 */

const VIEW_WIDTH = 160;
const VIEW_HEIGHT = 340;

/** Bottle body outline: cap sits above this, everything here is the part
 * the liquid can occupy. */
const BODY_PATH =
  "M63,34 L97,34 L97,54 C97,68 110,71 119,88 C129,106 133,128 133,153 L133,296 C133,317 121,328 98,328 L62,328 C39,328 27,317 27,296 L27,153 C27,128 31,106 41,88 C50,71 63,68 63,54 Z";

const BODY_TOP = 34;
const BODY_BOTTOM = 328;
const BODY_HEIGHT = BODY_BOTTOM - BODY_TOP;

interface WhyChooseItBottleProps {
  fillPercent: number;
  isComplete: boolean;
  className?: string;
}

export function WhyChooseItBottle({ fillPercent, isComplete, className }: WhyChooseItBottleProps) {
  const clampedFill = Math.min(100, Math.max(0, fillPercent));
  const liquidHeight = (clampedFill / 100) * BODY_HEIGHT;
  const liquidTop = BODY_BOTTOM - liquidHeight;

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className={className}
      role="img"
      aria-label={`Botella llenándose de agua de coco, ${Math.round(clampedFill)} por ciento`}
    >
      <defs>
        <clipPath id="why-bottle-body-clip">
          <path d={BODY_PATH} />
        </clipPath>
        <linearGradient id="why-liquid-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-lime)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--color-primary-green)" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="why-glass-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="35%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Glass body fill (very light, so the liquid reads clearly through it) */}
      <path d={BODY_PATH} fill="var(--color-surface)" opacity="0.5" />

      {/* Liquid, clipped to the bottle's body silhouette */}
      <g clipPath="url(#why-bottle-body-clip)">
        <rect
          x={20}
          y={liquidTop}
          width={VIEW_WIDTH - 40}
          height={liquidHeight + 20}
          fill="url(#why-liquid-gradient)"
          className="why-liquid-fill"
        />

        {/* Surface highlight with a very subtle idle wobble */}
        {clampedFill > 0 && (
          <ellipse
            cx={VIEW_WIDTH / 2}
            cy={liquidTop}
            rx={52}
            ry={4}
            fill="white"
            opacity={0.3}
            className="why-liquid-surface"
          />
        )}

        {/* A couple of tiny rising bubbles — purely decorative */}
        {clampedFill > 6 && (
          <>
            <circle
              cx={58}
              cy={liquidTop + Math.min(liquidHeight, 60)}
              r={2.4}
              fill="white"
              opacity={0.5}
              className="why-bubble why-bubble-a"
            />
            <circle
              cx={96}
              cy={liquidTop + Math.min(liquidHeight, 110)}
              r={1.8}
              fill="white"
              opacity={0.45}
              className="why-bubble why-bubble-b"
            />
          </>
        )}
      </g>

      {/* Glass outline on top of the liquid */}
      <path d={BODY_PATH} fill="none" stroke="var(--color-border)" strokeWidth={2.5} />
      <path d={BODY_PATH} fill="url(#why-glass-sheen)" opacity={0.5} />

      {/* Neck + cap */}
      <rect x={63} y={12} width={34} height={22} rx={3} fill="var(--color-primary-green)" />
      <rect x={63} y={12} width={34} height={5} rx={2} fill="var(--color-primary-dark)" opacity={0.5} />
      <path
        d="M67,34 L93,34 L93,52 C93,55 89,57 80,57 C71,57 67,55 67,52 Z"
        fill="var(--color-surface)"
        opacity={0.4}
        stroke="var(--color-border)"
        strokeWidth={1.5}
      />

      {/* Final "frescura" droplets shown once the bottle has finished filling */}
      {isComplete && (
        <g className="why-final-droplets">
          <circle cx={44} cy={70} r={2.2} fill="var(--color-primary-green)" opacity={0.6} />
          <circle cx={118} cy={95} r={1.8} fill="var(--color-primary-green)" opacity={0.5} />
          <circle cx={110} cy={60} r={1.4} fill="var(--color-primary-green)" opacity={0.55} />
        </g>
      )}
    </svg>
  );
}
