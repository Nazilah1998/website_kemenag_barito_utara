import React from "react";
import { db } from "@/lib/drizzle";
import { seksi, pegawai_seksi } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import LayananSlugClientPage from "./LayananSlugClientPage";
import { logError } from "@/lib/logger";

export const revalidate = 600;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const [seksiData2] = await db
      .select()
      .from(seksi)
      .where(eq(seksi.slug, slug))
      .limit(1);

    if (!seksiData2) {
      return {
        title: "Layanan Publik | Kemenag Barito Utara",
        description: "Layanan Publik Kantor Kementerian Agama Kabupaten Barito Utara.",
      };
    }

    return {
      title: `${seksiData2.judul} | Kemenag Barito Utara`,
      description: seksiData2.deskripsi,
    };
  } catch (error) {
    logError("layanan_slug_metadata_error", { error: error?.message });
    return {
      title: "Layanan Publik | Kemenag Barito Utara",
    };
  }
}

export default async function LayananSubPage({ params }) {
  const { slug } = await params;

  let seksiData = null;
  try {
    const data = await db.select().from(seksi).where(eq(seksi.slug, slug)).limit(1);
    seksiData = data[0] || null;

    if (seksiData) {
      const [pegawai] = await Promise.all([
        db.select().from(pegawai_seksi).where(eq(pegawai_seksi.seksi_id, seksiData.id)).orderBy(asc(pegawai_seksi.sort_order)).catch(() => []),
      ]);
      
      seksiData.pegawai_seksis = pegawai;
    }
  } catch (error) {
    logError("layanan_slug_fetch_error", { error: error?.message });
  }

  return (
    <LayananSlugClientPage slug={slug} initialData={seksiData} />
  );
}
