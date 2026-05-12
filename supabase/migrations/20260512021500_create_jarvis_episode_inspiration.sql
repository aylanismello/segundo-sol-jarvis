create table if not exists public.jarvis_episode_inspiration_sets (
  id uuid primary key default gen_random_uuid(),
  episode_id uuid not null references public.jarvis_episodes(id) on delete cascade,
  inspiration_set_id uuid not null references public.jarvis_inspiration_sets(id) on delete cascade,
  notes text,
  created_at timestamptz not null default now(),
  unique (episode_id, inspiration_set_id)
);

create index if not exists jarvis_episode_inspiration_sets_episode_id_idx
  on public.jarvis_episode_inspiration_sets(episode_id);

create index if not exists jarvis_episode_inspiration_sets_inspiration_set_id_idx
  on public.jarvis_episode_inspiration_sets(inspiration_set_id);
