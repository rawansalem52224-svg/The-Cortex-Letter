"use client";

import { useActionState, useRef } from "react";
import { addComment, type CommentState } from "@/lib/actions/comments";

const initialState: CommentState = { status: "idle" };

export function CommentForm({ postId, slug }: { postId: string; slug: string }) {
  const boundAction = addComment.bind(null, postId, slug);
  const [state, formAction, isPending] = useActionState(boundAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="flex flex-col gap-3"
    >
      <label htmlFor="comment-content" className="font-data text-xs uppercase tracking-wide text-muted">
        Add a comment
      </label>
      <textarea
        id="comment-content"
        name="content"
        required
        rows={3}
        placeholder="Share a thought, a question, or a related finding…"
        className="w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-accent"
      />
      {state.status === "error" && <p className="text-sm text-cat-emotion">{state.message}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-full bg-ink px-5 py-2.5 font-data text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? "Posting…" : "Post comment"}
      </button>
    </form>
  );
}
