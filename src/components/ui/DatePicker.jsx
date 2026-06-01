"use client";

import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { id } from "date-fns/locale";

function Chevron({ orientation, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className || "h-4 w-4"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d={
          orientation === "left"
            ? "M15 18l-6-6 6-6"
            : "M9 18l6-6-6-6"
        }
      />
    </svg>
  );
}

export default function DatePicker({ value, onChange, label, buttonClassName }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDate = value instanceof Date ? value : null;
  const displayText = selectedDate
    ? format(selectedDate, "d MMMM yyyy", { locale: id })
    : "";

  return (
    <div className="group" ref={ref}>
      {label && (
        <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white px-5 text-sm font-black text-slate-900 outline-none transition-all hover:border-slate-300 focus:border-slate-900 dark:border-white/5 dark:bg-slate-800/50 dark:text-white dark:hover:border-white/20 dark:focus:border-white ${buttonClassName || "h-14"}`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        <span className={selectedDate ? "" : "text-slate-400"}>
          {displayText || "Pilih tanggal..."}
        </span>
      </button>

      {open && (
        <div className="relative z-50 mt-2">
          <div className="absolute left-0 top-0 w-full min-w-[288px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  onChange(date);
                  setOpen(false);
                }
              }}
              locale={id}
              startMonth={new Date(2020, 0)}
              endMonth={new Date(2030, 11)}
              components={{ Chevron }}
              className="!m-0"
              classNames={{
                root: "w-full relative",
                months: "",
                month: "w-full",
                month_caption: "flex items-center justify-center h-10",
                caption_label: "text-sm font-bold text-slate-900 dark:text-white select-none",
                nav: "absolute top-0 flex w-full justify-between items-center h-10 pointer-events-none",
                button_previous: "pointer-events-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white disabled:opacity-30 disabled:cursor-default",
                button_next: "pointer-events-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white disabled:opacity-30 disabled:cursor-default",
                chevron: "h-4 w-4",
                month_grid: "w-full mt-2",
                weekdays: "grid grid-cols-7 mb-1",
                weekday: "text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 h-8 flex items-center justify-center",
                week: "grid grid-cols-7",
                day: "flex h-10 w-full items-center justify-center rounded-lg text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
                day_button: "h-full w-full rounded-lg cursor-pointer",
                selected: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100",
                today: "font-extrabold text-emerald-700 dark:text-emerald-400",
                outside: "text-slate-300 dark:text-slate-600",
                disabled: "text-slate-200 dark:text-slate-700",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
