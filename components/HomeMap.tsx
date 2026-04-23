"use client";

import { useEffect, useRef } from "react";
import type { MapData, MapRecord } from "@/lib/types";

declare global {
  interface Window {
    google: typeof google;
    initBonerbucksMap: () => void;
  }
}

export default function HomeMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const markers: google.maps.marker.AdvancedMarkerElement[] = [];

    async function initMap() {
      if (!mapRef.current) return;

      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

      const map = new Map(mapRef.current, {
        center: { lat: 39.5, lng: -98.35 },
        zoom: 4,
        mapId: "bonerbucks-map",
      });
      mapInstanceRef.current = map;

      // Fetch all sighting data
      const res = await fetch("/api/map");
      if (!res.ok) return;
      const data: MapData = await res.json();

      const infoWindow = new google.maps.InfoWindow();

      data.flat().forEach((rec: MapRecord) => {
        if (!rec.lat || !rec.lng) return;

        const pin = document.createElement("div");
        pin.innerHTML = "📍";
        pin.style.fontSize = "24px";
        pin.style.cursor = "pointer";

        const marker = new AdvancedMarkerElement({
          map,
          position: { lat: rec.lat, lng: rec.lng },
          content: pin,
          title: rec.serial,
        });

        markers.push(marker);

        marker.addListener("click", () => {
          const imgHtml = rec.thumb_url
            ? `<a href="${rec.large_url}" target="_blank">
                <img src="${rec.thumb_url}" style="max-width:105px;max-height:45px" />
               </a>`
            : "";
          infoWindow.setContent(`
            <div style="font-family:monospace;font-size:12px;max-width:200px">
              <strong><a href="/boners/${rec.serial}">${rec.serial}</a></strong><br/>
              ${rec.location}<br/>
              ${rec.date}<br/>
              ${rec.note ? `<em>${rec.note}</em><br/>` : ""}
              ${imgHtml}
            </div>
          `);
          infoWindow.open(map, marker as unknown as google.maps.MVCObject);
        });
      });
    }

    // Load Google Maps script
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    if (window.google?.maps) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=beta&libraries=maps,marker`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      markers.forEach((m) => (m.map = null));
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
