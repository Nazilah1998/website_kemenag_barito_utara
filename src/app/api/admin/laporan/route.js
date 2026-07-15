import { apiResponse } from "@/lib/api-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import { db } from "@/lib/drizzle";
import { report_categories, report_documents } from "@/db/schema";
import { eq, desc, asc, and, sql } from "drizzle-orm";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

function sanitizeSlug(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
}

export async function GET(request) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = sanitizeSlug(searchParams.get("slug") || "");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const year = searchParams.get("year") || "";

    if (!slug) {
      // If no slug, just fetch categories (no documents attached) for the sidebar/tabs
      const categories = await db
        .select()
        .from(report_categories)
        .orderBy(asc(report_categories.sort_order));

      return apiResponse({
        message: "Kategori laporan berhasil dimuat.",
        categories: categories.map(c => ({ ...c, documents: [] })),
      });
    }

    // If slug is provided, fetch documents for that specific category
    const [category] = await db
      .select()
      .from(report_categories)
      .where(eq(report_categories.slug, slug))
      .limit(1);

    if (!category) {
      return apiResponse({ message: "Kategori laporan tidak ditemukan." }, 404);
    }

    const conditions = [eq(report_documents.category_id, category.id)];
    if (year) {
      conditions.push(eq(report_documents.year, year));
    }

    const skip = (page - 1) * limit;

    const [documents, [{ count: totalStr }], allYearsData] = await Promise.all([
      db
        .select()
        .from(report_documents)
        .where(and(...conditions))
        .orderBy(desc(report_documents.year), desc(report_documents.created_at))
        .limit(limit)
        .offset(skip),
      db
        .select({ count: sql`count(*)` })
        .from(report_documents)
        .where(and(...conditions)),
      db
        .select({ year: report_documents.year })
        .from(report_documents)
        .where(eq(report_documents.category_id, category.id))
    ]);

    const total = Number(totalStr || 0);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const availableYears = Array.from(new Set(allYearsData.map(d => String(d.year || "").trim()).filter(Boolean))).sort((a, b) => Number(b) - Number(a));

    return apiResponse({
      message: "Dokumen laporan berhasil dimuat.",
      categories: [{
        ...category,
        documents: documents
      }],
      availableYears,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    logError("admin_laporan_list_error", { error: error?.message });

    return apiResponse(
      { message: error?.message || "Terjadi kesalahan saat memuat laporan." },
      500,
    );
  }
}
