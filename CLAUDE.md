# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build (also type-checks)
npm run lint         # ESLint
npm run db:migrate   # supabase db push — applies migrations to linked project
```

No test suite currently exists.

## Architecture

Next.js 15 App Router app deployed on Vercel, backed by Supabase (Postgres + Auth + Storage). Infrastructure is managed with Terraform (`terraform/`).

**Supabase client pattern** — three distinct clients, never mix them up:
- `lib/supabase/client.ts` — `createBrowserClient`, used in Client Components
- `lib/supabase/server.ts` `createClient()` — cookie-aware, used in Server Components and Route Handlers
- `lib/supabase/server.ts` `createServiceClient()` — service-role key, for privileged ops; never expose to browser

**Auth & middleware** — `middleware.ts` refreshes the Supabase session on every request (required by `@supabase/ssr`) and redirects unauthenticated users away from `/account` and `/admin`. Admin role-checking happens inside the individual page/handler, not in middleware. `profiles.role = 0` is a regular user; `role = 1` is admin.

**Anonymous sightings** — records can be created without logging in. The new record's ID is stored in an `anon_records` httpOnly cookie so the creator can edit/delete it later (mirrors the original Rails `session[:records]`).

**Data model** (see `supabase/migrations/001_init.sql` for full schema + RLS):
- `boners` — a unique physical boner-buck; `serial` is the PK (`[A-Z][0-9]{8}[A-Z]`)
- `records` — a sighting of a boner; `user_id` is nullable for anonymous sightings
- `profiles` — extends `auth.users` with `name` and `role`; auto-created by DB trigger on signup
- `posts` — blog posts (admin-managed)
- `boners_with_stats` — view joining boners + records, used by the index table

**Image storage** — Supabase Storage bucket `record-images` (public). URLs use Supabase Image Transformation API for on-the-fly resizing (`thumb` 105×45, `large` 700×300). See `lib/utils.ts` for URL helpers. Max upload: 500 KB (set in `lib/types.ts`).

**Map** — Leaflet + OpenStreetMap (replaced Google Maps). `components/HomeMap.tsx` is a Client Component that renders the map; `app/api/map/route.ts` serves GeoJSON (cached 60 s).

**Caching** — `/boners` revalidates every 30 s; `/api/map` uses `s-maxage=60`.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY      # server-only
NEXT_PUBLIC_SITE_URL           # used by Supabase Auth redirects
```

Copy `.env.example` to `.env.local`. `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in the example file is a leftover from before the Leaflet migration — it is no longer needed.

## Before Merging to Main

Bump the service worker cache version in `public/sw.js` (`CACHE_NAME = 'bonerbucks-vN'`) whenever any HTML, CSS, or JS changes ship. The activate handler deletes the old cache automatically — skipping this means users get stale assets until they do a hard refresh.

## Making a User Admin

```sql
UPDATE profiles SET role = 1 WHERE name = 'yourusername';
```
