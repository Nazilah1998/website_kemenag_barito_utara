import { apiResponse } from "@/lib/prisma-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import prisma from "@/lib/prisma";

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

    const categories = await prisma.report_categories.findMany({
      where: {
        ...(slug && { slug })
      },
      include: {
        report_documents: {
          orderBy: { created_at: 'desc' }
        }
      },
      orderBy: { sort_order: 'asc' }
    });

    const normalizedCategories = categories.map((category) => {
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
    console.error("admin_laporan_list_unhandled_error", error);

    return apiResponse(
      { message: error?.message || "Terjadi kesalahan saat memuat laporan." },
      500,
    );
  }
}
