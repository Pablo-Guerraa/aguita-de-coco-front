"use client";

import { useEffect, useRef, useState } from "react";

const WHEEL_GESTURE_IDLE_MS = 200;
const TOUCH_SWIPE_THRESHOLD_PX = 44;
const EXIT_FALLBACK_MS = 700;

export type DiscreteStoryPhase = "before" | "active" | "after";

interface UseDiscreteStoryOptions {
  stepCount: number;
  mobileOffsetPx: number;
  desktopOffsetPx: number;
  desktopMediaQuery: string;
}

export function useDiscreteStory({
  stepCount,
  mobileOffsetPx,
  desktopOffsetPx,
  desktopMediaQuery,
}: UseDiscreteStoryOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<DiscreteStoryPhase>("before");
  const [activeStep, setActiveStep] = useState(0);
  const phaseRef = useRef<DiscreteStoryPhase>("before");
  const activeStepRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const start = startRef.current;
    const end = endRef.current;
    if (!container || !start || !end || stepCount < 1) return;

    const lastStep = stepCount - 1;
    let lastScrollY = window.scrollY;
    let previousStartTop = start.getBoundingClientRect().top;
    let previousEndTop = end.getBoundingClientRect().top;
    let wheelLocked = false;
    let wheelCaptured = false;
    let wheelTimer: ReturnType<typeof setTimeout> | undefined;
    let exitTimer: ReturnType<typeof setTimeout> | undefined;
    let exiting = false;
    let touchStartY: number | null = null;
    let touchCaptured = false;

    const getOffset = () =>
      window.matchMedia(desktopMediaQuery).matches ? desktopOffsetPx : mobileOffsetPx;

    const updatePhase = (next: DiscreteStoryPhase) => {
      phaseRef.current = next;
      setPhase(next);
    };

    const updateStep = (next: number) => {
      activeStepRef.current = next;
      setActiveStep(next);
    };

    const enter = (direction: 1 | -1) => {
      updateStep(direction > 0 ? 0 : lastStep);
      updatePhase("active");
    };

    const finishExit = (nextPhase: "before" | "after") => {
      exiting = false;
      updatePhase(nextPhase);
      window.removeEventListener("scrollend", onScrollEnd);
      if (exitTimer) clearTimeout(exitTimer);
    };

    const onScrollEnd = () => {
      if (!exiting) return;
      finishExit(activeStepRef.current === 0 ? "before" : "after");
    };

    const exit = (direction: 1 | -1) => {
      if (exiting) return;
      exiting = true;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const target = direction > 0 ? end : start;
      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: direction > 0 ? "start" : "end",
      });

      if (reducedMotion) finishExit(direction > 0 ? "after" : "before");
      else {
        window.addEventListener("scrollend", onScrollEnd, { once: true });
        exitTimer = setTimeout(() => finishExit(direction > 0 ? "after" : "before"), EXIT_FALLBACK_MS);
      }
    };

    const advance = (direction: 1 | -1) => {
      if (exiting || phaseRef.current !== "active") return false;
      const next = activeStepRef.current + direction;
      if (next >= 0 && next <= lastStep) updateStep(next);
      else exit(direction);
      return true;
    };

    const onScroll = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 1 : scrollY < lastScrollY ? -1 : 0;
      const startTop = start.getBoundingClientRect().top;
      const endTop = end.getBoundingClientRect().top;
      const offset = getOffset();

      if (!exiting && phaseRef.current !== "active") {
        if (direction > 0 && previousStartTop > offset && startTop <= offset) enter(1);
        else if (direction < 0 && previousEndTop < window.innerHeight && endTop >= window.innerHeight)
          enter(-1);
      }

      previousStartTop = startTop;
      previousEndTop = endTop;
      lastScrollY = scrollY;
    };

    const unlockWheelAfterIdle = () => {
      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        wheelLocked = false;
        wheelCaptured = false;
      }, WHEEL_GESTURE_IDLE_MS);
    };

    const onWheel = (event: WheelEvent) => {
      if (phaseRef.current !== "active" || event.deltaY === 0) return;
      unlockWheelAfterIdle();
      if (wheelLocked) {
        if (wheelCaptured) event.preventDefault();
        return;
      }
      wheelLocked = true;
      wheelCaptured = advance(event.deltaY > 0 ? 1 : -1);
      if (wheelCaptured) event.preventDefault();
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartY = phaseRef.current === "active" ? event.touches[0]?.clientY ?? null : null;
      touchCaptured = false;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (touchStartY === null) return;
      if (touchCaptured) {
        if (event.cancelable) event.preventDefault();
        return;
      }
      const currentY = event.touches[0]?.clientY;
      if (currentY === undefined) return;
      const delta = touchStartY - currentY;
      if (delta === 0) return;
      if (event.cancelable) event.preventDefault();
      if (Math.abs(delta) < TOUCH_SWIPE_THRESHOLD_PX) return;
      touchCaptured = advance(delta > 0 ? 1 : -1);
    };

    const resetTouch = () => {
      touchStartY = null;
      touchCaptured = false;
    };

    const initialStartTop = start.getBoundingClientRect().top;
    const initialEndTop = end.getBoundingClientRect().top;
    if (initialEndTop < window.innerHeight) updatePhase("after");
    else if (initialStartTop > getOffset()) updatePhase("before");
    else enter(1);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", resetTouch, { passive: true });
    container.addEventListener("touchcancel", resetTouch, { passive: true });

    return () => {
      if (wheelTimer) clearTimeout(wheelTimer);
      if (exitTimer) clearTimeout(exitTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", resetTouch);
      container.removeEventListener("touchcancel", resetTouch);
    };
  }, [desktopMediaQuery, desktopOffsetPx, mobileOffsetPx, stepCount]);

  return { containerRef, startRef, endRef, phase, activeStep };
}
