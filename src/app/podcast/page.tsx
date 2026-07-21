import type { Metadata } from "next";
import { getPublishedEpisodes } from "@/lib/podcast";
import { EpisodeCard } from "@/components/episode-card";
import { Waveform } from "@/components/waveform";
import { NewsletterForm } from "@/components/newsletter-form";

export const metadata: Metadata = { title: "Podcast — The Cortex Letter" };

export default async function PodcastPage() {
  const episodes = await getPublishedEpisodes();

  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-16 sm:px-8 sm:pt-24">
        <p className="eyebrow">The Cortex Letter Podcast</p>
        <h1 className="font-display mt-3 max-w-2xl text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          Conversations with the people doing the research.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
          Long-form conversations with neurologists, psychiatrists, researchers, and clinicians —
          the people behind the findings we write about.
        </p>
        <Waveform className="mt-8 h-8 w-40" animated />
      </section>

      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        {episodes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="font-display text-xl font-semibold text-ink">New episodes coming soon.</p>
            <p className="mx-auto mt-2 max-w-sm text-muted">
              The first conversations are being recorded. Subscribe to the newsletter and you&rsquo;ll
              hear the moment the first episode is live.
            </p>
            <div className="mx-auto mt-6 max-w-sm">
              <NewsletterForm />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {episodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
