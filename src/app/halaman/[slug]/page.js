import { notFound } from "next/navigation";
import PageBanner from "@/components/PageBanner";
import { getStaticPageBySlug } from "@/lib/static-pages";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";
import { siteInfo } from "@/data/site";

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

  const description =
    page.description || `${page.title} - ${siteInfo.shortName}.`;
  const url = `/halaman/${page.slug}`;

  return {
    title: page.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "id_ID",
      url,
      siteName: siteInfo.shortName,
      title: page.title,
      description,
    },
    twitter: {
      card: "summary",
      title: page.title,
      description,
    },
  };
}

export default async function HalamanDetailPage({ params }) {
  const { slug } = await params;
  const page = await getStaticPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const jsonLd = breadcrumbSchema([
    { name: "Beranda", url: "/" },
    { name: page.title, url: `/halaman/${page.slug}` },
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
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
