import React from "react";
import Image from "next/image";

export function GaleriFormModal({
  open,
  editingId,
  form,
  imagePreview,
  saving,
  uploadingImage,
  onClose,
  onChange,
  onFileChange,
  onSave,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose} />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-50 shadow-2xl animate-in zoom-in-95 duration-500 dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-8 py-6 dark:border-slate-800 dark:bg-slate-900/50">
          <div>
            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
              {editingId ? "Perbarui Visual" : "Tambah Visual"}
            </h3>
            <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Manajemen Galeri Mandiri
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all dark:bg-slate-800"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid gap-8 sm:grid-cols-2">
            {/* Left: Date */}
            <div className="space-y-6">
              <div className="group">
                <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                  Tanggal Galeri
                </label>
                <input
                  type="datetime-local"
                  name="published_at"
                  value={form.published_at ? form.published_at.slice(0, 16) : ""}
                  onChange={onChange}
                  className="h-14 w-full rounded-2xl border-2 border-slate-100 bg-white px-5 text-sm font-black text-slate-900 outline-none transition-all focus:border-slate-900 dark:border-white/5 dark:bg-slate-800/50 dark:text-white dark:focus:border-white"
                />
              </div>

              <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/20">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-emerald-100 p-1 text-emerald-600 dark:bg-emerald-900/40">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-bold leading-relaxed text-emerald-700 dark:text-emerald-400">
                    Visual ini akan tampil secara mandiri di halaman publik galeri tanpa terhubung ke berita manapun.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Upload */}
            <div className="group relative">
              <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                Visual (3:4)
              </label>
              <label className="relative flex aspect-[3/4] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[2rem] border-2 border-dashed border-slate-200 bg-white p-6 transition-all hover:border-slate-900 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-white">
                <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />

                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover transition-opacity group-hover:opacity-75"
                  />
                ) : (
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-slate-900">
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Upload Foto</p>
                  </div>
                )}

                {uploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 dark:border-slate-800 dark:border-t-white" />
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-8 py-6 dark:border-slate-800 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="h-12 rounded-xl border-2 border-slate-50 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all dark:border-white/5 dark:hover:bg-white/5"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            disabled={saving || uploadingImage}
            className="flex h-12 items-center gap-3 rounded-xl bg-slate-900 px-10 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-black disabled:opacity-50 dark:bg-white dark:text-black dark:shadow-none"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black" />
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="4">
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span>{saving ? "Menyimpan..." : "Simpan Konten"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
