import GaleriPageClient from "@/components/features/galeri/GaleriPageClient";
import { db } from "@/lib/drizzle";
import { galeri } from "@/db/schema";
import { eq, desc, ne, and } from "drizzle-orm";
import { normalizeCoverImageUrl, toCoverPreviewUrl } from "@/lib/cover-image";
import { logError } from "@/lib/logger";

export const revalidate = 300;

export const metadata = {
  title: "Galeri",
  description:
    "Galeri dokumentasi kegiatan dan publikasi Kementerian Agama Barito Utara.",
};

function mapGaleriItems(rows = []) {
  return rows.filter(Boolean).map((item) => {
    const normalizedImage = normalizeCoverImageUrl(item?.image_url || "");
    const previewImage = toCoverPreviewUrl(normalizedImage);

    return {
      id: item?.id ?? null,
      title: item?.title || "Dokumentasi kegiatan",
      imageUrl: previewImage || "/assets/branding/kemenag.svg",
      linkUrl: item?.link_url && item.link_url !== "#" ? item.link_url : "",
      publishedAt: item?.published_at || item?.created_at || null,
    };
  });
}

async function getPublishedGaleri() {
  try {
    // 1. Try to get published items first
    let data = await db
      .select()
      .from(galeri)
      .where(and(eq(galeri.is_published, true), eq(galeri.source_type, "manual")))
      .orderBy(desc(galeri.published_at), desc(galeri.created_at));

    if (data && data.length > 0) {
      return mapGaleriItems(data);
    }

    // 2. Fallback: Get all items that are not explicitly unpublished
    data = await db
      .select()
      .from(galeri)
      .where(and(ne(galeri.is_published, false), eq(galeri.source_type, "manual")))
      .orderBy(desc(galeri.published_at), desc(galeri.created_at));

    return mapGaleriItems(data);
  } catch (error) {
    logError("galeri_public_error", { error: error?.message });
    return [];
  }
}

export default async function GaleriPage() {
  const items = await getPublishedGaleri();

  return (
    <main className="bg-slate-50 transition-colors dark:bg-slate-950">
      <GaleriPageClient items={items} />
    </main>
  );
}
