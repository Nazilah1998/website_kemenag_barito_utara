import { NextResponse } from "next/server";
import { getCurrentSessionContext } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function createNoStoreResponse(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim()?.toLowerCase();
    const password = body?.password;

    if (!email || !password) {
      return createNoStoreResponse(
        {
          ok: false,
          message: "Email dan password wajib diisi.",
        },
        400,
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return createNoStoreResponse(
        {
          ok: false,
          message: error.message || "Login gagal.",
        },
        400,
      );
    }

    const session = await getCurrentSessionContext();

    if (!session?.isAuthenticated) {
      await supabase.auth.signOut();

      return createNoStoreResponse(
        {
          ok: false,
          message: "Login gagal membuat session admin yang valid.",
        },
        401,
      );
    }

    if (!session?.isAdmin) {
      await supabase.auth.signOut();

      return createNoStoreResponse(
        {
          ok: false,
          code: "ADMIN_REQUIRED",
          message:
            "Login berhasil, tetapi akun ini tidak memiliki hak akses admin.",
        },
        403,
      );
    }

    return createNoStoreResponse({
      ok: true,
      message: "Login admin berhasil.",
      user: {
        id: session.profile?.id ?? session.claims?.sub ?? null,
        email: session.profile?.email ?? null,
        full_name: session.profile?.full_name ?? null,
        role: session.profile?.role ?? null,
      },
      mfa: {
        currentLevel: session.aal ?? null,
        nextLevel: session.nextAal ?? null,
        isVerified: session.isMfaVerified ?? false,
        errorMessage: session.mfaErrorMessage ?? null,
      },
    });
  } catch (error) {
    return createNoStoreResponse(
      {
        ok: false,
        message: error?.message || "Terjadi kesalahan server saat login.",
      },
      500,
    );
  }
}
