"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/profile";
import type { ReactionType } from "@/lib/types";

export async function toggleReaction(postId: string, slug: string, type: ReactionType): Promise<void> {
  if (!isSupabaseConfigured) return;

  const user = await getCurrentUser();
  if (!user) return;

  const supabase = await createClient();

  const { data: existing } = await supabase!
    .from("post_reactions")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .eq("type", type)
    .maybeSingle();

  if (existing) {
    await supabase!.from("post_reactions").delete().eq("id", existing.id);
  } else {
    await supabase!.from("post_reactions").insert({ post_id: postId, user_id: user.id, type });
  }

  revalidatePath(`/articles/${slug}`);
  revalidatePath("/favorites");
}
