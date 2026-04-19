import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ROLES } from "@/lib/permissions";

export const dynamic = "force-dynamic";
const SUPER_ADMIN_EMAIL = "nazilahmuhammad1998@gmail.com";

function json(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const fullName = String(body?.fullName || "").trim();
    const email = String(body?.email || "")
      .trim()
      .toLowerCase();
    const unitName = String(body?.unitName || "").trim();
    const password = String(body?.password || "");

    if (!fullName || !email || !password) {
      return json(
        { message: "Nama lengkap, email, dan password wajib diisi." },
        400,
      );
    }

    if (email === SUPER_ADMIN_EMAIL) {
      return json(
        {
          message:
            "Email super admin dikunci dan tidak bisa didaftarkan ulang.",
        },
        403,
      );
    }

    if (password.length < 8) {
      return json({ message: "Password minimal 8 karakter." }, 400);
    }

    const supabaseAdmin = createAdminClient();

    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id, email")
      .eq("email", email)
      .maybeSingle();

    if (existingProfile) {
      return json(
        { message: "Email sudah terdaftar. Gunakan email lain." },
        409,
      );
    }

    const { data: createdUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          role: ROLES.EDITOR,
          unit_name: unitName || null,
        },
        app_metadata: {
          role: ROLES.EDITOR,
        },
      });

    let userId = createdUser?.user?.id || null;

    if (createError) {
      const errorText = String(createError.message || "").toLowerCase();
      const isAlreadyRegistered =
        errorText.includes("already been registered") ||
        errorText.includes("already registered") ||
        errorText.includes("duplicate") ||
        errorText.includes("exists");

      if (!isAlreadyRegistered) {
        return json(
          { message: createError.message || "Gagal membuat user auth." },
          400,
        );
      }

      const { data: usersByEmail, error: listUsersError } =
        await supabaseAdmin.auth.admin.listUsers({
          page: 1,
          perPage: 1000,
        });

      if (listUsersError) {
        return json(
          {
            message:
              listUsersError.message ||
              "Gagal membaca daftar user auth untuk recovery.",
          },
          400,
        );
      }

      const matchedUser = (usersByEmail?.users || []).find(
        (item) =>
          String(item?.email || "")
            .trim()
            .toLowerCase() === email,
      );

      if (!matchedUser?.id) {
        return json(
          {
            message:
              "Email terdeteksi sudah terdaftar, namun user auth tidak ditemukan.",
          },
          409,
        );
      }

      userId = matchedUser.id;
    }

    if (!userId) {
      return json({ message: "User ID tidak ditemukan." }, 500);
    }

    const timestamp = new Date().toISOString();

    const { error: profileError } = await supabaseAdmin.from("profiles").upsert(
      {
        id: userId,
        full_name: fullName,
        email,
        role: ROLES.EDITOR,
        unit_name: unitName || null,
        avatar_url: null,
        is_active: false,
        updated_at: timestamp,
      },
      { onConflict: "id" },
    );

    if (profileError) {
      return json(
        { message: profileError.message || "Gagal menyimpan profile editor." },
        400,
      );
    }

    const { error: adminUsersError } = await supabaseAdmin
      .from("admin_users")
      .upsert(
        {
          user_id: userId,
          full_name: fullName,
          role: ROLES.EDITOR,
          is_active: false,
          updated_at: timestamp,
        },
        { onConflict: "user_id" },
      );

    if (adminUsersError) {
      return json(
        { message: adminUsersError.message || "Gagal menyimpan admin_users." },
        400,
      );
    }

    const { error: requestError } = await supabaseAdmin
      .from("editor_requests")
      .upsert(
        {
          user_id: userId,
          full_name: fullName,
          email,
          unit_name: unitName || null,
          status: "pending",
          requested_at: timestamp,
          updated_at: timestamp,
        },
        { onConflict: "user_id" },
      );

    if (requestError) {
      return json(
        {
          message: requestError.message || "Gagal menyimpan permintaan editor.",
        },
        400,
      );
    }

    return json({
      success: true,
      message:
        "Pendaftaran editor berhasil diproses. Jika user auth sudah ada, data editor berhasil dipulihkan.",
    });
  } catch (error) {
    return json(
      {
        message:
          error?.message || "Terjadi kesalahan saat mendaftar akun editor.",
      },
      500,
    );
  }
}
