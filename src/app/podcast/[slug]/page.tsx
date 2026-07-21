import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getEpisodeBySlug, getPublishedEpisodes } from "@/lib/podcast";
import { ListenLinks } from "@/components/listen-links";
import { ShareButton } from "@/components/share-button";
import { EpisodeCard } from "@/components/episode-card";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const episode = await getEpisodeBySlug(slug);
  if (!episode) return { title: "Episode not found — The Cortex Letter" };
  return {
    title: `${episode.title} — The Cortex Letter Podcast`,
    description: episode.description,
  };
}

export default async function EpisodePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const episode = await getEpisodeBySlug(slug);
  if (!episode) notFound();

  const all = await getPublishedEpisodes();
  const more = all.filter((e) => e.id !== episode.id).slice(0, 2);

  return (
    <article>
      <div className="mx-auto max-w-3xl px-5 pb-6 pt-12 sm:px-8 sm:pt-16">
        <Link href="/podcast" className="font-data text-sm text-muted hover:text-ink">
          &larr; Back to podcast
        </Link>

        <p className="eyebrow mt-6">
          {episode.episode_number ? `Episode ${episode.episode_number}` : "Episode"}
          {episode.duration_minutes ? ` · ${episode.duration_minutes} min` : ""}
        </p>
        <h1 className="font-display mt-3 text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          {episode.title}
        </h1>
        <p className="font-data mt-4 text-base text-accent-strong">
          {episode.guest_name}
          {episode.guest_role ? ` — ${episode.guest_role}` : ""}
        </p>
      </div>

      {episode.cover_image && (
        <div className="mx-auto max-w-3xl px-5 pt-2 sm:px-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={episode.cover_image}
            alt=""
            className="aspect-[16/9] w-full rounded-2xl object-cover"
          />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        {episode.audio_embed_url && (
          <iframe
            src={episode.audio_embed_url}
            width="100%"
            height="152"
            style={{ borderRadius: 12, border: "none" }}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title={`Listen to ${episode.title}`}
          />
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ListenLinks
            spotifyUrl={episode.spotify_url}
            appleUrl={episode.apple_url}
            youtubeUrl={episode.youtube_url}
          />
          <ShareButton title={episode.title} />
        </div>

        <div className="prose-article mt-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{episode.description}</ReactMarkdown>
        </div>

        {episode.guest_bio && (
          <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
            <p className="eyebrow">About the guest</p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{episode.guest_bio}</p>
          </div>
        )}
      </div>

      {more.length > 0 && (
        <div className="border-t border-border">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
            <h2 className="font-display text-2xl font-semibold text-ink">More episodes</h2>
            <div className="mt-8 flex flex-col gap-5">
              {more.map((e) => (
                <EpisodeCard key={e.id} episode={e} />
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
