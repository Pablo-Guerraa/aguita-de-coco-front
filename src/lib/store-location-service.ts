import storeLocationsData from "@/data/store-locations.json";
import type { StoreLocation, StoreLocationsResponse } from "@/types/store-location";

/**
 * Simulates a call to a future `/api/store-locations` endpoint.
 *
 * Once the real endpoint exists, replace the body of this function with a
 * `fetch("/api/store-locations")` call (or your data-fetching client of
 * choice) that resolves to the same `StoreLocation[]` shape — the map,
 * list and filter in the "Dónde comprar" section don't need to change.
 */
export async function getStoreLocations(): Promise<StoreLocation[]> {
  const data = storeLocationsData as StoreLocationsResponse;
  return data.locations;
}
