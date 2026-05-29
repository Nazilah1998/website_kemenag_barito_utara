import { apiResponse } from "@/lib/api-helpers";
import { db } from "@/lib/drizzle";
import { admin_audit_log } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { validateAdmin } from "@/lib/cms-utils";
import { PERMISSIONS } from "@/lib/permissions";
import { logError } from "@/lib/logger";

export async function GET(request) {
  try {
    const validation = await validateAdmin({ permission: PERMISSIONS.AUDIT_VIEW });
    if (!validation.ok) return validation.response;

    const { session, permissionContext } = validation;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [logs, [{ count: total }]] = await Promise.all([
      db
        .select()
        .from(admin_audit_log)
        .orderBy(desc(admin_audit_log.created_at))
        .limit(limit)
        .offset(skip),
      db.select({ count: sql`count(*)` }).from(admin_audit_log)
    ]);

    return apiResponse({
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logError("audit_log_get_error", { error: error?.message });
    return apiResponse({ error: "Internal Server Error" }, 500);
  }
}

export async function DELETE(request) {
  try {
    const validation = await validateAdmin();
    if (!validation.ok) return validation.response;

    const { session } = validation;
    
    // Only super_admin can delete or clear logs
    if (session.role !== "super_admin") {
      return apiResponse({ error: "Hanya Super Admin yang dapat menghapus riwayat log." }, 403);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      await db.delete(admin_audit_log).where(eq(admin_audit_log.id, id));
      return apiResponse({ message: "Log berhasil dihapus." });
    } else {
      await db.delete(admin_audit_log);
      return apiResponse({ message: "Seluruh riwayat log berhasil dibersihkan." });
    }
  } catch (error) {
    logError("audit_log_delete_error", { error: error?.message });
    return apiResponse({ error: "Gagal menghapus log." }, 500);
  }
}
