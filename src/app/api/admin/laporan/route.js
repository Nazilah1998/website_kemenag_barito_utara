import { NextResponse } from "next/server";
import { requireAdminAccess } from "@/lib/admin-guard";
import { logError, logInfo, logWarn } from "@/lib/logger";

export const dynamic = "force-dynamic";

function sanitizeSlug(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
}

function normalizeDocuments(documents = []) {
  return documents.slice().sort((a, b) => {
    const yearA = Number(a?.year || 0);
    const yearB = Number(b?.year || 0);

    if (yearA !== yearB) return yearB - yearA;

    const dateA = new Date(a?.created_at || 0).getTime();
    const dateB = new Date(b?.created_at || 0).getTime();

    return dateB - dateA;
  });
}

export async function GET(request) {
  const guard = await requireAdminAccess();

  if (!guard.ok) {
    logWarn("admin_laporan_list_denied", {
      status: guard.status,
      reason: guard.message,
    });

    return NextResponse.json(
      { message: guard.message },
      { status: guard.status },
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const rawSlug = searchParams.get("slug") || "";
    const slug = sanitizeSlug(rawSlug);

    let categoriesQuery = guard.supabase
      .from("report_categories")
      .select(
        `
        id,
        slug,
        title,
        description,
        intro,
        sort_order,
        is_active,
        created_at,
        updated_at
      `,
      )
      .order("sort_order", { ascending: true });

    if (slug) {
      categoriesQuery = categoriesQuery.eq("slug", slug);
    }

    const { data: categories, error: categoriesError } = await categoriesQuery;

    if (categoriesError) {
      logError("admin_laporan_categories_query_error", {
        adminUserId: guard.user?.id || null,
        slug: slug || null,
        message: categoriesError.message,
      });

      return NextResponse.json(
        { message: "Gagal memuat kategori laporan admin." },
        { status: 500 },
      );
    }

    const categoryIds = (categories || []).map((item) => item.id);

    let documents = [];

    if (categoryIds.length > 0) {
      const { data: docsData, error: docsError } = await guard.supabase
        .from("report_documents")
        .select(
          `
          id,
          category_id,
          title,
          description,
          year,
          file_name,
          file_path,
          file_url,
          mime_type,
          file_size,
          sort_order,
          is_published,
          created_by,
          created_at,
          updated_at,
          view_count
        `,
        )
        .in("category_id", categoryIds)
        .order("created_at", { ascending: false });

      if (docsError) {
        logError("admin_laporan_documents_query_error", {
          adminUserId: guard.user?.id || null,
          message: docsError.message,
        });

        return NextResponse.json(
          { message: "Gagal memuat dokumen laporan admin." },
          { status: 500 },
        );
      }

      documents = docsData || [];
    }

    const docsByCategoryId = documents.reduce((acc, doc) => {
      const key = doc.category_id;

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(doc);
      return acc;
    }, {});

    const normalizedCategories = (categories || []).map((category) => ({
      ...category,
      documents: normalizeDocuments(docsByCategoryId[category.id] || []),
    }));

    logInfo("admin_laporan_list_success", {
      adminUserId: guard.user?.id || null,
      slug: slug || null,
      categoryCount: normalizedCategories.length,
    });

    return NextResponse.json({
      message: "Data laporan admin berhasil dimuat.",
      categories: normalizedCategories,
    });
  } catch (error) {
    logError("admin_laporan_list_unhandled_error", {
      adminUserId: guard.user?.id || null,
      message: error?.message || "Unknown error",
    });

    return NextResponse.json(
      {
        message:
          error?.message || "Terjadi kesalahan saat memuat laporan admin.",
      },
      { status: 500 },
    );
  }
}
