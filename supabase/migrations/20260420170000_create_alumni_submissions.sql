create extension if not exists pgcrypto;

create table if not exists public.alumni_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  graduation_year integer not null,
  branch text not null,
  current_role text not null,
  current_company text not null,
  city_country text,
  linkedin_url text,
  advice text not null,
  skills_helped text not null,
  career_path text not null,
  status text not null default 'pending'
);

alter table public.alumni_submissions enable row level security;

grant insert on table public.alumni_submissions to anon;
grant select on table public.alumni_submissions to authenticated;

create policy "Allow anonymous inserts to alumni_submissions"
  on public.alumni_submissions
  for insert
  to anon
  with check (true);

create policy "Allow authenticated selects from alumni_submissions"
  on public.alumni_submissions
  for select
  to authenticated
  using (true);
