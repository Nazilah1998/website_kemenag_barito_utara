import { apiResponse } from "@/lib/prisma-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
const SUPER_ADMIN_EMAIL = "nazilahmuhammad1998@gmail.com";

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
      await prisma.editor_requests.update({
        where: { user_id: userId },
        data: {
          status: "approved",
          reviewed_at: now,
          reviewed_by: reviewerId,
          updated_at: now,
        }
      });

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

      const targetProfile = await prisma.profiles.findUnique({
        where: { id: userId },
        select: { id: true, email: true }
      });

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

      // Update in transaction to ensure consistency
      await prisma.$transaction([
        prisma.profiles.update({
          where: { id: userId },
          data: { role: nextRole, updated_at: now }
        }),
        prisma.admin_users.update({
          where: { user_id: userId },
          data: { role: nextRole, updated_at: now }
        })
      ]);

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

      const targetProfile = await prisma.profiles.findUnique({
        where: { id: userId },
        select: { id: true, email: true }
      });

      if (!targetProfile) return apiResponse({ message: "Profil tidak ditemukan." }, 404);

      const targetEmail = String(targetProfile?.email || "")
        .trim()
        .toLowerCase();

      if (targetEmail && targetEmail === SUPER_ADMIN_EMAIL) {
        return apiResponse({ message: "Akun super admin tidak dapat dihapus." }, 403);
      }

      const { createAdminClient } = await import("@/lib/supabase/admin");
      const supabaseAdmin = createAdminClient();
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      
      if (authDeleteError) {
        console.warn("Supabase Auth Delete Warning:", authDeleteError.message);
        // We continue anyway because we want to clean up Prisma tables
      }

      await prisma.$transaction([
        prisma.user_permissions.deleteMany({ where: { user_id: userId } }),
        prisma.editor_requests.deleteMany({ where: { user_id: userId } }),
        prisma.admin_users.deleteMany({ where: { user_id: userId } }),
        prisma.profiles.delete({ where: { id: userId } })
      ]);

      await recordAudit({
        session: auth.session,
        action: AUDIT_ACTIONS.DELETE,
        entity: AUDIT_ENTITIES.USER,
        entityId: userId,
        summary: `Menghapus akun editor (Auth & DB): ${targetEmail || userId}`,
        request,
      });

      return apiResponse({ message: "Akun editor berhasil dihapus." });
    }

    if (action === "reject") {
      await prisma.editor_requests.update({
        where: { user_id: userId },
        data: {
          status: "rejected",
          reviewed_at: now,
          reviewed_by: reviewerId,
          updated_at: now,
        }
      });

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
      await prisma.$transaction([
        prisma.profiles.update({
          where: { id: userId },
          data: { is_active: true, updated_at: now }
        }),
        prisma.admin_users.update({
          where: { user_id: userId },
          data: { is_active: true, updated_at: now }
        })
      ]);

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
      await prisma.$transaction([
        prisma.profiles.update({
          where: { id: userId },
          data: { is_active: false, updated_at: now }
        }),
        prisma.admin_users.update({
          where: { user_id: userId },
          data: { is_active: false, updated_at: now }
        })
      ]);

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
      await prisma.profiles.update({
        where: { id: userId },
        data: {
          failed_login_attempts: 0,
          lockout_until: null,
          updated_at: now,
        },
      });

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
    console.error("PATCH Editors [userId] Error:", error);
    return apiResponse(
      { message: error?.message || "Gagal memproses data editor." },
      500,
    );
  }
}
