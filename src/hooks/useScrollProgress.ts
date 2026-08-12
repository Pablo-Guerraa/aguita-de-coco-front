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
    let touchCaptured = false;
    let touchReleasedToNativeScroll = false;

    const changeStep = (direction: 1 | -1) => {
      const next = Math.min(lastStep, Math.max(0, activeStepRef.current + direction));
      if (next === activeStepRef.current) return false;
      activeStepRef.current = next;
      setActiveStep(next);
      return true;
    };

    const isPinned = () => {
      const rect = node.getBoundingClientRect();
      return rect.top <= stickyOffsetPx + 1 && rect.bottom > stickyOffsetPx + 1;
    };

    const hasStepInDirection = (direction: 1 | -1) =>
      direction > 0 ? activeStepRef.current < lastStep : activeStepRef.current > 0;

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
      touchCaptured = false;
      touchReleasedToNativeScroll = false;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (touchStartY === null || touchReleasedToNativeScroll) return;

      if (touchCaptured) {
        if (event.cancelable) event.preventDefault();
        return;
      }

      if (!isPinned()) return;
      const currentY = event.touches[0]?.clientY;
      if (currentY === undefined) return;
      const delta = touchStartY - currentY;
      if (delta === 0) return;

      const direction = delta > 0 ? 1 : -1;
      if (!hasStepInDirection(direction)) {
        touchReleasedToNativeScroll = true;
        return;
      }

      // Block physical scrolling as soon as this is known to be an in-story
      // gesture; the threshold controls the step change, not the scroll lock.
      if (event.cancelable) event.preventDefault();
      if (Math.abs(delta) < TOUCH_SWIPE_THRESHOLD_PX) return;

      changeStep(direction);
      touchCaptured = true;
    };

    const resetTouch = () => {
      touchStartY = null;
      touchCaptured = false;
      touchReleasedToNativeScroll = false;
    };

    const syncBoundaryStep = () => {
      const rect = node.getBoundingClientRect();
      let next: number | undefined;
      if (rect.top > stickyOffsetPx + 1) next = 0;
      else if (rect.bottom <= stickyOffsetPx + 1) next = lastStep;
      if (next !== undefined && next !== activeStepRef.current) {
        activeStepRef.current = next;
        setActiveStep(next);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    node.addEventListener("touchstart", onTouchStart, { passive: true });
    node.addEventListener("touchmove", onTouchMove, { passive: false });
    node.addEventListener("touchend", resetTouch, { passive: true });
    node.addEventListener("touchcancel", resetTouch, { passive: true });
    window.addEventListener("scroll", syncBoundaryStep, { passive: true });

    return () => {
      if (wheelTimer) clearTimeout(wheelTimer);
      window.removeEventListener("wheel", onWheel);
      node.removeEventListener("touchstart", onTouchStart);
      node.removeEventListener("touchmove", onTouchMove);
      node.removeEventListener("touchend", resetTouch);
      node.removeEventListener("touchcancel", resetTouch);
      window.removeEventListener("scroll", syncBoundaryStep);
    };
  }, [stepCount, stickyOffsetPx]);

  return { ref, activeStep };
}
