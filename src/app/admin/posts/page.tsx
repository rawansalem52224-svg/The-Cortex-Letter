import Link from "next/link";
import { format } from "date-fns";
import { getAllPostsForAdmin } from "@/lib/posts";
import { setPostStatus, deletePost } from "@/lib/actions/posts";
import { CategoryPill } from "@/components/category-pill";

export default async function AdminPostsPage() {
  const posts = await getAllPostsForAdmin();

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center">
        <p className="text-muted">No posts yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-surface">
      {posts.map((post) => (
        <div key={post.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <CategoryPill category={post.category} />
              <span
                className={`font-data text-[0.7rem] uppercase tracking-wide ${
                  post.status === "published" ? "text-accent-strong" : "text-muted"
                }`}
              >
                {post.status}
              </span>
            </div>
            <p className="font-display mt-1.5 text-lg font-semibold text-ink">{post.title}</p>
            <p className="font-data mt-1 text-xs text-muted">
              {post.author_name} &middot; updated {format(new Date(post.updated_at), "MMM d, yyyy")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/dashboard/${post.id}/edit`} className="font-data text-sm text-ink hover:text-accent-strong">
              Edit
            </Link>
            <form action={setPostStatus.bind(null, post.id, post.status === "published" ? "draft" : "published")}>
              <button type="submit" className="font-data text-sm text-ink hover:text-accent-strong">
                {post.status === "published" ? "Unpublish" : "Publish"}
              </button>
            </form>
            <form action={deletePost.bind(null, post.id)}>
              <button type="submit" className="font-data text-sm text-cat-emotion hover:opacity-80">
                Delete
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
