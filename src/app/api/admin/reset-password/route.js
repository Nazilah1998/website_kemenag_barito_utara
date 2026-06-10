import { apiResponse } from "@/lib/api-helpers";
import { createAdminClient } from "@/lib/supabase/admin";
import { logError } from "@/lib/logger";
import { redis, hasRedis } from "@/lib/redis";

// Fallback in-memory store for OTPs if Redis is not available
const globalOtpStore = globalThis.otpStore || new Map();
if (process.env.NODE_ENV !== "production") globalThis.otpStore = globalOtpStore;

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

      // --- VERIFIKASI CLOUDFLARE TURNSTILE ---
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
          return apiResponse(
            {
              ok: false,
              message: "Verifikasi keamanan gagal. Silakan coba lagi.",
            },
            400,
          );
        }
      } catch (err) {
        return apiResponse(
          { ok: false, message: "Terjadi kesalahan saat verifikasi keamanan." },
          500,
        );
      }

      // --- CUSTOM OTP LOGIC BYPASSING SUPABASE GOTRUE ---
      // 1. Cari user berdasarkan email di tabel profiles (bypass limit 50 listUsers)
      const cleanEmail = email.trim().toLowerCase();
      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, role")
        .eq("email", cleanEmail)
        .single();

      console.log("\\n[DEBUG] Pencarian Email:", cleanEmail);
      console.log(
        "[DEBUG] Hasil Query Profiles:",
        userProfile ? "DITEMUKAN" : "TIDAK DITEMUKAN",
      );

      if (!userProfile) {
        console.log(
          `\\n[PERINGATAN] Email '${cleanEmail}' TIDAK DITEMUKAN di tabel profiles!`,
        );
        console.log("-> Sistem menghentikan pengiriman email.\\n");
        // Return 200 OK untuk mencegah email enumeration
        return apiResponse({
          ok: true,
          message: "Jika email terdaftar, instruksi pemulihan telah dikirim.",
        });
      }

      // 2. Buat 6-digit OTP acak
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // LOG KHUSUS UNTUK MEMBANTU DEVELOPER BYPASS EMAIL:
      console.log("\\n=============================================");
      console.log("KODE OTP ANDA: " + otp);
      console.log("=============================================\\n");

      // 3. Simpan OTP ke Redis atau Memory
      try {
        if (hasRedis()) {
          await redis.setex(`otp:${cleanEmail}`, 300, otp); // Expire 5 menit
        } else {
          globalOtpStore.set(`otp:${cleanEmail}`, {
            otp,
            expiresAt: Date.now() + 300000,
          });
        }
      } catch (err) {
        logError("redis_otp_save_error", { error: err.message });
      }

      // 4. Kirim email menggunakan Nodemailer (Gmail)
      try {
        // Dynamic import agar tidak crash jika belum diinstall
        const nodemailer = (await import("nodemailer")).default;

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: Number(process.env.SMTP_PORT) || 465,
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const mailOptions = {
          from: `"${process.env.SMTP_SENDER_NAME || "Sistem Kemenag Barito Utara"}" <${process.env.SMTP_USER}>`,
          to: cleanEmail,
          subject: "Kode OTP Reset Akses Admin - Kemenag Barito Utara",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <!-- Using link instead of @import to avoid spam filters -->
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              <div style="background-color: #f3f4f6; padding: 40px 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);">
                  
                  <!-- Header Area -->
                  <div style="background: linear-gradient(135deg, #047857 0%, #059669 100%); padding: 40px 20px; text-align: center;">
                    <img src="https://kemenag.go.id/assets/img/logo.png" alt="Logo Kemenag" width="80" style="display: inline-block; margin-bottom: 0;" />
                  </div>

                  <!-- Content Area -->
                  <div style="padding: 40px 32px; text-align: center;">
                    <h2 style="color: #111827; margin-top: 0; margin-bottom: 16px; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Verifikasi Keamanan Akses</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 32px;">
                      Kami menerima permintaan untuk mereset kata sandi pada akun Administrator Anda. Untuk memverifikasi identitas Anda, silakan gunakan kode OTP (One-Time Password) di bawah ini:
                    </p>
                    
                    <!-- OTP Box -->
                    <div style="background-color: #f0fdf4; border: 2px dashed #10b981; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                      <div style="font-size: 46px; font-weight: 800; letter-spacing: 12px; color: #047857; text-align: center; line-height: 1; padding-left: 12px;">
                        ${otp}
                      </div>
                    </div>

                    <!-- Warning Alert -->
                    <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; text-align: left; border-radius: 0 8px 8px 0; margin-bottom: 0;">
                      <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.5;">
                        <strong>Peringatan Keamanan:</strong><br>
                        Kode OTP ini hanya berlaku selama <strong>5 Menit</strong>. Staf Kementerian Agama tidak akan pernah meminta kode ini. <strong>Jangan berikan kode ini kepada siapa pun!</strong>
                      </p>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div style="background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0;">
                      Email ini dibuat otomatis oleh sistem keamanan Kemenag Barito Utara.<br>
                      Jika Anda tidak merasa meminta reset password, abaikan email ini.<br>
                      <br>
                      <strong>Kementerian Agama Kabupaten Barito Utara</strong><br>
                      Jl. Ahmad Yani No. 123, Muara Teweh, Kalimantan Tengah
                    </p>
                  </div>

                </div>
              </div>
            </body>
            </html>
          `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("\\n[NODEMAILER SUCCESS]:", info.response);
      } catch (err) {
        console.log("\\n[NODEMAILER ERROR]:", err.message);
        logError("nodemailer_error", { error: err.message });
      }

      return apiResponse({
        ok: true,
        message:
          "Jika email terdaftar, instruksi pemulihan telah dikirim. Silakan cek kotak masuk atau folder spam Anda.",
      });
    }

    return apiResponse({ ok: false, message: "Aksi tidak valid." }, 400);
  } catch (error) {
    logError("reset_password_error", { error: error?.message });
    return apiResponse(
      {
        ok: false,
        message: "Terjadi kesalahan server saat memproses permintaan.",
      },
      500,
    );
  }
}
