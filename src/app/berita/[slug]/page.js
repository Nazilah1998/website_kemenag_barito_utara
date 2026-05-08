import Image from "next/image";
import { notFound } from "next/navigation";
import PageBanner from "@/components/common/PageBanner";
import BeritaViewCounter from "@/components/features/berita/components/BeritaViewCounter";
import {
  BeritaDetailBackLink,
  BeritaDetailMetaPills,
  BeritaDetailSidebar,
  BeritaDetailCategoryBadge,
} from "@/components/features/berita/components/BeritaDetailLocalized";
import { BeritaDetailNavigation } from "@/components/features/berita/components/BeritaDetailNavigation";
import BeritaDetailHeader from "@/components/features/berita/components/BeritaDetailHeader";
import {
  getAdjacentBerita,
  getBeritaBySlug,
  getRelatedBerita,
} from "../../../lib/berita";
import JsonLd from "@/components/features/seo/JsonLd";
import { breadcrumbSchema, newsArticleSchema } from "@/lib/structured-data";
import { siteInfo } from "@/data/site";

const FALLBACK_IMAGE = "/images/placeholder-news.jpg";

function truncateText(value = "", maxLength = 180) {
  if (!value) return "";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3).trim()}...`;
}

function toGoogleDriveDownloadUrl(url = "") {
  if (!url) return FALLBACK_IMAGE;
  const value = String(url);
  const fileIdMatch =
    value.match(/\/d\/([^/]+)/) ||
    value.match(/[?&]id=([^&]+)/) ||
    value.match(/\/uc\?.*id=([^&]+)/);

  if (fileIdMatch?.[1]) {
    return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
  }
  return value;
}

function stripTags(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toIso(value) {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const berita = await getBeritaBySlug(slug).catch(() => null);

  if (!berita) {
    return {
      title: "Berita tidak ditemukan",
      description: "Artikel yang Anda cari tidak tersedia.",
      robots: { index: false, follow: true },
    };
  }

  const description = truncateText(
    berita.excerpt || stripTags(berita.content) || siteInfo.description,
    180,
  );
  const url = `/berita/${berita.slug}`;
  const image = berita.coverImage || `${siteInfo.siteUrl}${siteInfo.logoSrc}`;
  const publishedTime =
    berita.publishedAt || berita.isoDate || berita.createdAt;
  const modifiedTime = berita.updatedAt || publishedTime;

  return {
    title: berita.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "id_ID",
      url,
      siteName: siteInfo.shortName,
      title: berita.title,
      description,
      images: [{ url: image, alt: berita.title }],
      publishedTime: toIso(publishedTime),
      modifiedTime: toIso(modifiedTime),
      section: berita.category,
    },
    twitter: {
      card: "summary_large_image",
      title: berita.title,
      description,
      images: [image],
    },
  };
}

export default async function DetailBeritaPage({ params }) {
  const { slug } = await params;
  const berita = await getBeritaBySlug(slug);

  if (!berita) {
    notFound();
  }

  const jsonLd = [
    newsArticleSchema(berita),
    breadcrumbSchema([
      { name: "Beranda", url: "/" },
      { name: "Berita", url: "/berita" },
      { name: berita.title, url: `/berita/${berita.slug}` },
    ]),
  ];

  const [relatedItems, adjacent] = await Promise.all([
    getRelatedBerita(berita.slug, berita.category, 3),
    getAdjacentBerita(berita.slug),
  ]);

  const coverImage = berita.coverImage || FALLBACK_IMAGE;
  const coverImageDownloadUrl = toGoogleDriveDownloadUrl(coverImage);

  return (
    <>
      <JsonLd data={jsonLd} />
      <BeritaDetailHeader title={berita.title} />

      <main className="bg-slate-50 transition-colors dark:bg-slate-950">
        <section className="w-full px-6 py-8 sm:px-10 lg:px-16 xl:px-20">
          <BeritaDetailBackLink />

          <article className="mt-6 space-y-8">
            <div className="overflow-hidden rounded-4xl border border-slate-200 bg-slate-900 shadow-xl dark:border-slate-800">
              <a
                href={coverImageDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block min-h-80 cursor-pointer overflow-hidden md:min-h-115"
                title="Buka atau unduh cover image"
              >
                <Image
                  src={coverImage}
                  alt={berita.title}
                  fill
                  priority
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  sizes="100vw"
                />

                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/55 to-slate-950/10" />

                <div className="absolute left-6 top-6 md:left-10 md:top-10">
                  <BeritaDetailCategoryBadge category={berita.category} />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                  <BeritaDetailMetaPills isoDate={berita.isoDate}>
                    <BeritaViewCounter
                      slug={berita.slug}
                      initialViews={berita.views}
                    />
                  </BeritaDetailMetaPills>
                </div>
              </a>
            </div>

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
              <div className="min-w-0">
                <article
                  className="prose prose-slate max-w-none rounded-4xl border border-slate-200 bg-white p-6 text-slate-800 shadow-sm md:p-8 lg:p-10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:prose-invert dark:prose-headings:text-white dark:prose-p:text-white dark:prose-strong:text-white dark:prose-a:text-emerald-300 dark:prose-a:no-underline hover:dark:prose-a:text-emerald-200 dark:prose-li:text-white dark:prose-blockquote:text-white dark:prose-figcaption:text-slate-200 dark:prose-hr:border-slate-700 dark:prose-code:text-emerald-300 dark:prose-pre:bg-slate-950 **:text-inherit! [&_p]:text-inherit! [&_li]:text-inherit! [&_blockquote]:text-inherit! [&_span]:text-inherit!"
                  style={{ color: "inherit" }}
                  dangerouslySetInnerHTML={{ __html: berita.content || "" }}
                />
              </div>

              <BeritaDetailSidebar
                category={berita.category}
                isoDate={berita.isoDate}
                views={berita.views}
                title={berita.title}
                slug={berita.slug}
              />
            </div>
          </article>

          <BeritaDetailNavigation
            adjacent={adjacent}
            relatedItems={relatedItems}
          />
        </section>
      </main>
    </>
  );
}
