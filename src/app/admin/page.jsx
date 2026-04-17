import { requireAdmin } from "@/lib/auth";
import { getDashboardStats } from "@/lib/admin-stats";
import DashboardCharts from "@/components/admin/DashboardCharts";

export const dynamic = "force-dynamic";

function StatCard({ label, value, helper, tone = "slate" }) {
  const tones = {
    slate: "border-slate-200 bg-white",
    emerald: "border-emerald-200 bg-emerald-50/80",
    amber: "border-amber-200 bg-amber-50/80",
    sky: "border-sky-200 bg-sky-50/80",
    rose: "border-rose-200 bg-rose-50/80",
  };
  const textTones = {
    slate: "text-slate-900",
    emerald: "text-emerald-900",
    amber: "text-amber-900",
    sky: "text-sky-900",
    rose: "text-rose-900",
  };

  return (
    <div
      className={`rounded-3xl border p-5 shadow-sm ${tones[tone] || tones.slate}`}
    >
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p
        className={`mt-2 text-3xl font-bold ${textTones[tone] || textTones.slate}`}
      >
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-500">{helper}</p>
    </div>
  );
}

function numberFmt(n) {
  return new Intl.NumberFormat("id-ID").format(Number(n || 0));
}

export default async function AdminDashboardPage() {
  const session = await requireAdmin({
    loginRedirect: "/admin/login",
    forbiddenRedirect:
      "/error?message=" +
      encodeURIComponent("Akun ini tidak memiliki hak akses admin."),
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
      <div className="rounded-3xl border border-emerald-100 bg-linear-to-br from-emerald-50 via-white to-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Dashboard Admin
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Selamat datang, {compactName}
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          {displayEmail} · Peran:{" "}
          <span className="font-semibold capitalize">
            {session.role || "tidak diketahui"}
          </span>
        </p>

        <div className="mt-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {session?.isMfaVerified
            ? "MFA admin aktif"
            : "MFA admin belum terverifikasi"}
        </div>
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Pesan Kontak"
          value={numberFmt(summary.totalKontak)}
          helper={`${numberFmt(summary.kontakBaru)} belum dibaca.`}
          tone={summary.kontakBaru > 0 ? "rose" : "slate"}
        />
        <StatCard
          label="Kesehatan Data"
          value={stats.ok ? "Normal" : "Periksa"}
          helper={
            stats.ok
              ? "Semua tabel dapat diakses."
              : "Beberapa tabel belum siap. Periksa Supabase."
          }
          tone={stats.ok ? "emerald" : "rose"}
        />
      </div>

      <DashboardCharts
        trend={stats.trend || []}
        topBerita={stats.topBerita || []}
        recentActivity={stats.recentActivity || []}
      />
    </section>
  );
}
