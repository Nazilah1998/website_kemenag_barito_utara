import React from "react";
import { db } from "@/lib/drizzle";
import { seksi, pegawai_seksi, layanan_ptsp, link_aplikasi_seksi } from "@/db/schema";
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
    seksiData = await db.query.seksi.findFirst({
      where: eq(seksi.slug, slug),
      with: {
        pegawai_seksis: {
          orderBy: [asc(pegawai_seksi.sort_order)]
        },
        layanan_ptsps: {
          orderBy: [asc(layanan_ptsp.sort_order)]
        },
        link_aplikasi_seksis: {
          orderBy: [asc(link_aplikasi_seksi.sort_order)]
        }
      }
    });
  } catch (error) {
    logError("layanan_slug_fetch_error", { error: error?.message });
    try {
      seksiData = await db.query.seksi.findFirst({
        where: eq(seksi.slug, slug),
        with: {
          pegawai_seksis: {
            orderBy: [asc(pegawai_seksi.sort_order)]
          }
        }
      });
    } catch (fallbackError) {
      logError("layanan_slug_fallback_error", { error: fallbackError?.message });
    }
  }

  return (
    <LayananSlugClientPage slug={slug} initialData={seksiData} />
  );
}
