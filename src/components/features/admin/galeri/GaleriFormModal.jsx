import React, { useRef } from "react";
import Image from "next/image";
import DatePicker from "@/components/ui/DatePicker";

export function GaleriFormModal({
  open,
  editingId,
  form,
  imagePreview,
  saving,
  uploadingImage,
  isDraggingImage,
  onClose,
  onChange,
  onFileChange,
  onImageDragOver,
  onImageDragLeave,
  onImageDrop,
  onSave,
}) {
  const fileInputRef = useRef(null);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-500" />

      <div className="relative w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden rounded-3xl sm:rounded-[2.5rem] border border-slate-200 bg-slate-50 shadow-2xl animate-in zoom-in-95 duration-500 dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-8 sm:py-6 dark:border-slate-800 dark:bg-slate-900/50">
          <div>
            <h3 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
              {editingId ? "Perbarui Visual" : "Tambah Visual"}
            </h3>
            <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Manajemen Galeri Mandiri
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all dark:bg-slate-800"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1">
          <div className="grid gap-5 sm:gap-8 sm:grid-cols-2">
            {/* Left: Date */}
            <div className="space-y-5 sm:space-y-6">
              <DatePicker
                label="Tanggal Galeri"
                value={form.published_at}
                onChange={(date) =>
                  onChange({ target: { name: "published_at", value: date } })
                }
              />

              <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/20">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-emerald-100 p-1 text-emerald-700 dark:bg-emerald-900/40">
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
              <div
                onDragOver={onImageDragOver}
                onDragLeave={onImageDragLeave}
                onDrop={onImageDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex aspect-[3/4] w-full sm:w-auto mx-auto max-w-[220px] sm:max-w-none cursor-pointer flex-col items-center justify-center overflow-hidden border-2 border-dashed p-6 transition-all ${
                  isDraggingImage
                    ? "border-emerald-500 bg-emerald-500/10 scale-[1.02]"
                    : "border-slate-200 bg-white hover:border-slate-900 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-white"
                }`}
              >
                <input type="file" ref={fileInputRef} accept="image/*" multiple={!editingId} className="hidden" onChange={onFileChange} />

                {imagePreview && imagePreview.length > 0 ? (
                  <>
                    <Image
                      src={imagePreview[0]}
                      alt="Preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover transition-opacity group-hover:opacity-75"
                    />
                    {imagePreview.length > 1 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity group-hover:bg-slate-900/70">
                         <div className="flex flex-col items-center">
                           <span className="text-white text-3xl font-black">+{imagePreview.length - 1}</span>
                           <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-1">Foto Lainnya</span>
                         </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-slate-900">
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Upload Foto</p>
                    <p className="mt-1 text-[8px] font-bold uppercase tracking-widest text-slate-400">Tarik & lepas atau klik untuk pilih</p>
                    {!editingId && (
                      <p className="mt-2 text-[8px] font-bold uppercase tracking-widest text-emerald-500">Bisa pilih banyak foto sekaligus</p>
                    )}
                  </div>
                )}

                {uploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 dark:border-slate-800 dark:border-t-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:px-8 sm:py-6 dark:border-slate-800 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="h-10 sm:h-12 rounded-xl border-2 border-slate-50 px-5 sm:px-8 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all dark:border-white/5 dark:hover:bg-white/5"
          >
            Batal
          </button>
          <button
            onClick={onSave}
            disabled={saving || uploadingImage}
            className="group relative flex h-10 sm:h-14 items-center gap-2 sm:gap-3 overflow-hidden rounded-xl sm:rounded-2xl bg-slate-900 px-6 sm:px-10 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-900/20 transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900 dark:shadow-none"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
            
            <div className="relative flex items-center gap-3">
              {saving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900" />
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="4">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
              <span>{saving ? "Sedang Menyimpan..." : (imagePreview?.length > 1 ? `Simpan ${imagePreview.length} Visual` : "Simpan Konten")}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
