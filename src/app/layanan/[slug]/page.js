import React from "react";
import prisma from "@/lib/prisma";
import LayananSlugClientPage from "./LayananSlugClientPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const seksi = await prisma.seksi.findUnique({
      where: { slug }
    });

    if (!seksi) {
      return {
        title: "Layanan Publik | Kemenag Barito Utara",
        description: "Layanan Publik Kantor Kementerian Agama Kabupaten Barito Utara.",
      };
    }

    return {
      title: `${seksi.judul} | Kemenag Barito Utara`,
      description: seksi.deskripsi,
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
    seksiData = await prisma.seksi.findUnique({
      where: { slug },
      include: {
        pegawai_seksi: {
          orderBy: { sort_order: 'asc' }
        },
        layanan_ptsp: {
          orderBy: { sort_order: 'asc' }
        },
        link_aplikasi_seksi: {
          orderBy: { sort_order: 'asc' }
        }
      }
    });
  } catch (error) {
    console.error("Error fetching seksi data from database:", error);
  }

  return (
    <LayananSlugClientPage slug={slug} initialData={seksiData} />
  );
}
