import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentProfile, getCurrentUser } from "@/lib/profile";
import { signOut } from "@/lib/actions/auth";

export const metadata: Metadata = { title: "Account — The Cortex Letter" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getCurrentProfile();

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <p className="eyebrow">Account</p>
      <h1 className="font-display mt-3 text-4xl font-semibold text-ink">
        {profile?.full_name || "Your account"}
      </h1>
      <p className="mt-2 text-muted">{user.email}</p>

      <div className="mt-10 rounded-2xl border border-border bg-surface p-8">
        <p className="font-display text-lg font-semibold text-ink">Want to write for us?</p>
        <p className="mt-2 text-muted">
          Readers can apply for publishing access from the Write for us page.
        </p>
        <Link
          href="/write-for-us"
          className="mt-5 inline-block rounded-full bg-ink px-6 py-3 font-data text-sm font-medium text-bg"
        >
          Apply to write
        </Link>
      </div>

      <form action={signOut} className="mt-8">
        <button type="submit" className="font-data text-sm text-muted hover:text-ink">
          Sign out
        </button>
      </form>
    </div>
  );
}
