import Link from "next/link";
import PageBanner from "@/components/common/PageBanner";
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
        title="Laporan & Akuntabilitas"
        description="Transparansi kinerja Kementerian Agama Kabupaten Barito Utara melalui dokumentasi resmi yang akuntabel."
        breadcrumb={[{ label: "Beranda", href: "/" }, { label: "Laporan" }]}
      />

      <main className="relative bg-white dark:bg-slate-950">
        {/* Background Decorative Elements */}
        <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-full overflow-hidden opacity-40">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-emerald-100/50 blur-[120px] dark:bg-emerald-900/10" />
          <div className="absolute right-0 top-20 h-64 w-64 rounded-full bg-teal-50/50 blur-[100px] dark:bg-teal-900/10" />
        </div>

        <section className="relative z-10 w-full px-6 py-12 sm:px-10 lg:px-16 xl:px-20">
          {/* Stats & Intro Dashboard */}
          <div className="relative mb-16 overflow-hidden rounded-[2.5rem] bg-emerald-950 p-8 text-white shadow-2xl lg:p-12">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-emerald-400 blur-[80px]" />
              <div className="absolute right-[5%] bottom-[10%] h-80 w-80 rounded-full bg-teal-500 blur-[100px]" />
            </div>

            <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                  <div className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                  Transparency Portal
                </div>
                <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Pusat Dokumen Publik
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-emerald-100/80">
                  Kami berkomitmen menyajikan data perencanaan, pelaksanaan, dan
                  evaluasi kinerja secara terbuka sebagai bentuk
                  pertanggungjawaban kepada masyarakat Barito Utara.
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-4 sm:gap-6">
                <div className="flex flex-col rounded-3xl bg-white/10 p-6 backdrop-blur-md border border-white/10 min-w-[140px]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300/80">
                    Total Kategori
                  </span>
                  <span className="mt-2 text-4xl font-black">
                    {totalCategories}
                  </span>
                </div>
                <div className="flex flex-col rounded-3xl bg-emerald-500 p-6 shadow-xl shadow-emerald-500/20 min-w-[140px]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                    Total Dokumen
                  </span>
                  <span className="mt-2 text-4xl font-black text-white">
                    {totalDocuments}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {laporanCategories.map((item, index) => {
              const docsCount = Array.isArray(item.documents)
                ? item.documents.length
                : 0;
              const iconStyle =
                CATEGORY_ICON_BG[item.icon] ||
                "from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-400/30";

              return (
                <Link
                  key={item.slug}
                  href={`/laporan/${item.slug}`}
                  className="group flex flex-col justify-between overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 transition-all duration-500 hover:scale-[1.02] hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/50"
                >
                  <div>
                    <div className="mb-6 flex items-start justify-between">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl border bg-gradient-to-br shadow-sm transition-transform duration-500 group-hover:rotate-6 ${iconStyle}`}
                      >
                        <CategoryIcon iconKey={item.icon} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 dark:text-slate-700">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-50 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                        {docsCount} File Tersedia
                      </span>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all group-hover:bg-emerald-600 group-hover:text-white dark:bg-white/5">
                      <ArrowRightIcon />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="mt-20 rounded-[2.5rem] bg-slate-50 p-10 text-center dark:bg-slate-900/30">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Butuh bantuan mencari dokumen?
            </h4>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Anda dapat menghubungi tim PPID kami melalui kanal bantuan jika
              dokumen yang Anda cari tidak ditemukan.
            </p>
            <Link
              href="/kontak"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-bold text-emerald-700 shadow-sm border border-slate-200 transition-all hover:bg-emerald-700 hover:text-white hover:border-emerald-700 dark:bg-slate-800 dark:border-slate-700 dark:text-emerald-400"
            >
              Hubungi Kami
              <ArrowRightIcon />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
