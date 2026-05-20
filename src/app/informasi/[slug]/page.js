import React from "react";
import prisma from "@/lib/prisma";
import InformasiSlugClientPage from "./InformasiSlugClientPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const page = await prisma.static_pages.findFirst({
      where: { slug, is_published: true },
    });
    if (!page) {
      return { title: "Informasi Publik | Kemenag Barito Utara" };
    }
    return {
      title: `${page.title} | Kemenag Barito Utara`,
      description: page.description || "",
    };
  } catch (error) {
    console.error("generateMetadata error:", error);
    return { title: "Informasi Publik | Kemenag Barito Utara" };
  }
}

export default async function InformasiSubPage({ params }) {
  const { slug } = await params;

  let pageData = null;
  try {
    pageData = await prisma.static_pages.findFirst({
      where: { slug, is_published: true },
      select: {
        title: true,
        description: true,
        content: true,
        updated_at: true,
      },
    });
  } catch (error) {
    console.error("Error fetching static page from database:", error);
  }

  return <InformasiSlugClientPage slug={slug} pageData={pageData} />;
}
