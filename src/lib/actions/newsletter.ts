"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type NewsletterState = { status: "idle" | "success" | "error"; message?: string };

export async function subscribeToNewsletter(
  _prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Enter a valid email address." };
  }

  if (!isSupabaseConfigured) {
    return {
      status: "error",
      message: "Newsletter signup isn't connected yet — set up Supabase to enable it.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase!.from("newsletter_subscribers").insert({ email });

  if (error) {
    if (error.code === "23505") {
      return { status: "success", message: "You're already on the list." };
    }
    return { status: "error", message: "Something went wrong. Try again in a moment." };
  }

  return { status: "success", message: "Subscribed. Watch your inbox for the next issue." };
}
