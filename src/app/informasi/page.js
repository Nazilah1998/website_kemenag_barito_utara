import React from "react";
import prisma from "@/lib/prisma";
import InformasiIndexClient from "./InformasiIndexClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Informasi Publik - Kementerian Agama Kabupaten Barito Utara",
  description:
    "Informasi publik, regulasi, profil pejabat, struktur organisasi, dan dasar hukum di lingkungan Kantor Kementerian Agama Kabupaten Barito Utara.",
};

export default async function InformasiPage() {
  let staticPages = [];
  try {
    staticPages = await prisma.static_pages.findMany({
      where: { is_published: true },
      select: { slug: true, title: true, description: true, updated_at: true },
      orderBy: { updated_at: "desc" },
    });
  } catch (error) {
    console.error("Error fetching static pages:", error);
  }

  return <InformasiIndexClient staticPages={staticPages} />;
}
