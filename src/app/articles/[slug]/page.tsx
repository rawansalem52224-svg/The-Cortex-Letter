import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { sanitizePostHtml } from "@/lib/sanitize";
import { getPostBySlug, getPublishedPosts } from "@/lib/posts";
import { getReactionSummary } from "@/lib/reactions";
import { getCurrentUser } from "@/lib/profile";
import { getHighlightsForPost } from "@/lib/highlights";
import { CategoryPill } from "@/components/category-pill";
import { ArticleCard } from "@/components/article-card";
import { ReadingProgress } from "@/components/reading-progress";
import { LikeButton } from "@/components/like-button";
import { FavoriteButton } from "@/components/favorite-button";
import { ShareButton } from "@/components/share-button";
import { CommentSection } from "@/components/comment-section";
import { ArticleHighlighter } from "@/components/article-highlighter";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found — The Cortex Letter" };
  return {
    title: `${post.title} — The Cortex Letter`,
    description: post.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [all, reactions, user, highlights] = await Promise.all([
    getPublishedPosts(),
    getReactionSummary(post.id),
    getCurrentUser(),
    getHighlightsForPost(post.id),
  ]);
  const more = all.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 2);
  const date = post.published_at ?? post.created_at;

  return (
    <article>
      <ReadingProgress />

      <div className="mx-auto max-w-3xl px-5 pb-6 pt-12 sm:px-8 sm:pt-16">
        <Link href="/articles" className="font-data text-sm text-muted hover:text-ink">
          &larr; Back to articles
        </Link>

        <div className="mt-6">
          <CategoryPill category={post.category} size="md" />
        </div>
        <h1 className="font-display mt-4 text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          {post.title}
        </h1>

        <div className="font-data mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
          <span>{post.author_name}</span>
          <span aria-hidden>&middot;</span>
          <span>{format(new Date(date), "MMMM d, yyyy")}</span>
          <span aria-hidden>&middot;</span>
          <span>{post.read_minutes} min read</span>
        </div>

        <p className="font-data mt-4 flex items-center gap-2 text-sm text-muted">
          <span
            aria-hidden
            className="inline-block h-3 w-3 shrink-0 rounded-sm"
            style={{ backgroundColor: "color-mix(in srgb, #facc15 55%, transparent)" }}
          />
          {user ? (
            <span>
              Tip: select any passage to highlight it and add a note. Find them all in{" "}
              <Link href="/notes" className="text-accent-strong hover:underline">
                Quotes &amp; notes
              </Link>
              .
            </span>
          ) : (
            <span>
              Tip: select any passage to copy or share it.{" "}
              <Link href="/login" className="text-accent-strong hover:underline">
                Sign in
              </Link>{" "}
              to highlight and keep notes.
            </span>
          )}
        </p>
      </div>

      {post.cover_image && (
        <div className="mx-auto max-w-3xl px-5 pt-6 sm:px-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_image}
            alt=""
            className="aspect-[16/9] w-full rounded-2xl object-cover"
          />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <ArticleHighlighter
          html={sanitizePostHtml(post.content)}
          postId={post.id}
          title={post.title}
          authorName={post.author_name}
          signedIn={Boolean(user)}
          initialHighlights={highlights}
        />

        <div className="mt-10 flex flex-wrap items-center gap-3 border-y border-border py-6">
          <LikeButton
            postId={post.id}
            slug={post.slug}
            signedIn={Boolean(user)}
            initialLiked={reactions.isLiked}
            initialCount={reactions.likeCount}
          />
          <FavoriteButton
            postId={post.id}
            slug={post.slug}
            signedIn={Boolean(user)}
            initialFavorited={reactions.isFavorited}
          />
          <ShareButton title={post.title} />
        </div>

        <div className="mt-14">
          <CommentSection postId={post.id} slug={post.slug} />
        </div>
      </div>

      {more.length > 0 && (
        <div className="border-t border-border">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
            <h2 className="font-display text-2xl font-semibold text-ink">More on {post.category}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {more.map((p) => (
                <ArticleCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
