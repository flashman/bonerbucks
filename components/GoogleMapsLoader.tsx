"use client";

import { useEffect, useState } from "react";

export default function GoogleMapsLoader({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(
    typeof window !== "undefined" && !!(window as Window & typeof globalThis & { google?: unknown }).google
  );

  useEffect(() => {
    if (loaded) return;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) { setLoaded(true); return; }

    const existing = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existing) { setLoaded(true); return; }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=places,geocoding`;
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, [loaded]);

  if (!loaded) return <p className="text-sm text-gray-500">Loading maps...</p>;
  return <>{children}</>;
}
