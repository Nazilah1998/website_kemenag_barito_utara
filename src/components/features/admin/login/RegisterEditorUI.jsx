import React from "react";
import { EyeIcon } from "./UpdatePasswordUI";

export const UNIT_KERJA_OPTIONS = [
  "Sub Bagian Tata Usaha",
  "Seksi Pendidikan Madrasah",
  "Seksi Pendidikan Agama Islam",
  "Seksi Pendidikan Diniyah & Pontren",
  "Seksi Bimas Islam",
  "Seksi Bimas Kristen & Katolik",
  "Penyelenggara Hindu",
  "Penyelenggara Zakat & Wakaf",
];

const inputClasses = "w-full rounded-2xl border-2 border-slate-50 bg-slate-50/50 px-5 py-3 text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-slate-900 focus:bg-white dark:border-white/5 dark:bg-white/5 dark:text-white dark:focus:border-white";
const labelClasses = "mb-1.5 block text-[9px] font-black uppercase tracking-[0.25em] text-slate-400";

export function RegisterInput({ label, type = "text", value, onChange, placeholder, required = true, autoComplete = "off" }) {
  return (
    <div>
      <label className={labelClasses}>{label}</label>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        autoComplete={autoComplete}
        className={inputClasses}
      />
    </div>
  );
}

export function RegisterSelect({ label, value, onChange, options, required = true }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="group relative" ref={containerRef}>
      <label className={labelClasses}>{label}</label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${inputClasses} flex items-center justify-between text-left ${isOpen ? "border-slate-900 bg-white" : ""}`}
      >
        <span className={!value ? "text-slate-300" : ""}>
          {value || `Pilih ${label}`}
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border-2 border-slate-900 bg-white shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 dark:bg-slate-900 dark:border-white">
          <div className="max-h-[240px] overflow-y-auto py-1 scrollbar-hide">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange({ target: { value: opt } });
                  setIsOpen(false);
                }}
                className={`flex w-full items-center px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${value === opt ? "bg-slate-900 text-white dark:bg-white dark:text-black" : "text-slate-600 dark:text-slate-300"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hidden input for form submission if needed */}
      <input type="hidden" value={value} required={required} />
    </div>
  );
}

export function RegisterPasswordInput({ value, onChange, show, onToggle, autoComplete = "new-password" }) {
  return (
    <div>
      <label className={labelClasses}>Password Akun</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"} value={value} onChange={onChange}
          placeholder="Minimal 8 karakter" required
          autoComplete={autoComplete}
          className={`${inputClasses} pr-14`}
        />
        <button
          type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 transition-all hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <EyeIcon isOpen={show} />
        </button>
      </div>
    </div>
  );
}
