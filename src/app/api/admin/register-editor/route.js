import { apiResponse } from "@/lib/api-helpers";
import { createAdminClient } from "@/lib/supabase/admin";
import { ROLES } from "@/lib/permissions";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { db } from "@/lib/drizzle";
import { profiles, admin_users, editor_requests } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "";

export async function POST(request) {
  const ip = getClientIp(request);
  const limitCheck = await rateLimit({
    key: `register-editor:${ip}`,
    limit: 3,
    windowMs: 3600_000,
  });

  if (!limitCheck.ok) {
    return apiResponse(
      { message: "Terlalu banyak permintaan pendaftaran. Silakan coba lagi nanti." },
      429,
    );
  }
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

    const [existingProfile] = await db
      .select({ id: profiles.id, email: profiles.email })
      .from(profiles)
      .where(eq(profiles.email, email))
      .limit(1);

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

    // Upsert all three tables
    const upsertProfiles = async () => {
      const [existing] = await db
        .select({ id: profiles.id })
        .from(profiles)
        .where(eq(profiles.id, userId))
        .limit(1);
      if (existing) {
        await db
          .update(profiles)
          .set({
            full_name: fullName,
            email,
            role: ROLES.EDITOR,
            unit_name: unitName || null,
            updated_at: now,
          })
          .where(eq(profiles.id, userId));
      } else {
        await db
          .insert(profiles)
          .values({
            id: userId,
            full_name: fullName,
            email,
            role: ROLES.EDITOR,
            unit_name: unitName || null,
            is_active: false,
            updated_at: now,
          });
      }
    };

    const upsertAdminUsers = async () => {
      const [existing] = await db
        .select({ user_id: admin_users.user_id })
        .from(admin_users)
        .where(eq(admin_users.user_id, userId))
        .limit(1);
      if (existing) {
        await db
          .update(admin_users)
          .set({
            full_name: fullName,
            role: ROLES.EDITOR,
            updated_at: now,
          })
          .where(eq(admin_users.user_id, userId));
      } else {
        await db
          .insert(admin_users)
          .values({
            user_id: userId,
            full_name: fullName,
            role: ROLES.EDITOR,
            is_active: false,
            updated_at: now,
          });
      }
    };

    const upsertEditorRequests = async () => {
      const [existing] = await db
        .select({ user_id: editor_requests.user_id })
        .from(editor_requests)
        .where(eq(editor_requests.user_id, userId))
        .limit(1);
      if (existing) {
        await db
          .update(editor_requests)
          .set({
            full_name: fullName,
            email,
            unit_name: unitName || null,
            status: "pending",
            updated_at: now,
          })
          .where(eq(editor_requests.user_id, userId));
      } else {
        await db
          .insert(editor_requests)
          .values({
            user_id: userId,
            full_name: fullName,
            email,
            unit_name: unitName || null,
            status: "pending",
            requested_at: now,
            updated_at: now,
          });
      }
    };

    await Promise.all([upsertProfiles(), upsertAdminUsers(), upsertEditorRequests()]);

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
