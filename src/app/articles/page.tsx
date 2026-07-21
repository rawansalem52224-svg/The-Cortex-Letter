import { Suspense } from "react";
import type { Metadata } from "next";
import { getPublishedPosts, searchPosts } from "@/lib/posts";
import { CATEGORY_LIST, isCategorySlug } from "@/lib/categories";
import { ArticleCard } from "@/components/article-card";
import { SearchBar } from "@/components/search-bar";
import Link from "next/link";

export const metadata: Metadata = { title: "Articles — The Cortex Letter" };

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; q?: string }>;
}) {
  const { topic, q } = await searchParams;
  const all = await getPublishedPosts();

  const activeTopic = topic && isCategorySlug(topic) ? topic : null;
  const byTopic = activeTopic ? all.filter((p) => p.category === activeTopic) : all;
  const results = searchPosts(byTopic, q ?? "");

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <p className="eyebrow">Archive</p>
      <h1 className="font-display mt-3 text-4xl font-semibold text-ink sm:text-5xl">Articles</h1>

      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/articles"
            className={`rounded-full border px-4 py-2.5 font-data text-xs uppercase tracking-wide transition-colors ${
              !activeTopic
                ? "border-ink bg-ink text-bg"
                : "border-border text-muted hover:border-border-strong"
            }`}
          >
            All
          </Link>
          {CATEGORY_LIST.map((c) => (
            <Link
              key={c.slug}
              href={`/articles?topic=${c.slug}`}
              className={`rounded-full border px-4 py-2.5 font-data text-xs uppercase tracking-wide transition-colors ${
                activeTopic === c.slug
                  ? "border-ink bg-ink text-bg"
                  : "border-border text-muted hover:border-border-strong"
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>

        <Suspense fallback={<div className="h-10 w-72" />}>
          <SearchBar />
        </Suspense>
      </div>

      {results.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-muted">No articles match that search yet. Try another term or topic.</p>
        </div>
      )}
    </div>
  );
}
