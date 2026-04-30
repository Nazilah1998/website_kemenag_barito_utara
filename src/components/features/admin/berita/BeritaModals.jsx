import React from "react";
import { IconTrashWarning, IconAlertCircle } from "./BeritaIcons";

export function DeleteConfirmModal({
  open,
  item,
  deleting,
  onClose,
  onConfirm,
}) {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

      <div className="relative w-full max-w-lg animate-in zoom-in slide-in-from-bottom-4 duration-300 overflow-hidden rounded-[2.5rem] border border-rose-100 bg-white shadow-2xl dark:border-rose-900/30 dark:bg-slate-900">
        <div className="flex items-start gap-5 px-8 py-8">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
            <IconTrashWarning />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Hapus Berita?
            </h3>
            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              Tindakan ini permanen dan tidak dapat dibatalkan.
            </p>
          </div>
        </div>

        <div className="px-8 pb-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Item Terpilih</span>
            <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-2">
              {item.title}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-8 py-8">
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-rose-600 px-6 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-rose-700 active:scale-95 disabled:opacity-50"
          >
            {deleting ? "Menghapus..." : "Ya, Hapus Permanen"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex h-14 w-full items-center justify-center rounded-2xl border-2 border-slate-100 bg-white px-6 text-sm font-black uppercase tracking-widest text-slate-900 transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
          >
            Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}

export function CloseFormConfirmModal({ open, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onCancel} />

      <div className="relative w-full max-w-md animate-in zoom-in slide-in-from-bottom-4 duration-300 overflow-hidden rounded-[2.5rem] border border-amber-100 bg-white shadow-2xl dark:border-amber-900/30 dark:bg-slate-900">
        <div className="flex flex-col items-center px-10 py-10 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
            <IconAlertCircle />
          </div>

          <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Tutup Form?
          </h3>
          <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
            Ada perubahan yang belum disimpan. Jika ditutup sekarang, perubahan Anda akan hilang.
          </p>

          <div className="mt-10 flex w-full flex-col gap-3">
            <button
              type="button"
              onClick={onConfirm}
              className="flex h-14 w-full items-center justify-center rounded-2xl bg-slate-900 px-6 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-slate-200"
            >
              Buang Perubahan
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="flex h-14 w-full items-center justify-center rounded-2xl border-2 border-slate-100 bg-white px-6 text-sm font-black uppercase tracking-widest text-slate-900 transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            >
              Lanjut Mengedit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
