"use client";

import { useEffect, useRef, useState } from "react";

const WHEEL_GESTURE_IDLE_MS = 200;
const TOUCH_SWIPE_THRESHOLD_PX = 44;

/**
 * Turns wheel gestures and vertical swipes into discrete story steps. The
 * wheel lock is released only after the event stream has been quiet, so the
 * many events produced by trackpad inertia still count as one gesture.
 */
export function useScrollSteps<T extends HTMLElement>(stepCount: number, stickyOffsetPx = 0) {
  const ref = useRef<T | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const activeStepRef = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node || stepCount < 1) return;

    const lastStep = stepCount - 1;
    let wheelLocked = false;
    let wheelWasCaptured = false;
    let wheelTimer: ReturnType<typeof setTimeout> | undefined;
    let touchStartY: number | null = null;

    const changeStep = (direction: 1 | -1) => {
      const next = Math.min(lastStep, Math.max(0, activeStepRef.current + direction));
      if (next === activeStepRef.current) return false;
      activeStepRef.current = next;
      setActiveStep(next);
      return true;
    };

    const isPinned = () => {
      const rect = node.getBoundingClientRect();
      return rect.top <= stickyOffsetPx + 1 && rect.bottom >= window.innerHeight - 1;
    };

    const unlockWheelAfterIdle = () => {
      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        wheelLocked = false;
        wheelWasCaptured = false;
      }, WHEEL_GESTURE_IDLE_MS);
    };

    const onWheel = (event: WheelEvent) => {
      if (!isPinned() || event.deltaY === 0) return;
      unlockWheelAfterIdle();

      if (wheelLocked) {
        if (wheelWasCaptured) event.preventDefault();
        return;
      }

      const direction = event.deltaY > 0 ? 1 : -1;
      wheelLocked = true;
      wheelWasCaptured = changeStep(direction);
      if (wheelWasCaptured) event.preventDefault();
    };

    const onTouchStart = (event: TouchEvent) => {
      touchStartY = isPinned() ? event.touches[0]?.clientY ?? null : null;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (touchStartY === null || !isPinned()) return;
      const endY = event.changedTouches[0]?.clientY;
      if (endY === undefined) return;
      const delta = touchStartY - endY;
      touchStartY = null;
      if (Math.abs(delta) < TOUCH_SWIPE_THRESHOLD_PX) return;
      changeStep(delta > 0 ? 1 : -1);
    };

    const syncBoundaryStep = () => {
      const rect = node.getBoundingClientRect();
      let next: number | undefined;
      if (rect.top > stickyOffsetPx + 1) next = 0;
      else if (rect.bottom < window.innerHeight - 1) next = lastStep;
      if (next !== undefined && next !== activeStepRef.current) {
        activeStepRef.current = next;
        setActiveStep(next);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    node.addEventListener("touchstart", onTouchStart, { passive: true });
    node.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("scroll", syncBoundaryStep, { passive: true });

    return () => {
      if (wheelTimer) clearTimeout(wheelTimer);
      window.removeEventListener("wheel", onWheel);
      node.removeEventListener("touchstart", onTouchStart);
      node.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("scroll", syncBoundaryStep);
    };
  }, [stepCount, stickyOffsetPx]);

  return { ref, activeStep };
}
