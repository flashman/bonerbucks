create or replace view public.boners_with_stats with (security_invoker = on) as
  select
    b.serial,
    b.created_at,
    count(r.id)::integer as sighting_count,
    max(r.created_at) as last_seen_at,
    (array_agg(r.location order by r.created_at desc))[1] as last_location,
    (array_agg(r.image_path order by r.created_at desc) filter (where r.image_path is not null))[1] as first_image_path
  from boners b
  left join records r on r.serial = b.serial
  group by b.serial, b.created_at;
