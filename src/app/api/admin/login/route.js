import { apiResponse } from "@/lib/api-helpers";
import { getCurrentSessionContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/drizzle";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const limitCheck = await rateLimit({
      key: `admin:login:${ip}`,
      limit: 5,
      windowMs: 60_000,
    });

    if (!limitCheck.ok) {
      return apiResponse(
        { message: "Terlalu banyak percobaan login. Silakan coba lagi nanti.", code: "RATE_LIMITED" },
        429,
      );
    }

    const body = await request.json().catch(() => ({}));
    const email = body?.email?.trim()?.toLowerCase();
    const password = body?.password;
    const turnstileToken = body?.turnstileToken;

    if (!email || !password || !turnstileToken) {
      return apiResponse(
        {
          ok: false,
          message: "Email, password, dan verifikasi keamanan wajib diisi.",
        },
        400,
      );
    }

    // --- VERIFIKASI CLOUDFLARE TURNSTILE (SERVER-SIDE) ---
    try {
      const verifyRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: process.env.TURNSTILE_SECRET_KEY,
            response: turnstileToken,
          }),
          signal: AbortSignal.timeout(5_000),
        },
      );
      const verifyJson = await verifyRes.json();

      if (!verifyJson.success) {
        return apiResponse(
          {
            ok: false,
            message:
              "Verifikasi keamanan gagal atau kadaluarsa. Silakan coba lagi.",
          },
          400,
        );
      }
    } catch (err) {
      console.error("Turnstile Verification Error:", err);
      return apiResponse(
        { ok: false, message: "Gagal memverifikasi keamanan. Coba lagi." },
        429,
      );
    }

    const supabase = await createClient();

    // 1. Cek profil untuk status lockout
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.email, email))
      .limit(1);

    if (
      profile &&
      profile.lockout_until &&
      new Date(profile.lockout_until) > new Date()
    ) {
      const remainingMinutes = Math.ceil(
        (new Date(profile.lockout_until) - new Date()) / 60000,
      );
      return apiResponse(
        {
          ok: false,
          message: `Akun dikunci karena terlalu banyak percobaan gagal. Silakan coba lagi dalam ${remainingMinutes} menit.`,
        },
        403,
      );
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // 2. Catat kegagalan login
      if (profile) {
        const newAttempts = (profile.failed_login_attempts || 0) + 1;
        const lockoutUntil =
          newAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null; // Kunci 15 menit jika >= 5 kali

        await db
          .update(profiles)
          .set({
            failed_login_attempts: newAttempts,
            lockout_until: lockoutUntil,
          })
          .where(eq(profiles.id, profile.id));
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
      await db
        .update(profiles)
        .set({
          failed_login_attempts: 0,
          lockout_until: null,
        })
        .where(eq(profiles.id, profile.id));
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
