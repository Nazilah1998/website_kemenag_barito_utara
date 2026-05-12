import prisma from "@/lib/prisma";
import { apiResponse } from "@/lib/prisma-helpers";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const ip = getClientIp(request);
    const limitCheck = await rateLimit({
      key: `search:${ip}`,
      limit: 30,
      windowMs: 60_000,
    });

    if (!limitCheck.ok) {
      return apiResponse({ items: [], message: "Terlalu banyak permintaan." }, 429);
    }

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 30);

    if (!q || q.length < 2) {
      return apiResponse({ items: [], q });
    }

    // Pencarian paralel menggunakan Prisma
    const [beritaResults, reportResults] = await Promise.all([
      prisma.berita.findMany({
        where: {
          is_published: true,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { excerpt: { contains: q, mode: 'insensitive' } },
            { content: { contains: q, mode: 'insensitive' } }
          ]
        },
        take: limit,
        orderBy: { published_at: 'desc' },
        select: { id: true, title: true, slug: true, excerpt: true, updated_at: true }
      }),
      prisma.report_documents.findMany({
        where: {
          is_published: true,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
          ]
        },
        take: limit,
        orderBy: { updated_at: 'desc' },
        select: { id: true, title: true, file_url: true, description: true, updated_at: true }
      })
    ]);

    // Transformasi hasil
    const items = [
      ...beritaResults.map(b => ({
        id: `berita-${b.id}`,
        section: "Berita",
        title: b.title,
        description: b.excerpt?.replace(/<[^>]+>/g, "").slice(0, 200),
        href: `/berita/${b.slug}`,
        updated_at: b.updated_at
      })),
      ...reportResults.map(r => ({
        id: `report-${r.id}`,
        section: "Laporan",
        title: r.title,
        description: r.description?.slice(0, 200),
        href: `/laporan`, // Bisa diimprovisasi ke direct link jika perlu
        updated_at: r.updated_at
      }))
    ].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    return apiResponse({ items, q });
  } catch (error) {
    console.error("Search API Error:", error);
    return apiResponse({ items: [], error: "Gagal memuat hasil pencarian" }, 200);
  }
}
