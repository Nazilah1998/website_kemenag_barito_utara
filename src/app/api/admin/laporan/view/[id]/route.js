import { apiResponse, getSafeIdFromContext } from "@/lib/api-helpers";
import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { report_documents } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
  try {
    const id = await getSafeIdFromContext(context);
    if (!id) {
      return apiResponse({ message: "ID dokumen tidak valid." }, 400);
    }

    const [doc] = await db
      .select({ id: report_documents.id, file_url: report_documents.file_url, is_published: report_documents.is_published, view_count: report_documents.view_count })
      .from(report_documents)
      .where(eq(report_documents.id, id))
      .limit(1);

    if (!doc) {
      return apiResponse({ message: "Dokumen tidak ditemukan." }, 404);
    }

    if (!doc.is_published) {
      return apiResponse({ message: "Dokumen belum dipublikasikan." }, 403);
    }

    if (!doc.file_url) {
      return apiResponse({ message: "File dokumen tidak tersedia." }, 404);
    }

    await db
      .update(report_documents)
      .set({ view_count: sql`${report_documents.view_count} + 1`, updated_at: new Date() })
      .where(eq(report_documents.id, id));

    return NextResponse.redirect(doc.file_url, 302);
  } catch (error) {
    logError("laporan_admin_view_redirect_error", { error: error?.message });
    return apiResponse(
      { message: error?.message || "Terjadi kesalahan saat mencatat view dokumen." },
      500,
    );
  }
}
