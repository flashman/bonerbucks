import Link from "next/link";
import HomeMap from "@/components/HomeMap";
import FeaturedBoner from "@/components/FeaturedBoner";
import type { FeaturedBonerData } from "@/components/FeaturedBoner";
import { createClient } from "@/lib/supabase/server";
import { imageUrl } from "@/lib/utils";

export const revalidate = 60;

const sans = '"futura","univers","helvetica",sans-serif';
const serif = '"palatino","caslon","sabon","bembo",serif';

function Divider() {
  return (
    <hr
      style={{
        border: "none",
        borderTop: "1px solid #ccc",
        margin: "20px 0",
      }}
    />
  );
}

export default async function HomePage() {
  const supabase = await createClient();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  // ── Stats ─────────────────────────────────────────────────────────────────
  const [{ count: bonerCount }, { count: sightingCount }, { count: photoCount }] =
    await Promise.all([
      supabase.from("boners").select("*", { count: "exact", head: true }),
      supabase.from("records").select("*", { count: "exact", head: true }),
      supabase
        .from("records")
        .select("*", { count: "exact", head: true })
        .not("image_path", "is", null),
    ]);

  // ── Featured boner candidates ─────────────────────────────────────────────
  // Qualify: ≥2 sightings, OR has a real note (not the default placeholder),
  // OR has at least one photo. Three queries + dedupe.
  const PLACEHOLDER_NOTE = "Found this in the wild. Exact circumstances lost to history";

  const [{ data: bySightings }, { data: byPhoto }, { data: byNote }] =
    await Promise.all([
      supabase
        .from("boners_with_stats")
        .select("serial, sighting_count, first_image_path")
        .gte("sighting_count", 2)
        .order("sighting_count", { ascending: false })
        .limit(20),
      supabase
        .from("boners_with_stats")
        .select("serial, sighting_count, first_image_path")
        .not("first_image_path", "is", null)
        .order("sighting_count", { ascending: false }),
      // Records with a non-null, non-placeholder note
      supabase
        .from("records")
        .select("serial, note")
        .not("note", "is", null)
        .neq("note", PLACEHOLDER_NOTE)
        .neq("note", "")
        .limit(40),
    ]);

  // Only qualify notes that are genuinely longer than the placeholder
  const noteSerials = [...new Set(
    (byNote ?? [])
      .filter((r) => r.note && r.note.trim().length > PLACEHOLDER_NOTE.length)
      .map((r) => r.serial)
  )];
  let byNoteStats: Array<{ serial: string; sighting_count: number; first_image_path: string | null }> = [];
  if (noteSerials.length > 0) {
    const { data } = await supabase
      .from("boners_with_stats")
      .select("serial, sighting_count, first_image_path")
      .in("serial", noteSerials);
    byNoteStats = data ?? [];
  }

  // Deduplicate, then sort: photos first, then by sighting count desc
  const seen = new Set<string>();
  const candidateRows = [
    ...(bySightings ?? []),
    ...(byPhoto ?? []),
    ...byNoteStats,
  ]
    .filter((c) => {
      if (seen.has(c.serial)) return false;
      seen.add(c.serial);
      return true;
    })
    .sort((a, b) => {
      const aHasPhoto = a.first_image_path ? 1 : 0;
      const bHasPhoto = b.first_image_path ? 1 : 0;
      if (bHasPhoto !== aHasPhoto) return bHasPhoto - aHasPhoto;
      return b.sighting_count - a.sighting_count;
    });

  // Fetch all records for candidate serials in one query
  let featured: FeaturedBonerData[] = [];
  if (candidateRows.length > 0) {
    const serials = candidateRows.map((c) => c.serial);
    const { data: records } = await supabase
      .from("records")
      .select("serial, location, note, image_path, created_at")
      .in("serial", serials)
      .order("created_at", { ascending: true });

    const recordsBySerial = new Map<
      string,
      Array<{ location: string; note: string | null; image_path: string | null }>
    >();
    for (const r of records ?? []) {
      if (!recordsBySerial.has(r.serial)) recordsBySerial.set(r.serial, []);
      recordsBySerial.get(r.serial)!.push({
        location: r.location,
        note: r.note,
        image_path: r.image_path,
      });
    }

    featured = candidateRows
      .map((c) => {
        const bonerRecords = recordsBySerial.get(c.serial) ?? [];
        const photos = bonerRecords.filter((r) => r.image_path).length;
        const firstImagePath =
          bonerRecords.find((r) => r.image_path)?.image_path ?? c.first_image_path;
        return {
          serial: c.serial,
          sighting_count: c.sighting_count,
          image_url: firstImagePath ? imageUrl(supabaseUrl, firstImagePath, "large") : null,
          photo_count: photos,
          locations: bonerRecords.map((r) => r.location),
          notes: bonerRecords.map((r) => r.note),
        };
      })
      .filter((f) => {
        // Final gate: must genuinely qualify on real data, not just query hints
        const hasMultipleSightings = f.sighting_count >= 2;
        const hasPhoto = f.photo_count > 0;
        const hasRealNote = f.notes.some(
          (n) => n && n.trim().length > PLACEHOLDER_NOTE.length
        );
        return hasMultipleSightings || hasPhoto || hasRealNote;
      });
  }

  return (
    <div>

      {/* ── Welcome ──────────────────────────────────────────────────────── */}
      <h2
        style={{
          fontFamily: sans,
          fontWeight: "bold",
          fontSize: 18,
          letterSpacing: "0.06em",
          textAlign: "center",
          marginBottom: 14,
          lineHeight: 1.5,
        }}
      >
        WELCOME TO BONERBUCKS.ORG
        <br />
        <span style={{ fontSize: 12, letterSpacing: "0.14em" }}>
          THE BONER TRACKING PROJECT
        </span>
      </h2>

      <p>
        Boner bucks were started by the people at 4chan with help of an AIDS victim.
        It is the act of defacing one dollar bills. On the back of the dollar the word
        one appears, and to make your one a boner buck you simply write B and R in front
        and after the one. Therefore making it a <em>BoneR buck</em>.
      </p>

      <blockquote
        style={{
          borderLeft: "2px solid black",
          margin: "14px 0 0 0",
          paddingLeft: 14,
          fontStyle: "italic",
          fontFamily: serif,
          fontSize: 13,
          lineHeight: 1.85,
          color: "#444",
        }}
      >
        <p style={{ margin: 0 }}>GUY 1: Oh shit, we are a little short on tip...</p>
        <p style={{ margin: 0 }}>GUY 2: Don&apos;t look at me! This is my last boner buck!</p>
        <p style={{ margin: 0 }}>GUY 3: Dude here, [Hands Guy 2 a sharpie] shut up and pitch in.</p>
        <p style={{ margin: "4px 0 0", textAlign: "right", fontSize: 11 }}>
          —urbandictionary.com
        </p>
      </blockquote>

      <Divider />

      {/* ── Report CTA ───────────────────────────────────────────────────── */}
      <div
        style={{
          border: "2px solid black",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: sans,
              fontWeight: "bold",
              fontSize: 15,
              margin: "0 0 3px",
              textAlign: "left",
            }}
          >
            💀 &nbsp; AH. SO YOU FOUND ONE.
          </p>
          <p style={{ fontSize: 12, color: "#666", margin: 0, textAlign: "left" }}>
            Every sighting tells a story.
          </p>
        </div>
        <Link
          href="/boners/new"
          style={{
            fontFamily: sans,
            fontWeight: "bold",
            fontSize: 13,
            textTransform: "uppercase" as const,
            border: "2px solid black",
            padding: "5px 16px",
            whiteSpace: "nowrap" as const,
            flexShrink: 0,
            color: "black",
            letterSpacing: "0.03em",
          }}
        >
          REPORT IT →
        </Link>
      </div>

      <Divider />

      {/* ── Map ──────────────────────────────────────────────────────────── */}
      <HomeMap />

      <Divider />

      {/* ── Featured boner rotator ───────────────────────────────────────── */}
      {featured.length > 0 && <FeaturedBoner candidates={featured} />}

      {featured.length > 0 && <Divider />}

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          background: "#ccc",
          border: "1px solid #ccc",
        }}
      >
        {[
          { num: bonerCount ?? 0, label: "boners tracked" },
          { num: sightingCount ?? 0, label: "sightings" },
          { num: photoCount ?? 0, label: "photos submitted" },
        ].map(({ num, label }) => (
          <div
            key={label}
            style={{
              background: "white",
              padding: "12px 8px",
              textAlign: "center",
            }}
          >
            <span
              style={{
                display: "block",
                fontFamily: sans,
                fontWeight: "bold",
                fontSize: 26,
                lineHeight: 1,
              }}
            >
              {num.toLocaleString()}
            </span>
            <span
              style={{
                display: "block",
                fontFamily: sans,
                fontSize: 9,
                color: "#888",
                textTransform: "uppercase" as const,
                letterSpacing: "0.07em",
                marginTop: 5,
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── Secondary CTAs ───────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        {[
          {
            href: "/make",
            title: "MAKING ONE?",
            desc: "Register it before you spend it so the trail starts from day one.",
          },
          {
            href: "/signup",
            title: "JOIN THE PROJECT",
            desc: "Create an account to manage your boners and track your sightings.",
          },
        ].map(({ href, title, desc }) => (
          <div key={href} style={{ border: "1px solid #ccc", padding: "12px 14px" }}>
            <p
              style={{
                fontFamily: sans,
                fontWeight: "bold",
                fontSize: 12,
                margin: "0 0 5px",
                textAlign: "left",
              }}
            >
              <Link href={href}>{title}</Link>
            </p>
            <p style={{ fontSize: 12, color: "#666", margin: 0, textAlign: "left" }}>
              {desc}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
