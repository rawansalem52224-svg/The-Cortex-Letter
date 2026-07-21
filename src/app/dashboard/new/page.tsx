import type { Metadata } from "next";
import { createPost } from "@/lib/actions/posts";
import { PostForm } from "@/components/post-form";

export const metadata: Metadata = { title: "New post — The Cortex Letter" };

export default function NewPostPage() {
  return (
    <div>
      <h1 className="font-display text-xl font-semibold text-ink">New post</h1>
      <p className="mt-1 text-sm text-muted">Saved as a draft first — publish when it&rsquo;s ready.</p>
      <div className="mt-8">
        <PostForm action={createPost} submitLabel="Save draft" />
      </div>
    </div>
  );
}
