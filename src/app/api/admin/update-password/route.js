import { apiResponse } from "@/lib/api-helpers";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { logError } from "@/lib/logger";
import { redis, hasRedis } from "@/lib/redis";

const globalOtpStore = globalThis.otpStore || new Map();

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
    const { email, otp, password } = body;

    if (!email || !otp || !password) {
      return apiResponse({ message: "Data tidak lengkap" }, 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    let isValidOtp = false;

    // 1) Validasi OTP kustom
    try {
      if (hasRedis()) {
        const storedOtp = await redis.get(`otp:${cleanEmail}`);
        if (storedOtp === otp) {
          isValidOtp = true;
          await redis.del(`otp:${cleanEmail}`); // Hapus setelah dipakai
        }
      } else {
        const data = globalOtpStore.get(`otp:${cleanEmail}`);
        if (data && data.otp === otp && Date.now() < data.expiresAt) {
          isValidOtp = true;
          globalOtpStore.delete(`otp:${cleanEmail}`);
        }
      }
    } catch (err) {
      logError("otp_verification_error", { error: err.message });
      return apiResponse({ message: "Gagal memverifikasi OTP" }, 500);
    }

    if (!isValidOtp) {
      return apiResponse({ message: "Kode OTP tidak valid atau sudah kedaluwarsa" }, 401);
    }

    // 2) Cari User ID berdasarkan Email
    const supabaseAdmin = createAdminClient();
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) {
      logError("list_users_for_update_error", { error: usersError.message });
      return apiResponse({ message: "Terjadi kesalahan pada database user" }, 500);
    }

    const user = usersData?.users?.find(u => u.email === cleanEmail);

    if (!user) {
      return apiResponse({ message: "User tidak ditemukan" }, 404);
    }

    // 3) Update password menggunakan Service Role
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: password,
    });

    if (updateError) {
      logError("update_password_supabase_error", { error: updateError.message });
      return apiResponse({ message: "Gagal memperbarui password" }, 500);
    }

    return apiResponse({ message: "Password berhasil diperbarui" });
  } catch (error) {
    logError("update_password_api_error", { error: error?.message });
    return apiResponse({ message: "Terjadi kesalahan server internal" }, 500);
  }
}
