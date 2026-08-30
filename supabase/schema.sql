-- The Cortex Letter — database schema
-- Run this once in your Supabase project's SQL Editor (https://supabase.com/dashboard -> your project -> SQL Editor).

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- profiles: one row per auth user. role controls dashboard access.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role text not null default 'reader' check (role in ('reader', 'writer', 'admin')),
  bio text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can update any profile"
  on public.profiles for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Auto-create a profile row (default role: reader) whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- posts
-- ─────────────────────────────────────────────────────────────
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  cover_image text,
  category text not null check (category in ('memory', 'sleep', 'neuroplasticity', 'perception', 'emotion', 'clinical')),
  status text not null default 'draft' check (status in ('draft', 'published')),
  author_id uuid not null references public.profiles (id) on delete cascade,
  author_name text not null default '',
  read_minutes int not null default 5,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.posts.content is 'Sanitized HTML produced by the rich text editor (not Markdown).';

create index if not exists posts_status_idx on public.posts (status);
create index if not exists posts_category_idx on public.posts (category);
create index if not exists posts_author_idx on public.posts (author_id);

alter table public.posts enable row level security;

create policy "Published posts are publicly readable"
  on public.posts for select
  using (status = 'published');

create policy "Authors can read their own posts"
  on public.posts for select
  using (auth.uid() = author_id);

create policy "Admins can read every post"
  on public.posts for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Writers and admins can create posts"
  on public.posts for insert
  with check (
    auth.uid() = author_id
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('writer', 'admin'))
  );

create policy "Authors can update their own posts"
  on public.posts for update
  using (auth.uid() = author_id);

create policy "Admins can update any post"
  on public.posts for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Authors can delete their own posts"
  on public.posts for delete
  using (auth.uid() = author_id);

create policy "Admins can delete any post"
  on public.posts for delete
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Keep updated_at current.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- writer_applications
-- ─────────────────────────────────────────────────────────────
create table if not exists public.writer_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid references auth.users (id) on delete set null,
  full_name text not null,
  email text not null,
  background text not null default '',
  pitch text not null default '',
  sample_link text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists writer_applications_status_idx on public.writer_applications (status);

alter table public.writer_applications enable row level security;

create policy "Applicants can submit an application"
  on public.writer_applications for insert
  with check (auth.uid() = applicant_id);

create policy "Applicants can read their own applications"
  on public.writer_applications for select
  using (auth.uid() = applicant_id);

create policy "Admins can read every application"
  on public.writer_applications for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Admins can update applications"
  on public.writer_applications for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ─────────────────────────────────────────────────────────────
-- newsletter_subscribers
-- ─────────────────────────────────────────────────────────────
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert
  with check (true);

create policy "Admins can read subscribers"
  on public.newsletter_subscribers for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ─────────────────────────────────────────────────────────────
-- post_reactions: likes (public counts) and favorites (private reading list)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('like', 'favorite')),
  created_at timestamptz not null default now(),
  unique (post_id, user_id, type)
);

create index if not exists post_reactions_post_idx on public.post_reactions (post_id);
create index if not exists post_reactions_user_idx on public.post_reactions (user_id);

alter table public.post_reactions enable row level security;

create policy "Likes are publicly visible"
  on public.post_reactions for select
  using (type = 'like');

create policy "Users can read their own reactions"
  on public.post_reactions for select
  using (auth.uid() = user_id);

create policy "Users can add their own reactions"
  on public.post_reactions for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own reactions"
  on public.post_reactions for delete
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- comments
-- ─────────────────────────────────────────────────────────────
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  author_name text not null default '',
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_post_idx on public.comments (post_id);

alter table public.comments enable row level security;

create policy "Comments are readable on published posts"
  on public.comments for select
  using (exists (select 1 from public.posts p where p.id = comments.post_id and p.status = 'published'));

create policy "Signed-in readers can comment"
  on public.comments for insert
  with check (auth.uid() = author_id);

create policy "Authors can delete their own comments"
  on public.comments for delete
  using (auth.uid() = author_id);

create policy "Admins can delete any comment"
  on public.comments for delete
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ─────────────────────────────────────────────────────────────
-- podcast_episodes: admin-managed, not open to writer applicants
-- ─────────────────────────────────────────────────────────────
create table if not exists public.podcast_episodes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  guest_name text not null default '',
  guest_role text not null default '',
  guest_bio text,
  cover_image text,
  audio_embed_url text,
  spotify_url text,
  apple_url text,
  youtube_url text,
  episode_number int,
  duration_minutes int,
  status text not null default 'draft' check (status in ('draft', 'published')),
  author_id uuid not null references public.profiles (id) on delete cascade,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists podcast_episodes_status_idx on public.podcast_episodes (status);

alter table public.podcast_episodes enable row level security;

create policy "Published episodes are publicly readable"
  on public.podcast_episodes for select
  using (status = 'published');

create policy "Admins can read every episode"
  on public.podcast_episodes for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Admins can create episodes"
  on public.podcast_episodes for insert
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Admins can update episodes"
  on public.podcast_episodes for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "Admins can delete episodes"
  on public.podcast_episodes for delete
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop trigger if exists podcast_episodes_set_updated_at on public.podcast_episodes;
create trigger podcast_episodes_set_updated_at
  before update on public.podcast_episodes
  for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- Make yourself an admin after your first signup:
--
--   update public.profiles set role = 'admin' where id =
--     (select id from auth.users where email = 'you@example.com');
-- ─────────────────────────────────────────────────────────────
