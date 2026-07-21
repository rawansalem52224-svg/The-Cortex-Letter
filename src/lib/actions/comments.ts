"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser, getCurrentProfile } from "@/lib/profile";

export type CommentState = { status: "idle" | "error"; message?: string };

export async function addComment(
  postId: string,
  slug: string,
  _prevState: CommentState,
  formData: FormData
): Promise<CommentState> {
  if (!isSupabaseConfigured) {
    return { status: "error", message: "Comments aren't connected yet — set up Supabase first." };
  }

  const user = await getCurrentUser();
  const profile = await getCurrentProfile();
  if (!user || !profile) {
    return { status: "error", message: "Sign in to leave a comment." };
  }

  const content = String(formData.get("content") ?? "").trim();
  if (!content) {
    return { status: "error", message: "Write something before posting." };
  }

  const supabase = await createClient();
  const { error } = await supabase!.from("comments").insert({
    post_id: postId,
    author_id: user.id,
    author_name: profile.full_name || "Reader",
    content,
  });

  if (error) {
    return { status: "error", message: "Couldn't post that comment. Try again." };
  }

  revalidatePath(`/articles/${slug}`);
  return { status: "idle" };
}

export async function deleteComment(commentId: string, slug: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  const profile = await getCurrentProfile();
  if (!profile) return;

  const supabase = await createClient();
  const query = supabase!.from("comments").delete().eq("id", commentId);

  if (profile.role === "admin") {
    await query;
  } else {
    await query.eq("author_id", profile.id);
  }

  revalidatePath(`/articles/${slug}`);
}
