import productsData from "@/data/products.json";
import type { Product, ProductsResponse } from "@/types/product";

/**
 * Simulates a call to a future `/api/products` endpoint.
 *
 * Once the real endpoint exists, replace the body with a `fetch(...)` call
 * that resolves to the same `Product[]` shape — no other part of the
 * Products section needs to change.
 */
export async function getProducts(): Promise<Product[]> {
  const data = productsData as ProductsResponse;
  return data.products;
}
