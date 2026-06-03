"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { logInfo } from "@/lib/logger";

/**
 * RealtimeSync Component (Broadcast Version)
 * Listens for global broadcast signals from the Admin API.
 * When a "refresh" signal is received, it triggers router.refresh().
 */
export default function RealtimeSync() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let channel;
    try {
      // Subscribe to a global broadcast channel
      channel = supabase.channel("site-updates");

      channel
        .on("broadcast", { event: "refresh-content" }, (payload) => {
          logInfo("realtimesync_broadcast_received", { payload });
          // Trigger a soft refresh to pull latest data from Server Components
          router.refresh();
        })
        .subscribe((status, err) => {
          if (status === "SUBSCRIBED") {
            logInfo("realtimesync_listening");
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            // Diam-diam — koneksi Realtime tidak tersedia di dev lokal
            logInfo("realtimesync_unavailable", { status });
          }
        });
    } catch {
      // Abaikan error koneksi Realtime
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel).catch(() => {});
      }
    };
  }, [supabase, router]);

  return null;
}
