"use client";

import { useActionState } from "react";
import { requestPasswordReset, type AuthState } from "@/lib/actions/auth";

const initialState: AuthState = { status: "idle" };

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, initialState);

  if (state.status === "check-email") {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8">
        <p className="font-display text-lg font-semibold text-ink">Check your email.</p>
        <p className="mt-2 text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div>
        <label htmlFor="email" className="font-data text-xs uppercase tracking-wide text-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-ink focus:border-accent"
        />
      </div>

      {state.status === "error" && <p className="text-sm text-cat-emotion">{state.message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-full bg-ink px-6 py-3 font-data text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
