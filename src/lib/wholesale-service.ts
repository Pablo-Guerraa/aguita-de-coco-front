import { WHATSAPP_BUSINESS_NUMBER, BUSINESS_NAME } from "@/config/business";

/**
 * Builds a WhatsApp deep link pre-filled with a wholesale/distribution
 * inquiry message. There is no backend yet, so this simply opens WhatsApp
 * — once a real contact endpoint/form exists, swap out the body of this
 * function without touching the calling component.
 */
export function getWholesaleWhatsAppUrl(): string {
  const message = `Hola ${BUSINESS_NAME}, estoy interesado en comprar al por mayor / distribuir sus productos. ¿Me pueden dar más información?`;
  return `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodeURIComponent(message)}`;
}
