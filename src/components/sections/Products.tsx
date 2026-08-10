import { getProducts } from "@/lib/product-service";
import { ProductsExperience } from "./products/ProductsExperience";

/**
 * "Productos y sabores" — an interactive catalog where visitors pick a
 * flavor, a presentation, a quantity and build an order that they can
 * check out via a cart drawer + form wizard, finishing on WhatsApp.
 * Product data is fully data-driven (see src/lib/product-service.ts).
 */
export async function Products() {
  const products = await getProducts();

  return (
    <section id="nuestros-productos" className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ProductsExperience products={products} />
      </div>
    </section>
  );
}
