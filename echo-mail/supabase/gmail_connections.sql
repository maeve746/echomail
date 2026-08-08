create extension if not exists pgcrypto;

create table if not exists public.gmail_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  gmail_email text not null,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  scopes text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists gmail_connections_user_id_key
  on public.gmail_connections(user_id);

alter table public.gmail_connections enable row level security;

drop policy if exists "Users can read their own Gmail connection"
  on public.gmail_connections;

create policy "Users can read their own Gmail connection"
  on public.gmail_connections
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own Gmail connection"
  on public.gmail_connections;

create policy "Users can create their own Gmail connection"
  on public.gmail_connections
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own Gmail connection"
  on public.gmail_connections;

create policy "Users can update their own Gmail connection"
  on public.gmail_connections
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own Gmail connection"
  on public.gmail_connections;

create policy "Users can delete their own Gmail connection"
  on public.gmail_connections
  for delete
  using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_gmail_connections_updated_at
  on public.gmail_connections;

create trigger set_gmail_connections_updated_at
  before update on public.gmail_connections
  for each row
  execute function public.set_updated_at();
