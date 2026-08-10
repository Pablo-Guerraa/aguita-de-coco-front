"use client";

import Image from "next/image";
import { ShoppingCart, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { QuantityStepper } from "./QuantityStepper";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/currency";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckout: () => void;
}

export function CartDrawer({ open, onOpenChange, onCheckout }: CartDrawerProps) {
  const { items, itemCount, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full! flex-col gap-0 p-0 sm:max-w-md!"
      >
        <SheetHeader className="border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            Tu pedido {itemCount > 0 && `(${itemCount})`}
          </SheetTitle>
          <SheetDescription>Revisa tus productos antes de continuar.</SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
            <ShoppingCart className="h-8 w-8 text-text-secondary" aria-hidden="true" />
            <p className="text-sm text-text-secondary">Todavía no has agregado productos.</p>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <ul className="flex flex-col divide-y divide-border px-4 sm:px-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 py-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-lime">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      sizes="64px"
                      className="object-contain p-1.5"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{item.productName}</p>
                        <p className="text-xs text-text-secondary">{item.presentationLabel}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Eliminar ${item.productName} del pedido`}
                        onClick={() => removeItem(item.id)}
                        className="text-text-secondary hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <QuantityStepper
                        value={item.quantity}
                        onChange={(next) => updateQuantity(item.id, next)}
                        label={`${item.productName} ${item.presentationLabel}`}
                      />
                      <span className="text-sm font-semibold text-text-primary">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}

        <SheetFooter className="border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Subtotal</span>
            <span className="font-semibold text-text-primary">{formatCurrency(subtotal)}</span>
          </div>
          <Separator className="my-1" />
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-text-primary">Total</span>
            <span className="text-lg font-bold text-text-primary">{formatCurrency(subtotal)}</span>
          </div>
          <Button
            type="button"
            size="lg"
            className="mt-2 h-11 rounded-full bg-primary-green text-sm font-semibold text-surface hover:bg-primary-dark"
            disabled={items.length === 0}
            onClick={onCheckout}
          >
            Continuar pedido
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
