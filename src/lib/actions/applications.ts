"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentProfile, getCurrentUser } from "@/lib/profile";

export type ApplicationState = { status: "idle" | "success" | "error"; message?: string };

export async function submitApplication(
  _prevState: ApplicationState,
  formData: FormData
): Promise<ApplicationState> {
  if (!isSupabaseConfigured) {
    return { status: "error", message: "Applications aren't connected yet — set up Supabase first." };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { status: "error", message: "Sign in before submitting your application." };
  }

  const background = String(formData.get("background") ?? "").trim();
  const pitch = String(formData.get("pitch") ?? "").trim();
  const sampleLink = String(formData.get("sample_link") ?? "").trim();
  const fullName = String(formData.get("full_name") ?? "").trim();

  if (!fullName || !background || !pitch) {
    return { status: "error", message: "Fill in your name, background, and pitch." };
  }

  const supabase = await createClient();
  const { error } = await supabase!.from("writer_applications").insert({
    applicant_id: user.id,
    full_name: fullName,
    email: user.email,
    background,
    pitch,
    sample_link: sampleLink || null,
  });

  if (error) {
    return { status: "error", message: "Something went wrong submitting your application." };
  }

  revalidatePath("/write-for-us");
  return { status: "success", message: "Application submitted. We read every one and reply by email." };
}

export async function reviewApplication(
  applicationId: string,
  decision: "approved" | "rejected"
): Promise<void> {
  if (!isSupabaseConfigured) return;

  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") return;

  const supabase = await createClient();

  const { data: application, error: fetchError } = await supabase!
    .from("writer_applications")
    .select("*")
    .eq("id", applicationId)
    .maybeSingle();

  if (fetchError || !application) return;

  const { error: updateError } = await supabase!
    .from("writer_applications")
    .update({ status: decision })
    .eq("id", applicationId);

  if (updateError) return;

  if (decision === "approved" && application.applicant_id) {
    await supabase!.from("profiles").update({ role: "writer" }).eq("id", application.applicant_id);
  }

  revalidatePath("/admin/applications");
}
