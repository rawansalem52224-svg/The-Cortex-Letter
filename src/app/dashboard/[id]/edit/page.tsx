import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostById } from "@/lib/posts";
import { getCurrentProfile } from "@/lib/profile";
import { updatePost, setPostStatus, deletePost } from "@/lib/actions/posts";
import { PostForm } from "@/components/post-form";

export const metadata: Metadata = { title: "Edit post — The Cortex Letter" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getCurrentProfile();
  const post = await getPostById(id);

  if (!post || !profile) notFound();
  if (post.author_id !== profile.id && profile.role !== "admin") notFound();

  const boundUpdate = updatePost.bind(null, post.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold text-ink">Edit post</h1>
        <div className="flex items-center gap-4">
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
      <div className="mt-8">
        <PostForm action={boundUpdate} defaults={post} submitLabel="Save changes" />
      </div>
    </div>
  );
}
