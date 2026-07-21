import type { Metadata } from "next";
import { createEpisode } from "@/lib/actions/podcast";
import { EpisodeForm } from "@/components/episode-form";

export const metadata: Metadata = { title: "New episode — The Cortex Letter" };

export default function NewEpisodePage() {
  return (
    <div>
      <h1 className="font-display text-xl font-semibold text-ink">New episode</h1>
      <p className="mt-1 text-sm text-muted">Saved as a draft first — publish when it&rsquo;s ready.</p>
      <div className="mt-8">
        <EpisodeForm action={createEpisode} submitLabel="Save draft" />
      </div>
    </div>
  );
}
