import PageBanner from "@/components/PageBanner";
import GaleriPageClient from "@/components/GaleriPageClient";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeCoverImageUrl, toCoverPreviewUrl } from "@/lib/cover-image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Galeri | Kemenag Barito Utara",
  description:
    "Galeri dokumentasi kegiatan dan publikasi Kementerian Agama Barito Utara.",
};

function toTimestamp(value) {
  if (!value) return 0;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function sortGaleriRows(rows = []) {
  return [...rows].sort((a, b) => {
    const aTime = toTimestamp(a?.published_at || a?.created_at);
    const bTime = toTimestamp(b?.published_at || b?.created_at);
    return bTime - aTime;
  });
}

function mapGaleriItems(rows = []) {
  return rows.filter(Boolean).map((item) => {
    const normalizedImage = normalizeCoverImageUrl(item?.image_url || "");
    const previewImage = toCoverPreviewUrl(normalizedImage);

    return {
      id: item?.id ?? null,
      title: item?.title || "Dokumentasi kegiatan",
      imageUrl: previewImage || "/kemenag.svg",
      linkUrl: item?.link_url && item.link_url !== "#" ? item.link_url : "",
      publishedAt: item?.published_at || item?.created_at || null,
    };
  });
}

async function getPublishedGaleri() {
  try {
    const supabase = createAdminClient();

    const baseQuery = supabase.from("galeri").select(`
      id,
      title,
      image_url,
      link_url,
      is_published,
      published_at,
      created_at
    `);

    const { data: publishedRows, error: publishedError } = await baseQuery
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false });

    if (publishedError) {
      console.error("Gagal memuat galeri publish:", publishedError);
    }

    if (Array.isArray(publishedRows) && publishedRows.length > 0) {
      return mapGaleriItems(publishedRows);
    }

    const { data: fallbackRows, error: fallbackError } = await supabase
      .from("galeri")
      .select(
        `
        id,
        title,
        image_url,
        link_url,
        is_published,
        published_at,
        created_at
      `,
      )
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false });

    if (fallbackError) {
      console.error("Gagal memuat galeri fallback:", fallbackError);
      return [];
    }

    const visibleRows = sortGaleriRows(
      (fallbackRows || []).filter((item) => item?.is_published !== false),
    );

    return mapGaleriItems(visibleRows);
  } catch (error) {
    console.error("GaleriPage error:", error);
    return [];
  }
}

export default async function GaleriPage() {
  const items = await getPublishedGaleri();

  return (
    <>
      <PageBanner
        title="Galeri"
        description="Dokumentasi visual kegiatan, layanan, dan publikasi resmi Kementerian Agama Kabupaten Barito Utara."
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Galeri" }]}
      />

      <div className="bg-slate-50">
        <GaleriPageClient items={items} />
      </div>
    </>
  );
}
