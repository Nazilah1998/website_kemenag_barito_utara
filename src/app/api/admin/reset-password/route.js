import { apiResponse } from "@/lib/prisma-helpers";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, email, password } = body;

    const supabase = createAdminClient();

    if (action === "verify-email") {
      if (!email) {
        return apiResponse(
          { ok: false, message: "Email wajib diisi." },
          400,
        );
      }

      // Check if user exists in auth.users first
      const { data: users, error: fetchError } =
        await supabase.auth.admin.listUsers();
      if (fetchError) throw fetchError;

      const user = users.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

      if (!user) {
        return apiResponse(
          {
            ok: false,
            message: "Email tidak terdaftar dalam sistem administrasi.",
          },
          404,
        );
      }

      // Send the actual recovery email via Supabase
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${new URL(request.url).origin}/auth/confirm?next=${encodeURIComponent("/admin/forgot-password?step=2")}`,
      });

      if (resetError) {
        console.error("Supabase Auth Error:", resetError);
        throw resetError;
      }

      return apiResponse({
        ok: true,
        message: "Instruksi pemulihan telah dikirim ke email Anda.",
      });
    }

    if (action === "reset-password") {
      if (!email || !password) {
        return apiResponse(
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
        return apiResponse(
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

      return apiResponse({
        ok: true,
        message: "Password berhasil diperbarui. Silakan login kembali.",
      });
    }

    return apiResponse(
      { ok: false, message: "Aksi tidak valid." },
      400,
    );
  } catch (error) {
    console.error("DEBUG - Reset Password Error:", error);
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

