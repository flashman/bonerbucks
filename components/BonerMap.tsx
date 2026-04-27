"use client";

import { useEffect, useRef } from "react";
import { escHtml, formatDate } from "@/lib/utils";

interface SightingPoint {
  lat: number | null;
  lng: number | null;
  location: string;
  created_at: string;
}

interface Props {
  serial: string;
  sightings: SightingPoint[];
}

function serialColor(serial: string): string {
  let hash = 0;
  for (let i = 0; i < serial.length; i++) {
    hash = serial.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 70%, 45%)`;
}

export default function BonerMap({ serial, sightings }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  // Sightings with valid coords, ordered oldest → newest for travel path
  const points = sightings
    .filter((s): s is SightingPoint & { lat: number; lng: number } => s.lat != null && s.lng != null)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || points.length === 0) return;
    let isMounted = true;

    async function initMap() {
      const L = (await import("leaflet")).default;
      if (!isMounted || !mapRef.current) return;

      const coords: [number, number][] = points.map((p) => [p.lat, p.lng]);
      const map = L.map(mapRef.current);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const color = serialColor(serial);

      if (points.length > 1) {
        L.polyline(coords, { color, weight: 2, opacity: 0.7, dashArray: "5, 5" }).addTo(map);
      }

      points.forEach((p, i) => {
        const isFirst = i === 0;
        const isLast = i === points.length - 1;
        const size = isFirst || isLast ? 20 : 14;
        const icon = L.divIcon({
          html: `<div style="font-size:${size}px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.5));">💀</div>`,
          className: "",
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
          popupAnchor: [0, -12],
        });
        const label = isLast && points.length > 1 ? " 📍 latest" : isFirst && points.length > 1 ? " 🏁 first" : "";
        L.marker([p.lat, p.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:monospace;font-size:12px">` +
            `<strong>${serial}</strong>${label}<br/>` +
            `${escHtml(p.location)}<br/>` +
            `${formatDate(p.created_at)}` +
            `</div>`
          );
      });

      map.fitBounds(coords, { padding: [20, 20] });
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (points.length === 0) return null;

  return (
    <div
      ref={mapRef}
      className="w-full h-64 border border-black bg-gray-100"
      aria-label={`Map showing travel path of boner ${serial}`}
    />
  );
}
