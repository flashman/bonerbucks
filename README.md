# Bonerbucks.org — The Boner Tracking Project

A Next.js 15 migration of the original Ruby on Rails 2/3 app.

**Stack:** Next.js 15 (App Router) · Supabase (Auth + Postgres + Storage) · Vercel · Terraform · TypeScript · Tailwind CSS

---

## Architecture

```
bonerbucks/
├── app/                      # Next.js App Router
│   ├── (auth)/login          # Login page (client component)
│   ├── (auth)/signup         # Signup page (client component)
│   ├── about/                # About page (static)
│   ├── blog/                 # Blog (static historical + DB posts)
│   ├── make/                 # How to make a boner (static)
│   ├── boners/               # Boner index & show pages (SSR)
│   │   ├── new/              # Report a boner (pre-fills serial from URL)
│   │   └── [serial]/         # Individual boner sighting history
│   ├── records/[id]/edit/    # Edit a sighting
│   ├── account/              # User's own boner records (protected)
│   ├── admin/records/        # Admin view of all records (protected)
│   └── api/                  # Route Handlers
│       ├── boners/           # GET /api/boners, GET /api/boners/[serial]
│       ├── records/          # POST /api/records, PATCH/DELETE /api/records/[id]
│       ├── map/              # GET /api/map  — GeoJSON for the homepage map
│       └── auth/logout/      # POST /api/auth/logout
├── components/               # Shared React components
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser Supabase client (createBrowserClient)
│   │   └── server.ts         # Server Supabase client (createServerClient) + service role
│   ├── types.ts              # Shared TypeScript types
│   └── utils.ts              # Serial validation, image URL helpers, date formatting
├── middleware.ts             # Session refresh + route protection
├── supabase/
│   └── migrations/
│       └── 001_init.sql      # Full schema: tables, RLS, storage, view, triggers
└── terraform/                # Infrastructure as code
    ├── main.tf               # Vercel project + Supabase project + env vars
    ├── variables.tf
    ├── outputs.tf
    └── terraform.tfvars.example
```

---

## Data Model

| Rails table | Supabase table | Notes |
|---|---|---|
| `boners` | `boners` | `serial` is still the primary key (no integer id) |
| `records` | `records` | Image stored in Supabase Storage instead of S3/Paperclip |
| `users` | `auth.users` + `profiles` | Auth handled by Supabase; `profiles` stores `name` + `role` |
| `user_sessions` | *(gone)* | Replaced by Supabase cookie-based sessions (`@supabase/ssr`) |
| `posts` | `posts` | Blog posts — historical ones migrated to static JSX |

**Serial format:** `[A-Z][0-9]{8}[A-Z]` — enforced by DB constraint + Zod validation.

**Image storage:** Supabase Storage bucket `record-images`. URLs are generated via the Supabase Image Transformation API (auto-resizes to `thumb` 105×45 or `large` 700×300).

**Anonymous sightings:** Anyone can report a boner without logging in. The created record IDs are stored in an `anon_records` httpOnly cookie so the creator can edit/delete them later (mirroring the original `session[:records]` Rails behaviour).

**Roles:** `profiles.role = 0` is a regular user; `role = 1` is admin.

---

## Local Development

### Prerequisites

- Node.js 20+
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`brew install supabase/tap/supabase`)
- A Google Maps API key with **Maps JavaScript API**, **Geocoding API**, and **Places API** enabled

### 1 — Clone & install

```bash
git clone https://github.com/yourorg/bonerbucks
cd bonerbucks
npm install
```

### 2 — Supabase local dev

```bash
supabase start          # starts local Postgres + Studio at http://localhost:54323
supabase db push        # applies migrations/001_init.sql
```

### 3 — Environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with the values from `supabase status` (for local dev) or your Supabase dashboard (for production):

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from supabase status>
SUPABASE_SERVICE_ROLE_KEY=<from supabase status>
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<your key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4 — Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment

### Option A — Automated with Terraform (recommended)

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Fill in terraform.tfvars
terraform init
terraform plan
terraform apply
```

After `apply`, follow the **POST-APPLY CHECKLIST** printed in the outputs.

### Option B — Manual

1. **Supabase:** Create a project at [app.supabase.com](https://app.supabase.com), copy your project URL and anon key, then run:
   ```bash
   npx supabase db push --project-ref <your-project-ref>
   ```

2. **Vercel:** Import the repo at [vercel.com/new](https://vercel.com/new) and set the environment variables from `.env.example`.

3. **Storage:** The migration creates the `record-images` bucket automatically. Verify it's set to **Public** in the Supabase dashboard (Storage → record-images → Settings).

---

## Making a User Admin

After signing up, run this in the Supabase SQL editor:

```sql
UPDATE profiles SET role = 1 WHERE name = 'yourusername';
```

Admins can edit/delete all records and see `/admin/records`.

---

## DevOps Notes

### Secrets Management
- **Never commit** `.env.local` or `terraform.tfvars`
- `SUPABASE_SERVICE_ROLE_KEY` is server-only — Terraform only exposes it to Vercel's `production` environment
- In CI/CD, inject secrets via your CI provider's secret store (GitHub Actions → Settings → Secrets)

### Remote Terraform State
For teams, store state remotely. Uncomment the `backend "s3"` block in `main.tf` and configure an S3 bucket (or use Terraform Cloud).

### ISR & Caching
- `/boners` page revalidates every 30 seconds
- `/api/map` revalidates every 60 seconds with `Cache-Control: s-maxage=60`
- Individual boner pages are server-rendered on demand

### Google Maps API Key
- Create separate keys for dev and prod
- In production, restrict the key to your domain (`bonerbucks.org/*`) in the Google Cloud Console
- Enable billing on the project (Maps has a free tier of $200/month)

### Image Uploads
- Max file size: 500 KB (enforced client-side and by Supabase Storage policy)
- Supabase Image Transformation resizes on-the-fly — no need for a separate image processing step
- Images are stored at `record-images/<timestamp>-<random>.<ext>`

---

## Key Differences from the Rails App

| Feature | Rails (original) | Next.js (this) |
|---|---|---|
| Auth | Authlogic (session, username login) | Supabase Auth (email + username display name) |
| Sessions | Cookie-based Rails sessions | Supabase `@supabase/ssr` cookie sessions |
| Image storage | S3 via Paperclip (2 sizes hardcoded) | Supabase Storage + Image Transformation API |
| Geocoding | Client-side via Google Maps Places | Client-side Google Maps Geocoder |
| Map | jQuery + Google Maps v3 + MarkerClusterer | React + Google Maps (Advanced Markers) |
| Blog | Hardcoded ERB HTML | Static JSX (historical) + `posts` table (new) |
| Deployment | Heroku (inferred from Procfile) | Vercel |
| DB | PostgreSQL via ActiveRecord | PostgreSQL via Supabase client (with RLS) |
| Anonymous records | `session[:records]` | `anon_records` httpOnly cookie |
