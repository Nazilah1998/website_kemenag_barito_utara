import prisma from "@/lib/prisma";
import { apiResponse } from "@/lib/prisma-helpers";
import { validateAdmin } from "@/lib/cms-utils";

export async function GET() {
  try {
    const validation = await validateAdmin();
    if (!validation.ok) return validation.response;

    const [
      totalNews,
      totalGaleri,
      totalLaporan,
      totalPesan,
      newsViews,
      reportViews
    ] = await Promise.all([
      prisma.berita.count(),
      prisma.galeri.count(),
      prisma.report_documents.count(),
      prisma.kontak_pesan.count({ where: { status: "baru" } }),
      prisma.berita.aggregate({
        _sum: { views: true }
      }),
      prisma.report_documents.aggregate({
        _sum: { view_count: true }
      })
    ]);

    const stats = {
      counts: {
        berita: totalNews,
        galeri: totalGaleri,
        laporan: totalLaporan,
        pesanBaru: totalPesan
      },
      views: {
        berita: Number(newsViews._sum.views || 0),
        laporan: Number(reportViews._sum.view_count || 0),
        total: Number(newsViews._sum.views || 0) + Number(reportViews._sum.view_count || 0)
      }
    };

    return apiResponse(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return apiResponse({ error: "Internal Server Error" }, 500);
  }
}
