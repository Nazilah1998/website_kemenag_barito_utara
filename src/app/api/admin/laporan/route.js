import { apiResponse } from "@/lib/api-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import { db } from "@/lib/drizzle";
import { report_categories, report_documents } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

function sanitizeSlug(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
}

function normalizeDocuments(documents = []) {
  return [...documents].sort((a, b) => {
    const yearA = Number(a?.year || 0);
    const yearB = Number(b?.year || 0);

    if (yearA !== yearB) return yearB - yearA;
    return new Date(b?.created_at || 0) - new Date(a?.created_at || 0);
  });
}

export async function GET(request) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = sanitizeSlug(searchParams.get("slug") || "");

    const categories = await db.query.report_categories.findMany({
      where: slug ? eq(report_categories.slug, slug) : undefined,
      with: {
        report_documents: {
          orderBy: [desc(report_documents.created_at)]
        }
      },
      orderBy: [asc(report_categories.sort_order)]
    });

    const normalizedCategories = (categories || []).map((category) => {
      return {
        ...category,
        documents: normalizeDocuments(category.report_documents || [])
      };
    });

    return apiResponse({
      message: "Data laporan admin berhasil dimuat.",
      categories: normalizedCategories,
    });
  } catch (error) {
    logError("admin_laporan_list_error", { error: error?.message });

    return apiResponse(
      { message: error?.message || "Terjadi kesalahan saat memuat laporan." },
      500,
    );
  }
}
