import { format } from "date-fns";
import { getAllApplications } from "@/lib/applications";
import { reviewApplication } from "@/lib/actions/applications";

export default async function AdminApplicationsPage() {
  const applications = await getAllApplications();

  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center">
        <p className="text-muted">No applications yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {applications.map((app) => (
        <div key={app.id} className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-display text-lg font-semibold text-ink">{app.full_name}</p>
              <p className="font-data text-xs text-muted">{app.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`font-data text-xs uppercase tracking-wide ${
                  app.status === "pending"
                    ? "text-cat-perception"
                    : app.status === "approved"
                      ? "text-accent-strong"
                      : "text-cat-emotion"
                }`}
              >
                {app.status}
              </span>
              <span className="font-data text-xs text-muted">
                {format(new Date(app.created_at), "MMM d, yyyy")}
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="font-data text-xs uppercase tracking-wide text-muted">Background</p>
              <p className="mt-1 text-sm leading-relaxed text-ink">{app.background}</p>
            </div>
            <div>
              <p className="font-data text-xs uppercase tracking-wide text-muted">Pitch</p>
              <p className="mt-1 text-sm leading-relaxed text-ink">{app.pitch}</p>
            </div>
          </div>

          {app.sample_link && (
            <a
              href={app.sample_link}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 inline-block font-data text-sm text-accent-strong hover:underline"
            >
              View writing sample &rarr;
            </a>
          )}

          {app.status === "pending" && (
            <div className="mt-5 flex gap-3 border-t border-border pt-5">
              <form action={reviewApplication.bind(null, app.id, "approved")}>
                <button
                  type="submit"
                  className="rounded-full bg-ink px-5 py-2 font-data text-sm font-medium text-bg"
                >
                  Approve
                </button>
              </form>
              <form action={reviewApplication.bind(null, app.id, "rejected")}>
                <button
                  type="submit"
                  className="rounded-full border border-border-strong px-5 py-2 font-data text-sm text-ink hover:border-accent"
                >
                  Reject
                </button>
              </form>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
