import React from "react";
import { db } from "@/lib/drizzle";
import { seksi, pegawai_seksi } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import ProfilPejabatUI from "@/components/features/informasi/ProfilPejabatUI";
import { logError } from "@/lib/logger";

export const revalidate = 600;

export const metadata = {
  title: "Profil Pejabat",
  description:
    "Kenali para pemimpin dan pejabat struktural yang mengabdi di Kantor Kementerian Agama Kabupaten Barito Utara.",
};

// Urutan tampil berdasarkan hirarki struktural
const SLUG_ORDER = [
  "kepala-kantor",
  "sekjen",
  "seksi-pendidikan-madrasah",
  "seksi-pendidikan-agama-islam",
  "seksi-pendidikan-diniyah-dan-pondok-pesantren",
  "seksi-bimas-islam",
  "penyelenggara-zakat-wakaf",
  "penyelenggara-hindu",
  "kua-kantor-urusan-agama",
];

export default async function ProfilPejabatPage() {
  const breadcrumb = [
    { label: "Beranda", href: "/" },
    { label: "Informasi Publik", href: "/informasi" },
    { label: "Profil Pejabat" },
  ];

  let kepalaKantor = null;
  let pejabatList = [];

  try {
    const rawSeksiList = await db.select().from(seksi);

    const seksiWithCounts = await Promise.all(
      rawSeksiList.map(async (item) => {
        const [{ count }] = await db
          .select({ count: sql`count(*)` })
          .from(pegawai_seksi)
          .where(eq(pegawai_seksi.seksi_id, item.id));
        return { ...item, _count: { pegawai_seksi: Number(count) } };
      })
    );

    const seksiList = seksiWithCounts;

    // Sort by defined hierarchy
    seksiList.sort((a, b) => {
      let indexA = SLUG_ORDER.indexOf(a.slug);
      let indexB = SLUG_ORDER.indexOf(b.slug);
      if (indexA === -1) indexA = 999;
      if (indexB === -1) indexB = 999;
      return indexA - indexB;
    });

    // Kepala Kantor ditampilkan secara featured
    kepalaKantor = seksiList.find((s) => s.slug === "kepala-kantor") || null;

    // Semua seksi lain (kecuali kepala kantor dan KUA) sebagai pejabat struktural
    pejabatList = seksiList.filter((s) => s.slug !== "kepala-kantor" && s.slug !== "kua-kantor-urusan-agama");
  } catch (error) {
    logError("profil_pejabat_error", { error: error?.message });
  }

  return (
    <ProfilPejabatUI
      breadcrumb={breadcrumb}
      kepalaKantor={kepalaKantor}
      pejabatList={pejabatList}
    />
  );
}
