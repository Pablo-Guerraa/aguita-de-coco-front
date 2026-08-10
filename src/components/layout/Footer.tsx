import { getFooterData } from "@/lib/footer-service";
import { FooterContent } from "./footer/FooterContent";

/**
 * Landing page footer — brand, navigation, contact, wholesale CTA and the
 * legal bottom bar. Content is fully data-driven (see
 * src/lib/footer-service.ts, currently backed by a local JSON file that
 * simulates a future endpoint response); this component just awaits the
 * data and hands it off to the interactive (entrance-animated) client shell.
 */
export async function Footer() {
  const footer = await getFooterData();

  return <FooterContent footer={footer} />;
}
