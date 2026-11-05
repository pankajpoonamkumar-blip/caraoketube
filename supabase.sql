-- Run once in Supabase: SQL Editor -> New query -> paste -> Run
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  is_vip boolean not null default false,
  vip_until timestamptz
);
create table public.favorites (
  user_id uuid not null references auth.users on delete cascade,
  video_id text not null, title text, channel text, thumb text,
  created_at timestamptz not null default now(),
  primary key (user_id, video_id)
);
alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
-- Users can read their own profile but never edit it (VIP is set only by your payment webhook).
create policy "read own profile" on public.profiles for select using (auth.uid() = id);
create policy "own favorites" on public.favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create function public.new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.profiles (id) values (new.id); return new; end $$;
create trigger on_signup after insert on auth.users for each row execute function public.new_user();
