import { notFound } from "next/navigation";
import Link from "next/link";
import PageBanner from "../../../components/PageBanner";
import { createClient } from "@/lib/supabase/server";

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

function getAttachmentButtonLabel(type) {
  if (type === "pdf") return "Buka PDF";
  if (type === "image") return "Buka Gambar";
  return "Buka Link Lampiran";
}

export async function generateMetadata({ params }) {
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("pengumuman")
    .select("title, excerpt, slug, is_published")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!item) {
    return {
      title: "Pengumuman tidak ditemukan | Kemenag Barito Utara",
      description: "Data pengumuman tidak ditemukan.",
    };
  }

  return {
    title: `${item.title} | Pengumuman`,
    description: item.excerpt || "Detail pengumuman resmi",
  };
}

export default async function DetailPengumumanPage({ params }) {
  const supabase = await createClient();

  const { data: item, error } = await supabase
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
    .eq("slug", params.slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Gagal memuat detail pengumuman.");
  }

  if (!item) {
    notFound();
  }

  const paragraphs = String(item.content || "")
    .split("\n")
    .map((text) => text.trim())
    .filter(Boolean);

  return (
    <>
      <PageBanner
        title="Detail Pengumuman"
        subtitle="Informasi resmi yang dapat langsung ditindaklanjuti."
      />

      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/pengumuman"
              className="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800"
            >
              ← Kembali ke halaman pengumuman
            </Link>

            <article className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span
                  className={`rounded-full px-3 py-1 ${
                    item.is_important
                      ? "bg-red-50 text-red-700"
                      : "bg-sky-50 text-sky-700"
                  }`}
                >
                  {item.is_important
                    ? "Pengumuman Penting"
                    : item.category || "Informasi"}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                  {formatDate(item.published_at || item.created_at)}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-bold leading-tight text-slate-900">
                {item.title}
              </h1>

              {item.excerpt ? (
                <p className="mt-4 rounded-2xl bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-600">
                  {item.excerpt}
                </p>
              ) : null}

              <div className="mt-8 space-y-5 text-[15px] leading-8 text-slate-700">
                {paragraphs.length > 0 ? (
                  paragraphs.map((paragraph, index) => (
                    <p key={`${item.id}-paragraph-${index}`}>{paragraph}</p>
                  ))
                ) : (
                  <p>Tidak ada isi detail pengumuman.</p>
                )}
              </div>

              {item.attachment_url ? (
                <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <h2 className="text-xl font-bold text-slate-900">Lampiran</h2>

                  {item.attachment_type === "image" ? (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.attachment_url}
                        alt={item.attachment_name || item.title}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.attachment_name || "Lampiran Pengumuman"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Klik tombol di samping untuk membuka lampiran.
                      </p>
                    </div>

                    <a
                      href={item.attachment_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-2xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800"
                    >
                      {getAttachmentButtonLabel(item.attachment_type)}
                    </a>
                  </div>
                </div>
              ) : null}
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
