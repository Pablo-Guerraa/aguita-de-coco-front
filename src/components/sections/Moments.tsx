import { getMoments } from "@/lib/moment-service";
import { MomentsGrid } from "./moments/MomentsGrid";

/**
 * "Cómo disfrutarla" — showcases different moments/occasions to enjoy the
 * product through large photographic cards. Content is fully data-driven
 * (see src/lib/moment-service.ts, currently backed by a local JSON file
 * that simulates a future endpoint response); this component just awaits
 * the data and renders the section shell + grid.
 */
export async function Moments() {
  const moments = await getMoments();

  return (
    <section
      id="como-disfrutarla"
      className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-surface-lime px-3.5 py-1.5 text-xs font-semibold text-primary-green">
            Cómo disfrutarla
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Un momento para cada ocasión
          </h2>
          <p className="mt-3 text-base text-text-secondary sm:text-lg">
            Texto temporal invitando a descubrir distintos momentos para disfrutar Aguita de Coco.
          </p>
        </div>

        <MomentsGrid moments={moments} />
      </div>
    </section>
  );
}
