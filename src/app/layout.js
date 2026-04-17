import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import AppShell from "@/components/AppShell";
import ThemeInitializer from "@/components/ThemeInitializer";
import { siteInfo } from "@/data/site";
import VercelAnalytics from "@/components/VercelAnalytics";
import VercelSpeedInsights from "@/components/VercelSpeedInsights";
import PwaRegister from "@/components/PwaRegister";
import JsonLd from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";

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
    <html lang="id" suppressHydrationWarning>
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
