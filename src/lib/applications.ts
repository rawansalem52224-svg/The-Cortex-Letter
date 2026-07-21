import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/profile";
import type { WriterApplication } from "@/lib/types";

export async function getMyApplication(): Promise<WriterApplication | null> {
  if (!isSupabaseConfigured) return null;
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase!
    .from("writer_applications")
    .select("*")
    .eq("applicant_id", user.id)
    .order("created_at", { ascending: false })
    .maybeSingle();

  if (error || !data) return null;
  return data as WriterApplication;
}

export async function getAllApplications(): Promise<WriterApplication[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data, error } = await supabase!
    .from("writer_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as WriterApplication[];
}
