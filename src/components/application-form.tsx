"use client";

import { useActionState } from "react";
import { submitApplication, type ApplicationState } from "@/lib/actions/applications";

const initialState: ApplicationState = { status: "idle" };

export function ApplicationForm({ defaultName, email }: { defaultName: string; email: string }) {
  const [state, formAction, isPending] = useActionState(submitApplication, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8">
        <p className="font-display text-xl font-semibold text-ink">Application received.</p>
        <p className="mt-2 text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div>
        <label htmlFor="full_name" className="font-data text-xs uppercase tracking-wide text-muted">
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          required
          defaultValue={defaultName}
          className="mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-ink focus:border-accent"
        />
      </div>

      <div>
        <label className="font-data text-xs uppercase tracking-wide text-muted">Email</label>
        <input
          disabled
          value={email}
          className="mt-2 w-full rounded-lg border border-border bg-surface-hover px-4 py-3 text-muted"
        />
      </div>

      <div>
        <label htmlFor="background" className="font-data text-xs uppercase tracking-wide text-muted">
          Your background
        </label>
        <textarea
          id="background"
          name="background"
          required
          rows={3}
          placeholder="Relevant degrees, research experience, or writing you've published elsewhere."
          className="mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-ink placeholder:text-muted focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="pitch" className="font-data text-xs uppercase tracking-wide text-muted">
          What would your first article be about?
        </label>
        <textarea
          id="pitch"
          name="pitch"
          required
          rows={4}
          placeholder="One finding or study, and why it's worth explaining to a general audience."
          className="mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-ink placeholder:text-muted focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="sample_link" className="font-data text-xs uppercase tracking-wide text-muted">
          Link to a writing sample (optional)
        </label>
        <input
          id="sample_link"
          name="sample_link"
          type="url"
          placeholder="https://…"
          className="mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-ink placeholder:text-muted focus:border-accent"
        />
      </div>

      {state.status === "error" && <p className="text-sm text-cat-emotion">{state.message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-full bg-ink px-6 py-3 font-data text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}
