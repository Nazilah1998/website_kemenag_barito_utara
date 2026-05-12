import PageBanner from "@/components/common/PageBanner";
import GaleriPageClient from "@/components/features/galeri/GaleriPageClient";
import prisma from "@/lib/prisma";
import { normalizeCoverImageUrl, toCoverPreviewUrl } from "@/lib/cover-image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Galeri | Kemenag Barito Utara",
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
      imageUrl: previewImage || "/kemenag.svg",
      linkUrl: item?.link_url && item.link_url !== "#" ? item.link_url : "",
      publishedAt: item?.published_at || item?.created_at || null,
    };
  });
}

async function getPublishedGaleri() {
  try {
    // 1. Try to get published items first
    let data = await prisma.galeri.findMany({
      where: { is_published: true },
      orderBy: [
        { published_at: 'desc' },
        { created_at: 'desc' }
      ]
    });

    if (data && data.length > 0) {
      return mapGaleriItems(data);
    }

    // 2. Fallback: Get all items that are not explicitly unpublished
    data = await prisma.galeri.findMany({
      where: {
        NOT: { is_published: false }
      },
      orderBy: [
        { published_at: 'desc' },
        { created_at: 'desc' }
      ]
    });

    return mapGaleriItems(data);
  } catch (error) {
    console.error("getPublishedGaleri error:", error);
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
