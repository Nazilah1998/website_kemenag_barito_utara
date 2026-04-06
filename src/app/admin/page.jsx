import { requireAdmin } from "@/lib/auth";

export const metadata = {
  title: "Dashboard Admin",
};

export default async function AdminDashboard() {
  const { supabase, profile } = await requireAdmin();

  const [
    { count: totalNews },
    { count: totalAnnouncements },
    { count: totalDocuments },
    { count: totalEvents },
  ] = await Promise.all([
    supabase.from("news").select("id", { count: "exact", head: true }),
    supabase
      .from("announcements")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("public_documents")
      .select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
  ]);

  const cards = [
    { label: "Total berita", value: totalNews ?? 0 },
    { label: "Total pengumuman", value: totalAnnouncements ?? 0 },
    { label: "Total dokumen", value: totalDocuments ?? 0 },
    { label: "Total agenda", value: totalEvents ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-2xl font-semibold">Selamat datang, {profile?.full_name || "Admin"}</h2>
        <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-300">
          Fondasi backend tahap 1 sudah siap: autentikasi, profil admin,
          struktur tabel inti, dan route server untuk validasi session. Tahap 2
          nanti bisa fokus ke CRUD modul berita, pengumuman, dokumen, dan agenda.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.label}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold">{card.value}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
