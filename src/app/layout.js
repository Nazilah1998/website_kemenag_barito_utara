import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FloatingActions from "../components/FloatingActions";
import Providers from "../components/Providers";
import { siteInfo } from "../data/site";

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
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 antialiased transition-colors dark:bg-slate-950 dark:text-slate-100`}
      >
        <Providers>
          <a
            href="#main-content"
            className="sr-only absolute left-4 top-4 z-[100] rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white focus:not-sr-only"
          >
            Lewati ke konten utama
          </a>

          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>

          <FloatingActions />
        </Providers>
      </body>
    </html>
  );
}