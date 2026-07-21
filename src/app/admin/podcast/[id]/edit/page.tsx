import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEpisodeById } from "@/lib/podcast";
import { getCurrentProfile } from "@/lib/profile";
import { updateEpisode, setEpisodeStatus, deleteEpisode } from "@/lib/actions/podcast";
import { EpisodeForm } from "@/components/episode-form";

export const metadata: Metadata = { title: "Edit episode — The Cortex Letter" };

export default async function EditEpisodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getCurrentProfile();
  const episode = await getEpisodeById(id);

  if (!episode || !profile || profile.role !== "admin") notFound();

  const boundUpdate = updateEpisode.bind(null, episode.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold text-ink">Edit episode</h1>
        <div className="flex items-center gap-4">
          <form
            action={setEpisodeStatus.bind(
              null,
              episode.id,
              episode.status === "published" ? "draft" : "published"
            )}
          >
            <button type="submit" className="font-data text-sm text-ink hover:text-accent-strong">
              {episode.status === "published" ? "Unpublish" : "Publish"}
            </button>
          </form>
          <form action={deleteEpisode.bind(null, episode.id)}>
            <button type="submit" className="font-data text-sm text-cat-emotion hover:opacity-80">
              Delete
            </button>
          </form>
        </div>
      </div>
      <div className="mt-8">
        <EpisodeForm action={boundUpdate} defaults={episode} submitLabel="Save changes" />
      </div>
    </div>
  );
}
