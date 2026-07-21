import Link from "next/link";
import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export const metadata: Metadata = { title: "Reset your password — The Cortex Letter" };

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-sm px-5 py-20 sm:px-0">
      <p className="eyebrow">Account</p>
      <h1 className="font-display mt-3 text-3xl font-semibold text-ink">Forgot your password?</h1>
      <p className="mt-2 text-sm text-muted">
        Enter your email and we&rsquo;ll send you a link to set a new one.
      </p>
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
      <p className="mt-6 text-sm text-muted">
        <Link href="/login" className="text-accent-strong hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
