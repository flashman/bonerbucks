"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { normaliseSerial, isValidSerial, MAX_IMAGE_BYTES } from "@/lib/utils";
import type { Record as BRecord } from "@/lib/types";

interface Props {
  /** Pre-fill serial (from URL param on /boners/new/[serial]) */
  initialSerial?: string;
  /** Editing mode — pass the existing record */
  record?: BRecord;
  /** Where to redirect after success */
  redirectTo?: string;
}

export default function RecordForm({ initialSerial = "", record, redirectTo }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!record;

  const [serial, setSerial] = useState(record?.serial ?? initialSerial);
  const [location, setLocation] = useState(record?.location ?? "");
  const [lat, setLat] = useState<number | "">(record?.lat ?? "");
  const [lng, setLng] = useState<number | "">(record?.lng ?? "");
  const [note, setNote] = useState(record?.note ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  /** Geocode the typed city using Nominatim (OpenStreetMap) */
  async function geocodeLocation(value: string) {
    if (!value.trim()) return;
    setGeocoding(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(value)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data?.lat && data?.lng) {
        setLat(parseFloat(data.lat.toFixed(6)));
        setLng(parseFloat(data.lng.toFixed(6)));
      }
    } catch {
      // silently ignore geocoding failures
    } finally {
      setGeocoding(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const normSerial = normaliseSerial(serial);
    if (!isValidSerial(normSerial)) {
      setError("SERIAL FORMAT IS INVALID. MUST BE ONE LETTER, 8 DIGITS, ONE LETTER (E.G. A12345678B).");
      return;
    }
    if (!location.trim()) { setError("CITY IS REQUIRED."); return; }
    if (lat === "" || lng === "") { setError("LAT/LNG IS REQUIRED. MAKE SURE YOUR CITY AUTO-GEOCODED."); return; }
    if (imageFile && imageFile.size > MAX_IMAGE_BYTES) {
      setError("IMAGE IS TOO LARGE. MAX SIZE IS 500KB.");
      return;
    }

    setLoading(true);
    try {
      let imagePath: string | undefined;

      // Upload image to Supabase Storage
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("record-images")
          .upload(path, imageFile, { contentType: imageFile.type, upsert: false });
        if (uploadErr) { setError("IMAGE UPLOAD FAILED: " + uploadErr.message.toUpperCase()); return; }
        imagePath = path;
      }

      const body = {
        serial: normSerial,
        location: location.trim(),
        lat: Number(lat),
        lng: Number(lng),
        note: note.trim() || null,
        ...(imagePath !== undefined ? { image_path: imagePath } : {}),
      };

      const url = isEdit ? `/api/records/${record!.id}` : "/api/records";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) {
        setError((json.error ?? "SOMETHING WENT WRONG").toUpperCase());
        return;
      }

      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push(`/boners/${normSerial}`);
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
      {error && <p className="error" style={{ marginBottom: 10 }}>{error}</p>}

      <div className="field-row">
        <h4>SERIAL:</h4>
        <input
          type="text"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          placeholder="A12345678B"
          maxLength={10}
          disabled={isEdit}
          required
          style={{ fontFamily: "verdana", fontSize: 14, border: "1px solid #999", padding: "2px 4px", width: 200, textTransform: "uppercase" }}
        />
        <p style={{ fontSize: 11, color: "#777", marginTop: 2 }}>Format: one letter, 8 digits, one letter</p>
      </div>

      <div className="field-row">
        <h4>CITY:</h4>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onBlur={(e) => geocodeLocation(e.target.value)}
          placeholder="Oakland, CA"
          required
          style={{ fontFamily: "verdana", fontSize: 14, border: "1px solid #999", padding: "2px 4px", width: 300 }}
        />
        {geocoding && <span style={{ fontSize: 11, color: "#777", marginLeft: 8 }}>GEOCODING...</span>}
        {lat !== "" && !geocoding && <span style={{ fontSize: 11, color: "green", marginLeft: 8 }}>✓ LOCATED</span>}
        {lat !== "" && <p style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{Number(lat).toFixed(4)}, {Number(lng).toFixed(4)}</p>}
      </div>

      <div className="field-row">
        <h4>NOTES (IF YOU WANT):</h4>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ fontFamily: "verdana", fontSize: 14, border: "1px solid #999", padding: "2px 4px", width: 500, height: 100 }}
          placeholder="Tell us about this boner..."
        />
      </div>

      <div className="field-row">
        <h4>IMAGE (IF YOU WANT... MAX SIZE IS 500KB):</h4>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ fontFamily: "verdana", fontSize: 13 }}
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        />
        {record?.image_path && !imageFile && (
          <p style={{ fontSize: 11, color: "#777", marginTop: 2 }}>Current image on file. Upload a new one to replace it.</p>
        )}
      </div>

      <br />
      <input
        type="submit"
        value={loading ? "SAVING..." : "DONE"}
        disabled={loading}
        style={{ opacity: loading ? 0.5 : 1 }}
      />
    </form>
  );
}
