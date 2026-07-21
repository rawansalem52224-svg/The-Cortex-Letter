"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AuthState = { status: "idle" | "error" | "check-email"; message?: string };

export async function signIn(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) {
    return { status: "error", message: "Supabase isn't connected yet — see the README." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase!.auth.signInWithPassword({ email, password });

  if (error) {
    return { status: "error", message: "Incorrect email or password." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUp(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) {
    return { status: "error", message: "Supabase isn't connected yet — see the README." };
  }

  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (password.length < 8) {
    return { status: "error", message: "Use a password with at least 8 characters." };
  }

  const supabase = await createClient();
  const { error, data } = await supabase!.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  if (!data.session) {
    return { status: "check-email", message: "Check your inbox to confirm your account, then sign in." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  if (!isSupabaseConfigured) return;
  const supabase = await createClient();
  await supabase!.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

async function getOrigin() {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "";
  const protocol =
    headersList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

export async function requestPasswordReset(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  if (!isSupabaseConfigured) {
    return { status: "error", message: "Supabase isn't connected yet — see the README." };
  }

  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { status: "error", message: "Enter your email address." };
  }

  const origin = await getOrigin();
  const supabase = await createClient();
  await supabase!.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  // Same message whether or not the email is registered, so no one can probe for accounts.
  return {
    status: "check-email",
    message: "If an account exists for that email, a reset link is on its way.",
  };
}

export async function updatePassword(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) {
    return { status: "error", message: "Supabase isn't connected yet." };
  }

  const password = String(formData.get("password") ?? "");
  if (password.length < 8) {
    return { status: "error", message: "Use a password with at least 8 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase!.auth.updateUser({ password });

  if (error) {
    return {
      status: "error",
      message: "Couldn't update your password. The reset link may have expired — request a new one.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
