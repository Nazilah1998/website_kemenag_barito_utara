import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageBanner from "../../../components/PageBanner";
import BeritaViewCounter from "@/components/BeritaViewCounter";
import BeritaDetailActions from "@/components/berita/BeritaDetailActions";
import {
  getAdjacentBerita,
  getBeritaBySlug,
  getRelatedBerita,
} from "../../../lib/berita";
import JsonLd from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  newsArticleSchema,
} from "@/lib/structured-data";
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

function MetaPill({ children }) {
  return (
    <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
      {children}
    </div>
  );
}

function RelatedCard({ item }) {
  const imageSrc = item.coverImage || FALLBACK_IMAGE;

  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link
        href={`/berita/${item.slug}`}
        className="relative block aspect-16/10 bg-slate-100"
      >
        <Image
          src={imageSrc}
          alt={item.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
      </Link>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
          <span>{item.date}</span>
          <span>•</span>
          <span>{item.category}</span>
        </div>

        <h3 className="mt-3 text-lg font-bold leading-snug text-slate-900">
          <Link
            href={`/berita/${item.slug}`}
            className="transition hover:text-emerald-700"
          >
            {item.title}
          </Link>
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {truncateText(
            item.excerpt || "Klik untuk membaca berita selengkapnya.",
            120,
          )}
        </p>

        <Link
          href={`/berita/${item.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          Baca artikel
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

function AdjacentArticleLink({ label, item, align = "left" }) {
  if (!item) return null;

  return (
    <Link
      href={`/berita/${item.slug}`}
      className="block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50"
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700 ${align === "right" ? "text-right" : ""}`}
      >
        {label}
      </p>
      <h3
        className={`mt-3 text-base font-bold leading-7 text-slate-900 ${align === "right" ? "text-right" : ""}`}
      >
        {item.title}
      </h3>
      <p
        className={`mt-2 text-sm text-slate-500 ${align === "right" ? "text-right" : ""}`}
      >
        {item.date}
      </p>
    </Link>
  );
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
  const publishedTime = berita.publishedAt || berita.isoDate || berita.createdAt;
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

function stripTags(value = "") {
  return String(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function toIso(value) {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
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
      <PageBanner
        title={berita.title}
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Berita", href: "/berita" },
          { label: berita.title },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          <span aria-hidden="true">←</span>
          Kembali ke halaman berita
        </Link>

        <article className="mt-6 space-y-8">
          <div className="overflow-hidden rounded-4xl border border-slate-200 bg-slate-900 shadow-xl">
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
                <div className="inline-flex rounded-full border border-white/15 bg-emerald-600/90 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                  {berita.category}
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                <div className="flex flex-wrap gap-3">
                  <MetaPill>Dipublikasikan {berita.date}</MetaPill>
                  <MetaPill>
                    <BeritaViewCounter
                      slug={berita.slug}
                      initialViews={berita.views}
                    />
                  </MetaPill>
                </div>
              </div>
            </a>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0">
              <article
                className="prose prose-slate max-w-none rounded-4xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 lg:p-10"
                dangerouslySetInnerHTML={{ __html: berita.content || "" }}
              />
            </div>

            <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">
                  Info artikel
                </p>

                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex items-start justify-between gap-4">
                    <span>Kategori</span>
                    <span className="font-semibold text-slate-900">
                      {berita.category}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span>Tanggal tayang</span>
                    <span className="text-right font-semibold text-slate-900">
                      {berita.date}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span>Jumlah pembaca</span>
                    <span className="text-right font-semibold text-slate-900">
                      {berita.views ?? 0} kali
                    </span>
                  </div>
                </div>
              </div>

              <BeritaDetailActions
                title={berita.title}
                path={`/berita/${berita.slug}`}
              />

              {adjacent?.newer || adjacent?.older ? (
                <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">
                    Lanjutkan membaca
                  </p>

                  <div className="space-y-3">
                    <AdjacentArticleLink
                      label="Artikel lebih baru"
                      item={adjacent?.newer}
                    />
                    <AdjacentArticleLink
                      label="Artikel berikutnya"
                      item={adjacent?.older}
                      align="right"
                    />
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </article>

        {relatedItems.length > 0 ? (
          <section className="mt-14">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                  Berita Terkait
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  Artikel lain yang masih relevan
                </h2>
              </div>

              <Link
                href="/berita"
                className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
              >
                Lihat semua berita
              </Link>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedItems.map((item) => (
                <RelatedCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </>
  );
}
