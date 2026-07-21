import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/profile";
import { getFavoritePosts } from "@/lib/reactions";
import { ArticleCard } from "@/components/article-card";

export const metadata: Metadata = { title: "Your favorites — The Cortex Letter" };

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const posts = await getFavoritePosts();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <p className="eyebrow">Your reading list</p>
      <h1 className="font-display mt-3 text-4xl font-semibold text-ink sm:text-5xl">Favorites</h1>

      {posts.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-muted">
            Nothing saved yet. Tap Save on any article to add it here.
          </p>
          <Link href="/articles" className="mt-4 inline-block font-data text-sm text-accent-strong hover:underline">
            Browse articles &rarr;
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
