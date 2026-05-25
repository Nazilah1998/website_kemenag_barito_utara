import { createClient } from "@supabase/supabase-js";
import { apiResponse } from "@/lib/prisma-helpers";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { env } from "@/lib/env";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const ip = getClientIp(request);

    const limitCheck = await rateLimit({
      key: `admin:update-profile:${ip}`,
      limit: 10,
      windowMs: 60_000,
    });

    if (!limitCheck.ok) {
      return apiResponse(
        { message: "Terlalu banyak percobaan. Coba lagi nanti." },
        429,
      );
    }

    const body = await request.json().catch(() => ({}));
    const { fullName, email, avatarUrl, accessToken } = body;

    if (!accessToken) {
      return apiResponse({ message: "Akses ditolak." }, 400);
    }

    // 1) Validasi token user
    const supabase = createClient(env.supabaseUrl, env.supabasePublishableKey);
    const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);
    const user = authData?.user;

    if (authError || !user) {
      return apiResponse({ message: "Sesi tidak valid atau kadaluarsa" }, 401);
    }

    const supabaseAdmin = createAdminClient();

    // 2) Update email di Auth jika berubah
    if (email && email !== user.email) {
      const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        email: email,
      });
      if (updateAuthError) {
        return apiResponse({ message: "Gagal memperbarui email. Email mungkin sudah digunakan." }, 400);
      }
    }

    // 3) Update profiles & admin_users tables
    await prisma.$transaction(async (tx) => {
      // Update profiles
      const profileExists = await tx.profiles.findUnique({ where: { id: user.id } });
      if (profileExists) {
        await tx.profiles.update({
          where: { id: user.id },
          data: {
            ...(fullName ? { full_name: fullName } : {}),
            ...(email ? { email: email } : {}),
            ...(avatarUrl !== undefined ? { avatar_url: avatarUrl } : {}),
            updated_at: new Date()
          }
        });
      }

      // Update admin_users if exists
      const adminExists = await tx.admin_users.findUnique({ where: { user_id: user.id } });
      if (adminExists) {
        await tx.admin_users.update({
          where: { user_id: user.id },
          data: {
            ...(fullName ? { full_name: fullName } : {}),
            updated_at: new Date()
          }
        });
      }
    });

    return apiResponse({ message: "Profil berhasil diperbarui" });
  } catch (error) {
    console.error("Update Profile API Error:", error);
    return apiResponse({ message: "Terjadi kesalahan server internal" }, 500);
  }
}
