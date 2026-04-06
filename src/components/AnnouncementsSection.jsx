import Link from "next/link";
import { pengumumanList } from "../data/pengumuman";

export default function AnnouncementsSection() {
  const featuredAnnouncement =
    pengumumanList.find((item) => item.isImportant) || pengumumanList[0];

  const otherAnnouncements = pengumumanList.filter(
    (item) => item.slug !== featuredAnnouncement.slug
  );

  return (
    <section className="py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Pengumuman
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Informasi Resmi dan Pemberitahuan Penting
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            Sampaikan informasi resmi, perubahan layanan, agenda penting, dan
            pemberitahuan lainnya secara terpisah dari berita kegiatan.
          </p>
        </div>

        <Link
          href="/pengumuman"
          className="hidden text-sm font-semibold text-emerald-700 hover:text-emerald-800 md:inline-flex"
        >
          Lihat Semua Pengumuman
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">
              Pengumuman Utama
            </span>
            <span className="text-sm text-slate-500">
              {featuredAnnouncement.date} · {featuredAnnouncement.category}
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-bold text-slate-900 md:text-3xl">
            {featuredAnnouncement.title}
          </h3>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            {featuredAnnouncement.excerpt}
          </p>

          <div className="mt-6">
            <Link
              href="/pengumuman"
              className="inline-flex items-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Buka Pengumuman
            </Link>
          </div>
        </article>

        <div className="space-y-4">
          {otherAnnouncements.map((item) => (
            <article
              key={item.slug}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {item.category}
                </span>
                <span className="text-sm text-slate-500">{item.date}</span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.excerpt}
              </p>
            </article>
          ))}

          <Link
            href="/pengumuman"
            className="inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800 md:hidden"
          >
            Lihat Semua Pengumuman
          </Link>
        </div>
      </div>
    </section>
  );
}