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

    const hasAdminPanelAccess = session?.isAdmin || session?.isEditor;

    if (!hasAdminPanelAccess) {
      await supabase.auth.signOut();

      return createNoStoreResponse(
        {
          ok: false,
          code: "ADMIN_PANEL_ACCESS_REQUIRED",
          message:
            "Login berhasil, tetapi akun ini tidak memiliki hak akses ke panel admin.",
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
        role: session.profile?.role ?? session.role ?? null,
      },
      permissions: {
        isAdmin: session.isAdmin ?? false,
        isEditor: session.isEditor ?? false,
        hasAdminPanelAccess,
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
