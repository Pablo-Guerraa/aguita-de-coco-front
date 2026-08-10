import type { OrderPayload } from "@/types/cart";
import { formatCurrency } from "@/lib/currency";
import { WHATSAPP_BUSINESS_NUMBER } from "@/config/business";

/** Builds a human-friendly, WhatsApp-formatted summary of the order. */
export function buildOrderMessage(order: OrderPayload): string {
  const lines: string[] = [];

  lines.push("*Nuevo pedido - Aguita de Coco*");
  lines.push("");
  lines.push("*Productos:*");
  for (const item of order.items) {
    lines.push(
      `• ${item.productName} (${item.presentationLabel}) x${item.quantity} — ${formatCurrency(
        item.unitPrice * item.quantity,
      )}`,
    );
  }
  lines.push("");
  lines.push(`*Total: ${formatCurrency(order.subtotal)}*`);
  lines.push("");
  lines.push("*Datos del cliente:*");
  lines.push(`Nombre: ${order.customer.name}`);
  lines.push(`Teléfono: ${order.customer.phone}`);
  if (order.customer.email) {
    lines.push(`Correo: ${order.customer.email}`);
  }
  lines.push("");
  lines.push("*Entrega:*");
  lines.push(`Ciudad: ${order.delivery.city}`);
  lines.push(`Dirección: ${order.delivery.address}`);
  lines.push(`Barrio: ${order.delivery.neighborhood}`);
  if (order.delivery.notes) {
    lines.push(`Info. adicional: ${order.delivery.notes}`);
  }

  return lines.join("\n");
}

export function getWhatsAppOrderUrl(order: OrderPayload): string {
  const message = buildOrderMessage(order);
  return `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Submits the order.
 *
 * There is no backend yet, so this simply opens WhatsApp with a pre-filled
 * message addressed to the business. Once a real endpoint exists, replace
 * the body of this function with something like:
 *
 *   await fetch("/api/orders", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(order),
 *   });
 *
 * The rest of the checkout flow (validation, wizard, cart) does not need
 * to change.
 */
export async function submitOrder(order: OrderPayload): Promise<{ whatsappUrl: string }> {
  const whatsappUrl = getWhatsAppOrderUrl(order);
  if (typeof window !== "undefined") {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }
  return { whatsappUrl };
}
