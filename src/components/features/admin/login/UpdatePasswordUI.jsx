import React from "react";

export function EyeIcon({ isOpen = false }) {
  if (isOpen) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C7 19 2.73 16.11 1 12c.92-2.18 2.36-4.01 4.16-5.36" />
        <path d="M10.58 10.58A2 2 0 1 0 13.41 13.41" />
        <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c5 0 9.27 2.89 11 7a11.05 11.05 0 0 1-1.68 2.75" />
        <path d="M1 1l22 22" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function calculatePasswordStrength(password) {
  if (!password) return { level: 0, label: "", color: "bg-slate-200" };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { level: 1, label: "Lemah", color: "bg-rose-500" };
  if (score === 3) return { level: 2, label: "Sedang", color: "bg-amber-500" };
  if (score === 4) return { level: 3, label: "Kuat", color: "bg-emerald-500" };
  return { level: 4, label: "Sangat Kuat", color: "bg-emerald-700" };
}

export function PasswordInput({ label, value, onChange, show, onToggle, placeholder, showStrength = false }) {
  const strength = showStrength ? calculatePasswordStrength(value) : null;

  return (
    <div>
      <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"} value={value} onChange={onChange}
          placeholder={placeholder} required
          className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 py-3.5 text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 shadow-sm pr-12"
        />
        <button
          type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 hover:text-black"
        >
          <EyeIcon isOpen={show} />
        </button>
      </div>

      {showStrength && value && (
        <div className="mt-3 animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kekuatan Password</span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${
              strength.level === 1 ? 'text-rose-600' :
              strength.level === 2 ? 'text-amber-600' :
              strength.level === 3 ? 'text-emerald-600' :
              'text-emerald-700'
            }`}>{strength.label}</span>
          </div>
          <div className="flex gap-1.5 h-1.5 w-full">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-full w-full rounded-full transition-colors duration-300 ${
                  level <= strength.level ? strength.color : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
