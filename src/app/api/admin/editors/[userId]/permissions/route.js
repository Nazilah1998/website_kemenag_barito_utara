import { apiResponse } from "@/lib/api-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import { PERMISSIONS } from "@/lib/permissions";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import { db } from "@/lib/drizzle";
import { user_permissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

const ALLOWED_PERMISSIONS = new Set(Object.values(PERMISSIONS));

export async function PUT(request, context) {
  try {
    const auth = await validateAdmin();
    if (!auth.ok) return auth.response;

    if (auth.session?.role !== "super_admin") {
      return apiResponse(
        { message: "Hanya super admin yang dapat mengatur permission editor." },
        403,
      );
    }

    const params = await context.params;
    const userId = params?.userId;

    if (!userId) {
      return apiResponse({ message: "User ID editor tidak valid." }, 400);
    }

    const body = await request.json().catch(() => ({}));
    const permissions = Array.isArray(body?.permissions)
      ? [...new Set(body.permissions.map((item) => String(item).trim()))]
      : [];

    const invalidPermission = permissions.find(
      (item) => !ALLOWED_PERMISSIONS.has(item),
    );

    if (invalidPermission) {
      return apiResponse(
        { message: `Permission tidak valid: ${invalidPermission}` },
        400,
      );
    }

    await db.transaction(async (tx) => {
      // Delete old permissions
      await tx.delete(user_permissions).where(eq(user_permissions.user_id, userId));

      // Insert new permissions
      if (permissions.length) {
        const now = new Date();
        await tx.insert(user_permissions).values(
          permissions.map((permission) => ({
            user_id: userId,
            permission,
            created_at: now,
            updated_at: now,
          }))
        );
      }
    });

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.UPDATE,
      entity: AUDIT_ENTITIES.USER,
      entityId: userId,
      summary: `Memperbarui permission user ${userId} menjadi: ${permissions.join(", ") || "none"}`,
      request,
    });

    return apiResponse({ message: "Permission editor berhasil disimpan." });
  } catch (error) {
    logError("editors_permissions_put_error", { error: error?.message });
    return apiResponse(
      { message: error?.message || "Gagal menyimpan permission editor." },
      500,
    );
  }
}
