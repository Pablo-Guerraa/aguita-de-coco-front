import momentsData from "@/data/moments.json";
import type { MomentCard, MomentsResponse } from "@/types/moment";

/**
 * Simulates a call to a future `/api/moments` endpoint.
 *
 * Once the real endpoint exists, replace the body of this function with a
 * `fetch("/api/moments")` call (or your data-fetching client of choice)
 * that resolves to the same `MomentCard[]` shape — no other part of the
 * "Cómo disfrutarla" section needs to change.
 */
export async function getMoments(): Promise<MomentCard[]> {
  const data = momentsData as MomentsResponse;
  return data.moments;
}
