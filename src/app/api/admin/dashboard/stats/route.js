import { apiResponse } from "@/lib/api-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import { db } from "@/lib/drizzle";
import { berita, galeri, report_documents, kontak_pesan } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { logError } from "@/lib/logger";

export async function GET() {
  try {
    const validation = await validateAdmin();
    if (!validation.ok) return validation.response;

    const [
      [{ count: totalNews }],
      [{ count: totalGaleri }],
      [{ count: totalLaporan }],
      [{ count: totalPesan }],
      [{ sum: newsViews }],
      [{ sum: reportViews }]
    ] = await Promise.all([
      db.select({ count: sql`count(*)` }).from(berita),
      db.select({ count: sql`count(*)` }).from(galeri),
      db.select({ count: sql`count(*)` }).from(report_documents),
      db.select({ count: sql`count(*)` }).from(kontak_pesan).where(eq(kontak_pesan.status, "baru")),
      db.select({ sum: sql`COALESCE(sum(${berita.views}), 0)` }).from(berita),
      db.select({ sum: sql`COALESCE(sum(${report_documents.view_count}), 0)` }).from(report_documents)
    ]);

    const stats = {
      counts: {
        berita: Number(totalNews),
        galeri: Number(totalGaleri),
        laporan: Number(totalLaporan),
        pesanBaru: Number(totalPesan)
      },
      views: {
        berita: Number(newsViews || 0),
        laporan: Number(reportViews || 0),
        total: Number(newsViews || 0) + Number(reportViews || 0)
      }
    };

    return apiResponse(stats);
  } catch (error) {
    logError("dashboard_stats_error", { error: error?.message });
    return apiResponse({ error: "Internal Server Error" }, 500);
  }
}
