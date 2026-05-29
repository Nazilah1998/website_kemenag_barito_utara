import React from "react";
import { db } from "@/lib/drizzle";
import { static_pages } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import InformasiSlugClientPage from "./InformasiSlugClientPage";
import { logError } from "@/lib/logger";

export const revalidate = 600;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const [page] = await db
      .select()
      .from(static_pages)
      .where(and(eq(static_pages.slug, slug), eq(static_pages.is_published, true)))
      .limit(1);
    if (!page) {
      return { title: "Informasi Publik | Kemenag Barito Utara" };
    }
    return {
      title: `${page.title} | Kemenag Barito Utara`,
      description: page.description || "",
    };
  } catch (error) {
    logError("informasi_slug_metadata_error", { error: error?.message });
    return { title: "Informasi Publik | Kemenag Barito Utara" };
  }
}

export default async function InformasiSubPage({ params }) {
  const { slug } = await params;

  let pageData = null;
  try {
    const [pageDataResult] = await db
      .select({
        title: static_pages.title,
        description: static_pages.description,
        content: static_pages.content,
        updated_at: static_pages.updated_at,
      })
      .from(static_pages)
      .where(and(eq(static_pages.slug, slug), eq(static_pages.is_published, true)))
      .limit(1);
    pageData = pageDataResult;
  } catch (error) {
    logError("informasi_slug_page_error", { error: error?.message });
  }

  return <InformasiSlugClientPage slug={slug} pageData={pageData} />;
}
