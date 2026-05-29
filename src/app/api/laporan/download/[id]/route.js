import { NextResponse } from "next/server";
import { apiResponse } from "@/lib/api-helpers";
import { db } from "@/lib/drizzle";
import { report_documents } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const ip = getClientIp(request);
  const limitCheck = await rateLimit({
    key: `laporan-download:${ip}`,
    limit: 20,
    windowMs: 60_000,
  });

  if (!limitCheck.ok) {
    return apiResponse({ message: "Terlalu banyak permintaan." }, 429);
  }
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return apiResponse({ message: "ID dokumen tidak valid." }, 400);
    }

    const [doc] = await db
      .select({ id: report_documents.id, file_url: report_documents.file_url, file_name: report_documents.file_name, is_published: report_documents.is_published })
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
      return apiResponse({ message: "URL file dokumen tidak tersedia." }, 404);
    }

    // Increment download count atomically
    await db
      .update(report_documents)
      .set({ download_count: sql`${report_documents.download_count} + 1` })
      .where(eq(report_documents.id, id));

    // Construct absolute URL if the path is relative
    let targetUrl = doc.file_url;
    if (targetUrl.startsWith("/")) {
      const baseUrl = new URL(request.url).origin;
      targetUrl = `${baseUrl}${targetUrl}`;
    }
    
    // Instead of forcing download through streams (since file could be in R2/S3),
    // redirecting is the easiest way. If the user wants a forced download,
    // they can add ?download=true to the target URL, or the client can handle it.
    // Given the previous setup, redirect is safe.

    const response = NextResponse.redirect(targetUrl);
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "*");
    return response;
  } catch (error) {
    logError("laporan_download_redirect_error", { error: error?.message });
    return apiResponse(
      {
        message: error?.message || "Terjadi kesalahan saat mengunduh dokumen.",
      },
      500,
    );
  }
}
