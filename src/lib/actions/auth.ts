"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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
