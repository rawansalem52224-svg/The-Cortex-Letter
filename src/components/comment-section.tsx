import Link from "next/link";
import { format } from "date-fns";
import { getCommentsForPost } from "@/lib/comments";
import { getCurrentProfile } from "@/lib/profile";
import { deleteComment } from "@/lib/actions/comments";
import { CommentForm } from "@/components/comment-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function CommentSection({ postId, slug }: { postId: string; slug: string }) {
  const [comments, profile] = await Promise.all([getCommentsForPost(postId), getCurrentProfile()]);

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ink">
        {comments.length > 0 ? `${comments.length} comment${comments.length === 1 ? "" : "s"}` : "Comments"}
      </h2>

      <div className="mt-8">
        {!isSupabaseConfigured ? (
          <p className="text-sm text-muted">
            Comments open once Supabase is connected — see the README.
          </p>
        ) : profile ? (
          <CommentForm postId={postId} slug={slug} />
        ) : (
          <p className="text-sm text-muted">
            <Link href="/login" className="text-accent-strong hover:underline">
              Sign in
            </Link>{" "}
            to join the discussion.
          </p>
        )}
      </div>

      {comments.length > 0 && (
        <div className="mt-10 flex flex-col divide-y divide-border">
          {comments.map((comment) => {
            const canDelete = profile && (profile.id === comment.author_id || profile.role === "admin");
            return (
              <div key={comment.id} className="flex flex-col gap-1.5 py-5">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-semibold text-ink">{comment.author_name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-data text-xs text-muted">
                      {format(new Date(comment.created_at), "MMM d, yyyy")}
                    </span>
                    {canDelete && (
                      <form action={deleteComment.bind(null, comment.id, slug)}>
                        <button type="submit" className="font-data text-xs text-cat-emotion hover:opacity-80">
                          Delete
                        </button>
                      </form>
                    )}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-ink">{comment.content}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
