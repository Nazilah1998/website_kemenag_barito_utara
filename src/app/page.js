import PortalPage from "@/components/features/portal/PortalPage";
import { siteInfo } from "@/data/site";

export const metadata = {
  title: siteInfo.shortName,
  description: `Selamat datang di portal resmi ${siteInfo.name}. Akses cepat layanan keagamaan dan informasi publik Kabupaten Barito Utara.`,
  alternates: {
    canonical: siteInfo.siteUrl.replace(/\/$/, "") + "/",
  },
};

export default function Home() {
  return <PortalPage />;
}
