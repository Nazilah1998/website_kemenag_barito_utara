import fs from "fs";
import path from "path";
import { Inter } from "next/font/google";
import "./tailwind.css";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import AppShell from "@/components/layout/AppShell";

import { siteInfo } from "@/data/site";
import Script from "next/script";
import dynamic from "next/dynamic";
import {
  organizationSchema,
  websiteSchema,
  navigationSchema,
} from "@/lib/structured-data";

const VercelAnalytics = dynamic(
  () => import("@/components/layout/VercelAnalytics"),
);
const VercelSpeedInsights = dynamic(
  () => import("@/components/layout/VercelSpeedInsights"),
);
const PwaRegister = dynamic(() => import("@/components/layout/PwaRegister"));
const ChatWidget = dynamic(
  () => import("@/components/features/chat/ChatWidget"),
);
const RealtimeSync = dynamic(() => import("@/components/common/RealtimeSync"));
import JsonLd from "@/components/features/seo/JsonLd";

const inter = Inter({ subsets: ["latin"] });

let criticalCss = "";
try {
  criticalCss = fs.readFileSync(
    path.join(process.cwd(), "src/app/critical.css"),
    "utf-8",
  );
} catch {
  // Fallback: ignore, page will still render without inline CSS
}

export const metadata = {
  metadataBase: new URL(siteInfo.siteUrl),
  title: {
    default: `${siteInfo.shortName}`,
    template: `%s | ${siteInfo.shortName}`,
  },
  description: siteInfo.description,
  keywords: [
    "Kemenag Barito Utara",
    "Kementerian Agama Barito Utara",
    "Kemenag Muara Teweh",
    "Layanan Kemenag Barito Utara",
    "Zakat Barito Utara",
    "Pendidikan Madrasah Barut",
    "PTSP Kemenag Barut",
  ],
  authors: [{ name: siteInfo.shortName }],
  creator: siteInfo.shortName,
  publisher: siteInfo.shortName,
  icons: {
    icon: [
      {
        url: "/assets/icons/kemenag-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/assets/icons/kemenag-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      { url: "/assets/branding/kemenag.svg", type: "image/svg+xml" },
    ],
    apple: [
      {
        url: "/assets/icons/kemenag-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
  verification: {
    google: "3ZH4iRGfl0Jurquu3gczAWNvE_-NQRDlEERr_ZDwJjA",
  },
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
    url: new URL("/", siteInfo.siteUrl).toString(),
    siteName: "Kemenag Barito Utara",
    title: `${siteInfo.name}`,
    description: siteInfo.description,
    images: [
      {
        url: "/assets/icons/kemenag-512.png",
        width: 512,
        height: 512,
        alt: siteInfo.shortName,
      },
      {
        url: "/assets/images/logo-share.png",
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
    images: ["/assets/images/logo-share.png"],
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
      <head>
        <link rel="preconnect" href={siteInfo.siteUrl} />
        {criticalCss && (
          <style
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: criticalCss }}
          />
        )}
        <Script
          id="theme-detection"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: "(function(){try{var e=\"site-theme\",t=document.documentElement,n=window.localStorage.getItem(e),r=n===\"light\"||n===\"dark\"?n:window.matchMedia(\"(prefers-color-scheme: dark)\").matches?\"dark\":\"light\";t.dataset.theme=r,r===\"dark\"?t.classList.add(\"dark\"):t.classList.remove(\"dark\"),t.style.colorScheme=r}catch(e){}})();",
          }}
        />
        <JsonLd
          data={[organizationSchema(), websiteSchema(), navigationSchema()]}
        />
      </head>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <AppShell>{children}</AppShell>
          <ChatWidget />
          <RealtimeSync />
        </Providers>

        <VercelAnalytics />
        <VercelSpeedInsights />
        <PwaRegister />
      </body>
    </html>
  );
}
