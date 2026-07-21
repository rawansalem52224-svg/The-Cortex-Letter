import Link from "next/link";
import type { PodcastEpisode } from "@/lib/types";
import { Waveform } from "@/components/waveform";

export function EpisodeCard({ episode }: { episode: PodcastEpisode }) {
  return (
    <Link
      href={`/podcast/${episode.slug}`}
      className="group flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border-strong sm:flex-row sm:items-center sm:p-8"
    >
      <div className="flex flex-none items-center gap-5 sm:flex-col sm:items-center sm:gap-3">
        <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-ink text-bg transition-transform group-hover:scale-105">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="translate-x-[1px]">
            <path d="M6 4l14 8-14 8V4z" />
          </svg>
        </span>
        <Waveform className="h-6 w-14 sm:hidden" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="eyebrow">
          {episode.episode_number ? `Episode ${episode.episode_number}` : "Episode"}
          {episode.duration_minutes ? ` · ${episode.duration_minutes} min` : ""}
        </p>
        <h3 className="font-display mt-1.5 text-xl font-semibold leading-snug text-ink">{episode.title}</h3>
        <p className="mt-1 font-data text-sm text-accent-strong">
          {episode.guest_name}
          {episode.guest_role ? ` — ${episode.guest_role}` : ""}
        </p>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{episode.description}</p>
      </div>

      <Waveform className="hidden h-10 w-16 flex-none sm:flex" />
    </Link>
  );
}
