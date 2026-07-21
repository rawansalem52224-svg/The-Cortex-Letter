import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/profile";
import type { Post, ReactionSummary } from "@/lib/types";

export async function getReactionSummary(postId: string): Promise<ReactionSummary> {
  if (!isSupabaseConfigured) return { likeCount: 0, isLiked: false, isFavorited: false };

  const supabase = await createClient();
  const user = await getCurrentUser();

  const { count } = await supabase!
    .from("post_reactions")
    .select("id", { count: "exact", head: true })
    .eq("post_id", postId)
    .eq("type", "like");

  let isLiked = false;
  let isFavorited = false;

  if (user) {
    const { data } = await supabase!
      .from("post_reactions")
      .select("type")
      .eq("post_id", postId)
      .eq("user_id", user.id);

    isLiked = data?.some((r) => r.type === "like") ?? false;
    isFavorited = data?.some((r) => r.type === "favorite") ?? false;
  }

  return { likeCount: count ?? 0, isLiked, isFavorited };
}

/** Posts the current signed-in user has favorited, newest first. */
export async function getFavoritePosts(): Promise<Post[]> {
  if (!isSupabaseConfigured) return [];

  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data, error } = await supabase!
    .from("post_reactions")
    .select("created_at, posts(*)")
    .eq("user_id", user.id)
    .eq("type", "favorite")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  const rows = data as unknown as { posts: Post | Post[] | null }[];
  return rows.flatMap((row) => (Array.isArray(row.posts) ? row.posts : row.posts ? [row.posts] : []));
}
