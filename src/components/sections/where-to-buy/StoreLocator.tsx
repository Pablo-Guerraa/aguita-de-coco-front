"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
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
const ALL_NEIGHBORHOODS_VALUE = "all";

interface StoreLocatorProps {
  locations: StoreLocation[];
}

export function StoreLocator({ locations }: StoreLocatorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCity, setActiveCity] = useState<string>(ALL_CITIES_VALUE);
  const [activeNeighborhood, setActiveNeighborhood] = useState<string>(ALL_NEIGHBORHOODS_VALUE);
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

  const neighborhoods = useMemo(() => {
    if (activeCity === ALL_CITIES_VALUE) return [];
    return Array.from(
      new Set(
        locations
          .filter((location) => location.city === activeCity)
          .map((location) => location.neighborhood),
      ),
    ).sort((a, b) => a.localeCompare(b, "es"));
  }, [locations, activeCity]);

  const filteredLocations = useMemo(
    () =>
      locations.filter(
        (location) =>
          (activeCity === ALL_CITIES_VALUE || location.city === activeCity) &&
          (activeNeighborhood === ALL_NEIGHBORHOODS_VALUE ||
            location.neighborhood === activeNeighborhood),
      ),
    [locations, activeCity, activeNeighborhood],
  );

  const handleSelectCity = (value: string) => {
    if (!value) return;
    setActiveCity(value);
    setActiveNeighborhood(ALL_NEIGHBORHOODS_VALUE);
    if (
      selectedId &&
      value !== ALL_CITIES_VALUE &&
      !locations.some(
        (location) => location.id === selectedId && location.city === value,
      )
    ) {
      setSelectedId(null);
    }
  };

  const handleSelectNeighborhood = (value: string) => {
    setActiveNeighborhood(value);
    if (
      selectedId &&
      !locations.some(
        (location) =>
          location.id === selectedId &&
          (activeCity === ALL_CITIES_VALUE || location.city === activeCity) &&
          (value === ALL_NEIGHBORHOODS_VALUE || location.neighborhood === value),
      )
    ) {
      setSelectedId(null);
    }
  };

  return (
    <div ref={rootRef}>
      <div className="mx-auto mb-6 grid max-w-xl gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
          Ciudad
          <select
            value={activeCity}
            onChange={(event) => handleSelectCity(event.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-surface px-3 font-normal outline-none transition focus:border-primary-green focus:ring-2 focus:ring-primary-green/20"
          >
            <option value={ALL_CITIES_VALUE}>Todas las ciudades</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-text-primary">
          Barrio o zona
          <select
            value={activeNeighborhood}
            onChange={(event) => handleSelectNeighborhood(event.target.value)}
            disabled={activeCity === ALL_CITIES_VALUE}
            className="h-11 w-full rounded-xl border border-border bg-surface px-3 font-normal outline-none transition focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value={ALL_NEIGHBORHOODS_VALUE}>Todos los barrios</option>
            {neighborhoods.map((neighborhood) => (
              <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
            ))}
          </select>
        </label>
      </div>

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
