import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/profile";
import { ResetPasswordForm } from "@/components/reset-password-form";

export const metadata: Metadata = { title: "Set a new password — The Cortex Letter" };

export default async function ResetPasswordPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-sm px-5 py-20 sm:px-0">
      <p className="eyebrow">Account</p>
      <h1 className="font-display mt-3 text-3xl font-semibold text-ink">Set a new password</h1>

      {!user ? (
        <div className="mt-8 rounded-2xl border border-border bg-surface p-8">
          <p className="text-ink">This link is invalid or has expired.</p>
          <Link
            href="/forgot-password"
            className="mt-3 inline-block font-data text-sm text-accent-strong hover:underline"
          >
            Request a new reset link &rarr;
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <ResetPasswordForm />
        </div>
      )}
    </div>
  );
}
