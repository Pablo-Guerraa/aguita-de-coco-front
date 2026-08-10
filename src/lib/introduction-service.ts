import introductionData from "@/data/introduction.json";
import type { IntroductionResponse, IntroductionSlide } from "@/types/introduction";

/**
 * Simulates a call to a future `/api/introduction` endpoint.
 *
 * Once the real endpoint exists, replace the body of this function with a
 * `fetch("/api/introduction")` call (or your data-fetching client of choice)
 * that resolves to the same `IntroductionSlide[]` shape — no other part of
 * the Introduction section needs to change.
 */
export async function getIntroductionSlides(): Promise<IntroductionSlide[]> {
  const data = introductionData as IntroductionResponse;
  return data.slides;
}
