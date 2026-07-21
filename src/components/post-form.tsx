"use client";

import { useActionState } from "react";
import type { PostFormState } from "@/lib/actions/posts";
import { CATEGORY_LIST } from "@/lib/categories";
import type { Post } from "@/lib/types";

const initialState: PostFormState = { status: "idle" };

export function PostForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (prevState: PostFormState, formData: FormData) => Promise<PostFormState>;
  defaults?: Partial<Post>;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div>
        <label htmlFor="title" className="font-data text-xs uppercase tracking-wide text-muted">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={defaults?.title}
          className="font-display mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-xl text-ink focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="category" className="font-data text-xs uppercase tracking-wide text-muted">
          Topic
        </label>
        <select
          id="category"
          name="category"
          required
          defaultValue={defaults?.category ?? ""}
          className="mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-ink focus:border-accent"
        >
          <option value="" disabled>
            Choose a topic
          </option>
          {CATEGORY_LIST.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="excerpt" className="font-data text-xs uppercase tracking-wide text-muted">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          required
          rows={2}
          defaultValue={defaults?.excerpt}
          placeholder="One or two sentences that summarize the finding — shown on article cards."
          className="mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-ink placeholder:text-muted focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="cover_image" className="font-data text-xs uppercase tracking-wide text-muted">
          Cover image URL (optional)
        </label>
        <input
          id="cover_image"
          name="cover_image"
          type="url"
          defaultValue={defaults?.cover_image ?? ""}
          placeholder="https://…"
          className="mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-ink placeholder:text-muted focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="content" className="font-data text-xs uppercase tracking-wide text-muted">
          Content (Markdown supported)
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={18}
          defaultValue={defaults?.content}
          placeholder={"## A subheading\n\nWrite your article here. Use **bold**, *italics*, and > blockquotes."}
          className="font-data mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-sm leading-relaxed text-ink placeholder:text-muted focus:border-accent"
        />
      </div>

      {state.message && (
        <p className={`text-sm ${state.status === "error" ? "text-cat-emotion" : "text-accent-strong"}`}>
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-full bg-ink px-6 py-3 font-data text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
