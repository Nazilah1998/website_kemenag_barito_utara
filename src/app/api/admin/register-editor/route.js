import { apiResponse } from "@/lib/prisma-helpers";
import { createAdminClient } from "@/lib/supabase/admin";
import { ROLES } from "@/lib/permissions";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
const SUPER_ADMIN_EMAIL = "nazilahmuhammad1998@gmail.com";

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
      return apiResponse(
        { message: "Nama lengkap, email, dan password wajib diisi." },
        400,
      );
    }

    if (email === SUPER_ADMIN_EMAIL) {
      return apiResponse(
        {
          message:
            "Email super admin dikunci dan tidak bisa didaftarkan ulang.",
        },
        403,
      );
    }

    if (password.length < 8) {
      return apiResponse({ message: "Password minimal 8 karakter." }, 400);
    }

    const existingProfile = await prisma.profiles.findUnique({
      where: { email: email },
      select: { id: true, email: true }
    });

    if (existingProfile) {
      return apiResponse(
        { message: "Email sudah terdaftar. Gunakan email lain." },
        409,
      );
    }

    const supabaseAdmin = createAdminClient();

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
        return apiResponse(
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
        return apiResponse(
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
        return apiResponse(
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
      return apiResponse({ message: "User ID tidak ditemukan." }, 500);
    }

    const now = new Date();

    // Use transaction to ensure all three tables are updated
    await prisma.$transaction([
      prisma.profiles.upsert({
        where: { id: userId },
        update: {
          full_name: fullName,
          email,
          role: ROLES.EDITOR,
          unit_name: unitName || null,
          updated_at: now,
        },
        create: {
          id: userId,
          full_name: fullName,
          email,
          role: ROLES.EDITOR,
          unit_name: unitName || null,
          is_active: false,
          updated_at: now,
        }
      }),
      prisma.admin_users.upsert({
        where: { user_id: userId },
        update: {
          full_name: fullName,
          role: ROLES.EDITOR,
          updated_at: now,
        },
        create: {
          user_id: userId,
          full_name: fullName,
          role: ROLES.EDITOR,
          is_active: false,
          updated_at: now,
        }
      }),
      prisma.editor_requests.upsert({
        where: { user_id: userId },
        update: {
          full_name: fullName,
          email,
          unit_name: unitName || null,
          status: "pending",
          updated_at: now,
        },
        create: {
          user_id: userId,
          full_name: fullName,
          email,
          unit_name: unitName || null,
          status: "pending",
          requested_at: now,
          updated_at: now,
        }
      })
    ]);

    return apiResponse({
      success: true,
      message:
        "Pendaftaran editor berhasil. Akun dapat langsung login tanpa verifikasi email Supabase, namun akses fitur menunggu verifikasi super admin.",
    });
  } catch (error) {
    console.error("POST Register Editor Error:", error);
    return apiResponse(
      { message: error?.message || "Terjadi kesalahan saat mendaftar akun editor." },
      500,
    );
  }
}
