"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

let browserClient;

export function createClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      env.supabaseUrl,
      env.supabasePublishableKey
    );
  }

  return browserClient;
}
