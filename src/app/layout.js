import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import AppShell from "@/components/AppShell";
import { siteInfo } from "@/data/site";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: `Website Resmi ${siteInfo.name}`,
  description: siteInfo.description,
  icons: {
    icon: "/kemenag.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
