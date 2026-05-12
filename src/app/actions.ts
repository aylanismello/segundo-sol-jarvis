"use server";

import { revalidatePath } from "next/cache";
import { getJarvisClient } from "@/lib/jarvis";

function text(formData: FormData, key: string) {
  const value = formData.get(key)?.toString().trim();
  return value ? value : null;
}

function tags(value: string | null) {
  return (value ?? "")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}

function sourceType(url: string | null) {
  if (!url) return "other";
  if (url.includes("spotify.com")) return "spotify";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("soundcloud.com")) return "soundcloud";
  if (url.includes("bandcamp.com")) return "bandcamp";
  if (url.includes("mixcloud.com")) return "mixcloud";
  return "other";
}

export async function addTrack(formData: FormData) {
  const supabase = getJarvisClient();
  const artist = text(formData, "artist");
  const title = text(formData, "title");
  const sourceUrl = text(formData, "source_url");
  const localPath = text(formData, "local_path");
  const tagList = tags(text(formData, "tags"));

  if (!artist || !title) return;

  const { data: track, error } = await supabase
    .from("jarvis_tracks")
    .insert({
      artist,
      title,
      rating_bucket: text(formData, "rating_bucket") ?? "unrated",
      notes: text(formData, "notes"),
    })
    .select("id")
    .single();

  if (error) throw error;

  const inserts = [];
  if (sourceUrl) {
    inserts.push(
      supabase.from("jarvis_track_links").insert({
        track_id: track.id,
        type: sourceType(sourceUrl),
        url: sourceUrl,
      }),
    );
  }
  if (localPath) {
    inserts.push(
      supabase.from("jarvis_picodrops_files").insert({
        track_id: track.id,
        local_path: localPath,
        source_url: sourceUrl,
        downloaded_at: new Date().toISOString(),
        filename: localPath.split("/").pop(),
      }),
    );
  }
  if (tagList.length) {
    inserts.push(
      supabase.from("jarvis_track_tags").insert(tagList.map((tag) => ({ track_id: track.id, tag }))),
    );
  }

  const results = await Promise.all(inserts);
  const failed = results.find((result) => result.error);
  if (failed?.error) throw failed.error;

  revalidatePath("/");
}

export async function addInspirationSet(formData: FormData) {
  const supabase = getJarvisClient();
  const title = text(formData, "title");
  const url = text(formData, "url");
  if (!title || !url) return;

  const { error } = await supabase.from("jarvis_inspiration_sets").insert({
    title,
    url,
    artist_or_channel: text(formData, "artist_or_channel"),
    source_type: sourceType(url),
    notes: text(formData, "notes"),
    flow_notes: text(formData, "flow_notes"),
  });

  if (error) throw error;
  revalidatePath("/");
}

export async function addEpisode(formData: FormData) {
  const supabase = getJarvisClient();
  const episodeNumber = text(formData, "episode_number");
  const title = text(formData, "title") ?? (episodeNumber ? `Episode ${episodeNumber}` : `Episode ${new Date().toLocaleDateString("en-US")}`);

  const { error } = await supabase.from("jarvis_episodes").insert({
    title,
    episode_number: episodeNumber ? Number(episodeNumber) : null,
    planning_start: text(formData, "planning_start"),
    planning_end: text(formData, "planning_end"),
    status: text(formData, "status") ?? "planning",
    notes: text(formData, "notes"),
  });

  if (error) throw error;
  revalidatePath("/");
}

export async function addCandidate(formData: FormData) {
  const supabase = getJarvisClient();
  const episodeId = text(formData, "episode_id");
  const trackId = text(formData, "track_id");
  if (!episodeId || !trackId) return;

  const { error } = await supabase.from("jarvis_episode_candidates").upsert(
    {
      episode_id: episodeId,
      track_id: trackId,
      status: text(formData, "status") ?? "candidate",
      notes: text(formData, "notes"),
    },
    { onConflict: "episode_id,track_id" },
  );

  if (error) throw error;
  revalidatePath("/");
}

export async function attachInspirationToEpisode(formData: FormData) {
  const supabase = getJarvisClient();
  const episodeId = text(formData, "episode_id");
  const inspirationSetId = text(formData, "inspiration_set_id");
  if (!episodeId || !inspirationSetId) return;

  const { error } = await supabase.from("jarvis_episode_inspiration_sets").upsert(
    {
      episode_id: episodeId,
      inspiration_set_id: inspirationSetId,
      notes: text(formData, "notes"),
    },
    { onConflict: "episode_id,inspiration_set_id" },
  );

  if (error) throw error;
  revalidatePath("/");
}
