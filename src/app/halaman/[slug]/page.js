import { notFound } from "next/navigation";
import PageBanner from "@/components/PageBanner";
import { getStaticPageBySlug } from "@/lib/static-pages";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getStaticPageBySlug(slug);

  if (!page) {
    return {
      title: "Halaman Tidak Ditemukan",
    };
  }

  return {
    title: page.title,
    description:
      page.description || "Halaman Kemenag Kabupaten Barito Utara.",
  };
}

export default async function HalamanDetailPage({ params }) {
  const { slug } = await params;
  const page = await getStaticPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <PageBanner
        title={page.title}
        description={page.description || undefined}
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: page.title },
        ]}
      />

      <main className="bg-slate-50/60 dark:bg-slate-950">
        <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <div
            className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:prose-invert dark:border-slate-800 dark:bg-slate-900 sm:p-8"
            dangerouslySetInnerHTML={{ __html: page.content || "" }}
          />
        </article>
      </main>
    </>
  );
}
