/**
 * A physical point of sale where the product can be purchased. Powers the
 * map + list in the "Dónde comprar" section.
 */
export interface StoreLocation {
  id: string;
  name: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  /** Short category label, e.g. "Supermercado", "Tienda naturista". */
  type: string;
  availableProducts: string[];
}

export interface StoreLocationsResponse {
  locations: StoreLocation[];
}
