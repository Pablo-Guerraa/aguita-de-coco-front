import Image from "next/image";
import { Leaf } from "lucide-react";

/**
 * Hero section — "Aguita de Coco".
 *
 * Visual composition: a bottle enters from each side while the coconut
 * mascot fades + scales in at the center. Motion is handled entirely with
 * CSS keyframes defined in globals.css (see .hero-bottle-left/right and
 * .hero-coco) so no animation library is needed. Users with
 * `prefers-reduced-motion: reduce` get the final static composition.
 */
export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-x-hidden bg-background py-16 sm:py-20 lg:py-24"
    >
      {/* Decorative organic shapes — subtle, do not compete with the artwork */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-16 -left-16 h-72 w-72 rounded-full bg-accent-lime/20 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-primary-green/10 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-coconut-brown-soft/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-green px-3.5 py-1.5 text-xs font-semibold text-primary-green">
          <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
          Hecha en Colombia · 100% natural
        </span>

        <h1 className="mt-5 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-6xl">
          Frescura de coco, directo del árbol a tu botella
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base text-text-secondary sm:text-lg">
          Sin azúcar añadida, sin conservantes y siempre bien fría.
        </p>

        <div className="mt-7">
          <a
            href="#nuestros-productos"
            className="inline-flex items-center justify-center rounded-full bg-primary-green px-7 py-3.5 text-sm font-semibold text-surface shadow-sm transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green sm:text-base"
          >
            Comprar ahora
            <span className="ml-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4 sm:h-5 sm:w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* Visual composition: bottle — coco — bottle */}
      <div className="relative z-10 mx-auto mt-8 flex w-full max-w-5xl items-end justify-between gap-1 px-2 sm:mt-10 sm:gap-3 md:mt-12 md:gap-6 lg:gap-10">
        <div className="hero-bottle-left w-[92px] shrink-0 will-change-transform sm:w-[125px] md:w-[165px] lg:w-[210px]">
          <div className="relative aspect-[2/3]">
            <Image
              src="/bottle.png"
              alt="Botella de Aguita de Coco entrando desde la izquierda"
              fill
              sizes="(min-width: 1024px) 210px, (min-width: 768px) 165px, (min-width: 640px) 125px, 92px"
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>
        </div>

        <div className="hero-coco relative z-20 w-[150px] shrink-0 will-change-transform sm:w-[190px] md:w-[240px] lg:w-[300px]">
          <div className="relative aspect-square">
            <Image
              src="/coco.png"
              alt="Coco, la mascota de Aguita de Coco, sosteniendo un coco con pitillo"
              fill
              sizes="(min-width: 1024px) 300px, (min-width: 768px) 240px, (min-width: 640px) 190px, 150px"
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        <div className="hero-bottle-right w-[92px] shrink-0 will-change-transform sm:w-[125px] md:w-[165px] lg:w-[210px]">
          <div className="relative aspect-[2/3]">
            <Image
              src="/bottle.png"
              alt="Botella de Aguita de Coco entrando desde la derecha"
              fill
              sizes="(min-width: 1024px) 210px, (min-width: 768px) 165px, (min-width: 640px) 125px, 92px"
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
