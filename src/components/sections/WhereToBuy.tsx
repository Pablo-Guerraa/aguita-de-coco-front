import { MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStoreLocations } from "@/lib/store-location-service";
import { getWholesaleWhatsAppUrl } from "@/lib/wholesale-service";
import { StoreLocator } from "./where-to-buy/StoreLocator";

/**
 * "Dónde comprar / pedidos" — covers the three ways to get the product:
 * finding a nearby point of sale (map + list, data-driven, see
 * src/lib/store-location-service.ts), ordering directly from the landing
 * (CTA back to #nuestros-productos), and wholesale/distribution inquiries
 * (WhatsApp CTA).
 */
export async function WhereToBuy() {
  const locations = await getStoreLocations();

  return (
    <section
      id="contacto"
      className="relative overflow-hidden bg-surface-green/40 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-lime px-3.5 py-1.5 text-xs font-semibold text-primary-green">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            Dónde comprar
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Encuentra Aguita de Coco cerca de ti
          </h2>
          <p className="mt-3 text-base text-text-secondary sm:text-lg">
            Consulta los puntos de venta disponibles o haz tu pedido directamente desde la página.
          </p>
        </div>

        <div className="mt-10 sm:mt-12">
          <StoreLocator locations={locations} />
        </div>

        {/* Direct order CTA */}
        <div className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-surface px-6 py-6 text-center sm:mt-12 sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm font-medium text-text-primary sm:text-base">
            ¿Prefieres pedir directamente?
          </p>
          <Button asChild className="rounded-full bg-primary-green px-5 hover:bg-primary-dark">
            <a href="#nuestros-productos">Ver productos</a>
          </Button>
        </div>

        {/* Wholesale / distribution block */}
        <div className="mt-8 overflow-hidden rounded-3xl bg-primary-green px-6 py-10 text-center sm:mt-10 sm:px-10 sm:py-12 lg:px-14">
          <h3 className="text-2xl font-bold text-surface sm:text-3xl">¿Tienes un negocio?</h3>
          <p className="mx-auto mt-3 max-w-lg text-sm text-surface/85 sm:text-base">
            Compra al por mayor o lleva nuestros productos a tus clientes.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-6 gap-2 rounded-full bg-accent-lime px-6 text-sm font-semibold text-text-primary hover:bg-accent-lime/90"
          >
            <a href={getWholesaleWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Quiero información
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
