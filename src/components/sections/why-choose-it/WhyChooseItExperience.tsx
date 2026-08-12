"use client";

import { useDiscreteStory } from "@/hooks/useDiscreteStory";
import type { WhyChooseItAttribute } from "@/types/why-choose-it";
import { WhyChooseItActiveAttributeMobile } from "./WhyChooseItActiveAttributeMobile";
import { WhyChooseItAttributesList } from "./WhyChooseItAttributesList";
import { WhyChooseItScene } from "./WhyChooseItScene";
import { SCENE_STEPS } from "./why-choose-it-utils";

/** Keep gesture boundaries aligned with the responsive sticky top classes. */
const STORY_LAYOUT = {
  mobileOffsetPx: 64,
  desktopOffsetPx: 80,
  desktopMediaQuery: "(min-width: 1024px)",
} as const;

interface WhyChooseItExperienceProps {
  attributes: WhyChooseItAttribute[];
}

/**
 * Explicit sentinels delimit a viewport stage. While active, the stage is a
 * single fixed unit; the controller releases it at either boundary.
 */
export function WhyChooseItExperience({ attributes }: WhyChooseItExperienceProps) {
  const stepCount = Math.min(attributes.length, SCENE_STEPS.length);
  const { containerRef, startRef, endRef, phase, activeStep } = useDiscreteStory({
    stepCount,
    ...STORY_LAYOUT,
  });

  if (attributes.length === 0) return null;

  return (
    <div ref={containerRef} data-story-phase={phase} className="relative">
      <div ref={startRef} aria-hidden="true" className="h-px" />
      <div className="h-[calc(100svh-4rem)] lg:h-[calc(100svh-5rem)]" aria-hidden="true" />
      <div
        className={`top-16 z-10 grid h-[calc(100svh-4rem)] w-full gap-6 lg:top-20 lg:h-[calc(100svh-5rem)] lg:grid-cols-2 lg:items-start lg:gap-16 ${phase === "active" ? "fixed left-0 right-0 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" : "invisible absolute inset-x-0"}`}
      >
        <div className="pointer-events-none col-start-1 row-start-1 order-2 invisible lg:pointer-events-auto lg:visible lg:col-auto lg:row-auto lg:h-full lg:order-1">
          <WhyChooseItAttributesList attributes={attributes} activeStep={activeStep} />
        </div>

        <div className="order-1 z-0 col-start-1 row-start-1 flex h-full flex-col items-center px-1 pt-4 pb-7 lg:col-auto lg:row-auto lg:order-2 lg:justify-center lg:px-0 lg:pt-0 lg:pb-0">
          <WhyChooseItActiveAttributeMobile attributes={attributes} activeStep={activeStep} />
          <div className="min-h-0 w-full flex-1">
            <WhyChooseItScene activeStep={activeStep} />
          </div>
        </div>
      </div>
      <div ref={endRef} aria-hidden="true" className="h-px" />
    </div>
  );
}
