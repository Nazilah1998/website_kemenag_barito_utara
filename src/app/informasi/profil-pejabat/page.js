import React from "react";
import prisma from "@/lib/prisma";
import ProfilPejabatUI from "@/components/features/informasi/ProfilPejabatUI";

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
    const seksiList = await prisma.seksi.findMany({
      include: {
        _count: {
          select: { pegawai_seksi: true },
        },
      },
    });

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
    console.error("Error fetching profil pejabat:", error);
  }

  return (
    <ProfilPejabatUI
      breadcrumb={breadcrumb}
      kepalaKantor={kepalaKantor}
      pejabatList={pejabatList}
    />
  );
}
