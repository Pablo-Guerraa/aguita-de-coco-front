"use client";

import { useScrollSteps } from "@/hooks/useScrollProgress";
import type { WhyChooseItAttribute } from "@/types/why-choose-it";
import { WhyChooseItActiveAttributeMobile } from "./WhyChooseItActiveAttributeMobile";
import { WhyChooseItAttributesList } from "./WhyChooseItAttributesList";
import { WhyChooseItScene } from "./WhyChooseItScene";
import { SCENE_STEPS } from "./why-choose-it-utils";

/** Matches the sticky header's height (h-16 = 64px) plus a little
 * breathing room, so the pinned scene never sits flush under the header. */
const STICKY_OFFSET_PX = 80;

interface WhyChooseItExperienceProps {
  attributes: WhyChooseItAttribute[];
}

/**
 * The wrapper owns the story's scroll height, while both the active copy
 * and the coconut+bottle scene stay pinned and update from the same step.
 * One complete gesture advances at most one discrete story step.
 */
export function WhyChooseItExperience({ attributes }: WhyChooseItExperienceProps) {
  const stepCount = Math.min(attributes.length, SCENE_STEPS.length);
  const { ref, activeStep } = useScrollSteps<HTMLDivElement>(stepCount, STICKY_OFFSET_PX);

  if (attributes.length === 0) return null;

  return (
    <div
      ref={ref}
      className="grid min-h-[220vh] gap-6 sm:min-h-[250vh] lg:min-h-[360vh] lg:grid-cols-2 lg:items-start lg:gap-16"
    >
      <div className="pointer-events-none col-start-1 row-start-1 order-2 invisible lg:pointer-events-auto lg:visible lg:sticky lg:top-20 lg:col-auto lg:row-auto lg:h-[calc(100svh-6rem)] lg:order-1">
        <WhyChooseItAttributesList attributes={attributes} activeStep={activeStep} />
      </div>

      <div className="order-1 top-16 z-0 col-start-1 row-start-1 flex h-[calc(100svh-4rem)] flex-col items-center px-1 pt-4 pb-7 sticky lg:top-20 lg:col-auto lg:row-auto lg:h-[calc(100svh-6rem)] lg:order-2 lg:justify-center lg:px-0 lg:pt-0 lg:pb-0">
        <WhyChooseItActiveAttributeMobile attributes={attributes} activeStep={activeStep} />
        <div className="min-h-0 w-full flex-1">
          <WhyChooseItScene activeStep={activeStep} />
        </div>
      </div>
    </div>
  );
}
