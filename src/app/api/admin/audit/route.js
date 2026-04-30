import { NextResponse } from "next/server";
import { validateAdmin } from "@/lib/cms-utils";
import { listAudit } from "@/lib/audit";
import { PERMISSIONS } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const auth = await validateAdmin({
    permission: PERMISSIONS.AUDIT_VIEW,
  });
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") || 50);
  const entity = searchParams.get("entity") || null;
  const action = searchParams.get("action") || null;

  const result = await listAudit({ limit, entity, action });

  if (!result.ok) {
    return NextResponse.json(
      { message: result.error || "Gagal mengambil log audit.", items: [] },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    { items: result.items },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function DELETE(request) {
  const auth = await validateAdmin({
    permission: PERMISSIONS.AUDIT_VIEW, // Minimal view, tapi sebaiknya ada permission khusus DELETE jika ada
  });
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const clearAll = searchParams.get("clear") === "all";

    let result;
    if (clearAll) {
      const { clearAllAudit } = await import("@/lib/audit");
      result = await clearAllAudit();
    } else if (id) {
      const { deleteAudit } = await import("@/lib/audit");
      result = await deleteAudit(id);
    } else {
      return NextResponse.json(
        { message: "ID log atau parameter pembersihan wajib ditentukan." },
        { status: 400 },
      );
    }

    if (!result.ok) {
      return NextResponse.json(
        { message: result.error || "Gagal menghapus log." },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: result.message });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Internal server error." },
      { status: 500 },
    );
  }
}
