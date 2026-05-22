"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import posthog from "posthog-js";

/**
 * Component yang menangkap $pageview events pada setiap perubahan route.
 * Diperlukan karena navigasi client-side di App Router tidak memicu
 * full page load, sehingga PostHog tidak bisa track otomatis.
 */
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      const search = searchParams?.toString();
      if (search) {
        url += `?${search}`;
      }
      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * PostHog Provider wrapper.
 * Memasang PostHogPageView di dalam Suspense boundary untuk menghindari
 * masalah dengan useSearchParams() yang memerlukan Suspense di App Router.
 */
export default function PostHogProvider({ children }) {
  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </>
  );
}
