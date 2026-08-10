import { getWhyChooseItAttributes } from "@/lib/why-choose-it-service";
import { WhyChooseItExperience } from "./why-choose-it/WhyChooseItExperience";

/**
 * "Por qué elegirla" — a scroll-driven story: as the visitor scrolls past
 * each attribute, a sticky coconut+bottle illustration pours water that
 * progressively fills the bottle, finishing right as the last attribute
 * ("Refrigerada") comes into view. Attribute copy is fully data-driven
 * (see src/lib/why-choose-it-service.ts, currently backed by a local JSON
 * file that simulates a future endpoint response).
 */
export async function WhyChooseIt() {
  const attributes = await getWhyChooseItAttributes();

  return (
    <section
      id="por-que-elegirla"
      className="relative bg-surface-green/30 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-surface-lime px-3.5 py-1.5 text-xs font-semibold text-primary-green">
            Por qué elegirla
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Cada detalle, pensado para ti
          </h2>
          <p className="mt-3 text-base text-text-secondary sm:text-lg">
            Texto temporal: descubre lo que hace especial a nuestra agua de coco, un atributo a la vez.
          </p>
        </div>

        <div className="mt-12 sm:mt-14">
          <WhyChooseItExperience attributes={attributes} />
        </div>
      </div>
    </section>
  );
}
