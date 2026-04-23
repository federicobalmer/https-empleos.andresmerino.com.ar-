create extension if not exists "pgcrypto";

create type public.job_status as enum ('draft', 'published', 'paused', 'closed');
create type public.work_type as enum ('full_time', 'part_time', 'hybrid', 'remote');
create type public.application_status as enum (
  'nuevo',
  'en_revision',
  'entrevista',
  'rechazado',
  'contratado'
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  location text not null,
  work_type public.work_type not null,
  summary text not null,
  description text not null,
  requirements text[] not null default '{}',
  salary_range text,
  status public.job_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  city text not null,
  message text,
  cv_path text not null,
  cv_filename text not null,
  status public.application_status not null default 'nuevo',
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists jobs_set_updated_at on public.jobs;
create trigger jobs_set_updated_at
before update on public.jobs
for each row execute procedure public.set_updated_at();

create or replace function public.is_admin(check_user uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = check_user
  );
$$;

alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "public can read published jobs" on public.jobs;
create policy "public can read published jobs"
on public.jobs for select
using (status = 'published');

drop policy if exists "admins manage jobs" on public.jobs;
create policy "admins manage jobs"
on public.jobs for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "public can apply" on public.applications;
create policy "public can apply"
on public.applications for insert
with check (true);

drop policy if exists "admins can read applications" on public.applications;
create policy "admins can read applications"
on public.applications for select
using (public.is_admin(auth.uid()));

drop policy if exists "admins can update applications" on public.applications;
create policy "admins can update applications"
on public.applications for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "admins can read admin users" on public.admin_users;
create policy "admins can read admin users"
on public.admin_users for select
using (public.is_admin(auth.uid()));

drop policy if exists "user can read own admin row" on public.admin_users;
create policy "user can read own admin row"
on public.admin_users for select
using (user_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('cvs', 'cvs', false)
on conflict (id) do nothing;

drop policy if exists "admins can read cv files" on storage.objects;
create policy "admins can read cv files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'cvs'
  and public.is_admin(auth.uid())
);
