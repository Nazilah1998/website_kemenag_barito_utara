import prisma from "@/lib/prisma";
import { apiResponse } from "@/lib/prisma-helpers";
import { validateAdmin } from "@/lib/cms-utils";

export async function GET(request) {
  try {
    const validation = await validateAdmin();
    if (!validation.ok) return validation.response;

    const { session, permissionContext } = validation;
    
    // Only allow if has AUDIT_VIEW permission or is super_admin
    if (session.role !== "super_admin" && !permissionContext?.permissions?.includes("audit_view")) {
      return apiResponse({ error: "Unauthorized. Audit access required." }, 403);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.admin_audit_log.findMany({
        orderBy: { created_at: "desc" },
        take: limit,
        skip: skip,
      }),
      prisma.admin_audit_log.count()
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
    console.error("Audit log API error:", error);
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
      await prisma.admin_audit_log.delete({
        where: { id }
      });
      return apiResponse({ message: "Log berhasil dihapus." });
    } else {
      await prisma.admin_audit_log.deleteMany();
      return apiResponse({ message: "Seluruh riwayat log berhasil dibersihkan." });
    }
  } catch (error) {
    console.error("Audit log DELETE error:", error);
    return apiResponse({ error: "Gagal menghapus log." }, 500);
  }
}
