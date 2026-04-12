import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import AppShell from "@/components/AppShell";
import { siteInfo } from "@/data/site";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL(siteInfo.siteUrl),
  title: {
    default: `${siteInfo.name}`,
    template: `%s | ${siteInfo.shortName}`,
  },
  description: siteInfo.description,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/kemenag.svg",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: siteInfo.shortName,
    title: `${siteInfo.name}`,
    description: siteInfo.description,
    images: [
      {
        url: "/kemenag.svg",
        alt: siteInfo.shortName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteInfo.name}`,
    description: siteInfo.description,
    images: ["/kemenag.svg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.className}>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
