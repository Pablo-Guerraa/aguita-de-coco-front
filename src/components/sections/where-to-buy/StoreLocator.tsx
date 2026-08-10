"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { StoreList } from "./StoreList";
import type { StoreLocation } from "@/types/store-location";

// Leaflet touches `window`/`document` at import time, so the map must be
// loaded client-side only.
const StoreMap = dynamic(() => import("./StoreMap").then((module) => module.StoreMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-surface-green text-sm text-text-secondary">
      Cargando mapa…
    </div>
  ),
});

const ALL_CITIES_VALUE = "all";

interface StoreLocatorProps {
  locations: StoreLocation[];
}

export function StoreLocator({ locations }: StoreLocatorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCity, setActiveCity] = useState<string>(ALL_CITIES_VALUE);
  const [isRevealed, setIsRevealed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Reveal the map + list once, the first time the locator nears the viewport.
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const cities = useMemo(
    () => Array.from(new Set(locations.map((location) => location.city))).sort(),
    [locations],
  );

  const filteredLocations = useMemo(
    () =>
      activeCity === ALL_CITIES_VALUE
        ? locations
        : locations.filter((location) => location.city === activeCity),
    [locations, activeCity],
  );

  const handleSelectCity = (value: string) => {
    if (!value) return;
    setActiveCity(value);
    setSelectedId(null);
  };

  return (
    <div ref={rootRef}>
      {cities.length > 1 && (
        <ToggleGroup
          type="single"
          value={activeCity}
          onValueChange={handleSelectCity}
          variant="outline"
          className="mb-6 flex-wrap justify-center gap-2"
          aria-label="Filtrar puntos de venta por ciudad"
        >
          <ToggleGroupItem
            value={ALL_CITIES_VALUE}
            className="rounded-full border-border px-4 data-[state=on]:border-primary-green data-[state=on]:bg-surface-green data-[state=on]:text-primary-green"
          >
            Todas las ciudades
          </ToggleGroupItem>
          {cities.map((city) => (
            <ToggleGroupItem
              key={city}
              value={city}
              className="rounded-full border-border px-4 data-[state=on]:border-primary-green data-[state=on]:bg-surface-green data-[state=on]:text-primary-green"
            >
              {city}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-6">
        {/* Map — shown first on mobile; fades + scales in very subtly. */}
        <div
          className={`order-1 h-[320px] overflow-hidden rounded-3xl shadow-md ring-1 ring-border/60 transition-[opacity,transform] duration-700 ease-out sm:h-[400px] lg:sticky lg:top-24 lg:order-none lg:h-[520px] ${
            isRevealed ? "scale-100 opacity-100" : "scale-[0.97] opacity-0"
          }`}
        >
          <StoreMap
            locations={filteredLocations}
            selectedId={selectedId}
            onSelect={setSelectedId}
            isRevealed={isRevealed}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>

        {/* List — enters from below, staggered. */}
        <div className="order-2 lg:order-none">
          <StoreList
            locations={filteredLocations}
            selectedId={selectedId}
            onSelect={setSelectedId}
            isRevealed={isRevealed}
          />
        </div>
      </div>
    </div>
  );
}
