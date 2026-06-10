# CLAUDE.md Cleanup — Design Spec

**Date:** 2026-06-09  
**Goal:** Remove staleness, fix factual errors, and delete dead Google Maps remnants.

---

## CLAUDE.md Changes

**Remove (slop/historical):**
- `# CLAUDE.md` header and "This file provides guidance to Claude Code..." boilerplate
- `Infrastructure is managed with Terraform (terraform/)` — Terraform is not in use
- `(mirrors the original Rails session[:records])` — irrelevant history
- `(replaced Google Maps)` parenthetical in the Map section
- Google Maps env var footnote from the Environment Variables section

**Fix (factual errors):**
- Max upload: "500 KB (set in `lib/types.ts`)" → "5 MB (set in `lib/utils.ts`)"

**Add (missing):**
- `BonerMap.tsx` — Client Component rendering the per-boner sighting map on individual boner pages (`/boners/[serial]`)
- `app/api/geocode/route.ts` — Nominatim-backed geocoding proxy (forward: city name → coords; reverse: coords → city name), used by RecordForm
- Git workflow section: always squash merge PRs (`gh pr merge <n> --squash`), always create a branch before committing anything beyond a 1-line hotfix

---

## `.env.example`

Delete the Google Maps block:
```
# Google Maps — from https://console.cloud.google.com/
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

---

## `.gitignore`

Add `*~` to catch editor backup files (`*.tsx~`, `*.ts~`, `*.mjs~`, `*.sql~`, etc.).

---

## GoogleMapsLoader Cleanup

`GoogleMapsLoader.tsx` is a no-op passthrough (`return <>{children}</>`), kept as a shim after the Google Maps → Leaflet migration. Remove it entirely:

1. Delete `components/GoogleMapsLoader.tsx`
2. Remove import + wrapper tags from three pages:
   - `app/boners/new/page.tsx`
   - `app/boners/new/[serial]/page.tsx`
   - `app/records/[id]/edit/page.tsx`

No behaviour changes — the component wraps nothing.

---

## Out of Scope

- GoogleMapsLoader is the only Maps remnant in live code; no other cleanup needed
- No test suite changes (none exists)
- No Supabase schema changes
