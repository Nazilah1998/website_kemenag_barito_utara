import { requireAdmin } from "@/lib/auth";
import { getAllBerita } from "@/lib/berita";

export const dynamic = "force-dynamic";

function StatCard({ label, value, helper }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{helper}</p>
    </div>
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
  const beritaList = await getAllBerita({ includeDrafts: true });

  const totalBerita = beritaList.length;
  const totalViews = beritaList.reduce(
    (acc, item) => acc + Number(item.views || 0),
    0,
  );
  const totalDraft = beritaList.filter(
    (item) => !Boolean(item.is_published ?? item.isPublished),
  ).length;
  const totalPublished = beritaList.filter((item) =>
    Boolean(item.is_published ?? item.isPublished),
  ).length;

  const displayEmail = user?.email || "-";
  const compactName =
    user?.full_name?.trim() ||
    String(displayEmail).split("@")[0] ||
    "Admin";

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-emerald-100 bg-linear-to-br from-emerald-50 via-white to-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Dashboard Admin
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Selamat datang, {compactName}
        </h1>

        <p className="mt-2 text-sm text-slate-600">{displayEmail}</p>

        <div className="mt-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {session?.isMfaVerified
            ? "MFA admin aktif"
            : "MFA admin belum terverifikasi"}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Berita"
          value={totalBerita}
          helper="Seluruh berita termasuk publish dan draft."
        />
        <StatCard
          label="Berita Publish"
          value={totalPublished}
          helper="Konten yang sudah tampil di website publik."
        />
        <StatCard
          label="Draft"
          value={totalDraft}
          helper="Konten yang masih disiapkan di panel admin."
        />
        <StatCard
          label="Total Views"
          value={totalViews}
          helper="Akumulasi view dari seluruh berita."
        />
      </div>
    </section>
  );
}