import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { assertServiceRoleKey, env } from "@/lib/env";

let adminClient;

export function createAdminClient() {
  if (!adminClient) {
    adminClient = createSupabaseClient(
      env.supabaseUrl,
      assertServiceRoleKey(),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  return adminClient;
}
