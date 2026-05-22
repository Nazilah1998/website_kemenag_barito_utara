import posthog from "posthog-js";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2026-01-01",
    capture_pageview: false, // Kita handle manual via PostHogPageView component
    capture_pageleave: true,
    capture_exceptions: true, // Aktifkan Error Tracking
  });
}
