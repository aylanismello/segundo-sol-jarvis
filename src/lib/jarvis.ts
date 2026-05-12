import { createClient } from "@supabase/supabase-js";

export type Track = {
  id: string;
  artist: string;
  title: string;
  display_title: string | null;
  rating_bucket: "must_play" | "maybe" | "archive" | "unrated";
  notes: string | null;
  created_at: string;
  jarvis_track_tags?: { tag: string }[];
  jarvis_track_links?: { type: string; url: string; label: string | null }[];
  jarvis_picodrops_files?: { local_path: string; downloaded_at: string | null; source_url: string | null }[];
};

export type InspirationSet = {
  id: string;
  title: string;
  artist_or_channel: string | null;
  source_type: string;
  url: string;
  notes: string | null;
  flow_notes: string | null;
  created_at: string;
};

export type Episode = {
  id: string;
  title: string;
  episode_number: number | null;
  planning_start: string | null;
  planning_end: string | null;
  status: "planning" | "crate_built" | "recorded" | "published" | "archived";
  notes: string | null;
  jarvis_episode_candidates?: { status: string; track_id: string }[];
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getJarvisClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getJarvisData() {
  const supabase = getJarvisClient();

  const [tracks, inspirationSets, episodes] = await Promise.all([
    supabase
      .from("jarvis_tracks")
      .select("*, jarvis_track_tags(tag), jarvis_track_links(type,url,label), jarvis_picodrops_files(local_path,downloaded_at,source_url)")
      .order("created_at", { ascending: false })
      .limit(60),
    supabase
      .from("jarvis_inspiration_sets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(24),
    supabase
      .from("jarvis_episodes")
      .select("*, jarvis_episode_candidates(status, track_id)")
      .order("episode_number", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  for (const result of [tracks, inspirationSets, episodes]) {
    if (result.error) throw result.error;
  }

  return {
    tracks: (tracks.data ?? []) as Track[],
    inspirationSets: (inspirationSets.data ?? []) as InspirationSet[],
    episodes: (episodes.data ?? []) as Episode[],
  };
}
