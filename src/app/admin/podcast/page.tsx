import Link from "next/link";
import { format } from "date-fns";
import { getAllEpisodesForAdmin } from "@/lib/podcast";
import { setEpisodeStatus, deleteEpisode } from "@/lib/actions/podcast";

export default async function AdminPodcastPage() {
  const episodes = await getAllEpisodesForAdmin();

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Link
          href="/admin/podcast/new"
          className="rounded-full bg-ink px-5 py-2.5 font-data text-sm font-medium text-bg"
        >
          New episode
        </Link>
      </div>

      {episodes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-muted">No episodes yet.</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-surface">
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-data text-xs text-muted">
                    {episode.episode_number ? `Ep. ${episode.episode_number}` : "Unnumbered"}
                  </span>
                  <span
                    className={`font-data text-[0.7rem] uppercase tracking-wide ${
                      episode.status === "published" ? "text-accent-strong" : "text-muted"
                    }`}
                  >
                    {episode.status}
                  </span>
                </div>
                <p className="font-display mt-1.5 text-lg font-semibold text-ink">{episode.title}</p>
                <p className="font-data mt-1 text-xs text-muted">
                  {episode.guest_name} &middot; updated {format(new Date(episode.updated_at), "MMM d, yyyy")}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/admin/podcast/${episode.id}/edit`}
                  className="font-data text-sm text-ink hover:text-accent-strong"
                >
                  Edit
                </Link>
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
          ))}
        </div>
      )}
    </div>
  );
}
