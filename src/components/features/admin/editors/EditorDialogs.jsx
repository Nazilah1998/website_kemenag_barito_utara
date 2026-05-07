import React from "react";
import { Button } from "./EditorUI";

export function EditorConfirmDialog({ dialog, onClose }) {
  if (!dialog) return null;

  const toneMap = {
    rose: "danger",
    blue: "primary",
    emerald: "success",
  };

  const confirmTone = toneMap[dialog.confirmTone] || "success";

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

      <div className="relative w-full max-w-sm animate-in zoom-in slide-in-from-bottom-8 duration-300 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col items-center text-center">
          <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full shadow-xl transition-all ${confirmTone === "danger"
            ? "bg-rose-50 text-rose-500 shadow-rose-500/10 dark:bg-rose-950/20"
            : "bg-emerald-50 text-emerald-500 shadow-emerald-500/10 dark:bg-emerald-950/20"
            }`}>
            <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">{dialog.title}</h3>
          <p className="mt-4 text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
            {dialog.description}
          </p>

          <div className="mt-10 flex w-full flex-col gap-3">
            <Button
              tone={confirmTone}
              className="w-full h-14"
              onClick={() => {
                const fn = dialog.onConfirm;
                onClose();
                if (typeof fn === "function") fn();
              }}
            >
              {dialog.confirmLabel}
            </Button>
            <Button
              tone="ghost"
              className="w-full h-14"
              onClick={onClose}
            >
              Batalkan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EditorToast({ toast }) {
  if (!toast) return null;

  const isError = toast.type === "error";
  const title = isError ? "Terjadi kendala" : "Berhasil";

  return (
    <div className="pointer-events-none fixed right-3 top-24 z-[400] flex w-[min(92vw,380px)] flex-col items-end gap-3 sm:right-6">
      <div
        className={`pointer-events-auto w-full overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-xl animate-in slide-in-from-right-8 duration-500 ${isError
          ? "border-rose-100 bg-white/95 text-rose-700 dark:border-rose-900/70 dark:bg-slate-900/95 dark:text-rose-300"
          : "border-emerald-100 bg-white/95 text-emerald-700 dark:border-emerald-900/70 dark:bg-slate-900/95 dark:text-emerald-300"
          }`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-4 px-6 py-5">
          <div className="min-w-0 flex-1">
            <p className="text-base font-black tracking-tight uppercase">{title}</p>
            <p className="mt-1 text-sm font-medium leading-relaxed opacity-70">
              {toast.text}
            </p>
          </div>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${isError ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"}`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="4">
              <path d={isError ? "M6 18L18 6M6 6l12 12" : "M5 13l4 4L19 7"} />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
