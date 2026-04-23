-- ============================================================
-- Bonerbucks Schema
-- Run via: supabase db push  OR  paste into Supabase SQL editor
-- ============================================================

-- ─── PROFILES ───────────────────────────────────────────────
-- Extends auth.users with a display name and role.
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text unique not null,
  role        integer not null default 0,  -- 0=user, 1=admin
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create a profile row when a new user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─── BONERS ─────────────────────────────────────────────────
-- A unique boner-buck. Serial is the natural PK (no surrogate id).
-- Format: one uppercase letter, 8 digits, one uppercase letter  e.g. A12345678B
create table if not exists boners (
  serial      text primary key,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint boners_serial_format check (serial ~ '^[A-Z][0-9]{8}[A-Z]$')
);

-- ─── RECORDS ────────────────────────────────────────────────
-- A sighting/report of a boner-buck in the wild.
create table if not exists records (
  id                  bigint generated always as identity primary key,
  serial              text not null references boners(serial) on delete cascade,
  location            text not null,
  note                text,
  lat                 double precision,
  lng                 double precision,
  image_path          text,       -- Supabase Storage path: "records/{id}/original"
  image_content_type  text,
  user_id             uuid references auth.users(id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists records_serial_idx  on records(serial);
create index if not exists records_user_id_idx on records(user_id);

-- ─── POSTS ──────────────────────────────────────────────────
-- Blog posts (admin-managed).
create table if not exists posts (
  id          bigint generated always as identity primary key,
  title       text not null,
  content     text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── UPDATED_AT TRIGGER ─────────────────────────────────────
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger boners_updated_at  before update on boners  for each row execute function touch_updated_at();
create trigger records_updated_at before update on records for each row execute function touch_updated_at();
create trigger posts_updated_at   before update on posts   for each row execute function touch_updated_at();
create trigger profiles_updated_at before update on profiles for each row execute function touch_updated_at();

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────

alter table profiles enable row level security;
alter table boners   enable row level security;
alter table records  enable row level security;
alter table posts    enable row level security;

-- profiles: users can read all, update their own
create policy "profiles: public read"   on profiles for select using (true);
create policy "profiles: owner update"  on profiles for update using (auth.uid() = id);

-- boners: public read; anyone can insert (anonymous sightings allowed)
create policy "boners: public read"   on boners for select using (true);
create policy "boners: public insert" on boners for insert with check (true);
create policy "boners: admin delete"  on boners for delete using (
  exists (select 1 from profiles where id = auth.uid() and role = 1)
);

-- records: public read; anyone can insert; owner or admin can update/delete
create policy "records: public read"    on records for select using (true);
create policy "records: public insert"  on records for insert with check (true);
create policy "records: owner update"   on records for update using (
  auth.uid() = user_id or
  exists (select 1 from profiles where id = auth.uid() and role = 1)
);
create policy "records: owner delete"   on records for delete using (
  auth.uid() = user_id or
  exists (select 1 from profiles where id = auth.uid() and role = 1)
);

-- posts: public read; admin write
create policy "posts: public read"   on posts for select using (true);
create policy "posts: admin insert"  on posts for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role = 1)
);
create policy "posts: admin update"  on posts for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 1)
);
create policy "posts: admin delete"  on posts for delete using (
  exists (select 1 from profiles where id = auth.uid() and role = 1)
);

-- ─── STORAGE ────────────────────────────────────────────────
-- Create the bucket via dashboard or CLI:
--   supabase storage create-bucket record-images --public
-- Then apply these policies (or use the dashboard):

insert into storage.buckets (id, name, public)
values ('record-images', 'record-images', true)
on conflict (id) do nothing;

create policy "record-images: public read" on storage.objects
  for select using (bucket_id = 'record-images');

create policy "record-images: authenticated upload" on storage.objects
  for insert with check (bucket_id = 'record-images');

create policy "record-images: owner delete" on storage.objects
  for delete using (
    bucket_id = 'record-images' and (
      auth.uid()::text = (storage.foldername(name))[1] or
      exists (select 1 from profiles where id = auth.uid() and role = 1)
    )
  );

-- ─── HELPER VIEWS ───────────────────────────────────────────
-- Boners enriched with latest-record info — used by the index table.
create or replace view boners_with_stats as
select
  b.serial,
  b.created_at,
  count(r.id)::int             as sighting_count,
  max(r.created_at)            as last_seen_at,
  (array_agg(r.location order by r.created_at desc))[1]   as last_location,
  (array_agg(r.image_path order by r.created_at desc) filter (where r.image_path is not null))[1] as first_image_path
from boners b
left join records r on r.serial = b.serial
group by b.serial, b.created_at;
