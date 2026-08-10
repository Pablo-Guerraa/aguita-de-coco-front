import { Palmtree } from "lucide-react";

/**
 * Placeholder brand logo.
 * Replace the icon badge and/or wordmark below with the final
 * logo asset (e.g. an <Image> or inline SVG) when it becomes available.
 */
export function Logo() {
  return (
    <a
      href="#inicio"
      aria-label="Aguita de Coco - Ir al inicio"
      className="flex items-center gap-2"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-green text-surface">
        <Palmtree className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-lg font-bold tracking-tight text-text-primary">
        Aguita <span className="text-primary-green">de Coco</span>
      </span>
    </a>
  );
}
