import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Profile } from "@/lib/types";

export async function getCurrentUser() {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase!.auth.getUser();

  return user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase!.from("profiles").select("*").eq("id", user.id).maybeSingle();

  if (error || !data) return null;
  return data as Profile;
}
