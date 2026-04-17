import { laporanCategories } from "@/data/laporan";
import { createAdminClient } from "@/lib/supabase/admin";

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toText(value, fallback = "") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function isPublishedDocument(doc) {
  if (typeof doc?.is_published === "boolean") return doc.is_published;
  if (typeof doc?.isPublished === "boolean") return doc.isPublished;
  return true;
}

function buildDocumentMeta({ year, href, mimeType, fileSize }) {
  const metaParts = [];

  if (year) metaParts.push(String(year));
  if (mimeType || String(href).toLowerCase().includes(".pdf"))
    metaParts.push("PDF");
  if (fileSize > 0) metaParts.push(`${Math.round(fileSize / 1024)} KB`);

  return metaParts.join(" • ");
}

export function normalizeLaporanDocument(doc = {}) {
  const href = toText(doc?.file_url || doc?.href || "#", "#");
  const year = doc?.year ? toNumber(doc.year, null) : null;
  const fileSize = toNumber(doc?.file_size, 0);
  const viewCount = toNumber(doc?.view_count, 0);
  const mimeType = toText(doc?.mime_type, "application/pdf");
  const title = toText(doc?.title, "Dokumen");
  const description = toText(doc?.description, "");

  return {
    id: doc?.id || `${title}-${href}`,
    title,
    description,
    href,
    meta: buildDocumentMeta({
      year,
      href,
      mimeType,
      fileSize,
    }),
    year,
    file_url: toText(doc?.file_url || href, href),
    file_name: toText(doc?.file_name, ""),
    file_path: toText(doc?.file_path, ""),
    mime_type: mimeType,
    file_size: fileSize,
    view_count: viewCount,
    is_published: isPublishedDocument(doc),
    created_at: doc?.created_at || null,
    updated_at: doc?.updated_at || null,
    sort_order: toNumber(doc?.sort_order, 0),
  };
}

export function sortLaporanDocuments(items = []) {
  return [...items].sort((a, b) => {
    const yearA = toNumber(a?.year, 0);
    const yearB = toNumber(b?.year, 0);
    if (yearA !== yearB) return yearB - yearA;

    const orderA = toNumber(a?.sort_order, 0);
    const orderB = toNumber(b?.sort_order, 0);
    if (orderA !== orderB) return orderA - orderB;

    const viewsA = toNumber(a?.view_count, 0);
    const viewsB = toNumber(b?.view_count, 0);
    if (viewsA !== viewsB) return viewsB - viewsA;

    return String(a?.title || "").localeCompare(String(b?.title || ""), "id");
  });
}

export function normalizeLaporanCategory(category = {}, documents = []) {
  return {
    id: category?.id || category?.slug || "",
    slug: toText(category?.slug, ""),
    title: toText(category?.title, "Tanpa Judul"),
    description: toText(category?.description, ""),
    intro: toText(category?.intro, ""),
    sort_order: toNumber(category?.sort_order, 0),
    is_active:
      typeof category?.is_active === "boolean" ? category.is_active : true,
    documents: sortLaporanDocuments(
      Array.isArray(documents) ? documents.map(normalizeLaporanDocument) : [],
    ),
  };
}

function normalizeFallbackCategory(item) {
  return normalizeLaporanCategory(item, item?.documents || []);
}

export async function getAllLaporanCategories() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("report_categories")
      .select("id, slug, title, description, intro, sort_order, is_active")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    if (error) throw error;

    if (!Array.isArray(data) || data.length === 0) {
      return laporanCategories.map(normalizeFallbackCategory);
    }

    return data.map((item) => normalizeLaporanCategory(item, []));
  } catch {
    return laporanCategories.map(normalizeFallbackCategory);
  }
}

export async function getLaporanDetailBySlug(slug) {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
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
        documents:report_documents (
          id,
          title,
          description,
          year,
          file_name,
          file_path,
          file_url,
          mime_type,
          file_size,
          view_count,
          sort_order,
          is_published,
          created_at,
          updated_at
        )
      `,
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) throw error;
    if (!data) return null;

    const documents = Array.isArray(data?.documents)
      ? data.documents.filter((item) => isPublishedDocument(item))
      : [];

    return normalizeLaporanCategory(data, documents);
  } catch {
    const fallback = laporanCategories.find((item) => item.slug === slug);
    if (!fallback) return null;
    return normalizeFallbackCategory(fallback);
  }
}

export async function getAdminLaporanCategories(slug = "") {
  try {
    const supabase = createAdminClient();

    let query = supabase.from("report_categories").select(
      `
      id,
      slug,
      title,
      description,
      intro,
      sort_order,
      is_active,
      documents:report_documents (
        id,
        title,
        description,
        year,
        file_name,
        file_path,
        file_url,
        mime_type,
        file_size,
        view_count,
        sort_order,
        is_published,
        created_at,
        updated_at
      )
    `,
    );

    if (slug) {
      query = query.eq("slug", slug);
    }

    const { data, error } = await query
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    if (error) throw error;

    return (data || []).map((item) =>
      normalizeLaporanCategory(item, item?.documents || []),
    );
  } catch {
    if (slug) {
      const fallback = laporanCategories.find((item) => item.slug === slug);
      return fallback ? [normalizeFallbackCategory(fallback)] : [];
    }

    return laporanCategories.map(normalizeFallbackCategory);
  }
}
