"use client";

import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export default function VisitorStats() {
  const [onlineCount, setOnlineCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Use a ref to prevent strict mode double fetching
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isFetchingRef.current) return;
    
    let isSubscribed = true;

    // 1. Ambil data statistik dari server
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/visitors");
        const data = await res.json();
        // apiResponse returns data directly, not wrapped in { data: ... }
        if (data && isSubscribed) {
          setTodayCount(data.today || 0);
          setTotalCount(data.total || 0);
        }
      } catch (error) {
        console.error("Gagal memuat statistik:", error);
      } finally {
        if (isSubscribed) setIsLoading(false);
      }
    };
    
    // 2. Catat pengunjung jika belum dicatat sesi ini
    const trackVisitor = async () => {
      if (!sessionStorage.getItem("visitor_tracked")) {
        // Optimistically set to pending to prevent strict mode double-firing
        sessionStorage.setItem("visitor_tracked", "pending");
        try {
          await fetch("/api/visitors", { method: "POST" });
          sessionStorage.setItem("visitor_tracked", "true");
        } catch (error) {
          console.error("Gagal mencatat pengunjung:", error);
          sessionStorage.removeItem("visitor_tracked"); // Allow retry on failure
        }
      }
      
      // Always fetch stats after checking tracking
      fetchStats();
    };

    isFetchingRef.current = true;
    trackVisitor();

    // 3. Setup Supabase Realtime Presence untuk Sedang Online
    const supabase = createClient();
    
    // UUID unik untuk koneksi ini
    const presenceId = crypto.randomUUID();
    
    const channel = supabase.channel("online_visitors", {
      config: {
        presence: {
          key: presenceId,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        if (!isSubscribed) return;
        const state = channel.presenceState();
        // Hitung jumlah koneksi aktif
        const count = Object.keys(state).length;
        setOnlineCount(count > 0 ? count : 1);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      isSubscribed = false;
      // Properly untrack presence before leaving
      channel.untrack().then(() => {
        supabase.removeChannel(channel);
      });
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center mt-2 md:mt-6 py-2 md:py-4 animate-fade-in text-slate-300">
      <h3 className="text-[10px] md:text-sm font-semibold text-slate-400 mb-1 md:mb-2">Statistik Pengunjung :</h3>
      <div className="flex flex-wrap items-center justify-center gap-x-2 md:gap-x-4 gap-y-1 md:gap-y-2 text-[9px] sm:text-[10px] md:text-sm">
        <div className="flex items-center gap-1.5">
          <span>Sedang Online :</span>
          {isLoading ? (
            <span className="text-emerald-400 font-medium animate-pulse">...</span>
          ) : (
            <span className="text-emerald-400 font-medium">{onlineCount} Orang</span>
          )}
        </div>
        <span className="text-slate-600 hidden sm:inline">|</span>
        <div className="flex items-center gap-1.5">
          <span>Hari ini :</span>
          {isLoading ? (
            <span className="text-blue-400 font-medium animate-pulse">...</span>
          ) : (
            <span className="text-blue-400 font-medium">{todayCount} Orang</span>
          )}
        </div>
        <span className="text-slate-600 hidden sm:inline">|</span>
        <div className="flex items-center gap-1.5">
          <span>Total Kunjungan :</span>
          {isLoading ? (
            <span className="text-fuchsia-400 font-medium animate-pulse">...</span>
          ) : (
            <span className="text-fuchsia-400 font-medium">{totalCount} Orang</span>
          )}
        </div>
      </div>
    </div>
  );
}
