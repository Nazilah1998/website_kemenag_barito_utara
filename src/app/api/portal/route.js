import { apiResponse } from "@/lib/api-helpers";
import { db } from "@/lib/drizzle";
import { berita, galeri, report_categories } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const revalidate = 300;

export async function GET() {
  try {
    const [
      [{ count: beritaCount }],
      [{ count: galeriCount }],
      [{ count: laporanCount }],
      latestBerita,
    ] = await Promise.all([
      db.select({ count: sql`count(*)` }).from(berita).where(eq(berita.is_published, true)),
      db.select({ count: sql`count(*)` }).from(galeri).where(eq(galeri.is_published, true)),
      db.select({ count: sql`count(*)` }).from(report_categories).where(eq(report_categories.is_active, true)),
      db
        .select({ title: berita.title, slug: berita.slug })
        .from(berita)
        .where(eq(berita.is_published, true))
        .orderBy(desc(berita.published_at))
        .limit(8),
    ]);

    return apiResponse({
      beritaCount: Number(beritaCount),
      galeriCount: Number(galeriCount),
      laporanCount: Number(laporanCount),
      latestBerita,
    });
  } catch (error) {
    return apiResponse(
      { message: "Gagal memuat data portal" },
      500
    );
  }
}
