import { apiResponse } from "@/lib/api-helpers";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateAdmin } from "@/lib/cms-utils";
import { ROLES } from "@/lib/permissions";
import { db } from "@/lib/drizzle";
import { profiles, admin_users, editor_requests } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    // 1. Validate Requester (Must be Super Admin)
    const auth = await validateAdmin();
    if (!auth.ok) return auth.response;

    if (auth.session?.role !== "super_admin") {
      return apiResponse(
        { message: "Hanya super admin yang dapat mendaftarkan editor baru secara langsung." },
        403
      );
    }

    // 2. Parse Body
    const body = await request.json().catch(() => ({}));
    const fullName = String(body?.fullName || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const unitName = String(body?.unitName || "").trim();
    const password = String(body?.password || "");

    if (!fullName || !email || !password) {
      return apiResponse(
        { message: "Nama lengkap, email, dan password wajib diisi." },
        400
      );
    }

    if (password.length < 8) {
      return apiResponse({ message: "Password minimal 8 karakter." }, 400);
    }

    // 3. Check for Existing Profile
    const [existingProfile] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.email, email))
      .limit(1);

    if (existingProfile) {
      return apiResponse(
        { message: "Email sudah terdaftar. Gunakan email lain." },
        409
      );
    }

    // 4. Create User in Supabase Auth (using Service Role)
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

    if (createError) {
      return apiResponse(
        { message: createError.message || "Gagal membuat user auth." },
        400
      );
    }

    const userId = createdUser?.user?.id;
    if (!userId) {
      return apiResponse({ message: "User ID tidak ditemukan setelah pembuatan." }, 500);
    }

    const now = new Date();

    // 5. Create Database Entries (Directly Active & Approved)
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
            is_active: true,
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
            is_active: true,
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
            is_active: true,
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
            is_active: true,
            updated_at: now,
          });
      }
    };

    const upsertEditorRequests = async () => {
      const reviewerId = auth.session?.profile?.id || auth.session?.user?.id || null;
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
            status: "approved",
            reviewed_at: now,
            reviewed_by: reviewerId,
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
            status: "approved",
            requested_at: now,
            reviewed_at: now,
            reviewed_by: reviewerId,
            updated_at: now,
          });
      }
    };

    await Promise.all([upsertProfiles(), upsertAdminUsers(), upsertEditorRequests()]);

    return apiResponse({
      success: true,
      message: "Akun editor baru berhasil dibuat dan langsung diaktifkan.",
      editorId: userId
    });

  } catch (error) {
    console.error("POST Internal Create Editor Error:", error);
    return apiResponse(
      { message: error?.message || "Terjadi kesalahan internal saat membuat akun." },
      500
    );
  }
}
