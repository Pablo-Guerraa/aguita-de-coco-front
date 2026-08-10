"use client";

import { Leaf, Salad, ShieldCheck, Snowflake, Sprout, type LucideIcon } from "lucide-react";
import type { WhyChooseItAttribute } from "@/types/why-choose-it";
import { getActiveAttributeIndex } from "./why-choose-it-utils";

/** One icon per attribute, in order. Falls back to cycling if more
 * attributes are ever added than icons defined here. */
const ATTRIBUTE_ICONS: LucideIcon[] = [Sprout, Leaf, ShieldCheck, Salad, Snowflake];

interface WhyChooseItAttributesListProps {
  attributes: WhyChooseItAttribute[];
  progress: number;
}

export function WhyChooseItAttributesList({
  attributes,
  progress,
}: WhyChooseItAttributesListProps) {
  const activeIndex = getActiveAttributeIndex(progress, attributes.length);

  return (
    <div className="relative flex flex-col">
      {/* Timeline track + progress dot — desktop only, purely decorative */}
      <div aria-hidden="true" className="absolute top-2 bottom-2 left-3 hidden w-px bg-border lg:block">
        <div
          className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-green shadow-[0_0_0_4px_var(--color-surface-green)] transition-[top] duration-150 ease-out"
          style={{ top: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      {attributes.map((attribute, index) => {
        const Icon = ATTRIBUTE_ICONS[index % ATTRIBUTE_ICONS.length];
        const isActive = index === activeIndex;

        return (
          <div
            key={attribute.id}
            className="flex min-h-[44vh] flex-col justify-center py-8 pl-10 sm:min-h-[50vh] lg:min-h-[72vh] lg:py-0 lg:pl-12"
          >
            <div
              className={`max-w-md transition-[opacity,transform] duration-500 ease-out ${
                isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-45"
              }`}
            >
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-500 ${
                  isActive ? "bg-primary-green text-surface" : "bg-surface-green text-primary-green"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-2xl font-bold text-text-primary sm:text-3xl">
                {attribute.title}
              </h3>
              <p className="mt-2 text-base text-text-secondary sm:text-lg">{attribute.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
