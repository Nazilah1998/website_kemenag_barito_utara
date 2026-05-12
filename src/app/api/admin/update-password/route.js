import { createClient } from "@supabase/supabase-js";
import { apiResponse } from "@/lib/prisma-helpers";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { password, accessToken } = body;

    if (!password || !accessToken) {
      return apiResponse({ message: "Data tidak lengkap" }, 400);
    }

    // 1. Verifikasi apakah token ini valid dan milik siapa
    // Kita butuh client biasa dengan token user tersebut atau getUser(accessToken)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return apiResponse({ message: "Sesi tidak valid atau kadaluarsa" }, 401);
    }

    // 2. Gunakan Admin Client untuk update password
    const supabaseAdmin = createAdminClient();

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: password }
    );

    if (updateError) {
      return apiResponse({ message: updateError.message }, 500);
    }

    return apiResponse({ message: "Password berhasil diperbarui" });
  } catch (error) {
    console.error("Update Password API Error:", error);
    return apiResponse({ message: "Terjadi kesalahan server internal" }, 500);
  }
}
