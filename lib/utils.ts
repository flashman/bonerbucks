import { SERIAL_REGEX } from "./types";

// 5MB — adjust as needed
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;


/** Normalise a serial: uppercase, strip whitespace */
export function normaliseSerial(raw: string): string {
  return raw.toUpperCase().replace(/\s+/g, "");
}

export function isValidSerial(serial: string): boolean {
  return SERIAL_REGEX.test(normaliseSerial(serial));
}

/** Build a public Supabase Storage URL for an image path */
export function imageUrl(
  supabaseUrl: string,
  path: string,
  variant: "thumb" | "large" = "large"
): string {
  // Supabase Image Transformation: ?width=&height=
  const dims = variant === "thumb" ? "width=105&height=45" : "width=700&height=300";
  return `${supabaseUrl}/storage/v1/object/public/record-images/${path}?${dims}&resize=contain`;

  //return `${supabaseUrl}/storage/v1/render/image/public/record-images/${path}?${dims}&resize=contain`;
}

export function publicStorageUrl(supabaseUrl: string, path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/record-images/${path}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Pull anonymous record IDs out of the cookie value */
export function parseAnonRecords(cookieValue: string | undefined): number[] {
  if (!cookieValue) return [];
  try {
    const parsed = JSON.parse(cookieValue);
    if (Array.isArray(parsed)) return parsed.filter(Number.isFinite);
  } catch {
    // ignore
  }
  return [];
}
