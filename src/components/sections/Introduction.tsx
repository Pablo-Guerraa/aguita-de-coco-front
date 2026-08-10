import { getIntroductionSlides } from "@/lib/introduction-service";
import { IntroductionSlider } from "./introduction/IntroductionSlider";

/**
 * Introduction section — tells a short visual story of how the product is
 * made through an image slider synced with copy. Slide content is fully
 * data-driven (see src/lib/introduction-service.ts): this component just
 * awaits the (currently local, later remote) data and renders the
 * interactive slider client-side.
 */
export async function Introduction() {
  const slides = await getIntroductionSlides();

  return (
    <section
      id="sobre-nosotros"
      className="relative overflow-hidden bg-surface-green/40 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <IntroductionSlider slides={slides} />
      </div>
    </section>
  );
}
