import Link from "next/link";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Create account — The Cortex Letter" };

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-sm px-5 py-20 sm:px-0">
      <p className="eyebrow">Account</p>
      <h1 className="font-display mt-3 text-3xl font-semibold text-ink">Create an account</h1>
      <p className="mt-2 text-sm text-muted">
        Already have one?{" "}
        <Link href="/login" className="text-accent-strong hover:underline">
          Sign in
        </Link>
        .
      </p>
      <div className="mt-8">
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
