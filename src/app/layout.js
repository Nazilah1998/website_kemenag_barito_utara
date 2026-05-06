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
import {
  organizationSchema,
  websiteSchema,
  navigationSchema,
} from "@/lib/structured-data";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL(siteInfo.siteUrl),
  title: {
    default: `${siteInfo.name}`,
    template: `%s | ${siteInfo.shortName}`,
  },
  description: siteInfo.description,
  keywords: [
    "Kemenag Barito Utara",
    "Kementerian Agama Barito Utara",
    "Kemenag Muara Teweh",
    "Layanan Haji Barito Utara",
    "Zakat Barito Utara",
    "Pendidikan Madrasah Barut",
    "PTSP Kemenag Barut",
  ],
  authors: [{ name: siteInfo.shortName }],
  creator: siteInfo.shortName,
  publisher: siteInfo.shortName,
  icons: {
    icon: [
      { url: "/kemenag-192.png", sizes: "192x192", type: "image/png" },
      { url: "/kemenag-512.png", sizes: "512x512", type: "image/png" },
      { url: "/kemenag.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/kemenag-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  applicationName: "Kemenag Barito Utara",
  appleWebApp: {
    capable: true,
    title: siteInfo.shortName,
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "Kemenag Barito Utara",
    title: `${siteInfo.name}`,
    description: siteInfo.description,
    images: [
      {
        url: "/kemenag-512.png",
        width: 512,
        height: 512,
        alt: siteInfo.shortName,
      },
      {
        url: "/logo-share.png",
        width: 1200,
        height: 630,
        alt: siteInfo.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteInfo.name}`,
    description: siteInfo.description,
    images: ["/logo-share.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        <JsonLd
          data={[organizationSchema(), websiteSchema(), navigationSchema()]}
        />

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
