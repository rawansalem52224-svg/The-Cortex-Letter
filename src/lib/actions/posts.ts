"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import readingTime from "reading-time";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentProfile } from "@/lib/profile";
import { slugify } from "@/lib/slugify";
import { isCategorySlug } from "@/lib/categories";

export type PostFormState = { status: "idle" | "error"; message?: string };

async function requireWriter() {
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== "writer" && profile.role !== "admin")) {
    return null;
  }
  return profile;
}

function readFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    coverImage: String(formData.get("cover_image") ?? "").trim(),
  };
}

export async function createPost(_prevState: PostFormState, formData: FormData): Promise<PostFormState> {
  if (!isSupabaseConfigured) return { status: "error", message: "Supabase isn't connected yet." };

  const profile = await requireWriter();
  if (!profile) return { status: "error", message: "Only writers can create posts." };

  const { title, excerpt, content, category, coverImage } = readFields(formData);

  if (!title || !excerpt || !content || !isCategorySlug(category)) {
    return { status: "error", message: "Fill in the title, excerpt, content, and topic." };
  }

  const supabase = await createClient();
  const baseSlug = slugify(title) || "article";
  let slug = baseSlug;

  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: existing } = await supabase!.from("posts").select("id").eq("slug", slug).maybeSingle();
    if (!existing) break;
    slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  const stats = readingTime(content);

  const { data: created, error } = await supabase!
    .from("posts")
    .insert({
      slug,
      title,
      excerpt,
      content,
      category,
      cover_image: coverImage || null,
      status: "draft",
      author_id: profile.id,
      author_name: profile.full_name || "Contributor",
      read_minutes: Math.max(1, Math.round(stats.minutes)),
    })
    .select("id")
    .single();

  if (error || !created) {
    return { status: "error", message: "Couldn't save that post. Try again." };
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/${created.id}/edit`);
}

export async function updatePost(
  postId: string,
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  if (!isSupabaseConfigured) return { status: "error", message: "Supabase isn't connected yet." };

  const profile = await requireWriter();
  if (!profile) return { status: "error", message: "Only writers can edit posts." };

  const { title, excerpt, content, category, coverImage } = readFields(formData);

  if (!title || !excerpt || !content || !isCategorySlug(category)) {
    return { status: "error", message: "Fill in the title, excerpt, content, and topic." };
  }

  const supabase = await createClient();
  const stats = readingTime(content);

  const query = supabase!
    .from("posts")
    .update({
      title,
      excerpt,
      content,
      category,
      cover_image: coverImage || null,
      read_minutes: Math.max(1, Math.round(stats.minutes)),
    })
    .eq("id", postId);

  const { error } =
    profile.role === "admin" ? await query : await query.eq("author_id", profile.id);

  if (error) return { status: "error", message: "Couldn't save changes." };

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${postId}/edit`);
  return { status: "idle", message: "Saved." };
}

export async function setPostStatus(postId: string, status: "draft" | "published") {
  if (!isSupabaseConfigured) return;
  const profile = await requireWriter();
  if (!profile) return;

  const supabase = await createClient();
  const query = supabase!
    .from("posts")
    .update({ status, published_at: status === "published" ? new Date().toISOString() : null })
    .eq("id", postId);

  if (profile.role === "admin") await query;
  else await query.eq("author_id", profile.id);

  revalidatePath("/dashboard");
  revalidatePath("/admin/posts");
  revalidatePath("/articles");
}

export async function deletePost(postId: string) {
  if (!isSupabaseConfigured) return;
  const profile = await requireWriter();
  if (!profile) return;

  const supabase = await createClient();
  const query = supabase!.from("posts").delete().eq("id", postId);

  if (profile.role === "admin") await query;
  else await query.eq("author_id", profile.id);

  revalidatePath("/dashboard");
  revalidatePath("/admin/posts");
}
