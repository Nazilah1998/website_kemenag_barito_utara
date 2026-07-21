import React from "react";
import { db } from "@/lib/drizzle";
import { seksi, pegawai_seksi } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import ProfilPejabatSlugClientPage from "./ProfilPejabatSlugClientPage";
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
        title: "Profil Pejabat | Kemenag Barito Utara",
        description: "Profil Pejabat Kantor Kementerian Agama Kabupaten Barito Utara.",
      };
    }

    return {
      title: `${seksiData2.judul} | Kemenag Barito Utara`,
      description: seksiData2.deskripsi,
    };
  } catch (error) {
    logError("profil_pejabat_slug_metadata_error", { error: error?.message });
    return {
      title: "Profil Pejabat | Kemenag Barito Utara",
    };
  }
}

export default async function ProfilPejabatSubPage({ params }) {
  const { slug } = await params;

  let seksiData = null;
  try {
    seksiData = await db.query.seksi.findFirst({
      where: eq(seksi.slug, slug),
      with: {
        pegawai_seksis: {
          orderBy: (pegawai, { asc }) => [asc(pegawai.sort_order)],
        },
      },
    });
  } catch (error) {
    logError("profil_pejabat_slug_fetch_error", { error: error?.message });
  }

  return (
    <ProfilPejabatSlugClientPage slug={slug} initialData={seksiData} />
  );
}
