import { apiResponse } from "@/lib/api-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import { PERMISSIONS } from "@/lib/permissions";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import { db } from "@/lib/drizzle";
import { kontak_pesan } from "@/db/schema";
import { eq, desc, sql, or, like } from "drizzle-orm";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const auth = await validateAdmin({
    allowEditor: true,
    permission: PERMISSIONS.KONTAK_MANAGE,
  });
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(10000, Math.max(1, parseInt(searchParams.get("limit") || "10000")));
    const skip = (page - 1) * limit;
    const q = searchParams.get("q")?.trim() || "";
    const statusFilter = searchParams.get("status")?.trim() || "";
    const subjekFilter = searchParams.get("subjek")?.trim() || "";

    const filters = [];
    if (q) {
      filters.push(
        or(
          like(kontak_pesan.nama, `%${q}%`),
          like(kontak_pesan.whatsapp, `%${q}%`),
          like(kontak_pesan.pesan, `%${q}%`),
          like(kontak_pesan.subjek, `%${q}%`),
        ),
      );
    }
    if (statusFilter) {
      filters.push(eq(kontak_pesan.status, statusFilter));
    }
    if (subjekFilter) {
      filters.push(eq(kontak_pesan.subjek, subjekFilter));
    }
    const whereClause = filters.length > 0 ? sql.join(filters, sql` AND `) : undefined;

    const [data, [{ count: total }]] = await Promise.all([
      db
        .select()
        .from(kontak_pesan)
        .where(whereClause)
        .orderBy(desc(kontak_pesan.created_at))
        .limit(limit)
        .offset(skip),
      db.select({ count: sql`count(*)` }).from(kontak_pesan).where(whereClause)
    ]);

    return apiResponse({
      items: data ?? [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logError("pesan_get_error", { error: error?.message });
    return apiResponse(
      { message: error.message || "Gagal mengambil daftar pesan." },
      500,
    );
  }
}

export async function PATCH(request) {
  const auth = await validateAdmin({
    allowEditor: true,
    permission: PERMISSIONS.KONTAK_MANAGE,
  });
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return apiResponse(
        { message: "ID dan status wajib diisi." },
        400,
      );
    }

    const [existing] = await db
      .select()
      .from(kontak_pesan)
      .where(eq(kontak_pesan.id, id))
      .limit(1);

    if (!existing) {
      return apiResponse({ message: "Pesan tidak ditemukan." }, 404);
    }

    const [data] = await db
      .update(kontak_pesan)
      .set({ status })
      .where(eq(kontak_pesan.id, id))
      .returning();

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.UPDATE,
      entity: AUDIT_ENTITIES.KONTAK,
      entityId: id,
      summary: `Mengubah status pesan dari ${existing?.status || 'unknown'} menjadi ${status}`,
      before: existing,
      after: data,
      request,
    });

    return apiResponse({
      message: "Status pesan berhasil diperbarui.",
      item: data,
    });
  } catch (error) {
    logError("pesan_patch_error", { error: error?.message });
    return apiResponse(
      { message: error.message || "Gagal memperbarui status pesan." },
      500,
    );
  }
}

export async function DELETE(request) {
  const auth = await validateAdmin({
    allowEditor: true,
    permission: PERMISSIONS.KONTAK_MANAGE,
  });
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return apiResponse({ message: "ID pesan wajib diisi." }, 400);
    }

    const [existing] = await db
      .select()
      .from(kontak_pesan)
      .where(eq(kontak_pesan.id, id))
      .limit(1);

    if (!existing) {
      return apiResponse({ message: "Pesan tidak ditemukan." }, 404);
    }

    await db.delete(kontak_pesan).where(eq(kontak_pesan.id, id));

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.DELETE,
      entity: AUDIT_ENTITIES.KONTAK,
      entityId: id,
      summary: `Menghapus pesan dari: ${existing?.nama || id}`,
      before: existing,
      request,
    });

    return apiResponse({ message: "Pesan berhasil dihapus." });
  } catch (error) {
    logError("pesan_delete_error", { error: error?.message });
    return apiResponse(
      { message: error.message || "Gagal menghapus pesan." },
      500,
    );
  }
}
