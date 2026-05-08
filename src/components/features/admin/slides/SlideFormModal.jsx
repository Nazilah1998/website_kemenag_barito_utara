import React from "react";
import Image from "next/image";
import { ToggleSwitch } from "./SlidesUI";

export function SlideFormModal({
  open, editingId, form, imagePreview,
  saving, uploadingImage,
  onClose, onChange, onFileChange, onSave,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose} />

      <div className="relative flex h-full max-h-[92vh] w-full max-w-4xl animate-in zoom-in slide-in-from-bottom-8 duration-500 flex-col overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-50 shadow-2xl dark:border-slate-800 dark:bg-slate-900">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5 dark:border-slate-800 dark:bg-slate-800/30">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/20 dark:bg-white dark:text-black dark:shadow-none">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Form Slider</p>
              <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                {editingId ? "Update Slide" : "Tambah Slide Baru"}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all hover:bg-rose-50 hover:text-rose-600 active:scale-90 dark:bg-slate-800 dark:hover:bg-rose-900/40"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid gap-8 p-8 lg:grid-cols-[1fr_320px]">

            {/* Main Form Area */}
            <div className="space-y-8">
              <div className="grid gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Judul Utama</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={onChange}
                    placeholder="Judul besar yang muncul di slide..."
                    className="mt-1.5 h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-base font-bold text-slate-900 outline-none transition-all focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Keterangan / Caption</label>
                  <textarea
                    name="caption"
                    value={form.caption}
                    onChange={onChange}
                    placeholder="Deskripsi singkat slide..."
                    rows={4}
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-white p-5 text-sm font-bold text-slate-900 outline-none transition-all focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:focus:border-white"
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Urutan Tampil</label>
                    <input
                      type="number"
                      name="sort_order"
                      value={form.sort_order}
                      onChange={onChange}
                      className="mt-1.5 h-12 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kategori / Seksi</label>
                    <select
                      name="category"
                      value={form.category || "utama"}
                      onChange={onChange}
                      className="mt-1.5 h-12 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-900 outline-none transition-all focus:border-slate-900 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:focus:border-white"
                    >
                      <option value="utama">Slider Utama (Tengah)</option>
                      <option value="kristen">Renungan Kristen</option>
                      <option value="katolik">Renungan Katolik</option>
                      <option value="islam">Mutiara Hikmah Islam</option>
                      <option value="hindu">Dharma Wacana Hindu</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-800/20 dark:shadow-none">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">File Gambar</label>
                </div>

                <label className="group relative flex h-40 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-slate-900 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-white">
                  <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                  <div className="flex flex-col items-center gap-1.5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M12 4v16m8-8H4" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {uploadingImage ? "Memproses..." : "Klik untuk Pilih Gambar"}
                    </span>
                    <span className="text-[9px] font-medium text-slate-400">JPG, PNG, WEBP (Maks 1MB)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Sidebar / Preview Area */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-800/20 dark:shadow-none">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Pengaturan</label>
                <div className="mt-4">
                  <ToggleSwitch
                    checked={Boolean(form.is_published)}
                    onChange={(val) => onChange({ target: { name: "is_published", type: "checkbox", checked: val } })}
                    label="PUBLIKASI"
                    description="Tampilkan slide di beranda."
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-800/20 dark:shadow-none">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Preview Tampilan (Portrait)</p>
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950/50">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-8 text-center text-[9px] font-black uppercase tracking-widest text-slate-300">
                      Belum ada gambar
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={onSave}
                  disabled={saving || uploadingImage}
                  className="flex h-14 w-full items-center justify-center rounded-2xl bg-slate-900 px-6 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:shadow-none"
                >
                  {saving ? "Menyimpan..." : "Simpan Slide"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-14 w-full items-center justify-center rounded-2xl border-2 border-slate-200 bg-white px-6 text-xs font-black uppercase tracking-widest text-slate-900 transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
