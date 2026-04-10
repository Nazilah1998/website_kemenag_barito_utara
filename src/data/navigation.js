import { messages } from "./i18n";

export function getNavigationItems(locale = "id") {
  const nav = messages[locale]?.nav ?? messages.id.nav;

  return [
    {
      label: nav.home,
      href: "/",
    },
    {
      label: nav.profile,
      href: "/profil",
      children: [
        { label: nav.profileOverview, href: "/profil" },
        { label: nav.visionMission, href: "/profil/visi-misi" },
        { label: nav.workCulture, href: "/profil/nilai-budaya-kerja" },
        { label: nav.structure, href: "/profil/struktur-organisasi" },
        {
          label: nav.regencyHistory,
          href: "/profil/sejarah-singkat-kabupaten",
        },
        { label: nav.headProfile, href: "/profil/pimpinan" },
      ],
    },
    {
      label: nav.publicInfo,
      children: [
        { label: nav.news, href: "/berita" },
        { label: nav.announcements, href: "/pengumuman" },
        { label: nav.documents, href: "/dokumen" },
        { label: nav.agenda, href: "/agenda" },
        { label: nav.gallery, href: "/galeri" },
      ],
    },
    {
      label: nav.services,
      href: "/layanan",
      children: [
        { label: nav.allServices, href: "/layanan" },
        { label: nav.requirements, href: "/layanan/persyaratan" },
        { label: nav.flow, href: "/layanan/alur" },
        { label: nav.faq, href: "/layanan/faq" },
      ],
    },
    {
      label: nav.contact,
      href: "/kontak",
    },
  ];
}
