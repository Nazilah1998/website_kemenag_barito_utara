import { apiResponse, getSafeIdFromContext } from "@/lib/api-helpers";
import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { report_documents } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
  try {
    const resolvedParams = await context.params;
    const pathParts = resolvedParams?.path || [];
    const id = pathParts[0];

    if (!id) {
      return apiResponse({ message: "ID dokumen tidak valid." }, 400);
    }

    const [doc] = await db
      .select({ id: report_documents.id, file_url: report_documents.file_url, file_name: report_documents.file_name, is_published: report_documents.is_published, view_count: report_documents.view_count })
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

    // Proxy the file to hide long Supabase URL
    let targetUrl = doc.file_url;
    if (targetUrl.startsWith("/")) {
      const baseUrl = new URL(request.url).origin;
      targetUrl = `${baseUrl}${targetUrl}`;
    }

    const fileResponse = await fetch(targetUrl);
    if (!fileResponse.ok) {
      throw new Error("Gagal mengambil dokumen dari server penyimpanan.");
    }

    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    const safeFilename = doc.file_name || `dokumen-${id}.pdf`;
    headers.set("Content-Disposition", `inline; filename="${safeFilename}"`); // inline for viewing with proper filename
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Cache-Control", "public, max-age=3600");

    return new Response(fileResponse.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    logError("laporan_admin_view_redirect_error", { error: error?.message });
    return apiResponse(
      { message: error?.message || "Terjadi kesalahan saat mencatat view dokumen." },
      500,
    );
  }
}
