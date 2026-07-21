"use client";

import { useActionState, useState, type FormEvent } from "react";
import { updatePassword, type AuthState } from "@/lib/actions/auth";

const initialState: AuthState = { status: "idle" };

export function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState(updatePassword, initialState);
  const [mismatch, setMismatch] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirm = (form.elements.namedItem("confirm") as HTMLInputElement).value;

    if (password !== confirm) {
      e.preventDefault();
      setMismatch(true);
    } else {
      setMismatch(false);
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="password" className="font-data text-xs uppercase tracking-wide text-muted">
          New password
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

      <div>
        <label htmlFor="confirm" className="font-data text-xs uppercase tracking-wide text-muted">
          Confirm new password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={8}
          className="mt-2 w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-ink focus:border-accent"
        />
      </div>

      {mismatch && <p className="text-sm text-cat-emotion">Passwords don&rsquo;t match.</p>}
      {state.status === "error" && <p className="text-sm text-cat-emotion">{state.message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-full bg-ink px-6 py-3 font-data text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
