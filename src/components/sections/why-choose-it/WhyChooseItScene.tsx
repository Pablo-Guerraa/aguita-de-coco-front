"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { WhyChooseItBottle } from "./WhyChooseItBottle";
import { WhyChooseItJet } from "./WhyChooseItJet";
import {
  getFillPercent,
  getJetGrowth,
  getJetOpacity,
  isFillComplete,
} from "./why-choose-it-utils";

interface WhyChooseItSceneProps {
  progress: number;
}

/**
 * Sticky visual: coconut on top, pouring jet, bottle filling below —
 * entirely driven by `progress` (0→1), never by its own timer.
 */
export function WhyChooseItScene({ progress }: WhyChooseItSceneProps) {
  const fillPercent = getFillPercent(progress);
  const jetOpacity = getJetOpacity(progress);
  const jetGrowth = getJetGrowth(progress);
  const complete = isFillComplete(progress);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="why-coco-bob relative z-10 w-[104px] shrink-0 will-change-transform sm:w-[120px] lg:w-[140px]">
        <div className="relative aspect-square">
          <Image
            src="/coco.png"
            alt="Coco, la mascota de Aguita de Coco, sirviendo agua de coco fresca"
            fill
            sizes="140px"
            className="object-contain drop-shadow-xl"
          />
        </div>
        {complete && (
          <Sparkles
            aria-hidden="true"
            className="why-freshness-sparkle absolute top-0 -right-2 h-5 w-5 text-accent-lime"
          />
        )}
      </div>

      <WhyChooseItJet opacity={jetOpacity} growth={jetGrowth} className="h-14 w-6 sm:h-16 lg:h-20" />

      <div className="w-[132px] shrink-0 sm:w-[150px] lg:w-[176px]">
        <WhyChooseItBottle
          fillPercent={fillPercent}
          isComplete={complete}
          className="h-auto w-full drop-shadow-lg"
        />
      </div>
    </div>
  );
}
