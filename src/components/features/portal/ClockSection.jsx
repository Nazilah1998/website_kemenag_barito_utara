"use client";

import React, { useState, useEffect } from "react";

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

function ClockIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" strokeWidth={2} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
    </svg>
  );
}

function CalendarIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={2} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M8 2v4M16 2v4" />
    </svg>
  );
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
    <div suppressHydrationWarning className="animate-fade-in flex items-center gap-4 bg-white/5 backdrop-blur-xl px-5 py-1.5 rounded-full ring-1 ring-white/10 shadow-2xl mb-2">
      <div className="flex items-center gap-3 border-r border-white/10 pr-6">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg tabular-nums">
          <ClockIcon className="w-5 h-5" />
          {time.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          <span className="text-[10px] font-bold text-slate-400 ml-1">{getTimezoneLabel()}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-medium uppercase tracking-widest">
          <CalendarIcon className="w-3.5 h-3.5" />
          {time.toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={`flex items-center gap-2 font-bold text-xs uppercase tracking-widest ${isOpen ? "text-emerald-400" : "text-rose-400"}`}
        >
          <div
            className={`w-2 h-2 rounded-full motion-safe:animate-pulse ${isOpen ? "bg-emerald-400" : "bg-rose-400"}`}
          />
          {isOpen ? "Layanan Buka" : "Layanan Tutup"}
        </div>
        <p className="text-slate-500 text-[10px] font-medium border-l border-white/10 pl-4">
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
    <div suppressHydrationWarning className="animate-fade-in flex flex-col items-center bg-white/5 backdrop-blur-lg px-4 py-2 rounded-2xl ring-1 ring-white/10 mb-3 w-full">
      <div className="flex items-center justify-between w-full border-b border-white/5 pb-2 mb-2">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm tabular-nums">
          <ClockIcon className="w-3.5 h-3.5" />
          {time.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          <span className="text-[8px] font-bold text-slate-400 ml-0.5">{getTimezoneLabel()}</span>
        </div>
        <div
          className={`flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider ${isOpen ? "text-emerald-400" : "text-rose-400"}`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full motion-safe:animate-pulse ${isOpen ? "bg-emerald-400" : "bg-rose-400"}`}
          />
          {isOpen ? "Layanan Buka" : "Layanan Tutup"}
        </div>
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="text-slate-400 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
          <CalendarIcon className="w-3 h-3" />
          {time.toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
        </div>
        <p className="text-slate-500 text-[9px] font-bold uppercase tracking-tighter">
          {time.getDay() === 5 ? "07:30 - 16:30" : "07:30 - 16:00"}
        </p>
      </div>
    </div>
  );
}
