"use client";

import { useActionState } from "react";
import { subscribeToNewsletter, type NewsletterState } from "@/lib/actions/newsletter";

const initialState: NewsletterState = { status: "idle" };

export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, initialState);

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full flex-1 rounded-full border border-border-strong bg-surface px-5 py-3 text-sm text-ink placeholder:text-muted focus:border-accent sm:w-auto"
        />
        <button
          type="submit"
          disabled={isPending}
          className="whitespace-nowrap rounded-full bg-ink px-6 py-3 font-data text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? "Subscribing…" : "Subscribe"}
        </button>
      </form>
      {state.status !== "idle" && (
        <p
          role="status"
          className={`mt-3 text-sm ${state.status === "success" ? "text-accent-strong" : "text-cat-emotion"}`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
