"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { MomentCard as MomentCardData } from "@/types/moment";

/**
 * Per-card scroll-reveal timing.
 *
 * On desktop the three cards sit roughly on the same row, so an
 * intersection observer alone wouldn't reliably produce a Card 1 → 2 → 3
 * stagger — we add a small `transition-delay` per index (lg breakpoint
 * only). On mobile the cards are stacked far apart, so each one already
 * reveals independently as it individually nears the viewport; no extra
 * delay is added there.
 */
const STAGGER_DELAY_CLASSES = [
  "lg:[transition-delay:0ms]",
  "lg:[transition-delay:160ms]",
  "lg:[transition-delay:320ms]",
];

/** Subtle per-card vertical offset (desktop only) so the row of cards feels
 * a little more hand-placed instead of perfectly gridded. */
const VERTICAL_OFFSET_CLASSES = [
  "lg:translate-y-0",
  "lg:translate-y-8",
  "lg:-translate-y-3",
];

interface MomentCardProps {
  moment: MomentCardData;
  index: number;
}

export function MomentCard({ moment, index }: MomentCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (event: MediaQueryListEvent) =>
      setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Reveal this card, individually, the first time it nears the viewport.
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }
    const node = revealRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const staggerDelayClass = STAGGER_DELAY_CLASSES[index % STAGGER_DELAY_CLASSES.length];
  const offsetClass = VERTICAL_OFFSET_CLASSES[index % VERTICAL_OFFSET_CLASSES.length];

  return (
    <div className={`relative ${offsetClass}`}>
      <div
        ref={revealRef}
        className={`group relative transition-[opacity,transform] duration-700 ease-out will-change-transform ${staggerDelayClass} ${
          isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-[0.96] opacity-0"
        }`}
      >
        <article className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface-green shadow-md ring-1 ring-border/60 transition-shadow duration-300 group-hover:shadow-xl sm:aspect-[3/4]">
          {/* Photo (temporary placeholder — will be replaced by real photography) */}
          <Image
            src={moment.image}
            alt={moment.title}
            fill
            sizes="(min-width: 1024px) 33vw, 90vw"
            className={`object-contain p-14 transition-transform duration-700 ease-out sm:p-16 ${
              isVisible ? "scale-100 group-hover:scale-105" : "scale-110"
            }`}
          />

          {/* Legibility scrim for the overlaid copy */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-text-primary/80 via-text-primary/10 to-transparent"
          />

          {/* Overlaid copy */}
          <div className="absolute inset-x-0 bottom-0 p-5 transition-transform duration-300 ease-out group-hover:-translate-y-1 sm:p-6">
            {moment.optionalLabel && (
              <span className="inline-flex items-center rounded-full bg-surface/90 px-2.5 py-1 text-xs font-semibold text-primary-green backdrop-blur-sm">
                {moment.optionalLabel}
              </span>
            )}
            <h3 className="mt-3 text-xl font-bold text-surface sm:text-2xl">{moment.title}</h3>
            <p className="mt-1.5 text-sm text-surface/85 sm:text-base">{moment.description}</p>
          </div>
        </article>
      </div>
    </div>
  );
}
