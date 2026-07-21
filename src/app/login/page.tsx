import Link from "next/link";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Sign in — The Cortex Letter" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-5 py-20 sm:px-0">
      <p className="eyebrow">Account</p>
      <h1 className="font-display mt-3 text-3xl font-semibold text-ink">Sign in</h1>
      <p className="mt-2 text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="text-accent-strong hover:underline">
          Create an account
        </Link>
        .
      </p>
      <div className="mt-8">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
