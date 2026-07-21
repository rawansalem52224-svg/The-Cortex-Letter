"use client";

import { useActionState } from "react";
import { signIn, signUp, type AuthState } from "@/lib/actions/auth";

const initialState: AuthState = { status: "idle" };

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, isPending] = useActionState(action, initialState);

  if (state.status === "check-email") {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8">
        <p className="font-display text-lg font-semibold text-ink">Almost there.</p>
        <p className="mt-2 text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {mode === "signup" && (
        <div>
          <label htmlFor="full_name" className="font-data text-xs uppercase tracking-wide text-muted">
            Full name
          </label>
          <input
            id="full_name"
            name="full_name"
            required
            className="mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-ink focus:border-accent"
          />
        </div>
      )}

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

      <div>
        <label htmlFor="password" className="font-data text-xs uppercase tracking-wide text-muted">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-ink focus:border-accent"
        />
      </div>

      {state.status === "error" && <p className="text-sm text-cat-emotion">{state.message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-full bg-ink px-6 py-3 font-data text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}
