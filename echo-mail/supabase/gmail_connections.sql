create table if not exists public.gmail_connections (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  access_token_encrypted text not null,
  refresh_token_encrypted text,
  scope text,
  token_type text,
  expiry_date timestamptz,
  connected_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.gmail_connections enable row level security;

create policy "Users can read their own Gmail connection"
  on public.gmail_connections
  for select
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
