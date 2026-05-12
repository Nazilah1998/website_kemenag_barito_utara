import { apiResponse } from "@/lib/prisma-helpers";
import { getCurrentSessionContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = body?.email?.trim()?.toLowerCase();
    const password = body?.password;
    const recaptchaToken = body?.recaptchaToken;

    if (!email || !password || !recaptchaToken) {
      return apiResponse(
        {
          ok: false,
          message: "Email, password, dan verifikasi keamanan wajib diisi.",
        },
        400,
      );
    }

    // --- VERIFIKASI GOOGLE RECAPTCHA (SERVER-SIDE) ---
    try {
      const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
      const verifyRes = await fetch(verifyUrl, { method: "POST" });
      const verifyJson = await verifyRes.json();

      if (!verifyJson.success) {
        return apiResponse(
          {
            ok: false,
            message: "Verifikasi keamanan gagal atau kadaluarsa. Silakan coba lagi.",
          },
          400,
        );
      }
    } catch (err) {
      console.error("ReCAPTCHA Verification Error:", err);
      // Jika server Google bermasalah, kita beri peringatan tapi tetap amankan login
    }

    const supabase = await createClient();

    // 1. Cek profil untuk status lockout (Menggunakan Prisma)
    const profile = await prisma.profiles.findUnique({
      where: { email }
    });

    if (profile && profile.lockout_until && new Date(profile.lockout_until) > new Date()) {
      const remainingMinutes = Math.ceil((new Date(profile.lockout_until) - new Date()) / 60000);
      return apiResponse({
        ok: false,
        message: `Akun dikunci karena terlalu banyak percobaan gagal. Silakan coba lagi dalam ${remainingMinutes} menit.`
      }, 403);
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // 2. Catat kegagalan login
      if (profile) {
        const newAttempts = (profile.failed_login_attempts || 0) + 1;
        const lockoutUntil = newAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null; // Kunci 15 menit jika >= 5 kali
        
        await prisma.profiles.update({
          where: { id: profile.id },
          data: { 
            failed_login_attempts: newAttempts,
            lockout_until: lockoutUntil
          }
        });
      }

      return apiResponse(
        {
          ok: false,
          message: error.message || "Login gagal.",
        },
        400,
      );
    }

    // 3. Reset kegagalan login jika berhasil
    if (profile && profile.failed_login_attempts > 0) {
      await prisma.profiles.update({
        where: { id: profile.id },
        data: { 
          failed_login_attempts: 0,
          lockout_until: null
        }
      });
    }

    const session = await getCurrentSessionContext();

    if (!session?.isAuthenticated) {
      await supabase.auth.signOut();

      return apiResponse(
        {
          ok: false,
          message: "Login gagal membuat session admin yang valid.",
        },
        401,
      );
    }

    const hasAdminPanelAccess = session?.isAdmin || session?.isEditor;

    if (!hasAdminPanelAccess) {
      await supabase.auth.signOut();

      return apiResponse(
        {
          ok: false,
          code: "ADMIN_PANEL_ACCESS_REQUIRED",
          message:
            "Login berhasil, tetapi akun ini tidak memiliki hak akses ke panel admin.",
        },
        403,
      );
    }

    // 5. Catat Login ke Audit Log
    await recordAudit({
      session,
      action: AUDIT_ACTIONS.LOGIN,
      entity: AUDIT_ENTITIES.USER,
      entityId: session.profile?.id || session.user?.id || null,
      summary: `Admin "${session.profile?.full_name || email}" berhasil login.`,
      request,
    });

    return apiResponse({
      ok: true,
      message: "Login admin berhasil.",
      user: {
        id: session.profile?.id ?? session.claims?.sub ?? null,
        email: session.profile?.email ?? null,
        full_name: session.profile?.full_name ?? null,
        role: session.profile?.role ?? session.role ?? null,
      },
      permissions: {
        isAdmin: session.isAdmin ?? false,
        isEditor: session.isEditor ?? false,
        hasAdminPanelAccess,
      },
    });
  } catch (error) {
    console.error("POST Login Error:", error);
    return apiResponse(
      {
        ok: false,
        message: error?.message || "Terjadi kesalahan server saat login.",
      },
      500,
    );
  }
}
