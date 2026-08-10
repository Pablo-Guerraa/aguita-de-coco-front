"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element has entered the viewport, resolving to `true`
 * exactly once (the observer disconnects after the first intersection).
 * Falls back to `true` immediately in environments without
 * `IntersectionObserver` support so content is never permanently hidden.
 */
export function useInViewOnce<T extends Element>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return { ref, inView };
}
