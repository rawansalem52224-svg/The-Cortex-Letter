import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/profile";
import type { Highlight, HighlightWithPost } from "@/lib/types";

const HIGHLIGHT_COLUMNS = "id, post_id, quote, start_offset, end_offset, prefix, suffix, color, note, created_at";

/** The signed-in reader's highlights on one article, in reading order. */
export async function getHighlightsForPost(postId: string): Promise<Highlight[]> {
  if (!isSupabaseConfigured) return [];

  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data, error } = await supabase!
    .from("post_highlights")
    .select(HIGHLIGHT_COLUMNS)
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .order("start_offset", { ascending: true });

  if (error || !data) return [];
  return data as Highlight[];
}

/** Every highlight the signed-in reader has made, newest first, with its article. */
export async function getAllHighlights(): Promise<HighlightWithPost[]> {
  if (!isSupabaseConfigured) return [];

  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data, error } = await supabase!
    .from("post_highlights")
    .select(`${HIGHLIGHT_COLUMNS}, posts(slug, title, author_name)`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  type Row = Highlight & { posts: HighlightWithPost["post"] | HighlightWithPost["post"][] };
  return (data as unknown as Row[]).map(({ posts, ...highlight }) => ({
    ...highlight,
    post: Array.isArray(posts) ? posts[0] ?? null : posts,
  }));
}
