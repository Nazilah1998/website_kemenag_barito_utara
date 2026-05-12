import { getCurrentSessionContext } from "@/lib/auth";
import { getUserPermissionContext } from "@/lib/user-permissions";
import { getDashboardStats } from "@/lib/admin-stats";
import { redirect } from "next/navigation";
import AdminLoginClient from "@/components/features/admin/AdminLoginClient";
import {
  DashboardHeader,
  StatCard,
  RecentActivity,
  TopContent,
  QuickMenu
} from "@/components/features/admin/dashboard/DashboardUI";
import DashboardCharts from "@/components/features/admin/DashboardCharts";

export const dynamic = "force-dynamic";

function numberFmt(n) {
  return new Intl.NumberFormat("id-ID").format(Number(n || 0));
}

export default async function AdminDashboardPage({ searchParams }) {
  const session = await getCurrentSessionContext();
  const params = await searchParams;
  const isUnauthorized = params?.error === "unauthorized";

  if (!session?.isAuthenticated || !session?.hasAdminAccess) {
    return <AdminLoginClient initialUnauthorized={isUnauthorized} />;
  }

  const permissionContext = await getUserPermissionContext({
    userId: session?.profile?.id || session?.user?.id || null,
    role: session?.role || null,
    email: session?.profile?.email || session?.user?.email || null,
  });

  const isPendingEditor =
    session?.role === "editor" &&
    (!permissionContext?.approved || !permissionContext?.isActive);

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
    totalReportDocs: 0,
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 delay-100">
      {/* 1. Greeting & Hero Area */}
      <DashboardHeader user={user} session={session} />

      {isPendingEditor && (
        <div className="rounded-[2rem] border-2 border-amber-100 bg-amber-50 p-8 dark:border-amber-900/30 dark:bg-amber-950/20">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">Verifikasi Tertunda</p>
              <p className="mt-1 text-sm font-medium text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                Akun editor Anda sudah bisa login, tetapi akses fitur masih dikunci. Silakan hubungi Super Admin untuk verifikasi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Analytics Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
        <StatCard
          label="Publikasi Berita"
          value={numberFmt(summary.totalBerita)}
          helper={`${numberFmt(summary.recent7)} berita baru dalam 7 hari terakhir.`}
          tone="emerald"
          icon={
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v4a2 2 0 002 2h4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 12h10M7 16h10" />
            </svg>
          }
        />
        <StatCard
          label="Total Jangkauan"
          value={numberFmt(summary.totalViews)}
          helper="Akumulasi tayangan seluruh konten berita."
          tone="blue"
          icon={
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />
        <StatCard
          label="Galeri Visual"
          value={numberFmt(summary.totalGallery)}
          helper="Total koleksi dokumentasi foto & video."
          tone="indigo"
          icon={
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          label="Slider Beranda"
          value={numberFmt(summary.totalSlides)}
          helper="Jumlah banner promo yang aktif bergantian."
          tone="fuchsia"
          icon={
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          label="Pesan Masuk"
          value={numberFmt(summary.totalKontak)}
          helper={`${numberFmt(summary.kontakBaru)} pesan baru perlu ditanggapi.`}
          tone="amber"
          icon={
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          }
        />
        <StatCard
          label="Dokumen Laporan"
          value={numberFmt(summary.totalReportDocs)}
          helper="Total dokumen publik yang terbit saat ini."
          tone="violet"
          icon={
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
      </div>

      {/* 3. Visual Analytics & Charts */}
      <div className="pt-4">
        <DashboardCharts
          trend={stats.trend}
          topBerita={stats.topBerita}
          recentActivity={stats.recentActivity}
        />
      </div>
    </div>
  );
}
