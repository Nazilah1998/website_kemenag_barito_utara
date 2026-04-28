import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import AppShell from "@/components/layout/AppShell";
import ThemeInitializer from "@/components/layout/ThemeInitializer";
import { siteInfo } from "@/data/site";
import VercelAnalytics from "@/components/layout/VercelAnalytics";
import VercelSpeedInsights from "@/components/layout/VercelSpeedInsights";
import PwaRegister from "@/components/layout/PwaRegister";
import JsonLd from "@/components/features/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL(siteInfo.siteUrl),
  title: {
    default: `${siteInfo.name}`,
    template: `%s | ${siteInfo.shortName}`,
  },
  description: siteInfo.description,
  alternates: { canonical: "/" },
  icons: { icon: "/logo-share.png" },
  manifest: "/manifest.webmanifest",
  applicationName: siteInfo.shortName,
  appleWebApp: {
    capable: true,
    title: siteInfo.shortName,
    statusBarStyle: "default",
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
        url: "/logo-share.png",
        width: 512,
        height: 512,
        alt: siteInfo.shortName,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${siteInfo.name}`,
    description: siteInfo.description,
    images: ["/logo-share.png"],
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#059669" },
    { media: "(prefers-color-scheme: dark)", color: "#047857" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeInitializer />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />

        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>

        <VercelAnalytics />
        <VercelSpeedInsights />
        <PwaRegister />
      </body>
    </html>
  );
}
