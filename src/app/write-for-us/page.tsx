import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentProfile, getCurrentUser } from "@/lib/profile";
import { getMyApplication } from "@/lib/applications";
import { ApplicationForm } from "@/components/application-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Write for us — The Cortex Letter" };

const EXPECTATIONS = [
  "You cite primary, peer-reviewed sources — not press releases or secondhand summaries.",
  "You can explain a finding's limits as clearly as the finding itself.",
  "You write for a curious general reader, not for other specialists.",
];

export default async function WriteForUsPage() {
  const profile = await getCurrentProfile();
  const user = await getCurrentUser();
  const application = await getMyApplication();

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <p className="eyebrow">Contribute</p>
      <h1 className="font-display mt-3 text-4xl font-semibold text-ink sm:text-5xl">Write for us</h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">
        The Cortex Letter is written by people who read the papers, not just the abstracts. If you
        have a research or science-writing background and a finding you think deserves a clearer
        explanation, we want to hear the pitch.
      </p>

      <div className="mt-10 rounded-2xl border border-border bg-surface p-8">
        <h2 className="font-display text-lg font-semibold text-ink">What we look for</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {EXPECTATIONS.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
              <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12">
        {!isSupabaseConfigured ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-muted">
              Applications open once Supabase is connected. See the README for setup steps.
            </p>
          </div>
        ) : !user ? (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center">
            <p className="text-ink">Sign in to submit an application.</p>
            <div className="mt-5 flex justify-center gap-3">
              <Link
                href="/login"
                className="rounded-full bg-ink px-6 py-3 font-data text-sm font-medium text-bg"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-full border border-border-strong px-6 py-3 font-data text-sm font-medium text-ink"
              >
                Create an account
              </Link>
            </div>
          </div>
        ) : profile?.role === "writer" || profile?.role === "admin" ? (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center">
            <p className="text-ink">You already have publishing access.</p>
            <Link
              href={profile.role === "admin" ? "/admin" : "/dashboard"}
              className="mt-4 inline-block font-data text-sm text-accent-strong hover:underline"
            >
              Go to your dashboard &rarr;
            </Link>
          </div>
        ) : application ? (
          <div className="rounded-2xl border border-border bg-surface p-8">
            <p className="font-display text-lg font-semibold text-ink">
              Application {application.status}
            </p>
            <p className="mt-2 text-muted">
              {application.status === "pending"
                ? "We've received your application and read every one. We'll follow up by email."
                : application.status === "approved"
                  ? "Welcome aboard — refresh to see your dashboard link in the header."
                  : "This application wasn't approved this round."}
            </p>
          </div>
        ) : (
          <ApplicationForm defaultName={profile?.full_name ?? ""} email={user.email ?? ""} />
        )}
      </div>
    </div>
  );
}
