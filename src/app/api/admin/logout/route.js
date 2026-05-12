import { apiResponse } from "@/lib/prisma-helpers";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return apiResponse({ ok: true, message: "Logout berhasil." });
  } catch (error) {
    console.error("POST Logout Error:", error);
    return apiResponse(
      { ok: false, message: error?.message || "Gagal logout." },
      500,
    );
  }
}
