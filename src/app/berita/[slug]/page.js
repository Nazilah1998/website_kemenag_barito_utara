import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageBanner from "../../../components/PageBanner";
import BeritaViewCounter from "@/components/BeritaViewCounter";
import BeritaDetailActions from "@/components/berita/BeritaDetailActions";
import {
  estimateReadingTime,
  getAdjacentBerita,
  getBeritaBySlug,
  getRelatedBerita,
} from "../../../lib/berita";

const FALLBACK_IMAGE = "/images/placeholder-news.jpg";

function stripHtml(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateText(value = "", maxLength = 180) {
  if (!value) return "";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3).trim()}...`;
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

export default async function DetailBeritaPage({ params }) {
  const { slug } = await params;
  const berita = await getBeritaBySlug(slug);

  if (!berita) {
    notFound();
  }

  const [relatedItems, adjacent] = await Promise.all([
    getRelatedBerita(berita.slug, berita.category, 3),
    getAdjacentBerita(berita.slug),
  ]);

  const summary = truncateText(
    berita.excerpt ||
      stripHtml(berita.content) ||
      "Informasi lengkap berita Kemenag Barito Utara.",
    180,
  );

  const readingTime = estimateReadingTime(
    berita.content || berita.excerpt || "",
  );
  const coverImage = berita.coverImage || FALLBACK_IMAGE;

  return (
    <>
      <PageBanner
        title={berita.title}
        description={summary}
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
            <div className="relative min-h-80 overflow-hidden md:min-h-115">
              <Image
                src={coverImage}
                alt={berita.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />

              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/55 to-slate-950/10" />

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                <div className="inline-flex rounded-full border border-white/15 bg-emerald-600/90 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                  {berita.category}
                </div>

                <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight text-white md:text-5xl">
                  {berita.title}
                </h1>

                {summary ? (
                  <p className="mt-4 max-w-3xl text-base leading-7 text-white/85 md:text-lg">
                    {summary}
                  </p>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-3">
                  <MetaPill>Dipublikasikan {berita.date}</MetaPill>
                  <MetaPill>
                    <BeritaViewCounter
                      slug={berita.slug}
                      initialViews={berita.views}
                    />
                  </MetaPill>
                  <MetaPill>{readingTime} menit baca</MetaPill>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0">
              {berita.excerpt ? (
                <div className="rounded-[28px] border border-emerald-100 bg-emerald-50 p-5 md:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                    Ringkasan
                  </p>
                  <p className="mt-3 text-base leading-8 text-slate-700 md:text-lg">
                    {berita.excerpt}
                  </p>
                </div>
              ) : null}

              <article
                className="prose prose-slate mt-8 max-w-none rounded-4xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 lg:p-10"
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
                    <span>Estimasi baca</span>
                    <span className="font-semibold text-slate-900">
                      {readingTime} menit
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
