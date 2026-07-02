"use client";

import React, { useState, useEffect } from "react";

// ID untuk Kabupaten Barito Utara
const KOTA_ID = "2203";

const PRAYERS = [
  { id: "imsak", label: "Imsak", icon: "🌙" },
  { id: "subuh", label: "Subuh", icon: "🕌" },
  { id: "terbit", label: "Terbit", icon: "🌅" },
  { id: "dhuha", label: "Dhuha", icon: "☀️" },
  { id: "dzuhur", label: "Dzuhur", icon: "🌞" },
  { id: "ashar", label: "Ashar", icon: "🌤️" },
  { id: "maghrib", label: "Maghrib", icon: "🌇" },
  { id: "isya", label: "Isya", icon: "🌃" },
];

export default function PrayerScheduleWidget() {
  const [schedule, setSchedule] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const date = String(d.getDate()).padStart(2, "0");

        const res = await fetch("/api/sholat");
        const data = await res.json();
        
        if (data && data.status && data.data && data.data.jadwal) {
          setSchedule(data.data.jadwal);
        }
      } catch (error) {
        console.error("Gagal mengambil jadwal sholat:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  useEffect(() => {
    if (!schedule) return;

    // Run interval to find next prayer time
    const checkNextPrayer = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTotalMinutes = currentHours * 60 + currentMinutes;

      let next = null;

      for (const prayer of PRAYERS) {
        const timeStr = schedule[prayer.id];
        if (timeStr) {
          const [h, m] = timeStr.split(":");
          const prayerTotalMinutes = parseInt(h, 10) * 60 + parseInt(m, 10);
          
          if (prayerTotalMinutes > currentTotalMinutes) {
            next = prayer.id;
            break;
          }
        }
      }

      // Jika sudah melewati isya, next prayer adalah imsak hari berikutnya
      if (!next) {
        next = "imsak";
      }

      setNextPrayer(next);
    };

    checkNextPrayer();
    const interval = setInterval(checkNextPrayer, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [schedule]);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-4 mb-2 md:mt-6 md:mb-4 px-4 lg:px-0 animate-pulse">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl h-[104px] w-full"></div>
      </div>
    );
  }

  if (!schedule) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mt-4 mb-2 md:mt-6 md:mb-4 animate-fade-in px-4 lg:px-0">
      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-3 md:p-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
          
          {/* Header Title */}
          <div className="flex items-center gap-3 shrink-0 border-b md:border-b-0 md:border-r border-slate-700/50 pb-2 md:pb-0 md:pr-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-slate-200">Jadwal Sholat</h3>
              <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider">Barito Utara</p>
            </div>
          </div>

          {/* Schedule Row */}
          <div className="flex flex-row overflow-x-auto hide-scrollbar gap-2 md:gap-3 flex-1 pb-1 md:pb-0">
            {PRAYERS.map((prayer) => {
              const time = schedule[prayer.id];
              const isNext = nextPrayer === prayer.id;
              const isHiddenOnMobile = ["imsak", "terbit", "dhuha"].includes(prayer.id);
              
              return (
                <div 
                  key={prayer.id}
                  className={`${
                    isHiddenOnMobile ? "hidden md:flex" : "flex"
                  } flex-col items-center justify-center p-2 rounded-xl min-w-[60px] md:min-w-[70px] flex-1 shrink-0 transition-all duration-300 ${
                    isNext 
                      ? "bg-emerald-500/20 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]" 
                      : "bg-slate-900/50 border border-slate-700/30 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="text-sm md:text-base mb-1">{prayer.icon}</span>
                  <span className={`text-[9px] md:text-[10px] font-medium uppercase tracking-wider mb-0.5 ${isNext ? "text-emerald-300" : "text-slate-400"}`}>
                    {prayer.label}
                  </span>
                  <span className={`text-xs md:text-sm font-bold ${isNext ? "text-emerald-400" : "text-slate-200"}`}>
                    {time || "-"}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </div>
      
      {/* CSS untuk menyembunyikan scrollbar tapi tetap bisa di-scroll */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
