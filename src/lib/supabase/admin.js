import { createClient } from "@supabase/supabase-js";
import { env, assertServiceRoleKey } from "@/lib/env";

export function createAdminClient() {
  const serviceRoleKey = assertServiceRoleKey();

  return createClient(env.supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
