import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/profile";
import { getAllHighlights } from "@/lib/highlights";
import { NoteCard } from "@/components/note-card";
import type { HighlightWithPost } from "@/lib/types";

export const metadata: Metadata = { title: "Your notes — The Cortex Letter" };

export default async function NotesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const highlights = await getAllHighlights();

  // Group by article, keeping the article with the newest highlight first.
  const groups = new Map<string, { post: NonNullable<HighlightWithPost["post"]>; items: HighlightWithPost[] }>();
  for (const h of highlights) {
    if (!h.post) continue; // Article was deleted or unpublished.
    const group = groups.get(h.post.slug) ?? { post: h.post, items: [] };
    group.items.push(h);
    groups.set(h.post.slug, group);
  }
  for (const group of groups.values()) {
    group.items.sort((a, b) => a.start_offset - b.start_offset);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <p className="eyebrow">Your commonplace book</p>
      <h1 className="font-display mt-3 text-4xl font-semibold text-ink sm:text-5xl">Quotes &amp; notes</h1>
      <p className="mt-4 text-muted">
        Everything you&rsquo;ve highlighted, with your notes. Only you can see this page.
      </p>

      {groups.size === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-muted">
            No highlights yet. Select any passage in an article to highlight it in your colour and add a note.
          </p>
          <Link href="/articles" className="mt-4 inline-block font-data text-sm text-accent-strong hover:underline">
            Browse articles &rarr;
          </Link>
        </div>
      ) : (
        <div className="mt-12 space-y-14">
          {[...groups.values()].map(({ post, items }) => (
            <section key={post.slug} aria-labelledby={`notes-${post.slug}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border pb-3">
                <h2 id={`notes-${post.slug}`} className="font-display text-2xl font-semibold text-ink">
                  <Link href={`/articles/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
                <span className="font-data text-sm text-muted">
                  {post.author_name} &middot; {items.length} {items.length === 1 ? "highlight" : "highlights"}
                </span>
              </div>
              <ul className="mt-6 space-y-5">
                {items.map((h) => (
                  <li key={h.id}>
                    <NoteCard highlight={h} slug={post.slug} title={post.title} authorName={post.author_name} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
