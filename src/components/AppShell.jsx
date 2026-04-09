"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import AccessibilityWidget from "@/components/AccessibilityWidget";

export default function AppShell({ children }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith("/admin");

    if (isAdminRoute) {
        return <main className="bg-slate-100">{children}</main>;
    }

    return (
        <>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <FloatingActions />
            <AccessibilityWidget />
        </>
    );
}