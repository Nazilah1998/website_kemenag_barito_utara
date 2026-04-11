import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAllBerita } from "@/lib/berita";

export const dynamic = "force-dynamic";

function StatCard({ label, value, helper }) {
  return (
    <div className="min-w-0 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
        {label}
      </p>
      <p
        className="mt-3 wrap-break-word text-3xl font-bold leading-tight text-slate-900"
        title={String(value)}
      >
        {value}
      </p>
      <p className="mt-2 wrap-break-word text-sm leading-6 text-slate-500">
        {helper}
      </p>
    </div>
  );
}

function QuickLinkCard({ href, title, description }) {
  return (
    <Link
      href={href}
      className="block min-w-0 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:bg-emerald-50"
    >
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
        Buka modul
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const session = await requireAdmin({
    loginRedirect: "/admin/login",
    forbiddenRedirect:
      "/error?message=" +
      encodeURIComponent("Akun ini tidak memiliki hak akses admin."),
  });

  const user = session.profile;
  const beritaList = await getAllBerita();

  const totalBerita = beritaList.length;
  const totalViews = beritaList.reduce((acc, item) => acc + Number(item.views || 0), 0);
  const latestBerita = beritaList[0] || null;
  const averageViews = totalBerita > 0 ? Math.round(totalViews / totalBerita) : 0;

  const displayName = user?.full_name?.trim() || "Admin";
  const displayEmail = user?.email || "-";
  const compactName =
    user?.full_name?.trim() ||
    String(displayEmail).split("@")[0] ||
    "Admin";

  return (
    <div className="space-y-8">
      <section className="min-w-0 rounded-4xl border border-slate-200 bg-linear-to-br from-white via-emerald-50 to-teal-50 p-6 shadow-sm md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
          Dashboard Admin
        </p>

        <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
          Selamat datang, {compactName}
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
          Panel ini dipakai untuk mengelola konten website publik. Fokus utama saat ini
          adalah kualitas berita, konsistensi publikasi, dan kemudahan workflow editor.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <div
            className="max-w-full rounded-full border border-emerald-200 bg-white px-4 py-2 font-semibold text-emerald-700"
            title={displayEmail}
          >
            <span className="block max-w-70 truncate">{displayEmail}</span>
          </div>

          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700">
            Role: {user?.role || "admin"}
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Berita tayang"
          value={totalBerita.toLocaleString("id-ID")}
          helper="Jumlah berita yang sudah tampil di website publik."
        />
        <StatCard
          label="Total pembaca"
          value={totalViews.toLocaleString("id-ID")}
          helper="Akumulasi pembacaan dari seluruh berita yang sudah tayang."
        />
        <StatCard
          label="Artikel terbaru"
          value={latestBerita ? latestBerita.date : "-"}
          helper={latestBerita ? latestBerita.title : "Belum ada berita tayang."}
        />
        <StatCard
          label="Rata-rata pembaca"
          value={averageViews.toLocaleString("id-ID")}
          helper="Rata-rata jumlah pembaca untuk setiap berita yang sudah tayang."
        />
      </section>

      <section>
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
            Modul Utama
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Akses cepat panel admin
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <QuickLinkCard
            href="/admin/berita"
            title="Berita"
            description="Kelola artikel, status tayang, cover, ringkasan, dan isi berita."
          />
          <QuickLinkCard
            href="/admin/pengumuman"
            title="Pengumuman"
            description="Atur pengumuman resmi agar tetap rapi, jelas, dan mudah ditemukan."
          />
          <QuickLinkCard
            href="/admin/agenda"
            title="Agenda"
            description="Kelola agenda kegiatan, jadwal acara, dan publikasi aktivitas instansi."
          />
          <QuickLinkCard
            href="/admin/dokumen"
            title="Dokumen"
            description="Kelola unggahan dokumen publik dan arsip yang perlu ditampilkan."
          />
        </div>
      </section>
    </div>
  );
}