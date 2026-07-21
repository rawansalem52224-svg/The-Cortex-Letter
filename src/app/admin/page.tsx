import Link from "next/link";
import { getAllApplications } from "@/lib/applications";
import { getAllPostsForAdmin } from "@/lib/posts";

export default async function AdminOverviewPage() {
  const [applications, posts] = await Promise.all([getAllApplications(), getAllPostsForAdmin()]);

  const pending = applications.filter((a) => a.status === "pending").length;
  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  const stats = [
    { label: "Pending applications", value: pending, href: "/admin/applications" },
    { label: "Published posts", value: published, href: "/admin/posts" },
    { label: "Drafts in progress", value: drafts, href: "/admin/posts" },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {stats.map((s) => (
        <Link
          key={s.label}
          href={s.href}
          className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border-strong"
        >
          <p className="font-display text-4xl font-semibold text-ink">{s.value}</p>
          <p className="mt-2 font-data text-xs uppercase tracking-wide text-muted">{s.label}</p>
        </Link>
      ))}
    </div>
  );
}
