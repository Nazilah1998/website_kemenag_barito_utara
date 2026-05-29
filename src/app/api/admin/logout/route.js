import { apiResponse } from "@/lib/api-helpers";
import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/logger";

export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return apiResponse({ ok: true, message: "Logout berhasil." });
  } catch (error) {
    logError("logout_post_error", { error: error?.message });
    return apiResponse(
      { ok: false, message: error?.message || "Gagal logout." },
      500,
    );
  }
}
