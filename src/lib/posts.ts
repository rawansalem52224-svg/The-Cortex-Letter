import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SEED_POSTS } from "@/lib/seed-data";
import type { CategorySlug } from "@/lib/categories";
import type { Post } from "@/lib/types";

function sortByPublishedDesc(posts: Post[]) {
  return [...posts].sort(
    (a, b) => new Date(b.published_at ?? b.created_at).getTime() - new Date(a.published_at ?? a.created_at).getTime()
  );
}

/** All published posts, newest first. Falls back to placeholder seed data until Supabase is connected. */
export async function getPublishedPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured) return sortByPublishedDesc(SEED_POSTS);

  const supabase = await createClient();
  const { data, error } = await supabase!
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) return sortByPublishedDesc(SEED_POSTS);
  return data as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured) {
    return SEED_POSTS.find((p) => p.slug === slug) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase!
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  return data as Post;
}

export async function getPostsByCategory(category: CategorySlug): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return posts.filter((p) => p.category === category);
}

export function searchPosts(posts: Post[], query: string): Post[] {
  const q = query.trim().toLowerCase();
  if (!q) return posts;
  return posts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}

/** Every post (draft + published) belonging to one author, for the writer dashboard. */
export async function getPostsByAuthor(authorId: string): Promise<Post[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase!
    .from("posts")
    .select("*")
    .eq("author_id", authorId)
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return data as Post[];
}

/** Every post across every author, for the admin dashboard. */
export async function getAllPostsForAdmin(): Promise<Post[]> {
  if (!isSupabaseConfigured) return sortByPublishedDesc(SEED_POSTS);

  const supabase = await createClient();
  const { data, error } = await supabase!
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return data as Post[];
}

export async function getPostById(id: string): Promise<Post | null> {
  if (!isSupabaseConfigured) return SEED_POSTS.find((p) => p.id === id) ?? null;

  const supabase = await createClient();
  const { data, error } = await supabase!.from("posts").select("*").eq("id", id).maybeSingle();

  if (error || !data) return null;
  return data as Post;
}
