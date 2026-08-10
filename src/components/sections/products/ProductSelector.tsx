"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { QuantityStepper } from "./QuantityStepper";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/currency";
import type { Product } from "@/types/product";

interface ProductSelectorProps {
  products: Product[];
}

export function ProductSelector({ products }: ProductSelectorProps) {
  const { addItem } = useCart();

  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? "");
  const [selectedPresentationId, setSelectedPresentationId] = useState(
    products[0]?.presentations[0]?.id ?? "",
  );
  const [quantity, setQuantity] = useState(1);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) ?? products[0],
    [products, selectedProductId],
  );

  const selectedPresentation = useMemo(
    () =>
      selectedProduct?.presentations.find(
        (presentation) => presentation.id === selectedPresentationId,
      ) ?? selectedProduct?.presentations[0],
    [selectedProduct, selectedPresentationId],
  );

  if (!selectedProduct || !selectedPresentation) return null;

  const lineTotal = selectedPresentation.price * quantity;

  const handleSelectProduct = (productId: string) => {
    if (!productId) return;
    setSelectedProductId(productId);
    const product = products.find((item) => item.id === productId);
    const stillValid = product?.presentations.some((p) => p.id === selectedPresentationId);
    if (!stillValid) {
      setSelectedPresentationId(product?.presentations[0]?.id ?? "");
    }
  };

  const handleAddToCart = () => {
    addItem(
      {
        id: `${selectedProduct.id}:${selectedPresentation.id}`,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        presentationId: selectedPresentation.id,
        presentationLabel: selectedPresentation.label,
        unitPrice: selectedPresentation.price,
        image: selectedProduct.image,
      },
      quantity,
    );

    toast.success(`${selectedProduct.name} agregado al pedido`, {
      description: `${selectedPresentation.label} · x${quantity} · ${formatCurrency(lineTotal)}`,
    });

    setQuantity(1);
  };

  return (
    <div
      className="grid items-start gap-10 rounded-3xl border border-border bg-surface p-5 sm:p-8 lg:grid-cols-2 lg:gap-14 lg:p-10"
      style={{ ["--flavor-accent" as string]: selectedProduct.accentColor }}
    >
      {/* Visual preview — remounts (via key) on flavor/presentation change to replay the entrance transition */}
      <div
        key={`${selectedProduct.id}-${selectedPresentation.id}`}
        className="flavor-fade-in flex flex-col items-center gap-4"
      >
        <div className="relative flex aspect-square w-full max-w-xs items-center justify-center overflow-hidden rounded-2xl bg-(--flavor-accent)/8">
          <div
            className="relative h-4/5 w-4/5"
            style={{ transform: `scale(${selectedPresentation.sizeScale ?? 1})` }}
          >
            <Image
              src={selectedProduct.image}
              alt={`Botella de Aguita de Coco sabor ${selectedProduct.name}, presentación ${selectedPresentation.label}`}
              fill
              sizes="320px"
              className="object-contain drop-shadow-lg"
            />
          </div>
          <span className="absolute top-3 right-3 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-text-primary shadow-sm">
            {selectedPresentation.label}
          </span>
        </div>

        <div className="text-center">
          <span className="text-xs font-semibold tracking-wide text-(--flavor-accent) uppercase">
            {selectedProduct.name}
          </span>
          <p className="mx-auto mt-1 max-w-xs text-sm text-text-secondary">
            {selectedProduct.shortDescription}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-6">
        <div>
          <span className="text-sm font-semibold text-text-primary">Sabor</span>
          <ToggleGroup
            type="single"
            value={selectedProductId}
            onValueChange={handleSelectProduct}
            variant="outline"
            className="mt-2 flex-wrap justify-start gap-2"
          >
            {products.map((product) => (
              <ToggleGroupItem
                key={product.id}
                value={product.id}
                className="gap-2 rounded-full border-border px-3.5 data-[state=on]:border-(--flavor-accent) data-[state=on]:bg-(--flavor-accent)/10 data-[state=on]:text-text-primary"
                style={{ ["--flavor-accent" as string]: product.accentColor }}
                aria-label={`Sabor ${product.name}`}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: product.accentColor }}
                  aria-hidden="true"
                />
                {product.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div>
          <span className="text-sm font-semibold text-text-primary">Presentación</span>
          <ToggleGroup
            type="single"
            value={selectedPresentationId}
            onValueChange={(value) => value && setSelectedPresentationId(value)}
            variant="outline"
            className="mt-2 justify-start gap-2"
          >
            {selectedProduct.presentations.map((presentation) => (
              <ToggleGroupItem
                key={presentation.id}
                value={presentation.id}
                className="rounded-full border-border px-4 data-[state=on]:border-primary-green data-[state=on]:bg-surface-green data-[state=on]:text-primary-green"
              >
                {presentation.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
          <div>
            <span className="text-sm font-semibold text-text-primary">Cantidad</span>
            <div className="mt-2">
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                label={selectedProduct.name}
              />
            </div>
          </div>

          <div className="text-right">
            <span className="block text-xs text-text-secondary">Total</span>
            <span className="text-xl font-bold text-text-primary">{formatCurrency(lineTotal)}</span>
          </div>
        </div>

        <Button
          type="button"
          size="lg"
          className="h-11 gap-2 rounded-full bg-primary-green px-6 text-sm font-semibold text-surface hover:bg-primary-dark"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          Agregar al pedido
        </Button>
      </div>
    </div>
  );
}
