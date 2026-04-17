"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AppShell({ children }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith("/admin");

    if (isAdminRoute) {
        return <main id="konten-utama" className="bg-slate-100">{children}</main>;
    }

    return (
        <>
            <a
                href="#konten-utama"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-emerald-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-emerald-300"
            >
                Lewati ke konten utama
            </a>
            <Header />
            <main id="konten-utama" tabIndex="-1" className="min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    );
}