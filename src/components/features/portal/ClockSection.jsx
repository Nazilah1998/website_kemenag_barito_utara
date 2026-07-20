"use client";

import React, { useState, useEffect } from "react";
import { Clock, CalendarDays, CheckCircle2, XCircle } from "lucide-react";

function getStatusFromTime(time) {
  const day = time.getDay();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const currentTime = hour * 100 + minute;

  let isOpen = false;
  if (day >= 1 && day <= 4) {
    if (currentTime >= 730 && currentTime <= 1600) isOpen = true;
  } else if (day === 5) {
    if (currentTime >= 730 && currentTime <= 1630) isOpen = true;
  }

  return isOpen;
}

function getTimezoneLabel() {
  const offset = -new Date().getTimezoneOffset();
  if (offset === 420) return "WIB";
  if (offset === 480) return "WITA";
  if (offset === 540) return "WIT";
  const hours = offset / 60;
  return `UTC${hours >= 0 ? "+" : ""}${hours}`;
}

export function DesktopClockSection() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) return null;

  const isOpen = getStatusFromTime(time);

  return (
    <div 
      suppressHydrationWarning 
      className="animate-fade-in flex items-center justify-between gap-6 bg-slate-900/60 backdrop-blur-xl px-6 py-3 rounded-2xl ring-1 ring-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-4 border-t border-white/5 overflow-hidden relative group"
    >
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

      <div className="flex items-center gap-5 relative z-10">
        <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-xl tracking-tight tabular-nums drop-shadow-md">
          <Clock className="w-5 h-5 opacity-90" strokeWidth={2.5} />
          {time.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
          <span className="text-xs font-bold text-slate-400 ml-1 mt-1">{getTimezoneLabel()}</span>
        </div>
        
        <div className="h-6 w-px bg-white/10"></div>
        
        <div className="flex items-center gap-2.5 text-slate-300 text-xs font-semibold uppercase tracking-widest">
          <CalendarDays className="w-4 h-4 text-slate-400" strokeWidth={2} />
          {time.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 relative z-10 bg-slate-950/40 py-2 px-5 rounded-xl ring-1 ring-white/5">
        <div
          className={`flex items-center gap-2 font-bold text-xs uppercase tracking-widest ${isOpen ? "text-emerald-400" : "text-rose-400"}`}
        >
          {isOpen ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
          ) : (
            <XCircle className="w-4 h-4 text-rose-500" strokeWidth={2.5} />
          )}
          {isOpen ? "Layanan Buka" : "Layanan Tutup"}
        </div>
        <div className="h-4 w-px bg-white/10"></div>
        <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">
          {time.getDay() === 5 ? "Jam Kerja: 07:30 - 16:30" : "Jam Kerja: 07:30 - 16:00"}
        </p>
      </div>
    </div>
  );
}

export function MobileClockSection() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) return null;

  const isOpen = getStatusFromTime(time);

  return (
    <div 
      suppressHydrationWarning 
      className="animate-fade-in flex flex-col bg-slate-900/60 backdrop-blur-xl rounded-2xl ring-1 ring-white/10 shadow-lg mb-4 w-full border-t border-white/5 overflow-hidden relative"
    >
      <div className="flex items-center justify-between p-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg tabular-nums">
          <Clock className="w-4 h-4 opacity-90" strokeWidth={2.5} />
          {time.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          <span className="text-[10px] font-bold text-slate-400">{getTimezoneLabel()}</span>
        </div>
        <div className={`flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg ${isOpen ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" : "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20"}`}>
          {isOpen ? (
            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
          ) : (
            <XCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
          )}
          {isOpen ? "Buka" : "Tutup"}
        </div>
      </div>
      <div className="flex items-center justify-between bg-slate-950/40 px-4 py-3">
        <div className="text-slate-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
          {time.toLocaleDateString("id-ID", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
        <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">
          {time.getDay() === 5 ? "07:30 - 16:30" : "07:30 - 16:00"}
        </p>
      </div>
    </div>
  );
}
