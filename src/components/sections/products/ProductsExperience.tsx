"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartProvider, useCart } from "@/contexts/CartContext";
import { ProductSelector } from "./ProductSelector";
import { CartDrawer } from "./CartDrawer";
import { CheckoutWizard } from "./CheckoutWizard";
import type { Product } from "@/types/product";

interface ProductsExperienceProps {
  products: Product[];
}

function ProductsExperienceContent({ products }: ProductsExperienceProps) {
  const { itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBumping, setIsBumping] = useState(false);
  const previousCountRef = useRef(itemCount);

  useEffect(() => {
    if (itemCount !== previousCountRef.current) {
      previousCountRef.current = itemCount;
      setIsBumping(true);
      const timeout = setTimeout(() => setIsBumping(false), 480);
      return () => clearTimeout(timeout);
    }
  }, [itemCount]);

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">Nuestros productos</h2>
          <p className="mt-2 max-w-md text-text-secondary">
            Elige tu sabor, la presentación y arma tu pedido en segundos.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className="relative rounded-full"
          onClick={() => setIsCartOpen(true)}
          aria-label={`Ver pedido, ${itemCount} ${itemCount === 1 ? "producto" : "productos"}`}
        >
          <ShoppingCart className="h-5 w-5" aria-hidden="true" />
          {itemCount > 0 && (
            <span
              className={`absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-lime px-1 text-[11px] font-bold text-text-primary ${
                isBumping ? "cart-badge-bump" : ""
              }`}
            >
              {itemCount}
            </span>
          )}
        </Button>
      </div>

      <div className="mt-8">
        <ProductSelector products={products} />
      </div>

      <CartDrawer
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutWizard open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen} />
    </>
  );
}

export function ProductsExperience({ products }: ProductsExperienceProps) {
  return (
    <CartProvider>
      <ProductsExperienceContent products={products} />
    </CartProvider>
  );
}
