import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/lib/supabase/config";

/**
 * Service-role Supabase client. Bypasses RLS, so it must only ever run on the server
 * (the `server-only` import makes the build fail if a client component pulls it in).
 * Returns null when SUPABASE_SERVICE_ROLE_KEY isn't set.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !serviceRoleKey) return null;

  return createClient(SUPABASE_URL, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
