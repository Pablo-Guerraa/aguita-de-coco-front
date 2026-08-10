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
      className={`why-jet pointer-events-none relative ${className ?? ""}`}
      style={{ opacity, transform: `scaleY(${Math.max(growth, 0.001)})` }}
    >
      <div className="why-jet-stream absolute inset-y-0 left-[calc(50%-3px)] w-1.5 overflow-hidden rounded-full bg-gradient-to-b from-[#F8FAF1]/35 via-[#EEF3E3]/75 to-[#DDE9D4]/85 shadow-[0_0_5px_rgba(248,250,241,0.45)]">
        <span className="absolute inset-y-0 left-[1px] w-px bg-white/45" />
      </div>
      <span className="why-jet-drop why-jet-drop-a absolute top-[27%] left-[calc(50%-2px)] size-1 rounded-full bg-[#F8FAF1]/85" />
      <span className="why-jet-drop why-jet-drop-b absolute top-[60%] left-[calc(50%-2px)] size-1 rounded-full bg-[#EEF3E3]/80" />
    </div>
  );
}
