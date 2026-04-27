insert into posts (title, content) values (
  'Are we so back?',
  '<p>After a many-year hiatus, we are asking the hard questions.</p>
<div class="media"><img src="https://xlojicyooqatkvyfwhbm.supabase.co/storage/v1/object/public/record-images/blog/are_we_so_back.jpeg" alt="Are we so back?" style="max-width:500px" /></div>'
) on conflict do nothing;
