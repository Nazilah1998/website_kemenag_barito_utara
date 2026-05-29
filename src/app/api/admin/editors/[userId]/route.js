import { apiResponse } from "@/lib/api-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import { db } from "@/lib/drizzle";
import { profiles, admin_users, editor_requests, user_permissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logWarn, logError } from "@/lib/logger";

export const dynamic = "force-dynamic";
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "";

export async function PATCH(request, context) {
  try {
    const auth = await validateAdmin();
    if (!auth.ok) return auth.response;

    if (auth.session?.role !== "super_admin") {
      return apiResponse(
        { message: "Hanya super admin yang dapat memproses editor." },
        403,
      );
    }

    const params = await context.params;
    const userId = params?.userId;

    if (!userId) {
      return apiResponse({ message: "User ID editor tidak valid." }, 400);
    }

    const body = await request.json().catch(() => ({}));
    const action = String(body?.action || "")
      .trim()
      .toLowerCase();

    const reviewerId = auth.session?.profile?.id || auth.session?.user?.id || null;
    const currentUserId = auth.session?.user?.id || null;
    const now = new Date();

    if (action === "approve") {
      await db
        .update(editor_requests)
        .set({
          status: "approved",
          reviewed_at: now,
          reviewed_by: reviewerId,
          updated_at: now,
        })
        .where(eq(editor_requests.user_id, userId));

      await recordAudit({
        session: auth.session,
        action: AUDIT_ACTIONS.UPDATE,
        entity: AUDIT_ENTITIES.USER,
        entityId: userId,
        summary: `Menyetujui pendaftaran editor: ${userId}`,
        request,
      });

      return apiResponse({
        message:
          "Editor berhasil di-approve. Silakan tentukan role, permission, dan aktivasi akun.",
      });
    }

    if (action === "set_role") {
      const nextRole = String(body?.role || "")
        .trim()
        .toLowerCase();

      if (nextRole !== "admin" && nextRole !== "editor") {
        return apiResponse({ message: "Role hanya boleh admin atau editor." }, 400);
      }

      if (currentUserId && currentUserId === userId) {
        return apiResponse(
          { message: "Tidak bisa mengubah role akun Anda sendiri." },
          400,
        );
      }

      const [targetProfile] = await db
        .select({ id: profiles.id, email: profiles.email })
        .from(profiles)
        .where(eq(profiles.id, userId))
        .limit(1);

      if (!targetProfile) return apiResponse({ message: "Profil tidak ditemukan." }, 404);

      const targetEmail = String(targetProfile?.email || "")
        .trim()
        .toLowerCase();

      if (targetEmail && targetEmail === SUPER_ADMIN_EMAIL) {
        return apiResponse(
          { message: "Role akun super admin dikunci dan tidak dapat diubah." },
          403,
        );
      }

      // Update both tables to ensure consistency
      await db.transaction(async (tx) => {
        await tx
          .update(profiles)
          .set({ role: nextRole, updated_at: now })
          .where(eq(profiles.id, userId));
        await tx
          .update(admin_users)
          .set({ role: nextRole, updated_at: now })
          .where(eq(admin_users.user_id, userId));
      });

      await recordAudit({
        session: auth.session,
        action: AUDIT_ACTIONS.ROLE_CHANGE,
        entity: AUDIT_ENTITIES.USER,
        entityId: userId,
        summary: `Mengubah role ${userId} menjadi ${nextRole}`,
        request,
      });

      return apiResponse({
        message: `Role akun berhasil diubah menjadi ${nextRole}.`,
      });
    }

    if (action === "delete") {
      if (currentUserId && currentUserId === userId) {
        return apiResponse(
          { message: "Tidak bisa menghapus akun Anda sendiri." },
          400,
        );
      }

      // Check if it's the super admin by email before deleting
      const [targetProfile] = await db
        .select({ id: profiles.id, email: profiles.email })
        .from(profiles)
        .where(eq(profiles.id, userId))
        .limit(1);

      if (targetProfile && targetProfile.email === SUPER_ADMIN_EMAIL) {
        return apiResponse({ message: "Akun super admin tidak dapat dihapus." }, 403);
      }

      const { createAdminClient } = await import("@/lib/supabase/admin");
      const supabaseAdmin = createAdminClient();
      
      // Try to delete from Supabase Auth first
      try {
        await supabaseAdmin.auth.admin.deleteUser(userId);
      } catch (authErr) {
        logWarn("editors_delete_auth_warning", { error: authErr.message });
      }

      // Delete from all tables dalam 1 transaksi
      await db.transaction(async (tx) => {
        await tx.delete(user_permissions).where(eq(user_permissions.user_id, userId));
        await tx.delete(editor_requests).where(eq(editor_requests.user_id, userId));
        await tx.delete(admin_users).where(eq(admin_users.user_id, userId));
        await tx.delete(profiles).where(eq(profiles.id, userId));
      });

      await recordAudit({
        session: auth.session,
        action: AUDIT_ACTIONS.DELETE,
        entity: AUDIT_ENTITIES.USER,
        entityId: userId,
        summary: `Menghapus akun editor (Auth & DB): ${targetProfile?.email || userId}`,
        request,
      });

      return apiResponse({ message: "Akun editor berhasil dihapus sepenuhnya." });
    }

    if (action === "reject") {
      await db
        .update(editor_requests)
        .set({
          status: "rejected",
          reviewed_at: now,
          reviewed_by: reviewerId,
          updated_at: now,
        })
        .where(eq(editor_requests.user_id, userId));

      await recordAudit({
        session: auth.session,
        action: AUDIT_ACTIONS.UPDATE,
        entity: AUDIT_ENTITIES.USER,
        entityId: userId,
        summary: `Menolak pendaftaran editor: ${userId}`,
        request,
      });

      return apiResponse({ message: "Editor berhasil ditolak." });
    }

    if (action === "activate") {
      await db.transaction(async (tx) => {
        await tx
          .update(profiles)
          .set({ is_active: true, updated_at: now })
          .where(eq(profiles.id, userId));
        await tx
          .update(admin_users)
          .set({ is_active: true, updated_at: now })
          .where(eq(admin_users.user_id, userId));
      });

      await recordAudit({
        session: auth.session,
        action: AUDIT_ACTIONS.UPDATE,
        entity: AUDIT_ENTITIES.USER,
        entityId: userId,
        summary: `Mengaktifkan akun: ${userId}`,
        request,
      });

      return apiResponse({ message: "Akun editor berhasil diaktifkan." });
    }

    if (action === "deactivate") {
      await db.transaction(async (tx) => {
        await tx
          .update(profiles)
          .set({ is_active: false, updated_at: now })
          .where(eq(profiles.id, userId));
        await tx
          .update(admin_users)
          .set({ is_active: false, updated_at: now })
          .where(eq(admin_users.user_id, userId));
      });

      await recordAudit({
        session: auth.session,
        action: AUDIT_ACTIONS.UPDATE,
        entity: AUDIT_ENTITIES.USER,
        entityId: userId,
        summary: `Menonaktifkan akun: ${userId}`,
        request,
      });

      return apiResponse({ message: "Akun editor berhasil dinonaktifkan." });
    }

    if (action === "unlock") {
      await db
        .update(profiles)
        .set({
          failed_login_attempts: 0,
          lockout_until: null,
          updated_at: now,
        })
        .where(eq(profiles.id, userId));

      await recordAudit({
        session: auth.session,
        action: AUDIT_ACTIONS.UPDATE,
        entity: AUDIT_ENTITIES.USER,
        entityId: userId,
        summary: `Membuka kunci akun (reset login attempts): ${userId}`,
        request,
      });

      return apiResponse({ message: "Kunci akun berhasil dibuka." });
    }

    return apiResponse({ message: "Aksi tidak dikenali." }, 400);
  } catch (error) {
    logError("editors_patch_error", { error: error?.message });
    return apiResponse(
      { message: error?.message || "Gagal memproses data editor." },
      500,
    );
  }
}
