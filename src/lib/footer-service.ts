import footerData from "@/data/footer.json";
import type { FooterData, FooterResponse } from "@/types/footer";
import { BUSINESS_NAME, WHATSAPP_BUSINESS_NUMBER } from "@/config/business";

export interface FooterViewModel extends Omit<FooterData, "contact"> {
  contact: {
    whatsappUrl: string;
    whatsappLabel: string;
    instagramHandle: string;
    instagramUrl: string;
    email: string;
    emailUrl: string;
  };
}

/**
 * Simulates a call to a future `/api/footer` endpoint. Navigation, contact
 * and legal content live in the local JSON (see src/data/footer.json) while
 * WhatsApp routing is derived from the shared business config, mirroring the
 * pattern used by src/lib/wholesale-service.ts. Once a real endpoint exists,
 * replace the body of this function — the rest of the Footer doesn't change.
 */
export async function getFooterData(): Promise<FooterViewModel> {
  const { footer } = footerData as FooterResponse;
  const message = `Hola ${BUSINESS_NAME}, tengo una consulta.`;

  return {
    ...footer,
    contact: {
      whatsappUrl: `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodeURIComponent(message)}`,
      whatsappLabel: "Escríbenos por WhatsApp",
      instagramHandle: footer.contact.instagramHandle,
      instagramUrl: footer.contact.instagramUrl,
      email: footer.contact.email,
      emailUrl: `mailto:${footer.contact.email}`,
    },
  };
}
