import Link from "next/link";
import PageBanner from "../../components/PageBanner";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Pengumuman | Kemenag Barito Utara",
  description:
    "Pengumuman resmi, edaran, jadwal, dan informasi penting instansi.",
};

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(date);
}

function getAttachmentLabel(type) {
  if (type === "image") return "Ada Gambar";
  if (type === "pdf") return "Ada PDF";
  if (type) return "Ada Lampiran";
  return null;
}

export default async function PengumumanPage() {
  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from("pengumuman")
    .select(
      `
      id,
      slug,
      title,
      excerpt,
      content,
      category,
      is_important,
      is_published,
      published_at,
      attachment_url,
      attachment_name,
      attachment_type,
      created_at
    `,
    )
    .eq("is_published", true)
    .order("is_important", { ascending: false })
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Gagal memuat halaman pengumuman.");
  }

  return (
    <>
      <PageBanner
        title="Pengumuman"
        subtitle="Informasi resmi, penting, dan dapat langsung ditindaklanjuti."
      />

      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            {!items || items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900">
                  Belum ada pengumuman
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Pengumuman resmi akan tampil di halaman ini setelah
                  dipublikasikan dari panel admin.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className={`rounded-3xl border bg-white p-6 shadow-sm transition hover:shadow-md ${
                      item.is_important ? "border-red-200" : "border-slate-200"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                      <span
                        className={`rounded-full px-3 py-1 ${
                          item.is_important
                            ? "bg-red-50 text-red-700"
                            : "bg-sky-50 text-sky-700"
                        }`}
                      >
                        {item.is_important
                          ? "Penting"
                          : item.category || "Informasi"}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                        {formatDate(item.published_at || item.created_at)}
                      </span>

                      {item.attachment_url ? (
                        <span className="rounded-full bg-violet-50 px-3 py-1 text-violet-700">
                          {getAttachmentLabel(item.attachment_type)}
                        </span>
                      ) : null}
                    </div>

                    <h2 className="mt-4 text-2xl font-bold text-slate-900">
                      {item.title}
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {item.excerpt}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        href={`/pengumuman/${item.slug}`}
                        className="inline-flex items-center rounded-2xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800"
                      >
                        Lihat detail
                      </Link>

                      {item.attachment_url ? (
                        <a
                          href={item.attachment_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Buka lampiran
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
