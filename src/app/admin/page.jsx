import { requirePermission } from "@/lib/user-permissions";
import { PERMISSIONS } from "@/lib/permissions";
import { getDashboardStats } from "@/lib/admin-stats";

export const dynamic = "force-dynamic";

function StatCard({ label, value, helper, tone = "slate" }) {
  const tones = {
    slate: "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/80",
    emerald:
      "border-emerald-200 bg-emerald-50/80 dark:border-emerald-700/60 dark:bg-emerald-900/20",
    amber:
      "border-amber-200 bg-amber-50/80 dark:border-amber-700/60 dark:bg-amber-900/20",
    sky: "border-sky-200 bg-sky-50/80 dark:border-sky-700/60 dark:bg-sky-900/20",
    rose: "border-rose-200 bg-rose-50/80 dark:border-rose-700/60 dark:bg-rose-900/20",
  };

  const textTones = {
    slate: "text-slate-900 dark:text-slate-100",
    emerald: "text-emerald-900 dark:text-emerald-200",
    amber: "text-amber-900 dark:text-amber-200",
    sky: "text-sky-900 dark:text-sky-200",
    rose: "text-rose-900 dark:text-rose-200",
  };

  return (
    <div className={`rounded-3xl border p-5 shadow-sm ${tones[tone] || tones.slate}`}>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${textTones[tone] || textTones.slate}`}>
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{helper}</p>
    </div>
  );
}

function numberFmt(n) {
  return new Intl.NumberFormat("id-ID").format(Number(n || 0));
}

export default async function AdminDashboardPage() {
  const { session } = await requirePermission(PERMISSIONS.DASHBOARD_VIEW, {
    loginRedirect: "/admin/login",
    forbiddenRedirect:
      "/error?message=" +
      encodeURIComponent("Anda tidak memiliki akses ke dashboard admin."),
    inactiveRedirect:
      "/error?message=" +
      encodeURIComponent("Akun editor Anda belum diverifikasi oleh super admin."),
  });

  const user = session.profile;
  const stats = await getDashboardStats({ days: 14 });

  const summary = stats.summary || {
    totalBerita: 0,
    totalPublished: 0,
    totalDraft: 0,
    totalViews: 0,
    recent7: 0,
    totalKontak: 0,
    kontakBaru: 0,
  };

  const displayEmail = user?.email || "-";
  const compactName =
    user?.full_name?.trim() || String(displayEmail).split("@")[0] || "Admin";

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-emerald-100 bg-linear-to-br from-emerald-50 via-white to-white p-6 shadow-sm dark:border-emerald-700/50 dark:from-emerald-900/25 dark:via-slate-900 dark:to-slate-900">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
          Dashboard Admin
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">
          Selamat datang, {compactName}
        </h1>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {displayEmail} · Peran:{" "}
          <span className="font-semibold capitalize">
            {session.role || "tidak diketahui"}
          </span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Berita"
          value={numberFmt(summary.totalBerita)}
          helper={`${numberFmt(summary.recent7)} berita dibuat 7 hari terakhir.`}
          tone="emerald"
        />
        <StatCard
          label="Berita Publish"
          value={numberFmt(summary.totalPublished)}
          helper="Konten yang tampil di website publik."
        />
        <StatCard
          label="Draft"
          value={numberFmt(summary.totalDraft)}
          helper="Konten yang sedang disiapkan."
          tone="amber"
        />
        <StatCard
          label="Total Views"
          value={numberFmt(summary.totalViews)}
          helper="Akumulasi view seluruh berita."
          tone="sky"
        />
      </div>
    </section>
  );
}
