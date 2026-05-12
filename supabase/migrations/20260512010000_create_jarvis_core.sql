-- Segundo Sol Jarvis core schema
-- Project: azorean-base / zifjbbhgeydgccjolmji

create extension if not exists pgcrypto;

create table if not exists public.jarvis_tracks (
  id uuid primary key default gen_random_uuid(),
  artist text not null,
  title text not null,
  display_title text generated always as (
    nullif(trim(coalesce(artist, '') || ' — ' || coalesce(title, '')), '—')
  ) stored,
  rating_bucket text not null default 'unrated'
    check (rating_bucket in ('must_play', 'maybe', 'archive', 'unrated')),
  notes text,
  bpm numeric(6,2),
  musical_key text,
  energy integer check (energy is null or energy between 1 and 5),
  mood text,
  genre text,
  played_count integer not null default 0 check (played_count >= 0),
  last_played_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jarvis_track_links (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.jarvis_tracks(id) on delete cascade,
  type text not null check (type in ('spotify', 'youtube', 'soundcloud', 'bandcamp', 'mixcloud', 'other')),
  url text not null,
  label text,
  created_at timestamptz not null default now(),
  unique (track_id, url)
);

create table if not exists public.jarvis_track_tags (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.jarvis_tracks(id) on delete cascade,
  tag text not null,
  created_at timestamptz not null default now(),
  unique (track_id, tag)
);

create table if not exists public.jarvis_picodrops_files (
  id uuid primary key default gen_random_uuid(),
  track_id uuid references public.jarvis_tracks(id) on delete set null,
  local_path text not null,
  source_url text,
  downloaded_at timestamptz,
  filename text,
  artist_from_tags text,
  title_from_tags text,
  created_at timestamptz not null default now(),
  unique (local_path)
);

create table if not exists public.jarvis_inspiration_sets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist_or_channel text,
  source_type text not null default 'other'
    check (source_type in ('youtube', 'soundcloud', 'mixcloud', 'spotify', 'other')),
  url text not null,
  notes text,
  flow_notes text,
  mood text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (url)
);

create table if not exists public.jarvis_episodes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  episode_number integer,
  planning_start date,
  planning_end date,
  status text not null default 'planning'
    check (status in ('planning', 'crate_built', 'recorded', 'published', 'archived')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (episode_number)
);

create table if not exists public.jarvis_episode_candidates (
  id uuid primary key default gen_random_uuid(),
  episode_id uuid not null references public.jarvis_episodes(id) on delete cascade,
  track_id uuid not null references public.jarvis_tracks(id) on delete cascade,
  status text not null default 'candidate'
    check (status in ('candidate', 'selected', 'rejected', 'deferred', 'played')),
  position_hint integer,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (episode_id, track_id)
);

create index if not exists jarvis_tracks_rating_bucket_idx on public.jarvis_tracks(rating_bucket);
create index if not exists jarvis_tracks_created_at_idx on public.jarvis_tracks(created_at desc);
create index if not exists jarvis_track_links_track_id_idx on public.jarvis_track_links(track_id);
create index if not exists jarvis_track_tags_tag_idx on public.jarvis_track_tags(tag);
create index if not exists jarvis_picodrops_files_track_id_idx on public.jarvis_picodrops_files(track_id);
create index if not exists jarvis_inspiration_sets_created_at_idx on public.jarvis_inspiration_sets(created_at desc);
create index if not exists jarvis_episodes_status_idx on public.jarvis_episodes(status);
create index if not exists jarvis_episode_candidates_episode_status_idx on public.jarvis_episode_candidates(episode_id, status);
create index if not exists jarvis_episode_candidates_track_id_idx on public.jarvis_episode_candidates(track_id);

create or replace function public.jarvis_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists jarvis_tracks_touch_updated_at on public.jarvis_tracks;
create trigger jarvis_tracks_touch_updated_at
before update on public.jarvis_tracks
for each row execute function public.jarvis_touch_updated_at();

drop trigger if exists jarvis_inspiration_sets_touch_updated_at on public.jarvis_inspiration_sets;
create trigger jarvis_inspiration_sets_touch_updated_at
before update on public.jarvis_inspiration_sets
for each row execute function public.jarvis_touch_updated_at();

drop trigger if exists jarvis_episodes_touch_updated_at on public.jarvis_episodes;
create trigger jarvis_episodes_touch_updated_at
before update on public.jarvis_episodes
for each row execute function public.jarvis_touch_updated_at();

drop trigger if exists jarvis_episode_candidates_touch_updated_at on public.jarvis_episode_candidates;
create trigger jarvis_episode_candidates_touch_updated_at
before update on public.jarvis_episode_candidates
for each row execute function public.jarvis_touch_updated_at();
