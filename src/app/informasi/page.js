import React from "react";
import { db } from "@/lib/drizzle";
import { static_pages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import InformasiIndexClient from "./InformasiIndexClient";

export const revalidate = 600;

export const metadata = {
  title: "Informasi Publik",
  description:
    "Informasi publik, regulasi, profil pejabat, struktur organisasi, dan dasar hukum di lingkungan Kantor Kementerian Agama Kabupaten Barito Utara.",
};

export default async function InformasiPage() {
  let staticPages = [];
  try {
    staticPages = await db
      .select({
        slug: static_pages.slug,
        title: static_pages.title,
        description: static_pages.description,
        updated_at: static_pages.updated_at,
      })
      .from(static_pages)
      .where(eq(static_pages.is_published, true))
      .orderBy(desc(static_pages.updated_at));
  } catch (error) {
    console.error("Error fetching static pages:", error);
  }

  return <InformasiIndexClient staticPages={staticPages} />;
}
