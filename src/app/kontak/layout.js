import JsonLd from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  contactPageSchema,
} from "@/lib/structured-data";
import { siteInfo } from "@/data/site";

const title = `Kontak Kami - ${siteInfo.shortName}`;
const description =
  "Kanal kontak resmi Kementerian Agama Kabupaten Barito Utara. Hubungi kami via WhatsApp, telepon, email, atau datang langsung ke kantor.";

export const metadata = {
  title: "Kontak Kami",
  description,
  alternates: { canonical: "/kontak" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/kontak",
    siteName: siteInfo.shortName,
    title,
    description,
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function KontakLayout({ children }) {
  return (
    <>
      <JsonLd
        data={[
          contactPageSchema(),
          breadcrumbSchema([
            { name: "Beranda", url: "/" },
            { name: "Kontak", url: "/kontak" },
          ]),
        ]}
      />
      {children}
    </>
  );
}
