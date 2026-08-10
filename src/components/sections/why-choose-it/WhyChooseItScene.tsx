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
    <div className="relative flex h-full w-full flex-col items-center justify-center lg:justify-start lg:pt-4 lg:pb-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-[5%] left-1/2 z-0 w-[72%] max-w-[420px] -translate-x-1/2 blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse at 48% 45%, rgb(216 184 146 / 20%) 0%, rgb(216 184 146 / 15%) 48%, transparent 76%)",
          borderRadius: "46% 54% 43% 57% / 55% 44% 56% 45%",
        }}
      />

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

      <WhyChooseItJet
        opacity={jetOpacity}
        growth={jetGrowth}
        className="z-10 h-14 w-6 shrink-0 sm:h-16 lg:h-auto lg:min-h-24 lg:flex-1"
      />

      <div className="relative z-10 w-[132px] shrink-0 sm:w-[150px] lg:w-[176px]">
        <WhyChooseItBottle
          fillPercent={fillPercent}
          isComplete={complete}
          className="h-auto w-full drop-shadow-lg"
        />
      </div>
    </div>
  );
}
