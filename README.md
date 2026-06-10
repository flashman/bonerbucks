# Bonerbucks.org — The Boner Tracking Project

Track boner-bucks in the wild. Report sightings, see where they've been, claim your finds.

**Production:** [bonerbucks.org](https://bonerbucks.org)

**Stack:** Next.js 15 (App Router) · Supabase (Auth + Postgres + Storage) · Vercel · TypeScript · Tailwind CSS

**Architecture:** SSR via Next.js App Router. Three distinct Supabase clients — browser, cookie-aware server, and service-role (never mix them). Anonymous sightings are tracked via an `anon_records` httpOnly cookie so unauthenticated users can edit their own records. Geocoding proxied through `/api/geocode` (Nominatim, no API key needed).

---

## Deploying changes

Push to `main` → Vercel deploys automatically.

**Before merging any HTML/CSS/JS change:** bump the service worker cache version in `public/sw.js` (`CACHE_NAME = 'bonerbucks-vN'`). Skipping this causes users to get stale assets until they hard-refresh.

---

## Local Development

### Prerequisites

- Node.js 20+
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`brew install supabase/tap/supabase`)

### Setup

```bash
git clone https://github.com/flashman/bonerbucks
cd bonerbucks
npm install
```

```bash
supabase start          # starts local Postgres + Studio at http://localhost:54323
supabase db push        # applies migrations
```

```bash
cp .env.example .env.local
# Fill in Supabase values from `supabase status`
# Set NEXT_PUBLIC_SITE_URL to your production domain before deploying
```

```bash
npm run dev             # http://localhost:3000
```

---

## First-time Deployment

1. **Supabase:** Create a project at [app.supabase.com](https://app.supabase.com), then run:
   ```bash
   npx supabase db push --project-ref <your-project-ref>
   ```

2. **Vercel:** Import the repo at [vercel.com/new](https://vercel.com/new) and set the environment variables from `.env.example`.

3. **Storage:** Verify the `record-images` bucket is set to **Public** in the Supabase dashboard.

---

## Making a User Admin

```sql
UPDATE profiles SET role = 1 WHERE name = 'yourusername';
```

---

## Notes

- `SUPABASE_SERVICE_ROLE_KEY` is server-only — never expose to the browser
- Max image upload: 5 MB
- Geocoding via Nominatim (no API key needed)
