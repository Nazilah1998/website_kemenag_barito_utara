"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

/**
 * Kirim GA4 pageview secara manual pada setiap navigasi.
 * Diperlukan karena @next/third-parties/google mengirim pageview pertama,
 * tetapi navigasi SPA (soft navigation) butuh trigger manual.
 */
function GAPageviewTracker({ gaId }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!gaId || typeof window === "undefined" || typeof window.gtag !== "function") return;

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

    window.gtag("config", gaId, {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams, gaId]);

  return null;
}

/**
 * Wrapper dengan Suspense diperlukan karena useSearchParams()
 * harus dibungkus Suspense di Next.js App Router.
 */
export default function GAPageviewTrackerWrapper({ gaId }) {
  if (!gaId) return null;
  return (
    <Suspense fallback={null}>
      <GAPageviewTracker gaId={gaId} />
    </Suspense>
  );
}
