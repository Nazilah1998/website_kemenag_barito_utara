"use client";

import React, { useState, useEffect } from "react";
import { Moon, CloudSun, Sunrise, Sun, SunMedium, Cloud, Sunset, MoonStar, Clock, MapPin } from "lucide-react";

const KOTA_ID = "2203"; // Barito Utara

const PRAYERS = [
  { id: "imsak", label: "Imsak", icon: Moon },
  { id: "subuh", label: "Subuh", icon: CloudSun },
  { id: "terbit", label: "Terbit", icon: Sunrise },
  { id: "dhuha", label: "Dhuha", icon: Sun },
  { id: "dzuhur", label: "Dzuhur", icon: SunMedium },
  { id: "ashar", label: "Ashar", icon: Cloud },
  { id: "maghrib", label: "Maghrib", icon: Sunset },
  { id: "isya", label: "Isya", icon: MoonStar },
];

export default function PrayerScheduleWidget() {
  const [schedule, setSchedule] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch("/api/sholat");
        const data = await res.json();
        
        if (data?.data?.jadwal) {
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

    const updateTimeAndNextPrayer = () => {
      const now = new Date();
      // Format current time HH:MM:SS
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));

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

      if (!next) {
        next = "imsak"; // If passed Isya, next is Imsak tomorrow
      }

      setNextPrayer(next);
    };

    updateTimeAndNextPrayer();
    const interval = setInterval(updateTimeAndNextPrayer, 1000); // Check every second for the clock

    return () => clearInterval(interval);
  }, [schedule]);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto mt-6 mb-4 px-4 lg:px-0 animate-pulse">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] h-[100px] w-full"></div>
      </div>
    );
  }

  if (!schedule) return null;

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 mb-4 animate-fade-in px-4 lg:px-0">
      <div className="bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2rem] p-5 sm:p-6 lg:p-5 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/4 w-1/2 h-full bg-emerald-500/5 blur-[100px] -z-10 rounded-full" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-8">
          
          {/* Header & Location */}
          <div className="flex items-center justify-between lg:justify-start gap-5 shrink-0 px-1">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-0.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Jadwal Sholat</h3>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
                <p className="text-xs font-semibold uppercase tracking-wider">Barito Utara</p>
              </div>
            </div>
            
            {/* Live Clock Divider & Clock for Mobile/Desktop */}
            <div className="flex lg:hidden flex-col items-end">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Waktu Lokal</span>
              <span className="text-base font-black text-emerald-400 tracking-tight">{currentTime || "--:--"}</span>
            </div>

            <div className="hidden lg:block w-px h-10 bg-white/10 mx-2" />
            
            <div className="hidden lg:flex flex-col">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-0.5">Waktu Lokal</span>
              <span className="text-xl font-black text-emerald-400 tracking-tight">{currentTime || "--:--"}</span>
            </div>
          </div>

          {/* Schedule Row */}
          <div className="flex flex-row overflow-x-auto hide-scrollbar gap-1.5 sm:gap-2 flex-1 pb-1 lg:pb-0">
            {PRAYERS.map((prayer) => {
              const time = schedule[prayer.id];
              const isNext = nextPrayer === prayer.id;
              const isHiddenOnMobile = ["imsak", "terbit", "dhuha"].includes(prayer.id);
              const Icon = prayer.icon;
              
              return (
                <div 
                  key={prayer.id}
                  className={`${
                    isHiddenOnMobile ? "hidden md:flex" : "flex"
                  } flex-col items-center justify-center py-2.5 px-1.5 sm:px-2 rounded-xl sm:rounded-2xl min-w-[56px] sm:min-w-[72px] flex-1 shrink-0 transition-all duration-500 group relative ${
                    isNext 
                      ? "bg-gradient-to-b from-emerald-500 to-emerald-700 shadow-[0_8px_16px_-6px_rgba(16,185,129,0.5)] border-transparent -translate-y-0.5 sm:-translate-y-1" 
                      : "bg-white/5 border border-white/5 hover:bg-white/10"
                  }`}
                >
                  {isNext && (
                    <span className="absolute -top-1 w-6 sm:w-8 h-1 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  )}
                  <Icon 
                    strokeWidth={isNext ? 2.5 : 2} 
                    className={`w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-2 transition-transform duration-300 group-hover:scale-110 ${isNext ? "text-white" : "text-emerald-500/80"}`} 
                  />
                  <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest mb-0.5 sm:mb-1 ${isNext ? "text-emerald-50" : "text-slate-400"}`}>
                    {prayer.label}
                  </span>
                  <span className={`text-xs sm:text-sm font-black ${isNext ? "text-white" : "text-slate-200"}`}>
                    {time || "-"}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </div>
      
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
