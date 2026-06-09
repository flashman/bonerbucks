"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { normaliseSerial, isValidSerial, MAX_IMAGE_BYTES, imageUrl } from "@/lib/utils";
import SafeImage from "@/components/SafeImage";
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [geocodeError, setGeocodeError] = useState("");
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanNote, setScanNote] = useState<string | null>(null);
  const scanIdRef = useRef(0);

  /** Geocode the typed city using Nominatim (OpenStreetMap) */
  async function geocodeLocation(value: string) {
    if (!value.trim()) return;
    setGeocoding(true);
    setGeocodeError("");
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(value)}`);
      if (!res.ok) {
        setGeocodeError("GEOCODING SERVICE UNAVAILABLE. TRY AGAIN.");
        return;
      }
      const data = await res.json();
      if (data?.lat && data?.lng) {
        setLat(parseFloat(data.lat.toFixed(6)));
        setLng(parseFloat(data.lng.toFixed(6)));
      } else {
        setGeocodeError("COULDN'T LOCATE THAT PLACE. TRY ADDING STATE OR COUNTRY.");
      }
    } catch {
      setGeocodeError("GEOCODING FAILED. CHECK YOUR CONNECTION AND TRY AGAIN.");
    } finally {
      setGeocoding(false);
    }
  }

  async function preprocessForOcr(file: File): Promise<Blob> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        // Upscale small images — Tesseract accuracy degrades on small text
        const scale = Math.max(1, 1500 / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
          // Convert to grayscale then boost contrast
          const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          const c = Math.min(255, Math.max(0, (g - 128) * 1.8 + 128));
          d[i] = d[i + 1] = d[i + 2] = c;
        }
        ctx.putImageData(imageData, 0, 0);
        URL.revokeObjectURL(url);
        canvas.toBlob(b => resolve(b!), "image/png");
      };
      img.src = url;
    });
  }

  async function scanForSerial(file: File) {
    if (file.size > MAX_IMAGE_BYTES) return;
    const myId = ++scanIdRef.current;
    setScanning(true);
    setScanNote(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let worker: any = null;
    try {
      const { createWorker } = await import("tesseract.js");
      worker = await createWorker("eng");
      await worker.setParameters({
        tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        tessedit_pageseg_mode: "11", // sparse text — finds text anywhere in a complex image
      });
      const preprocessed = await preprocessForOcr(file);
      const { data: { text } } = await worker.recognize(preprocessed);
      if (myId !== scanIdRef.current) return;
      console.log("[OCR raw]", text);
      const collapsed = text.toUpperCase().replace(/\s+/g, "");
      console.log("[OCR collapsed]", collapsed);

      // Strict match first
      let match = collapsed.match(/[A-Z][0-9]{8}[A-Z]/g)?.[0] ?? null;

      // Loose match: normalize common OCR letter/digit confusions in digit positions.
      // R→9 observed empirically on dollar bill serial font; rest are classic Tesseract confusions.
      if (!match) {
        const DIGIT_SUB: Record<string, string> = { O: "0", Q: "0", I: "1", L: "1", Z: "2", S: "5", B: "8", R: "9", P: "9", G: "6", T: "7" };
        for (const candidate of collapsed.match(/[A-Z][A-Z0-9]{8}[A-Z]/g) ?? []) {
          const middle = candidate.slice(1, 9).replace(/[A-Z]/g, (c: string) => DIGIT_SUB[c] ?? c);
          if (/^[0-9]{8}$/.test(middle)) {
            match = candidate[0] + middle + candidate[9];
            break;
          }
        }
      }

      if (match) {
        setSerial(match);
        setScanNote("SERIAL FOUND — PLEASE VERIFY");
      } else {
        setScanNote("COULDN'T FIND SERIAL IN IMAGE");
      }
    } catch {
      // Tesseract failed to load or crashed — fail silently
    } finally {
      worker?.terminate();
      if (myId === scanIdRef.current) setScanning(false);
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
    if (geocoding) { setError("PLEASE WAIT FOR GEOCODING TO FINISH."); return; }
    if (lat === "" || lng === "") { setError("LAT/LNG IS REQUIRED. MAKE SURE YOUR CITY AUTO-GEOCODED."); return; }
    if (imageFile && imageFile.size > MAX_IMAGE_BYTES) {
      setError("IMAGE IS TOO LARGE. MAX SIZE IS 5MB.");
      return;
    }

    setLoading(true);
    try {
      let imagePath: string | undefined;

      // Upload image to Supabase Storage; prefix with user ID so storage RLS delete policy works
      if (imageFile) {
        const { data: { user } } = await supabase.auth.getUser();
        const uid = user?.id ?? "anon";
        const ext = imageFile.name.split(".").pop();
        const path = `${uid}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
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
          onChange={(e) => { setSerial(e.target.value); setScanNote(null); }}
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
          onChange={(e) => { setLocation(e.target.value); setGeocodeError(""); }}
          onBlur={(e) => geocodeLocation(e.target.value)}
          placeholder="Oakland, CA"
          required
          style={{ fontFamily: "verdana", fontSize: 14, border: "1px solid #999", padding: "2px 4px", width: "100%", maxWidth: 300 }}
        />
        {geocoding && <span style={{ fontSize: 11, color: "#777", marginLeft: 8 }}>GEOCODING...</span>}
        {lat !== "" && !geocoding && !geocodeError && <span style={{ fontSize: 11, color: "green", marginLeft: 8 }}>✓ LOCATED</span>}
        {lat !== "" && !geocodeError && <p style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{Number(lat).toFixed(4)}, {Number(lng).toFixed(4)}</p>}
        {geocodeError && <p style={{ fontSize: 11, color: "red", marginTop: 2 }}>{geocodeError}</p>}
      </div>

      <div className="field-row">
        <h4>NOTES (IF YOU WANT):</h4>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ fontFamily: "verdana", fontSize: 14, border: "1px solid #999", padding: "2px 4px", width: "100%", maxWidth: 500, height: 100 }}
          placeholder="Tell us about this boner..."
        />
      </div>

      <div className="field-row">
        <h4>IMAGE (IF YOU WANT... MAX SIZE IS 5MB):</h4>
        <input
          type="file"
          accept="image/*"
          style={{ fontFamily: "verdana", fontSize: 13 }}
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            setScanNote(null);
            setImageFile(file);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(file ? URL.createObjectURL(file) : null);
            if (file) scanForSerial(file);
          }}
        />
        <p style={{ fontSize: 11, color: "#777", marginTop: 2 }}>Tip: crop to just the serial number for best scan results.</p>
        {previewUrl && (
          <div style={{ marginTop: 4 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Preview" style={{ maxWidth: 105, maxHeight: 45, display: "block" }} />
            <p style={{ fontSize: 11, color: imageFile && imageFile.size > MAX_IMAGE_BYTES ? "red" : "#777", marginTop: 2 }}>
              {imageFile?.name} ({(imageFile!.size / (1024 * 1024)).toFixed(2)} MB)
              {imageFile && imageFile.size > MAX_IMAGE_BYTES ? " — TOO LARGE" : ""}
            </p>
          </div>
        )}
        {scanning && (
          <span style={{ fontSize: 11, color: "#777", display: "block", marginTop: 4 }}>SCANNING FOR SERIAL...</span>
        )}
        {!scanning && scanNote && (
          <span style={{ fontSize: 11, color: scanNote.startsWith("SERIAL") ? "green" : "#aaa", display: "block", marginTop: 4 }}>
            {scanNote}
          </span>
        )}
        {record?.image_path && !imageFile && (
          <div style={{ marginTop: 4 }}>
            <SafeImage
              src={imageUrl(process.env.NEXT_PUBLIC_SUPABASE_URL!, record.image_path, "large")}
              alt="Current image"
              style={{ maxWidth: 300, maxHeight: 200, display: "block", marginBottom: 4 }}
            />
            <p style={{ fontSize: 11, color: "#777" }}>Current image on file. Upload a new one to replace it.</p>
          </div>
        )}
      </div>

      <br />
      <input
        type="submit"
        value={loading ? "SAVING..." : "DONE"}
        disabled={loading || geocoding}
        style={{ opacity: loading || geocoding ? 0.5 : 1 }}
      />
    </form>
  );
}
