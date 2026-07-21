import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { ArticleCard } from "@/components/article-card";
import { CATEGORY_LIST } from "@/lib/categories";
import { NewsletterForm } from "@/components/newsletter-form";
import { SignalPulse } from "@/components/signal-pulse";

export default async function Home() {
  const posts = await getPublishedPosts();
  const [lead, ...rest] = posts;
  const secondary = rest.slice(0, 2);
  const latest = rest.slice(2, 8);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
        <p className="eyebrow">Issue N&#176; 001 &middot; Neuroscience, examined</p>
        <h1 className="font-display mt-5 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
          Dispatches from the frontier of the mind.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          Peer-reviewed findings on memory, sleep, perception, and emotion — read carefully,
          explained plainly, and never oversold.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/articles"
            className="rounded-full bg-ink px-6 py-3 font-data text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            Read the latest
          </Link>
          <Link
            href="/write-for-us"
            className="rounded-full border border-border-strong px-6 py-3 font-data text-sm font-medium text-ink transition-colors hover:border-accent"
          >
            Apply to write &rarr;
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SignalPulse />
      </div>

      {/* Featured */}
      {lead && (
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <ArticleCard post={lead} variant="feature" />
            <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-surface px-6">
              {secondary.map((post) => (
                <ArticleCard key={post.id} post={post} variant="compact" />
              ))}
              {secondary.length === 0 && (
                <p className="py-8 text-sm text-muted">More articles are on the way.</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Latest grid */}
      {latest.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold text-ink">Latest articles</h2>
            <Link href="/articles" className="font-data text-sm text-accent-strong hover:underline">
              View all &rarr;
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Topics */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h2 className="font-display text-2xl font-semibold text-ink">Explore by topic</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {CATEGORY_LIST.map((c) => (
            <Link
              key={c.slug}
              href={`/articles?topic=${c.slug}`}
              className="group flex items-center gap-2 rounded-full border border-border px-5 py-2.5 transition-colors hover:border-border-strong"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: c.colorVar }} />
              <span className="font-data text-sm text-ink">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow">The weekly signal</p>
              <h2 className="font-display mt-3 text-3xl font-semibold leading-tight text-ink">
                One clear finding in your inbox, every week.
              </h2>
              <p className="mt-3 max-w-md text-muted">
                No hype, no oversimplified headlines — just the research and what it actually
                shows.
              </p>
            </div>
            <div className="lg:max-w-md lg:justify-self-end lg:w-full">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
