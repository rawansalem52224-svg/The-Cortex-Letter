import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type UnsubscribeResult = "removed" | "not-found" | "invalid" | "error";

/** Deletes the newsletter subscriber that owns this unsubscribe token. */
export async function unsubscribeByToken(token: string): Promise<UnsubscribeResult> {
  if (!UUID_PATTERN.test(token)) return "invalid";

  const supabase = createAdminClient();
  if (!supabase) return "error";

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .delete()
    .eq("unsubscribe_token", token)
    .select("id");

  if (error) {
    console.error("[newsletter] Unsubscribe failed:", error);
    return "error";
  }
  return data && data.length > 0 ? "removed" : "not-found";
}
