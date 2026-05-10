import PortalPage from "@/components/features/portal/PortalPage";
import { siteInfo } from "@/data/site";

export const metadata = {
  title: `Portal Resmi | ${siteInfo.name}`,
  description: `Selamat datang di portal resmi ${siteInfo.name}. Akses cepat layanan keagamaan dan informasi publik Kabupaten Barito Utara.`,
};

export default function Home() {
  return <PortalPage />;
}
