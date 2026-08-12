"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks how far the user has scrolled through a tall container, expressed
 * as a 0→1 progress value.
 *
 * `progress` reaches 0 the moment the container's top edge lines up with
 * `stickyOffsetPx` from the top of the viewport, and reaches 1 the moment
 * the container's bottom edge lines up with the bottom of the viewport —
 * i.e. exactly the window during which a `sticky` child (pinned at
 * `top: stickyOffsetPx`) inside this container stays pinned. This makes it
 * a drop-in driver for scroll-linked ("scrollytelling") visuals that live
 * next to a normally-flowing, taller column of content.
 *
 * Listens with a rAF-throttled scroll/resize handler and disconnects while
 * the container is far outside the viewport to avoid unnecessary work.
 */
export function useScrollProgress<T extends HTMLElement>(stickyOffsetPx = 0) {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let ticking = false;
    let isNearViewport = true;

    const computeProgress = () => {
      ticking = false;
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const travel = rect.height - viewportHeight;

      let next: number;
      if (travel <= 0) {
        // Container is shorter than the viewport: it's either fully
        // in view (mid animation) or not yet/no longer reached.
        next = rect.top <= stickyOffsetPx ? 1 : 0;
      } else {
        next = (stickyOffsetPx - rect.top) / travel;
      }
      setProgress(Math.min(1, Math.max(0, next)));
    };

    const requestTick = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(computeProgress);
    };

    computeProgress();

    const onScroll = () => {
      if (isNearViewport) requestTick();
    };
    const onResize = () => requestTick();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Only keep tracking scroll while the container is reasonably close to
    // the viewport — once it's far away, progress is pinned at 0 or 1 and
    // there is nothing to compute until it approaches again.
    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          isNearViewport = entry.isIntersecting;
          if (isNearViewport) requestTick();
        },
        { rootMargin: "50% 0px 50% 0px" },
      );
      observer.observe(node);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      observer?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stickyOffsetPx]);

  return { ref, progress };
}
