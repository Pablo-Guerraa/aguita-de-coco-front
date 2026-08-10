"use client";

import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StoreLocation } from "@/types/store-location";

/** Entrance stagger (list slides up from below once the section reveals). */
const STAGGER_DELAY_CLASSES = ["delay-0", "delay-75", "delay-150", "delay-200", "delay-300", "delay-300"];

interface StoreListProps {
  locations: StoreLocation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isRevealed: boolean;
}

export function StoreList({ locations, selectedId, onSelect, isRevealed }: StoreListProps) {
  if (locations.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-surface p-6 text-center text-sm text-text-secondary">
        No encontramos puntos de venta para esta ciudad todavía.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3" role="list">
      {locations.map((location, index) => {
        const isSelected = location.id === selectedId;
        const delayClass = STAGGER_DELAY_CLASSES[index % STAGGER_DELAY_CLASSES.length];

        return (
          <li
            key={location.id}
            className={`transition-[opacity,transform] duration-500 ease-out ${delayClass} ${
              isRevealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            {/* A `div` (not `button`) because it wraps a real "Cómo llegar" link;
                nesting an <a> inside a <button> would be invalid HTML. */}
            <div
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={`Ver ${location.name} en el mapa`}
              onClick={() => onSelect(location.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(location.id);
                }
              }}
              className={`cursor-pointer rounded-2xl border p-4 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green sm:p-5 ${
                isSelected
                  ? "border-primary-green bg-surface-green"
                  : "border-border bg-surface hover:border-primary-green/40 hover:bg-surface-green/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <MapPin
                    className={`mt-0.5 h-4 w-4 shrink-0 ${isSelected ? "text-primary-green" : "text-text-secondary"}`}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-text-primary">{location.name}</p>
                    <p className="text-sm text-text-secondary">{location.address}</p>
                    <p className="text-sm text-text-secondary">{location.city}</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-surface-lime px-2.5 py-1 text-xs font-semibold text-primary-green">
                  {location.type}
                </span>
              </div>

              <Button
                asChild
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 gap-1.5 rounded-full"
                onClick={(event) => event.stopPropagation()}
              >
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Cómo llegar a ${location.name}`}
                >
                  <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                  Cómo llegar
                </a>
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
