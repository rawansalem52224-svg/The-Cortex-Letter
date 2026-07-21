"use client";

import { useActionState } from "react";
import type { EpisodeFormState } from "@/lib/actions/podcast";
import type { PodcastEpisode } from "@/lib/types";

const initialState: EpisodeFormState = { status: "idle" };

export function EpisodeForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (prevState: EpisodeFormState, formData: FormData) => Promise<EpisodeFormState>;
  defaults?: Partial<PodcastEpisode>;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div>
        <label htmlFor="title" className="font-data text-xs uppercase tracking-wide text-muted">
          Episode title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={defaults?.title}
          className="font-display mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-xl text-ink focus:border-accent"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="guest_name" className="font-data text-xs uppercase tracking-wide text-muted">
            Guest name
          </label>
          <input
            id="guest_name"
            name="guest_name"
            required
            defaultValue={defaults?.guest_name}
            className="mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-ink focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="guest_role" className="font-data text-xs uppercase tracking-wide text-muted">
            Guest role / title
          </label>
          <input
            id="guest_role"
            name="guest_role"
            placeholder="e.g. Neurologist, Stanford Medicine"
            defaultValue={defaults?.guest_role}
            className="mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-ink placeholder:text-muted focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="guest_bio" className="font-data text-xs uppercase tracking-wide text-muted">
          Guest bio (optional)
        </label>
        <textarea
          id="guest_bio"
          name="guest_bio"
          rows={2}
          defaultValue={defaults?.guest_bio ?? ""}
          placeholder="A couple of sentences on who they are."
          className="mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-ink placeholder:text-muted focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="description" className="font-data text-xs uppercase tracking-wide text-muted">
          Episode description (Markdown supported)
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={8}
          defaultValue={defaults?.description}
          placeholder="What this conversation covers…"
          className="font-data mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-sm leading-relaxed text-ink placeholder:text-muted focus:border-accent"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="episode_number" className="font-data text-xs uppercase tracking-wide text-muted">
            Episode number
          </label>
          <input
            id="episode_number"
            name="episode_number"
            type="number"
            min={1}
            defaultValue={defaults?.episode_number ?? ""}
            className="mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-ink focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="duration_minutes" className="font-data text-xs uppercase tracking-wide text-muted">
            Duration (minutes)
          </label>
          <input
            id="duration_minutes"
            name="duration_minutes"
            type="number"
            min={1}
            defaultValue={defaults?.duration_minutes ?? ""}
            className="mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-ink focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="cover_image" className="font-data text-xs uppercase tracking-wide text-muted">
          Cover image URL (optional)
        </label>
        <input
          id="cover_image"
          name="cover_image"
          type="url"
          defaultValue={defaults?.cover_image ?? ""}
          placeholder="https://…"
          className="mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-ink placeholder:text-muted focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="audio_embed_url" className="font-data text-xs uppercase tracking-wide text-muted">
          Audio embed URL (optional)
        </label>
        <input
          id="audio_embed_url"
          name="audio_embed_url"
          type="url"
          defaultValue={defaults?.audio_embed_url ?? ""}
          placeholder="https://open.spotify.com/embed/episode/…"
          className="mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-ink placeholder:text-muted focus:border-accent"
        />
        <p className="mt-1.5 text-xs text-muted">
          From Spotify: open the episode &rarr; Share &rarr; Embed episode &rarr; copy the src URL from the code.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="spotify_url" className="font-data text-xs uppercase tracking-wide text-muted">
            Spotify link
          </label>
          <input
            id="spotify_url"
            name="spotify_url"
            type="url"
            defaultValue={defaults?.spotify_url ?? ""}
            placeholder="https://…"
            className="mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-ink placeholder:text-muted focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="apple_url" className="font-data text-xs uppercase tracking-wide text-muted">
            Apple Podcasts link
          </label>
          <input
            id="apple_url"
            name="apple_url"
            type="url"
            defaultValue={defaults?.apple_url ?? ""}
            placeholder="https://…"
            className="mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-ink placeholder:text-muted focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="youtube_url" className="font-data text-xs uppercase tracking-wide text-muted">
            YouTube link
          </label>
          <input
            id="youtube_url"
            name="youtube_url"
            type="url"
            defaultValue={defaults?.youtube_url ?? ""}
            placeholder="https://…"
            className="mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-ink placeholder:text-muted focus:border-accent"
          />
        </div>
      </div>

      {state.message && (
        <p className={`text-sm ${state.status === "error" ? "text-cat-emotion" : "text-accent-strong"}`}>
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-full bg-ink px-6 py-3 font-data text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
