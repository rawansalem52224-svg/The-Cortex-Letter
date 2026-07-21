import Link from "next/link";
import { format } from "date-fns";
import type { Post } from "@/lib/types";
import { CategoryPill } from "@/components/category-pill";

export function ArticleCard({
  post,
  variant = "default",
}: {
  post: Post;
  variant?: "feature" | "default" | "compact";
}) {
  const date = post.published_at ?? post.created_at;

  if (variant === "feature") {
    return (
      <Link
        href={`/articles/${post.slug}`}
        className="group block rounded-2xl border border-border bg-surface p-8 transition-colors hover:border-border-strong sm:p-10"
      >
        {post.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image}
            alt=""
            className="mb-6 aspect-[16/9] w-full rounded-xl object-cover"
          />
        )}
        <CategoryPill category={post.category} size="md" />
        <h2 className="font-display mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {post.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{post.excerpt}</p>
        <div className="font-data mt-6 flex items-center gap-3 text-xs text-muted">
          <span>{post.author_name}</span>
          <span aria-hidden>&middot;</span>
          <span>{format(new Date(date), "MMM d, yyyy")}</span>
          <span aria-hidden>&middot;</span>
          <span>{post.read_minutes} min read</span>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/articles/${post.slug}`} className="group flex flex-col gap-1.5 py-4">
        <CategoryPill category={post.category} />
        <h3 className="font-display text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-accent-strong">
          {post.title}
        </h3>
        <div className="font-data text-xs text-muted">
          {format(new Date(date), "MMM d, yyyy")} &middot; {post.read_minutes} min read
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/articles/${post.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-surface p-6 transition-colors hover:border-border-strong"
    >
      {post.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_image}
          alt=""
          className="-mx-6 -mt-6 mb-5 aspect-[16/9] w-[calc(100%+3rem)] rounded-t-xl object-cover"
        />
      )}
      <CategoryPill category={post.category} />
      <h3 className="font-display mt-3 text-xl font-semibold leading-snug text-ink">{post.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
      <div className="font-data mt-5 flex items-center gap-2.5 text-xs text-muted">
        <span>{post.author_name}</span>
        <span aria-hidden>&middot;</span>
        <span>{format(new Date(date), "MMM d, yyyy")}</span>
        <span aria-hidden>&middot;</span>
        <span>{post.read_minutes} min</span>
      </div>
    </Link>
  );
}
