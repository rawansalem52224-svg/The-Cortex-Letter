import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { PodcastEpisode } from "@/lib/types";

export async function getPublishedEpisodes(): Promise<PodcastEpisode[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase!
    .from("podcast_episodes")
    .select("*")
    .eq("status", "published")
    .order("episode_number", { ascending: false, nullsFirst: false });

  if (error || !data) return [];
  return data as PodcastEpisode[];
}

export async function getEpisodeBySlug(slug: string): Promise<PodcastEpisode | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const { data, error } = await supabase!
    .from("podcast_episodes")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  return data as PodcastEpisode;
}

export async function getEpisodeById(id: string): Promise<PodcastEpisode | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const { data, error } = await supabase!.from("podcast_episodes").select("*").eq("id", id).maybeSingle();

  if (error || !data) return null;
  return data as PodcastEpisode;
}

export async function getAllEpisodesForAdmin(): Promise<PodcastEpisode[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase!
    .from("podcast_episodes")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return data as PodcastEpisode[];
}
