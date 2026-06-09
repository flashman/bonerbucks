"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { normaliseSerial, isValidSerial, MAX_IMAGE_BYTES, imageUrl } from "@/lib/utils";
import Lightbox from "@/components/Lightbox";
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
  const [lightbox, setLightbox] = useState(false);
  const scanIdRef = useRef(0);
  // Only true if the user explicitly picked/transformed an image this session.
  // The useEffect that loads the existing image for display must NOT set this.
  const imageChangedRef = useRef(false);

  useEffect(() => {
    if (!record?.image_path) return;
    const url = imageUrl(process.env.NEXT_PUBLIC_SUPABASE_URL!, record.image_path, "large");
    fetch(url)
      .then(r => r.blob())
      .then(blob => {
        const file = new File([blob], "current-image.jpg", { type: blob.type || "image/jpeg" });
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(blob));
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  async function extractGpsFromImage(file: File) {
    // Only attempt on files that could have EXIF (JPEG/HEIF)
    if (!file.type.includes("jpeg") && !file.type.includes("jpg") && !file.type.includes("heic") && !file.type.includes("heif")) return;
    try {
      const exifr = await import("exifr");
      const gps = await exifr.gps(file);
      if (!gps?.latitude || !gps?.longitude) return;
      setLat(parseFloat(gps.latitude.toFixed(6)));
      setLng(parseFloat(gps.longitude.toFixed(6)));
      // Reverse geocode to get a human-readable city name
      setGeocoding(true);
      setGeocodeError("");
      const res = await fetch(`/api/geocode?lat=${gps.latitude}&lng=${gps.longitude}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.display_name) setLocation(data.display_name);
      }
    } catch {
      // EXIF read failed or no GPS — silently ignore
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
        // Isolate the green serial ink: pixels where green dominates become black,
        // everything else (black engraving, paper) becomes white.
        // GREEN_MARGIN controls how much greener-than-red/blue a pixel must be.
        const GREEN_MARGIN = 10;
        for (let i = 0; i < d.length; i += 4) {
          const isGreen = d[i + 1] > d[i] + GREEN_MARGIN && d[i + 1] > d[i + 2] + GREEN_MARGIN;
          d[i] = d[i + 1] = d[i + 2] = isGreen ? 0 : 255;
        }
        ctx.putImageData(imageData, 0, 0);
        URL.revokeObjectURL(url);
        canvas.toBlob(b => resolve(b!), "image/png");
      };
      img.src = url;
    });
  }

  async function scanForSerial(file: File) {
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
        tessedit_pageseg_mode: "6", // uniform text block — better for clean binary images
      });
      const preprocessed = await preprocessForOcr(file);
      const { data: { text } } = await worker.recognize(preprocessed);
      if (myId !== scanIdRef.current) return;
      const upperText = text.toUpperCase();
      const searchTargets = upperText.split(/\s+/).filter((w: string) => w.length >= 10);

      const isPlausibleSerial = (middle: string) => {
        const counts = middle.split("").reduce<Record<string, number>>((a, d) => { a[d] = (a[d] ?? 0) + 1; return a; }, {});
        return Math.max(...(Object.values(counts) as number[])) <= 5;
      };

      const DIGIT_SUB: Record<string, string> = { O: "0", Q: "0", I: "1", L: "1", Z: "2", S: "5", B: "8", R: "9", P: "9", G: "6" };
      const LETTER_SUB: Record<string, string> = { "1": "I", "0": "O", "5": "S", "8": "B", "2": "Z" };
      const tryLoose = (candidate: string): string | null => {
        const first = LETTER_SUB[candidate[0]] ?? candidate[0];
        const last = LETTER_SUB[candidate[9]] ?? candidate[9];
        const middle = candidate.slice(1, 9).replace(/[A-Z]/g, (c: string) => DIGIT_SUB[c] ?? c);
        if (!/^[A-Z]$/.test(first) || !/^[A-Z]$/.test(last) || !/^[0-9]{8}$/.test(middle)) return null;
        if (!isPlausibleSerial(middle)) return null;
        return first + middle + last;
      };

      let match: string | null = null;
      // Pass 1 (strict) across all targets, then Pass 2 (loose, letter-first),
      // then Pass 3 (loose, digit-first) — ordered from fewest to most substitutions.
      outer: for (const str of searchTargets) {
        for (const c of str.match(/[A-Z][0-9]{8}[A-Z]/g) ?? []) {
          if (isPlausibleSerial(c.slice(1, 9))) { match = c; break outer; }
        }
      }
      if (!match) {
        outer: for (const str of searchTargets) {
          for (const c of str.match(/[A-Z][A-Z0-9]{8}[A-Z0-9]/g) ?? []) {
            const r = tryLoose(c); if (r) { match = r; break outer; }
          }
        }
      }
      if (!match) {
        outer: for (const str of searchTargets) {
          for (const c of str.match(/[0-9][A-Z0-9]{8}[A-Z]/g) ?? []) {
            const r = tryLoose(c); if (r) { match = r; break outer; }
          }
        }
      }

      if (match) {
        setSerial(match);
        setScanNote("SERIAL FOUND — PLEASE VERIFY");
      }
    } catch {
      // Tesseract failed to load or crashed — fail silently
    } finally {
      worker?.terminate();
      if (myId === scanIdRef.current) setScanning(false);
    }
  }

  async function applyTransform(type: "rotateCW" | "rotateCCW" | "flipH" | "flipV") {
    if (!imageFile || !previewUrl) return;
    const newBlob = await new Promise<Blob>((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Cap long edge at 2400px so re-encoded file stays well under 5MB
        const scale = Math.min(1, 2400 / Math.max(img.width, img.height));
        const sw = Math.round(img.width * scale);
        const sh = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        if (type === "rotateCW" || type === "rotateCCW") {
          canvas.width = sh;
          canvas.height = sw;
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(type === "rotateCW" ? Math.PI / 2 : -Math.PI / 2);
          ctx.drawImage(img, -sw / 2, -sh / 2, sw, sh);
        } else {
          canvas.width = sw;
          canvas.height = sh;
          ctx.translate(sw, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(img, 0, 0, sw, sh);
        }
        canvas.toBlob(b => resolve(b!), "image/jpeg", 0.88);
      };
      img.src = previewUrl;
    });
    const newFile = new File([newBlob], imageFile.name, { type: "image/jpeg" });
    URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(newBlob));
    setImageFile(newFile);
    imageChangedRef.current = true;
    setScanNote(null);
    if (!isEdit) scanForSerial(newFile);
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

      // Upload image to Supabase Storage; prefix with user ID so storage RLS delete policy works.
      // imageChangedRef guards against re-uploading the existing image when editing without
      // changing the photo (the useEffect loads it for preview but must not trigger upload).
      if (imageFile && imageChangedRef.current) {
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
        <h4>IMAGE (IF YOU WANT):</h4>
        <label style={{ display: "inline-block", fontFamily: "verdana", fontSize: 12, border: "1px solid #999", padding: "3px 8px", cursor: "pointer", userSelect: "none" }}>
          {imageFile ? "CHANGE IMAGE" : "CHOOSE FILE"}
          <input
            key={previewUrl ?? "empty"}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setScanNote(null);
              setLightbox(false);
              setImageFile(file);
              imageChangedRef.current = !!file;
              if (previewUrl) URL.revokeObjectURL(previewUrl);
              setPreviewUrl(file ? URL.createObjectURL(file) : null);
              if (file) {
                if (!isEdit) scanForSerial(file);
                if (!location.trim()) extractGpsFromImage(file);
              }
            }}
          />
        </label>
        <span style={{ fontSize: 11, color: "#aaa", marginLeft: 8 }}>MAX 5MB</span>

        {previewUrl && (
          <div style={{ marginTop: 10 }}>
            <div className="relative group" style={{ maxWidth: 500 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Preview" onClick={() => setLightbox(true)} style={{ maxWidth: "100%", height: "auto", display: "block", cursor: "pointer" }} />
              <div className="absolute top-1 left-1 flex gap-1 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-150">
                {(["rotateCCW", "rotateCW", "flipH"] as const).map((t) => (
                  <button key={t} type="button" aria-label={{ rotateCCW: "Rotate left", rotateCW: "Rotate right", flipH: "Flip" }[t]} disabled={scanning || !imageChangedRef.current} onClick={() => applyTransform(t)} style={{ background: "rgba(0,0,0,0.55)", color: "white", border: "none", cursor: (scanning || !imageChangedRef.current) ? "default" : "pointer", width: 26, height: 26, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", opacity: imageChangedRef.current ? 1 : 0.4 }}>
                    {{ rotateCCW: "↺", rotateCW: "↻", flipH: "↔" }[t]}
                  </button>
                ))}
              </div>
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => { scanIdRef.current++; URL.revokeObjectURL(previewUrl); setPreviewUrl(null); setImageFile(null); imageChangedRef.current = false; setScanNote(null); setScanning(false); setLightbox(false); }}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-150"
                style={{ background: "rgba(0,0,0,0.55)", color: "white", border: "none", cursor: "pointer", width: 26, height: 26, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}
              >×</button>
            </div>
            <p style={{ fontSize: 11, color: imageFile && imageFile.size > MAX_IMAGE_BYTES ? "red" : "#777", marginTop: 6 }}>
              {imageFile?.name} ({(imageFile!.size / (1024 * 1024)).toFixed(2)} MB)
              {imageFile && imageFile.size > MAX_IMAGE_BYTES ? " — TOO LARGE" : ""}
            </p>
            {scanning && <span style={{ fontSize: 11, color: "#777", display: "block", marginTop: 4 }}>SCANNING FOR SERIAL...</span>}
            {!scanning && scanNote && <span style={{ fontSize: 11, color: "green", display: "block", marginTop: 4 }}>✓ {scanNote}</span>}
          </div>
        )}

        {lightbox && previewUrl && <Lightbox src={previewUrl} onClose={() => setLightbox(false)} />}

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
