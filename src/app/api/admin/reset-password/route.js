import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
    const { action, email, password } = body;

    const supabase = createAdminClient();

    if (action === "verify-email") {
      if (!email) {
        return createNoStoreResponse(
          { ok: false, message: "Email wajib diisi." },
          400,
        );
      }

      // Check if user exists in auth.users
      const { data: users, error: fetchError } =
        await supabase.auth.admin.listUsers();
      if (fetchError) throw fetchError;

      const user = users.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

      if (!user) {
        return createNoStoreResponse(
          {
            ok: false,
            message: "Email tidak terdaftar dalam sistem administrasi.",
          },
          404,
        );
      }

      return createNoStoreResponse({
        ok: true,
        message: "Email tervalidasi.",
        userId: user.id,
      });
    }

    if (action === "reset-password") {
      if (!email || !password) {
        return createNoStoreResponse(
          { ok: false, message: "Email dan password baru wajib diisi." },
          400,
        );
      }

      // 1. Get User ID first
      const { data: users, error: fetchError } =
        await supabase.auth.admin.listUsers();
      if (fetchError) throw fetchError;

      const user = users.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

      if (!user) {
        return createNoStoreResponse(
          {
            ok: false,
            message: "User tidak ditemukan.",
          },
          404,
        );
      }

      // 2. Update password
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: password },
      );

      if (updateError) throw updateError;

      return createNoStoreResponse({
        ok: true,
        message: "Password berhasil diperbarui. Silakan login kembali.",
      });
    }

    return createNoStoreResponse(
      { ok: false, message: "Aksi tidak valid." },
      400,
    );
  } catch (error) {
    console.error("Reset Password Error:", error);
    return createNoStoreResponse(
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
