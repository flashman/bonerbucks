"use client";

import { useEffect, useRef } from "react";
import type { MapData, MapRecord } from "@/lib/types";
import { escHtml } from "@/lib/utils";

/** Deterministic color from a serial string so each boner gets a consistent line color */
function serialColor(serial: string): string {
  let hash = 0;
  for (let i = 0; i < serial.length; i++) {
    hash = serial.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 45%)`;
}

export default function HomeMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import("leaflet")).default;

      if (!isMounted || !mapRef.current) return;

      const map = L.map(mapRef.current).setView([39.5, -98.35], 4);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const res = await fetch("/api/map");
      if (!res.ok || !isMounted) return;
      const data: MapData = await res.json();

      data.forEach((sightings: MapRecord[]) => {
        if (sightings.length === 0) return;

        const serial = sightings[0].serial;
        const color = serialColor(serial);
        const coords = sightings.map((r) => [r.lat, r.lng] as [number, number]);

        // Draw travel path if the boner has been spotted in more than one place
        if (coords.length > 1) {
          L.polyline(coords, {
            color,
            weight: 2,
            opacity: 0.7,
            dashArray: "5, 5",
          }).addTo(map);
        }

        // Place a marker at each sighting
        sightings.forEach((rec, i) => {
          const isFirst = i === 0;
          const isLast = i === sightings.length - 1;

          // Larger skull for first/last sighting, smaller for intermediate stops
          const size = isFirst || isLast ? 20 : 14;
          const icon = L.divIcon({
            html: `<div style="font-size:${size}px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.5));">💀</div>`,
            className: "",
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
            popupAnchor: [0, -12],
          });

          const imgHtml = rec.thumb_url
            ? `<a href="${rec.large_url}" target="_blank">
                 <img src="${rec.thumb_url}" style="max-width:105px;max-height:45px;display:block;margin-top:4px" />
               </a>`
            : "";

          const label = isLast ? " 📍 latest" : isFirst && sightings.length > 1 ? " 🏁 first" : "";

          const popupContent = `
            <div style="font-family:monospace;font-size:12px;max-width:200px">
              <strong><a href="/boners/${rec.serial}">${rec.serial}</a></strong>${label}<br/>
              ${escHtml(rec.location)}<br/>
              ${rec.date}<br/>
              ${rec.note ? `<em>${escHtml(rec.note)}</em><br/>` : ""}
              ${imgHtml}
            </div>
          `;

          L.marker([rec.lat, rec.lng], { icon, title: rec.serial })
            .addTo(map)
            .bindPopup(popupContent);
        });
      });
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      id="map_canvas"
      className="w-full h-96 border border-black bg-gray-100"
      aria-label="Map of boner sightings"
    />
  );
}
