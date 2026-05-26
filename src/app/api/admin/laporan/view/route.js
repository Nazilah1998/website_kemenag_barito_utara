import { apiResponse } from "@/lib/api-helpers";
import { db } from "@/lib/drizzle";
import { report_documents } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const id = String(body?.id || "").trim();

    if (!id) {
      return apiResponse({ message: "ID dokumen tidak valid." }, 400);
    }

    const [document] = await db
      .update(report_documents)
      .set({ view_count: sql`${report_documents.view_count} + 1` })
      .where(eq(report_documents.id, id))
      .returning({ view_count: report_documents.view_count });

    return apiResponse({ views: document.view_count });
  } catch (error) {
    console.error("POST Laporan View Error:", error);
    return apiResponse(
      { message: error?.message || "Gagal mencatat pembaca." },
      500,
    );
  }
}
