import { apiResponse } from "@/lib/api-helpers";
import { createAdminClient } from "@/lib/supabase/admin";
import { logError } from "@/lib/logger";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, email, password, turnstileToken } = body;

    const supabase = createAdminClient();

    if (action === "verify-email") {
      if (!email || !turnstileToken) {
        return apiResponse(
          { ok: false, message: "Email dan verifikasi keamanan wajib diisi." },
          400,
        );
      }

      // --- VERIFIKASI CLOUDFLARE TURNSTILE (SERVER-SIDE) ---
      try {
        const verifyRes = await fetch(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              secret: process.env.TURNSTILE_SECRET_KEY,
              response: turnstileToken,
            }),
            signal: AbortSignal.timeout(5_000),
          },
        );

        const verifyData = await verifyRes.json();

        if (!verifyData.success) {
          logError("reset_password_turnstile_failed", { verifyData });
          return apiResponse(
            {
              ok: false,
              message: "Verifikasi keamanan gagal. Silakan coba lagi.",
            },
            400,
          );
        }
      } catch (err) {
        logError("reset_password_turnstile_error", { error: err?.message });
        return apiResponse(
          { ok: false, message: "Terjadi kesalahan saat verifikasi keamanan." },
          500,
        );
      }
      // --- END VERIFIKASI TURNSTILE ---

      // Send the actual recovery email via Supabase
      // Kami langsung mengirim email tanpa mengecek listUsers() untuk mencegah DDoS dan User Enumeration.
      // Supabase akan mengabaikan email yang tidak terdaftar.
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${new URL(request.url).origin}/auth/confirm?next=${encodeURIComponent("/admin/forgot-password?step=2")}`,
        },
      );

      if (resetError) {
        logError("reset_password_supabase_error", { error: resetError?.message });
        // Kita bisa melempar error jika ini adalah masalah rate limit dari supabase
        if (resetError.status === 429) {
          return apiResponse(
            {
              ok: false,
              message: "Terlalu banyak permintaan. Silakan coba lagi nanti.",
            },
            429,
          );
        }
        // Untuk error lain, tetap lanjutkan untuk mencegah enumeration
      }

      return apiResponse({
        ok: true,
        message:
          "Jika email terdaftar, instruksi pemulihan telah dikirim. Silakan cek kotak masuk atau folder spam Anda.",
      });
    }

    // SECURITY NOTE:
    // Endpoint ini sengaja hanya mendukung pengiriman recovery email.
    // Tidak boleh ada aksi yang menetapkan password berdasarkan email
    // tanpa reset token/expiry yang tervalidasi.
    return apiResponse({ ok: false, message: "Aksi tidak valid." }, 400);
  } catch (error) {
    logError("reset_password_error", { error: error?.message });
    return apiResponse(
      {
        ok: false,
        message:
          error?.message ||
          "Terjadi kesalahan server saat memproses permintaan.",
      },
      500,
    );
  }
}
