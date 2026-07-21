"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentProfile } from "@/lib/profile";
import { slugify } from "@/lib/slugify";

export type EpisodeFormState = { status: "idle" | "error"; message?: string };

async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") return null;
  return profile;
}

function readFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    guestName: String(formData.get("guest_name") ?? "").trim(),
    guestRole: String(formData.get("guest_role") ?? "").trim(),
    guestBio: String(formData.get("guest_bio") ?? "").trim(),
    coverImage: String(formData.get("cover_image") ?? "").trim(),
    audioEmbedUrl: String(formData.get("audio_embed_url") ?? "").trim(),
    spotifyUrl: String(formData.get("spotify_url") ?? "").trim(),
    appleUrl: String(formData.get("apple_url") ?? "").trim(),
    youtubeUrl: String(formData.get("youtube_url") ?? "").trim(),
    episodeNumber: String(formData.get("episode_number") ?? "").trim(),
    durationMinutes: String(formData.get("duration_minutes") ?? "").trim(),
  };
}

export async function createEpisode(
  _prevState: EpisodeFormState,
  formData: FormData
): Promise<EpisodeFormState> {
  if (!isSupabaseConfigured) return { status: "error", message: "Supabase isn't connected yet." };

  const profile = await requireAdmin();
  if (!profile) return { status: "error", message: "Only admins can add episodes." };

  const fields = readFields(formData);
  if (!fields.title || !fields.description || !fields.guestName) {
    return { status: "error", message: "Fill in the title, description, and guest name." };
  }

  const supabase = await createClient();
  const baseSlug = slugify(fields.title) || "episode";
  let slug = baseSlug;

  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: existing } = await supabase!
      .from("podcast_episodes")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  const { data: created, error } = await supabase!
    .from("podcast_episodes")
    .insert({
      slug,
      title: fields.title,
      description: fields.description,
      guest_name: fields.guestName,
      guest_role: fields.guestRole,
      guest_bio: fields.guestBio || null,
      cover_image: fields.coverImage || null,
      audio_embed_url: fields.audioEmbedUrl || null,
      spotify_url: fields.spotifyUrl || null,
      apple_url: fields.appleUrl || null,
      youtube_url: fields.youtubeUrl || null,
      episode_number: fields.episodeNumber ? Number(fields.episodeNumber) : null,
      duration_minutes: fields.durationMinutes ? Number(fields.durationMinutes) : null,
      status: "draft",
      author_id: profile.id,
    })
    .select("id")
    .single();

  if (error || !created) {
    return { status: "error", message: "Couldn't save that episode. Try again." };
  }

  revalidatePath("/admin/podcast");
  redirect(`/admin/podcast/${created.id}/edit`);
}

export async function updateEpisode(
  episodeId: string,
  _prevState: EpisodeFormState,
  formData: FormData
): Promise<EpisodeFormState> {
  if (!isSupabaseConfigured) return { status: "error", message: "Supabase isn't connected yet." };

  const profile = await requireAdmin();
  if (!profile) return { status: "error", message: "Only admins can edit episodes." };

  const fields = readFields(formData);
  if (!fields.title || !fields.description || !fields.guestName) {
    return { status: "error", message: "Fill in the title, description, and guest name." };
  }

  const supabase = await createClient();
  const { error } = await supabase!
    .from("podcast_episodes")
    .update({
      title: fields.title,
      description: fields.description,
      guest_name: fields.guestName,
      guest_role: fields.guestRole,
      guest_bio: fields.guestBio || null,
      cover_image: fields.coverImage || null,
      audio_embed_url: fields.audioEmbedUrl || null,
      spotify_url: fields.spotifyUrl || null,
      apple_url: fields.appleUrl || null,
      youtube_url: fields.youtubeUrl || null,
      episode_number: fields.episodeNumber ? Number(fields.episodeNumber) : null,
      duration_minutes: fields.durationMinutes ? Number(fields.durationMinutes) : null,
    })
    .eq("id", episodeId);

  if (error) return { status: "error", message: "Couldn't save changes." };

  revalidatePath("/admin/podcast");
  revalidatePath(`/admin/podcast/${episodeId}/edit`);
  return { status: "idle", message: "Saved." };
}

export async function setEpisodeStatus(episodeId: string, status: "draft" | "published") {
  if (!isSupabaseConfigured) return;
  const profile = await requireAdmin();
  if (!profile) return;

  const supabase = await createClient();
  await supabase!
    .from("podcast_episodes")
    .update({ status, published_at: status === "published" ? new Date().toISOString() : null })
    .eq("id", episodeId);

  revalidatePath("/admin/podcast");
  revalidatePath("/podcast");
}

export async function deleteEpisode(episodeId: string) {
  if (!isSupabaseConfigured) return;
  const profile = await requireAdmin();
  if (!profile) return;

  const supabase = await createClient();
  await supabase!.from("podcast_episodes").delete().eq("id", episodeId);

  revalidatePath("/admin/podcast");
  revalidatePath("/podcast");
}
