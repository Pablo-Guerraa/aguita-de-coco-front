"use client";

import type { WhyChooseItAttribute } from "@/types/why-choose-it";
import { ATTRIBUTE_ICONS } from "./WhyChooseItAttributesList";
import { getActiveAttributeIndex } from "./why-choose-it-utils";

interface WhyChooseItActiveAttributeMobileProps {
  attributes: WhyChooseItAttribute[];
  progress: number;
}

/** Compact, cross-fading copy for the mobile sticky story. */
export function WhyChooseItActiveAttributeMobile({
  attributes,
  progress,
}: WhyChooseItActiveAttributeMobileProps) {
  const activeIndex = getActiveAttributeIndex(progress, attributes.length);

  return (
    <div className="grid w-full shrink-0 lg:hidden">
      {attributes.map((attribute, index) => {
        const Icon = ATTRIBUTE_ICONS[index % ATTRIBUTE_ICONS.length];
        const isActive = index === activeIndex;

        return (
          <div
            key={attribute.id}
            aria-hidden={!isActive}
            className={`col-start-1 row-start-1 flex items-start gap-3 transition-[opacity,transform] duration-500 ease-out ${
              isActive
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-1.5 opacity-0"
            }`}
          >
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-green text-surface">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 pt-0.5">
              <h3 className="text-xl font-bold leading-tight text-text-primary sm:text-2xl">
                {attribute.title}
              </h3>
              <p className="mt-1 text-sm leading-snug text-text-secondary sm:text-base">
                {attribute.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
