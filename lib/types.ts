export interface Profile {
  id: string;
  name: string;
  role: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface Boner {
  serial: string;
  created_at: string;
  updated_at: string;
}

export interface Record {
  id: number;
  serial: string;
  location: string;
  note: string | null;
  lat: number | null;
  lng: number | null;
  image_path: string | null;
  image_content_type: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface BonerWithStats {
  serial: string;
  created_at: string;
  sighting_count: number;
  last_seen_at: string | null;
  last_location: string | null;
  first_image_path: string | null;
}

/** Shape returned by /api/map — one entry per boner that has sightings */
export interface MapRecord {
  serial: string;
  lat: number;
  lng: number;
  location: string;
  date: string;
  thumb_url: string | null;
  large_url: string | null;
  note: string | null;
}

export type MapData = MapRecord[][];

export const SERIAL_REGEX = /^[A-Z][0-9]{8}[A-Z]$/;
