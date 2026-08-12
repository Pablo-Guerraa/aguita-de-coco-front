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
    let entryNormalizationFrame: number | undefined;
    let exiting = false;
    let isNormalizingEntry = false;
    let exitTargetPhase: "before" | "after" | null = null;
    let touchStartY: number | null = null;
    let touchCaptured = false;
    let pendingExitDirection: 1 | -1 | null = null;

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

    const normalizeEntry = (direction: 1 | -1) => {
      const targetTop = direction > 0 ? getOffset() : window.innerHeight;
      const boundary = direction > 0 ? start : end;
      const correction = boundary.getBoundingClientRect().top - targetTop;
      if (Math.abs(correction) <= 1) return;

      isNormalizingEntry = true;
      window.scrollBy({ top: correction, behavior: "auto" });
      entryNormalizationFrame = window.requestAnimationFrame(() => {
        isNormalizingEntry = false;
        lastScrollY = window.scrollY;
        previousStartTop = start.getBoundingClientRect().top;
        previousEndTop = end.getBoundingClientRect().top;
      });
    };

    const enter = (direction: 1 | -1) => {
      updateStep(direction > 0 ? 0 : lastStep);
      updatePhase("active");
      normalizeEntry(direction);
    };

    const finishExit = (nextPhase: "before" | "after") => {
      exiting = false;
      exitTargetPhase = null;
      updatePhase(nextPhase);
      window.removeEventListener("scrollend", onScrollEnd);
      if (exitTimer) {
        clearTimeout(exitTimer);
        exitTimer = undefined;
      }
    };

    const onScrollEnd = () => {
      if (!exiting || !exitTargetPhase) return;
      finishExit(exitTargetPhase);
    };

    const exit = (direction: 1 | -1) => {
      if (exiting) return;
      const targetPhase = direction > 0 ? "after" : "before";
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const target = direction > 0 ? end : start;

      exiting = true;
      exitTargetPhase = targetPhase;

      if (!reducedMotion) {
        window.addEventListener("scrollend", onScrollEnd, { once: true });
        exitTimer = setTimeout(() => finishExit(targetPhase), EXIT_FALLBACK_MS);
      }

      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: direction > 0 ? "start" : "end",
      });

      if (reducedMotion) finishExit(targetPhase);
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

      if (isNormalizingEntry) {
        previousStartTop = startTop;
        previousEndTop = endTop;
        lastScrollY = scrollY;
        return;
      }

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
      pendingExitDirection = null;
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
      const direction = delta > 0 ? 1 : -1;
      const next = activeStepRef.current + direction;
      if (next < 0 || next > lastStep) {
        pendingExitDirection = direction;
        touchCaptured = true;
      } else touchCaptured = advance(direction);
    };

    const onTouchEnd = () => {
      const exitDirection = pendingExitDirection;
      touchStartY = null;
      touchCaptured = false;
      pendingExitDirection = null;
      if (exitDirection !== null) exit(exitDirection);
    };

    const onTouchCancel = () => {
      touchStartY = null;
      touchCaptured = false;
      pendingExitDirection = null;
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
    container.addEventListener("touchend", onTouchEnd, { passive: true });
    container.addEventListener("touchcancel", onTouchCancel, { passive: true });

    return () => {
      if (wheelTimer) clearTimeout(wheelTimer);
      if (exitTimer) clearTimeout(exitTimer);
      if (entryNormalizationFrame) window.cancelAnimationFrame(entryNormalizationFrame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [desktopMediaQuery, desktopOffsetPx, mobileOffsetPx, stepCount]);

  return { containerRef, startRef, endRef, phase, activeStep };
}
