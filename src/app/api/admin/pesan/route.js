import { apiResponse } from "@/lib/prisma-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import { PERMISSIONS } from "@/lib/permissions";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await validateAdmin({
    allowEditor: true,
    permission: PERMISSIONS.KONTAK_MANAGE,
  });
  if (!auth.ok) return auth.response;

  try {
    const data = await prisma.kontak_pesan.findMany({
      orderBy: { created_at: 'desc' }
    });

    return apiResponse({
      items: data ?? [],
    });
  } catch (error) {
    console.error("GET Pesan Error:", error);
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

    const existing = await prisma.kontak_pesan.findUnique({
      where: { id: id }
    });

    const data = await prisma.kontak_pesan.update({
      where: { id: id },
      data: { status }
    });

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.UPDATE,
      entity: AUDIT_ENTITIES.KONTAK_PESAN,
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
    console.error("PATCH Pesan Error:", error);
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

    const existing = await prisma.kontak_pesan.findUnique({
      where: { id: id }
    });

    await prisma.kontak_pesan.delete({
      where: { id: id }
    });

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.DELETE,
      entity: AUDIT_ENTITIES.KONTAK_PESAN,
      entityId: id,
      summary: `Menghapus pesan dari: ${existing?.sender_name || id}`,
      before: existing,
      request,
    });

    return apiResponse({ message: "Pesan berhasil dihapus." });
  } catch (error) {
    console.error("DELETE Pesan Error:", error);
    return apiResponse(
      { message: error.message || "Gagal menghapus pesan." },
      500,
    );
  }
}
