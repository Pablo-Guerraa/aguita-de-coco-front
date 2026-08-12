"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { WhyChooseItBottle } from "./WhyChooseItBottle";
import { WhyChooseItJet } from "./WhyChooseItJet";
import { getSceneStep } from "./why-choose-it-utils";

interface WhyChooseItSceneProps {
  activeStep: number;
}

/**
 * Sticky visual: coconut on top, pouring jet, bottle filling below —
 * entirely driven by the current discrete step, never by its own timer.
 */
export function WhyChooseItScene({ activeStep }: WhyChooseItSceneProps) {
  const scene = getSceneStep(activeStep);
  const complete = scene.coco === "finish";

  return (
    <div className="relative flex h-full w-full items-center justify-center py-3 lg:py-4">
      <div className="relative z-10 flex w-full flex-col items-center justify-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-[5%] left-1/2 z-0 w-[72%] max-w-[420px] -translate-x-1/2 blur-2xl"
          style={{
            background:
              "radial-gradient(ellipse at 48% 45%, rgb(216 184 146 / 20%) 0%, rgb(216 184 146 / 15%) 48%, transparent 76%)",
            borderRadius: "46% 54% 43% 57% / 55% 44% 56% 45%",
          }}
        />

        <div
          className="why-coco-bob relative z-10 w-[88px] shrink-0 will-change-transform sm:w-[104px] lg:w-[140px]"
          role="img"
          aria-label="Coco, la mascota de Aguita de Coco, sirviendo agua de coco fresca"
        >
          <div className="relative aspect-square overflow-hidden">
            <Image
              src="/coco.png"
              alt=""
              fill
              sizes="140px"
              className="object-contain object-center drop-shadow-xl transition-opacity duration-500 ease-out motion-reduce:transition-none"
              style={{
                opacity: scene.coco === "idle" ? 1 : 0,
                transform: "scale(0.96) translateY(1%)",
              }}
            />
            <Image
              src="/coco-pouring.png"
              alt=""
              fill
              sizes="140px"
              className="object-contain object-[48%_52%] drop-shadow-xl transition-opacity duration-500 ease-out motion-reduce:transition-none"
              style={{
                opacity: scene.coco === "pouring" ? 1 : 0,
                transform: "translateX(-1.5%) scale(1.04)",
              }}
            />
            <Image
              src="/coco-finish.png"
              alt=""
              fill
              sizes="140px"
              className="object-contain object-[50%_48%] drop-shadow-xl transition-opacity duration-500 ease-out motion-reduce:transition-none"
              style={{
                opacity: scene.coco === "finish" ? 1 : 0,
                transform: "translateY(1.5%) scale(1.18)",
              }}
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
          opacity={scene.jet ? 1 : 0}
          growth={scene.jet ? 1 : 0}
          className="z-10 h-12 w-6 shrink-0 sm:h-16 lg:h-20"
        />

        <div className="relative z-10 w-[128px] shrink-0 sm:w-[144px] lg:w-[176px]">
          <WhyChooseItBottle
            fillPercent={scene.fill}
            isComplete={complete}
            className="h-auto w-full drop-shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
