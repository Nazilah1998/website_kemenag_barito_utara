import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import { getAllLaporanCategories } from "@/lib/laporan";

export const metadata = {
  title: "Laporan dan Akuntabilitas",
  description:
    "Dokumen akuntabilitas Kementerian Agama Kabupaten Barito Utara: Renstra, Perjanjian Kinerja, Laporan Kinerja, dan dokumen pendukung lainnya.",
};

export const revalidate = 300;

const CATEGORY_ICON_BG = {
  "clipboard-check":
    "from-emerald-500/20 to-teal-500/10 text-emerald-300 border-emerald-400/30",
  target: "from-cyan-500/20 to-blue-500/10 text-cyan-300 border-cyan-400/30",
  handshake:
    "from-amber-500/20 to-orange-500/10 text-amber-300 border-amber-400/30",
  "calendar-plan":
    "from-violet-500/20 to-fuchsia-500/10 text-violet-300 border-violet-400/30",
  "chart-up":
    "from-lime-500/20 to-emerald-500/10 text-lime-300 border-lime-400/30",
  "file-report":
    "from-sky-500/20 to-cyan-500/10 text-sky-300 border-sky-400/30",
  "briefcase-plan":
    "from-rose-500/20 to-pink-500/10 text-rose-300 border-rose-400/30",
};

function FolderIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </svg>
  );
}

function CategoryIcon({ iconKey }) {
  switch (iconKey) {
    case "clipboard-check":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="9" y="2" width="6" height="4" rx="1" />
          <path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      );
    case "target":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
      );
    case "handshake":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 12 8 9a3 3 0 0 0-4 4l3.5 3.5a3 3 0 0 0 4.2 0l4.8-4.8a3 3 0 1 1 4.2 4.2L16 20" />
          <path d="M14 10 9.5 5.5a3 3 0 0 0-4.2 0L4 6.8" />
        </svg>
      );
    case "calendar-plan":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18M8 14h3M8 18h6" />
        </svg>
      );
    case "chart-up":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 3v18h18" />
          <path d="m7 14 4-4 3 3 5-6" />
        </svg>
      );
    case "file-report":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h5" />
        </svg>
      );
    case "briefcase-plan":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" />
        </svg>
      );
    default:
      return <FolderIcon />;
  }
}

function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default async function LaporanIndexPage() {
  const laporanCategories = await getAllLaporanCategories();
  const totalCategories = laporanCategories.length;
  const totalDocuments = laporanCategories.reduce((sum, category) => {
    const count = Array.isArray(category.documents)
      ? category.documents.length
      : 0;
    return sum + count;
  }, 0);

  return (
    <>
      <PageBanner
        title="Laporan dan Akuntabilitas"
        description="Transparansi dan akuntabilitas kinerja Kementerian Agama Kabupaten Barito Utara melalui dokumen resmi yang dapat diakses publik."
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Laporan" }]}
      />

      <main className="bg-slate-50/60 dark:bg-slate-950">
        <section className="w-full px-6 py-10 sm:px-10 md:py-14 lg:px-16 xl:px-20">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-200/50 bg-white p-6 shadow-sm dark:border-emerald-900/40 dark:bg-slate-900">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_42%)]" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  <FolderIcon />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Dokumen Akuntabilitas
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Halaman ini menghimpun dokumen resmi yang mencerminkan
                    perencanaan, pelaksanaan, evaluasi kinerja, serta bentuk
                    pertanggungjawaban instansi kepada publik. Silakan pilih
                    kategori laporan untuk melihat dokumen secara lengkap.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/60">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Kategori
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {totalCategories}
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 dark:border-emerald-800/60 dark:bg-emerald-900/20">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                    Dokumen
                  </p>
                  <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                    {totalDocuments}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {laporanCategories.map((item, index) => {
              const docsCount = Array.isArray(item.documents)
                ? item.documents.length
                : 0;
              const iconStyle =
                CATEGORY_ICON_BG[item.icon] ||
                "from-emerald-500/20 to-teal-500/10 text-emerald-300 border-emerald-400/30";

              return (
                <Link
                  key={item.slug}
                  href={`/laporan/${item.slug}`}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.18),_transparent_42%)]" />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                          Kategori {String(index + 1).padStart(2, "0")}
                        </p>
                        <h3 className="mt-2 text-base font-semibold text-slate-900 transition group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-400">
                          {item.title}
                        </h3>
                      </div>

                      <span
                        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br ${iconStyle}`}
                      >
                        <CategoryIcon iconKey={item.icon} />
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {item.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        {docsCount} dokumen
                      </span>

                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                        <span>Buka Dokumen</span>
                        <ArrowRightIcon />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
