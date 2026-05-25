"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export interface FeaturedBonerData {
  serial: string;
  sighting_count: number;
  image_url: string | null;
  photo_count: number;
  locations: string[];
  notes: (string | null)[];
}

const sans = '"futura","univers","helvetica",sans-serif';

function buildNarrative(locations: string[], notes: (string | null)[]): string {
  if (locations.length === 0) return "";

  if (locations.length === 1) {
    const note = notes[0];
    return note
      ? `First spotted in ${locations[0]}. Someone noted: "${note}"`
      : `First spotted in ${locations[0]}.`;
  }

  const [first, ...rest] = locations;
  let narrative = `First spotted in ${first}.`;

  if (rest.length === 1) {
    narrative += ` Later found in ${rest[0]}.`;
  } else if (rest.length <= 3) {
    const last = rest[rest.length - 1];
    const middle = rest.slice(0, -1).join(", ");
    narrative += ` Also seen in ${middle} and ${last}.`;
  } else {
    narrative += ` Has since passed through ${rest.slice(0, 2).join(", ")}, and ${rest.length - 2} more ${rest.length - 2 === 1 ? "stop" : "stops"}.`;
  }

  const interestingNote = notes.find((n) => n && n.trim().length > 8);
  if (interestingNote) {
    narrative += ` Someone noted: "${interestingNote.trim()}"`;
  }

  return narrative;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FeaturedBoner({ candidates }: { candidates: FeaturedBonerData[] }) {
  // Shuffle once on mount so each visitor sees a different order
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const shuffled = useMemo(() => shuffle(candidates).slice(0, 40), []);
  const [idx, setIdx] = useState(0);

  const next = () => {
    if (shuffled.length <= 1) return;
    setIdx((prev) => (prev + 1) % shuffled.length);
  };

  if (shuffled.length === 0) return null;

  const boner = shuffled[idx];
  const narrative = buildNarrative(boner.locations, boner.notes);

  return (
    <div style={{ border: "1px solid #ccc" }}>

      {/* header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5px 12px",
          borderBottom: "1px solid #ccc",
          background: "#f9f9f9",
        }}
      >
        <span
          style={{
            fontFamily: sans,
            fontWeight: "bold",
            fontSize: 10,
            textTransform: "uppercase" as const,
            letterSpacing: "0.07em",
            color: "#888",
          }}
        >
          A BONER IN THE WILD
        </span>
        {shuffled.length > 1 && (
          <button
            onClick={next}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: sans,
              fontWeight: "bold",
              fontSize: 10,
              textTransform: "uppercase" as const,
              letterSpacing: "0.07em",
              color: "#888",
              padding: 0,
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.color = "black";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.color = "#888";
            }}
          >
            ANOTHER ONE →
          </button>
        )}
      </div>

      {/* body */}
      <div style={{ display: "flex" }}>

        {/* photo */}
        <Link
          href={`/boners/${boner.serial}`}
          style={{
            flexShrink: 0,
            width: "50%",
            background: "#f5f5f5",
            borderRight: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            minHeight: 120,
          }}
        >
          {boner.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={boner.image_url}
              alt={`Boner buck ${boner.serial}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <span style={{ fontSize: 36 }}>💀</span>
          )}
        </Link>

        {/* content */}
        <div style={{ padding: "12px 16px", flex: 1, textAlign: "left" }}>
          <Link
            href={`/boners/${boner.serial}`}
            style={{
              display: "block",
              fontFamily: sans,
              fontWeight: "bold",
              fontSize: 17,
              letterSpacing: "0.05em",
              marginBottom: 7,
              color: "black",
            }}
          >
            {boner.serial}
          </Link>

          {narrative && (
            <p style={{ fontSize: 12, lineHeight: 1.75, color: "#555", margin: "0 0 10px" }}>
              {narrative}
            </p>
          )}

          {/* pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
            <span
              style={{
                fontFamily: sans,
                fontSize: 9,
                fontWeight: "bold",
                border: "1px solid #ccc",
                borderRadius: 20,
                padding: "2px 9px",
                color: "#666",
                textTransform: "uppercase" as const,
                letterSpacing: "0.05em",
              }}
            >
              💀 {boner.sighting_count} {boner.sighting_count === 1 ? "SIGHTING" : "SIGHTINGS"}
            </span>
            {boner.photo_count > 0 && (
              <span
                style={{
                  fontFamily: sans,
                  fontSize: 9,
                  fontWeight: "bold",
                  border: "1px solid #ccc",
                  borderRadius: 20,
                  padding: "2px 9px",
                  color: "#666",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.05em",
                }}
              >
                📸 {boner.photo_count} {boner.photo_count === 1 ? "PHOTO" : "PHOTOS"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* dot navigation */}
      {shuffled.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: 6,
            justifyContent: "center",
            padding: "8px",
            borderTop: "1px solid #ccc",
            background: "#f9f9f9",
          }}
        >
          {shuffled.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Show boner ${i + 1}`}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                border: "none",
                background: i === idx ? "black" : "#ccc",
                padding: 0,
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
