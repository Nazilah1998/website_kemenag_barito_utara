"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PageViewTracker() {
  const pathname = usePathname();
  const lastTracked = useRef("");
  const timerRef = useRef(null);

  // ── 1. Track every page view ─────────────────────────────────
  useEffect(() => {
    if (pathname === lastTracked.current) return;

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      lastTracked.current = pathname;
      try {
        await fetch("/api/visitors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: pathname }),
        });
      } catch { /* silent */ }
    }, 1500);

    return () => clearTimeout(timerRef.current);
  }, [pathname]);

  // ── 2. Supabase Presence — "Sedang Online" (global, not just portal) ──
  useEffect(() => {
    const supabase = createClient();
    const presenceId = crypto.randomUUID();

    // Pastikan tidak ada channel sisa dari mount sebelumnya (efek Strict Mode)
    const existing = supabase.getChannels().find(c => c.topic === "realtime:online_visitors");
    if (existing) {
      supabase.removeChannel(existing);
    }

    const channel = supabase.channel("online_visitors", {
      config: { presence: { key: presenceId } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        // dispatch custom event so VisitorStats can read it
        const count = Object.keys(channel.presenceState()).length;
        window.dispatchEvent(
          new CustomEvent("online-visitors-change", {
            detail: { count: count > 0 ? count : 1 },
          })
        );
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, []);

  return null;
}
