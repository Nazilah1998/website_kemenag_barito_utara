import React from "react";
import { db } from "@/lib/drizzle";
import { seksi, pegawai_seksi, layanan_ptsp, link_aplikasi_seksi } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import LayananSlugClientPage from "./LayananSlugClientPage";

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
    console.error("generateMetadata error:", error);
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
    console.error("Error fetching seksi data from database:", error);
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
      console.error("Fallback query also failed:", fallbackError);
    }
  }

  return (
    <LayananSlugClientPage slug={slug} initialData={seksiData} />
  );
}
