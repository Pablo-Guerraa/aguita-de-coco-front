import whyChooseItData from "@/data/why-choose-it.json";
import type { WhyChooseItAttribute, WhyChooseItResponse } from "@/types/why-choose-it";

/**
 * Simulates a call to a future `/api/why-choose-it` endpoint.
 *
 * Once the real endpoint exists, replace the body of this function with a
 * `fetch("/api/why-choose-it")` call (or your data-fetching client of
 * choice) that resolves to the same `WhyChooseItAttribute[]` shape — no
 * other part of the "Por qué elegirla" section needs to change.
 */
export async function getWhyChooseItAttributes(): Promise<WhyChooseItAttribute[]> {
  const data = whyChooseItData as WhyChooseItResponse;
  return data.attributes;
}
