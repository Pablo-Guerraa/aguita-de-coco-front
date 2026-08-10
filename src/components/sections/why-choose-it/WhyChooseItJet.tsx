/**
 * The pouring water stream between the coconut and the bottle. Purely
 * visual — `opacity`/`growth` are derived from scroll progress by the
 * caller (see why-choose-it-utils.ts) so the jet appears/disappears in
 * lockstep with scrolling rather than on its own timer. The gentle
 * "flowing" shimmer and falling droplets are decorative-only and are
 * gated behind `prefers-reduced-motion: no-preference` in globals.css.
 */
interface WhyChooseItJetProps {
  opacity: number;
  growth: number;
  className?: string;
}

export function WhyChooseItJet({ opacity, growth, className }: WhyChooseItJetProps) {
  return (
    <div
      aria-hidden="true"
      className={`why-jet pointer-events-none ${className ?? ""}`}
      style={{ opacity, transform: `scaleY(${Math.max(growth, 0.001)})` }}
    >
      <svg viewBox="0 0 24 96" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="why-jet-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent-lime)" stopOpacity="0.1" />
            <stop offset="20%" stopColor="var(--color-primary-green)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--color-primary-green)" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <rect x="9" y="0" width="6" height="96" rx="3" fill="url(#why-jet-gradient)" className="why-jet-stream" />
        <circle cx="12" cy="26" r="2" fill="var(--color-primary-green)" className="why-jet-drop why-jet-drop-a" />
        <circle cx="12" cy="58" r="1.6" fill="var(--color-primary-green)" className="why-jet-drop why-jet-drop-b" />
      </svg>
    </div>
  );
}
