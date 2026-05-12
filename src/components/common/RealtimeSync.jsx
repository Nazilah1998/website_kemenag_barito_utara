"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * RealtimeSync Component (Broadcast Version)
 * Listens for global broadcast signals from the Admin API.
 * When a "refresh" signal is received, it triggers router.refresh().
 */
export default function RealtimeSync() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Subscribe to a global broadcast channel
    const channel = supabase.channel("site-updates");

    channel
      .on("broadcast", { event: "refresh-content" }, (payload) => {
        console.log("[RealtimeSync] Broadcast signal received:", payload);
        // Trigger a soft refresh to pull latest data from Server Components
        router.refresh();
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("[RealtimeSync] Listening for site updates...");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return null;
}
