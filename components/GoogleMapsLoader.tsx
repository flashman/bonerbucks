"use client";

// Google Maps has been replaced with Leaflet + OpenStreetMap.
// This component is kept as a passthrough so the pages that wrap
// RecordForm with it don't need to change. It can be removed
// along with its usages once you're done cleaning up.
export default function GoogleMapsLoader({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

