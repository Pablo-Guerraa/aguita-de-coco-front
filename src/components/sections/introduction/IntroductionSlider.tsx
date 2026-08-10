"use client";

import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { IntroductionSlide } from "@/types/introduction";

const AUTOPLAY_INTERVAL_MS = 4500;
const RESUME_AFTER_INTERACTION_MS = 6000;
const SWIPE_THRESHOLD_PX = 40;

interface IntroductionSliderProps {
  slides: IntroductionSlide[];
}

export function IntroductionSlider({ slides }: IntroductionSliderProps) {
  const slideCount = slides.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [isTemporarilyPaused, setIsTemporarilyPaused] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Detect (and react to) the user's reduced-motion preference.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (event: MediaQueryListEvent) =>
      setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Reveal the section once, the first time it enters the viewport.
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % slideCount) + slideCount) % slideCount);
    },
    [slideCount],
  );

  // After any manual interaction, briefly hold off the autoplay timer so it
  // doesn't immediately fight with what the user just did.
  const holdAutoplay = useCallback(() => {
    setIsTemporarilyPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsTemporarilyPaused(false);
    }, RESUME_AFTER_INTERACTION_MS);
  }, []);

  const handleSelect = useCallback(
    (index: number) => {
      goTo(index);
      holdAutoplay();
    },
    [goTo, holdAutoplay],
  );

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  const isAutoplaying =
    autoplayEnabled && !isTemporarilyPaused && !prefersReducedMotion && slideCount > 1;

  useEffect(() => {
    if (!isAutoplaying) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isAutoplaying, slideCount]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartXRef.current;
    touchStartXRef.current = null;
    if (startX === null) return;
    const deltaX = event.changedTouches[0].clientX - startX;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
    handleSelect(activeIndex + (deltaX < 0 ? 1 : -1));
  };

  if (slideCount === 0) return null;

  return (
    <div
      ref={rootRef}
      className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
      onMouseEnter={() => setIsTemporarilyPaused(true)}
      onMouseLeave={() => setIsTemporarilyPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Cómo elaboramos Aguita de Coco"
    >
      {/* Image stage */}
      <div
        className={`relative order-1 mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl bg-surface shadow-sm transition-[opacity,transform] duration-700 ease-out sm:max-w-lg lg:order-none lg:max-w-none ${
          isRevealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="grid h-full w-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              aria-hidden={index !== activeIndex}
              className={`relative col-start-1 row-start-1 h-full w-full transition-[opacity,transform] duration-700 ease-out ${
                index === activeIndex ? "scale-100 opacity-100" : "scale-105 opacity-0"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="(min-width: 1024px) 480px, 90vw"
                className="object-contain p-10 sm:p-12"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Slide content */}
      <div className="order-2 lg:order-none">
        <div
          className={`grid transition-[opacity,transform] delay-150 duration-700 ease-out ${
            isRevealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              aria-hidden={index !== activeIndex}
              className={`col-start-1 row-start-1 transition-[opacity,transform] duration-500 ease-out ${
                index === activeIndex
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-2 opacity-0"
              }`}
            >
              <span className="text-xs font-semibold tracking-wide text-primary-green uppercase">
                {slide.eyebrow}
              </span>
              <h3 className="mt-2 text-2xl font-bold text-text-primary sm:text-3xl">
                {slide.title}
              </h3>
              <p className="mt-3 max-w-md text-base text-text-secondary sm:text-lg">
                {slide.description}
              </p>
            </div>
          ))}
        </div>

        {/* Controls: indicators + prev/next + play/pause */}
        <div className="mt-8 flex items-center gap-4">
          <div className="flex items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Ir a la diapositiva ${index + 1}: ${slide.title}`}
                aria-current={index === activeIndex}
                onClick={() => handleSelect(index)}
                className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green ${
                  index === activeIndex
                    ? "w-7 bg-accent-lime"
                    : "w-2.5 bg-border hover:bg-coconut-brown-soft"
                }`}
              />
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              aria-pressed={!autoplayEnabled}
              aria-label={autoplayEnabled ? "Pausar reproducción automática" : "Reanudar reproducción automática"}
              onClick={() => setAutoplayEnabled((prev) => !prev)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-primary-green hover:text-primary-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green"
            >
              {autoplayEnabled ? (
                <Pause className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              aria-label="Diapositiva anterior"
              onClick={() => handleSelect(activeIndex - 1)}
              className="hidden h-8 w-8 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-primary-green hover:text-primary-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green sm:inline-flex"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Siguiente diapositiva"
              onClick={() => handleSelect(activeIndex + 1)}
              className="hidden h-8 w-8 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-primary-green hover:text-primary-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green sm:inline-flex"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
