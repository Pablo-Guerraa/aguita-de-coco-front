"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { StoreLocation } from "@/types/store-location";

interface StoreMapProps {
  locations: StoreLocation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isRevealed: boolean;
  prefersReducedMotion: boolean;
}

/** Rough geographic center of Colombia — sensible fallback before bounds fit. */
const DEFAULT_CENTER: [number, number] = [4.711, -74.0721];
const DEFAULT_ZOOM = 6;

/**
 * Builds a small teardrop-shaped pin (plain CSS, no external icon sheet)
 * so the map matches the brand palette instead of Leaflet's default blue
 * marker. The entrance "pop" animation (see .store-pin-animate in
 * globals.css) is staggered per-marker via the `--pin-delay` CSS variable.
 */
function createPinIcon(isSelected: boolean, delayMs: number, shouldAnimate: boolean) {
  const size = isSelected ? 34 : 28;
  const html = `
    <span class="store-pin${shouldAnimate ? " store-pin-animate" : ""}" style="--pin-delay:${delayMs}ms;--pin-size:${size}px;">
      <span class="store-pin-drop${isSelected ? " store-pin-drop-selected" : ""}"></span>
      <span class="store-pin-dot"></span>
    </span>
  `;
  return L.divIcon({
    html,
    className: "store-pin-wrapper",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

/** Keeps the map's viewport in sync with the active filter/selection. */
function MapController({
  locations,
  selectedId,
  prefersReducedMotion,
}: {
  locations: StoreLocation[];
  selectedId: string | null;
  prefersReducedMotion: boolean;
}) {
  const map = useMap();
  const hasFitRef = useRef(false);

  useEffect(() => {
    if (locations.length === 0) return;
    const bounds = L.latLngBounds(
      locations.map((location) => [location.latitude, location.longitude] as [number, number]),
    );
    if (prefersReducedMotion || !hasFitRef.current) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    } else {
      map.flyToBounds(bounds, { padding: [40, 40], maxZoom: 13, duration: 0.7 });
    }
    hasFitRef.current = true;
  }, [locations, map, prefersReducedMotion]);

  useEffect(() => {
    if (!selectedId) return;
    const location = locations.find((item) => item.id === selectedId);
    if (!location) return;
    const targetZoom = Math.max(map.getZoom(), 13);
    if (prefersReducedMotion) {
      map.setView([location.latitude, location.longitude], targetZoom);
    } else {
      map.flyTo([location.latitude, location.longitude], targetZoom, { duration: 0.7 });
    }
  }, [selectedId, locations, map, prefersReducedMotion]);

  return null;
}

export function StoreMap({ locations, selectedId, onSelect, isRevealed, prefersReducedMotion }: StoreMapProps) {
  const shouldAnimatePins = isRevealed && !prefersReducedMotion;

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController locations={locations} selectedId={selectedId} prefersReducedMotion={prefersReducedMotion} />

      {isRevealed &&
        locations.map((location, index) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={createPinIcon(location.id === selectedId, index * 70, shouldAnimatePins)}
            eventHandlers={{ click: () => onSelect(location.id) }}
          >
            <Popup>
              <div className="min-w-[160px] text-sm">
                <p className="font-semibold text-text-primary">{location.name}</p>
                <p className="text-text-secondary">{location.address}</p>
                <p className="text-text-secondary">{location.city}</p>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
