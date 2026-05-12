import React from "react";
import StrukturOrganisasiUI from "@/components/features/informasi/StrukturOrganisasiUI";
import { leadershipProfiles } from "@/data/profile";

export const metadata = {
  title: "Struktur Organisasi - Kementerian Agama Kabupaten Barito Utara",
  description: "Bagan struktur organisasi dan profil pimpinan Kantor Kementerian Agama Kabupaten Barito Utara.",
};

export default function StrukturOrganisasiPage() {
  const breadcrumb = [
    { label: "Beranda", href: "/" },
    { label: "Informasi Publik", href: "/informasi" },
    { label: "Struktur Organisasi" },
  ];

  return (
    <StrukturOrganisasiUI 
      breadcrumb={breadcrumb}
      leadershipData={leadershipProfiles}
    />
  );
}
