import { createClient } from "@supabase/supabase-js";
import { apiResponse } from "@/lib/api-helpers";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { env } from "@/lib/env";
import { logError } from "@/lib/logger";

export async function POST(request) {
  try {
    const ip = getClientIp(request);

    const limitCheck = await rateLimit({
      key: `admin:update-password:${ip}`,
      limit: 5,
      windowMs: 60_000,
    });

    if (!limitCheck.ok) {
      return apiResponse(
        { message: "Terlalu banyak percobaan. Coba lagi nanti." },
        429,
      );
    }

    const body = await request.json().catch(() => ({}));
    const { password, accessToken } = body;

    if (!password || !accessToken) {
      return apiResponse({ message: "Data tidak lengkap" }, 400);
    }

    // 1) Validasi token user secara fail-closed
    const supabase = createClient(env.supabaseUrl, env.supabasePublishableKey);

    const { data, error: authError } = await supabase.auth.getUser(accessToken);

    const user = data?.user;

    if (authError || !user) {
      return apiResponse({ message: "Sesi tidak valid atau kadaluarsa" }, 401);
    }

    // 2) Update password hanya untuk user dari token tersebut
    const supabaseAdmin = createAdminClient();

    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: password,
      });

    if (updateError) {
      // Jangan leak detail internal dari Supabase
      return apiResponse({ message: "Gagal memperbarui password" }, 500);
    }

    return apiResponse({ message: "Password berhasil diperbarui" });
  } catch (error) {
    logError("update_password_api_error", { error: error?.message });
    return apiResponse({ message: "Terjadi kesalahan server internal" }, 500);
  }
}
