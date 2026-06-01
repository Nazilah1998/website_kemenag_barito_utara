import React from "react";
import { inputClassName } from "./LoginUI";

export function LoginCaptcha({
  challenge,
  input,
  setInput,
  onRefresh
}) {

  return (
    <div className="group space-y-4 rounded-3xl border border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/30">
      <div className="flex items-center justify-between px-1">
        <label htmlFor="admin-captcha" className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Verifikasi Keamanan
        </label>
        <button
          type="button"
          onClick={onRefresh}
          className="text-[11px] font-bold text-emerald-700 transition-colors hover:text-emerald-700 dark:text-emerald-400"
        >
          Ganti Kode
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-white text-xl font-bold tracking-[0.4em] text-slate-900 shadow-sm ring-1 ring-slate-200 transition-transform group-hover:scale-[1.02] dark:bg-slate-950 dark:text-white dark:ring-slate-800">
          {challenge}
        </div>


        <div className="flex-[1.2]">
          <input
            id="admin-captcha"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            className={`${inputClassName()} text-center font-bold tracking-widest placeholder:font-medium placeholder:tracking-normal`}
            placeholder="Ketik kode..."
            autoComplete="off"
            maxLength={8}
            required
          />
        </div>
      </div>
    </div>
  );
}

