import { createClient } from "@supabase/supabase-js";
import { apiResponse } from "@/lib/api-helpers";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { env } from "@/lib/env";
import { db } from "@/lib/drizzle";
import { profiles, admin_users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logError } from "@/lib/logger";

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
    const { fullName, email, avatarUrl, avatarBase64, accessToken } = body;

    let finalAvatarUrl = avatarUrl;
    
    if (avatarBase64) {
      try {
        const { uploadBase64Image } = await import("@/lib/storage-media");
        const res = await uploadBase64Image({ 
          dataUrl: avatarBase64, 
          folder: "avatars", 
          fileNameStem: "avatar" 
        });
        finalAvatarUrl = res.publicUrl;
      } catch (err) {
        logError("update_profile_avatar_upload", { error: err?.message });
        return apiResponse({ message: "Gagal mengunggah foto profil." }, 500);
      }
    }

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
    await db.transaction(async (tx) => {
      // Update profiles
      const [profileExists] = await tx
        .select({ id: profiles.id })
        .from(profiles)
        .where(eq(profiles.id, user.id))
        .limit(1);

      if (profileExists) {
        await tx
          .update(profiles)
          .set({
            ...(fullName ? { full_name: fullName } : {}),
            ...(email ? { email: email } : {}),
            ...(finalAvatarUrl !== undefined ? { avatar_url: finalAvatarUrl } : {}),
            updated_at: new Date()
          })
          .where(eq(profiles.id, user.id));
      }

      // Update admin_users if exists
      const [adminExists] = await tx
        .select({ user_id: admin_users.user_id })
        .from(admin_users)
        .where(eq(admin_users.user_id, user.id))
        .limit(1);

      if (adminExists) {
        await tx
          .update(admin_users)
          .set({
            ...(fullName ? { full_name: fullName } : {}),
            updated_at: new Date()
          })
          .where(eq(admin_users.user_id, user.id));
      }
    });

    return apiResponse({ message: "Profil berhasil diperbarui" });
  } catch (error) {
    logError("update_profile_api_error", { error: error?.message });
    return apiResponse({ message: "Terjadi kesalahan server internal" }, 500);
  }
}
