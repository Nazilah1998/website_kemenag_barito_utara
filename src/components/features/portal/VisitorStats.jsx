"use client";

import React, { useEffect, useState, useRef } from "react";

export default function VisitorStats() {
  const [onlineCount, setOnlineCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isFetchingRef.current) return;

    let isSubscribed = true;

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/visitors", { cache: "no-store", next: { revalidate: 0 } });
        const data = await res.json();
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

    isFetchingRef.current = true;
    fetchStats();

    const intervalId = setInterval(() => {
      if (isSubscribed) fetchStats();
    }, 30000);

    // ── Listen online count dari PageViewTracker ─────────────────
    const handleOnlineChange = (e) => {
      if (!isSubscribed) return;
      setOnlineCount(e.detail.count);
    };
    window.addEventListener("online-visitors-change", handleOnlineChange);

    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
      window.removeEventListener("online-visitors-change", handleOnlineChange);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center mt-2 md:mt-6 py-2 md:py-4 animate-fade-in text-slate-300">
      <h3 className="text-[10px] md:text-sm font-semibold text-slate-400 mb-1 md:mb-2">
        Statistik Pengunjung :
      </h3>
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
          <span>Total :</span>
          {isLoading ? (
            <span className="text-fuchsia-400 font-medium animate-pulse">...</span>
          ) : (
            <span className="text-fuchsia-400 font-medium">{totalCount} Kunjungan</span>
          )}
        </div>
      </div>
    </div>
  );
}
