"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import type { WhyChooseItAttribute } from "@/types/why-choose-it";
import { WhyChooseItAttributesList } from "./WhyChooseItAttributesList";
import { WhyChooseItScene } from "./WhyChooseItScene";

/** Matches the sticky header's height (h-16 = 64px) plus a little
 * breathing room, so the pinned scene never sits flush under the header. */
const STICKY_OFFSET_PX = 80;

interface WhyChooseItExperienceProps {
  attributes: WhyChooseItAttribute[];
}

/**
 * Scroll-driven layout: a normally-flowing column of attributes on one
 * side, and a `sticky` coconut+bottle scene on the other that stays
 * pinned in view while the attributes scroll past. `useScrollProgress`
 * turns that same scroll into a single 0→1 number that both the active
 * attribute highlight and the bottle's liquid level are derived from.
 */
export function WhyChooseItExperience({ attributes }: WhyChooseItExperienceProps) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>(STICKY_OFFSET_PX);

  if (attributes.length === 0) return null;

  return (
    <div ref={ref} className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-16">
      <div className="order-2 lg:order-1">
        <WhyChooseItAttributesList attributes={attributes} progress={progress} />
      </div>

      <div className="order-1 top-20 z-0 flex h-[44vh] items-center justify-center sticky sm:h-[50vh] lg:h-[72vh] lg:order-2">
        <WhyChooseItScene progress={progress} />
      </div>
    </div>
  );
}
