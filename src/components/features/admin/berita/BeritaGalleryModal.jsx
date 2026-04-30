import React from "react";
import { CoverThumb } from "./BeritaUI";

export function BeritaGalleryModal({
  open,
  form,
  previewSrc,
  sendingId,
  uploading,
  prefillLoading,
  isAlreadyInGallery,
  onClose,
  onChange,
  onFileChange,
  onClearImage,
  onSubmit,
  onDelete,
}) {
  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose} />

      <div className="relative flex h-full w-full max-w-4xl animate-in zoom-in-95 duration-500 flex-col overflow-hidden bg-slate-50 shadow-2xl sm:h-auto sm:max-h-[92vh] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 dark:bg-slate-900">

        {/* Header Section - Fixed */}
        <div className="shrink-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900/50 sm:px-8 sm:py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg dark:bg-white dark:text-black">
              <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                  {isAlreadyInGallery ? "Perbarui Galeri" : "Kirim ke Galeri"}
                </h3>
                {isAlreadyInGallery && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white">
                    Aktif
                  </span>
                )}
              </div>
              <p className="mt-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
                Optimize & Sync to Gallery
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/30"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Section - Scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Column: Inputs */}
            <div className="space-y-6 lg:col-span-7">
              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 italic mb-2 block">
                  Judul Galeri
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  placeholder="Masukkan judul untuk galeri..."
                  className="h-14 w-full rounded-2xl border-2 border-slate-50 bg-white px-5 text-sm font-black text-slate-900 outline-none transition-all focus:border-slate-900 dark:border-white/5 dark:bg-slate-800/50 dark:text-white dark:focus:border-white"
                />
              </div>

              <div className="group opacity-70">
                <label className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 italic mb-2 block">
                  Tautan Berita (Link URL)
                </label>
                <input
                  name="link_url"
                  value={form.link_url}
                  onChange={onChange}
                  placeholder="/berita/judul-slug"
                  className="h-14 w-full rounded-2xl border-2 border-slate-50 bg-slate-100 px-5 text-sm font-bold text-slate-500 outline-none dark:border-white/5 dark:bg-slate-800/20"
                  readOnly
                />
                <p className="text-[9px] font-bold text-slate-400 italic mt-2">Sinkronisasi otomatis dengan slug berita.</p>
              </div>

              <div className="group">
                <label className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 italic mb-2 block">
                  Tanggal Galeri
                </label>
                <input
                  type="datetime-local"
                  name="published_at"
                  value={form.published_at ? form.published_at.slice(0, 16) : ""}
                  onChange={onChange}
                  className="h-14 w-full rounded-2xl border-2 border-slate-50 bg-white px-5 text-sm font-black text-slate-900 outline-none transition-all focus:border-slate-900 dark:border-white/5 dark:bg-slate-800/50 dark:text-white dark:focus:border-white"
                />
              </div>
            </div>

            {/* Right Column: Image Upload */}
            <div className="lg:col-span-5">
              <div className="flex flex-col h-full space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 italic">
                    Visual Galeri (3:4)
                  </label>
                  {(form.image_url || form.gallery_upload_base64) && (
                    <button
                      type="button"
                      onClick={onClearImage}
                      className="text-[9px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600"
                    >
                      Hapus Foto
                    </button>
                  )}
                </div>

                <div className="flex-1 relative group">
                  <label className="flex h-full min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white p-6 text-center transition-all hover:border-slate-900 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-white">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onFileChange}
                    />

                    <div className="relative z-10">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-colors group-hover:bg-slate-900 group-hover:text-white dark:bg-slate-900 dark:group-hover:bg-white dark:group-hover:text-black shadow-sm">
                        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] italic text-slate-900 dark:text-white">
                        {uploading
                          ? "Memproses..."
                          : isAlreadyInGallery
                            ? "Ganti Visual"
                            : "Upload Foto"}
                      </p>
                      <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        Auto Compress Enabled
                      </p>
                    </div>

                    {previewSrc && (
                      <div className="absolute inset-0 z-0 p-3">
                        <CoverThumb
                          key={previewSrc || "gallery-empty"}
                          src={previewSrc}
                          alt="Preview"
                          className="h-full w-full rounded-[1.8rem] object-cover shadow-xl opacity-20 group-hover:opacity-40 transition-opacity"
                          fallbackText={prefillLoading ? "Memuat..." : ""}
                        />
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section - Fixed */}
        <div className="shrink-0 flex flex-col gap-4 border-t border-slate-200 bg-white px-6 py-6 dark:border-slate-800 dark:bg-slate-900/50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex justify-center sm:justify-start">
            {isAlreadyInGallery && (
              <button
                type="button"
                onClick={onDelete}
                disabled={Boolean(sendingId) || uploading || prefillLoading}
                className="h-12 w-full sm:w-auto rounded-xl bg-rose-50 px-6 text-[10px] font-black uppercase tracking-[0.2em] italic text-rose-600 transition-all hover:bg-rose-100 disabled:opacity-50 dark:bg-rose-950/20 dark:text-rose-400"
              >
                Hapus Konten
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-12 w-full sm:w-auto rounded-xl border-2 border-slate-50 px-8 text-[10px] font-black uppercase tracking-[0.2em] italic text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-white/5 dark:hover:bg-white/5 dark:hover:text-white"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={onSubmit}
              disabled={Boolean(sendingId) || uploading || prefillLoading}
              className="group relative flex h-12 w-full sm:w-auto items-center justify-center gap-3 overflow-hidden rounded-xl bg-slate-900 px-10 text-[10px] font-black uppercase tracking-[0.2em] italic text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-slate-100"
            >
              {sendingId ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black" />
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="4">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
              <span className="relative z-10">
                {sendingId
                  ? "Mengirim..."
                  : isAlreadyInGallery
                    ? "Update Galeri"
                    : "Simpan Galeri"}
              </span>
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
