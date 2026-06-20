import { db } from "@/lib/drizzle";
import { berita, report_documents, static_pages, agenda, dokumen, seksi } from "@/db/schema";
import { eq, and, or, ilike, desc } from "drizzle-orm";
import { apiResponse } from "@/lib/api-helpers";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { logError } from "@/lib/logger";

export const dynamic = 'force-dynamic';

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

    const searchTerm = `%${q}%`;

    const [beritaResults, reportResults, pagesResults, agendaResults, dokumenResults, seksiResults] = await Promise.all([
      db.select({
        id: berita.id,
        title: berita.title,
        slug: berita.slug,
        excerpt: berita.excerpt,
        updated_at: berita.updated_at,
      })
      .from(berita)
      .where(
        and(
          eq(berita.is_published, true),
          or(
            ilike(berita.title, searchTerm),
            ilike(berita.excerpt, searchTerm),
          )
        )
      )
      .orderBy(desc(berita.published_at))
      .limit(limit),

      db.select({
        id: report_documents.id,
        title: report_documents.title,
        file_url: report_documents.file_url,
        description: report_documents.description,
        updated_at: report_documents.updated_at,
      })
      .from(report_documents)
      .where(
        and(
          eq(report_documents.is_published, true),
          or(
            ilike(report_documents.title, searchTerm),
            ilike(report_documents.description, searchTerm),
          )
        )
      )
      .orderBy(desc(report_documents.updated_at))
      .limit(limit),

      db.select({
        id: static_pages.id,
        title: static_pages.title,
        slug: static_pages.slug,
        description: static_pages.description,
        updated_at: static_pages.updated_at,
      })
      .from(static_pages)
      .where(
        and(
          eq(static_pages.is_published, true),
          or(
            ilike(static_pages.title, searchTerm),
            ilike(static_pages.description, searchTerm),
          )
        )
      )
      .orderBy(desc(static_pages.updated_at))
      .limit(limit),

      db.select({
        id: agenda.id,
        title: agenda.title,
        slug: agenda.slug,
        description: agenda.description,
        location: agenda.location,
        start_at: agenda.start_at,
        updated_at: agenda.updated_at,
      })
      .from(agenda)
      .where(
        and(
          eq(agenda.is_published, true),
          or(
            ilike(agenda.title, searchTerm),
            ilike(agenda.description, searchTerm),
            ilike(agenda.location, searchTerm),
          )
        )
      )
      .orderBy(desc(agenda.updated_at))
      .limit(limit),

      db.select({
        id: dokumen.id,
        title: dokumen.title,
        slug: dokumen.slug,
        description: dokumen.description,
        category: dokumen.category,
        updated_at: dokumen.updated_at,
      })
      .from(dokumen)
      .where(
        and(
          eq(dokumen.is_published, true),
          or(
            ilike(dokumen.title, searchTerm),
            ilike(dokumen.description, searchTerm),
            ilike(dokumen.category, searchTerm),
          )
        )
      )
      .orderBy(desc(dokumen.updated_at))
      .limit(limit),

      db.select({
        id: seksi.id,
        title: seksi.judul,
        slug: seksi.slug,
        description: seksi.deskripsi,
        nama_kepala: seksi.nama_kepala,
        updated_at: seksi.updated_at,
      })
      .from(seksi)
      .where(
        or(
          ilike(seksi.judul, searchTerm),
          ilike(seksi.deskripsi, searchTerm),
          ilike(seksi.nama_kepala, searchTerm),
        )
      )
      .orderBy(desc(seksi.updated_at))
      .limit(limit),
    ]);

    const items = [
      ...beritaResults.map((b) => ({
        id: `berita-${b.id}`,
        section: "Berita",
        title: b.title,
        description: b.excerpt?.replace(/<[^>]+>/g, "").slice(0, 200),
        href: `/berita/${b.slug}`,
        updated_at: b.updated_at,
      })),
      ...reportResults.map((r) => ({
        id: `report-${r.id}`,
        section: "Laporan",
        title: r.title,
        description: r.description?.slice(0, 200),
        href: `/laporan`,
        updated_at: r.updated_at,
      })),
      ...pagesResults.map((p) => ({
        id: `page-${p.id}`,
        section: "Halaman",
        title: p.title,
        description: p.description?.slice(0, 200),
        href: `/informasi/${p.slug}`,
        updated_at: p.updated_at,
      })),
      ...agendaResults.map((a) => ({
        id: `agenda-${a.id}`,
        section: "Agenda",
        title: a.title,
        description: a.description?.slice(0, 200),
        href: `#`,
        updated_at: a.updated_at,
      })),
      ...dokumenResults.map((d) => ({
        id: `dokumen-${d.id}`,
        section: "Dokumen",
        title: d.title,
        description: d.description?.slice(0, 200),
        href: `/informasi`,
        updated_at: d.updated_at,
      })),
      ...seksiResults.map((s) => ({
        id: `seksi-${s.id}`,
        section: "Layanan",
        title: s.title,
        description: s.description?.slice(0, 200),
        href: `/layanan/${s.slug}`,
        updated_at: s.updated_at,
      })),
    ].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    return apiResponse({ items, q });
  } catch (error) {
    logError("search_api_error", { error: error?.message });
    return apiResponse({ items: [], error: "Gagal memuat hasil pencarian" }, 200);
  }
}
