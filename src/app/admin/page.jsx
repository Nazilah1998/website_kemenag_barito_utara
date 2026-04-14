import { requireAdmin } from "@/lib/auth";
import { getAllBerita } from "@/lib/berita";

export const dynamic = "force-dynamic";

function StatCard({ label, value, helper }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
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
  const beritaList = await getAllBerita();

  const totalBerita = beritaList.length;
  const totalViews = beritaList.reduce(
    (acc, item) => acc + Number(item.views || 0),
    0
  );
  const totalDraft = beritaList.filter((item) => !item.is_published).length;
  const totalPublished = beritaList.filter((item) => item.is_published).length;

  const displayEmail = user?.email || "-";
  const compactName =
    user?.full_name?.trim() ||
    String(displayEmail).split("@")[0] ||
    "Admin";

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
          Dashboard Admin
        </span>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Selamat datang, {compactName}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {displayEmail}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total berita"
          value={totalBerita}
          helper="Seluruh artikel yang tersimpan"
        />
        <StatCard
          label="Berita tayang"
          value={totalPublished}
          helper="Artikel yang sudah dipublikasikan"
        />
        <StatCard
          label="Draft"
          value={totalDraft}
          helper="Artikel yang belum tayang"
        />
        <StatCard
          label="Total pembaca"
          value={totalViews}
          helper="Akumulasi view seluruh berita"
        />
      </div>
    </section>
  );
}