import React from "react";
import { IconTrashWarning, IconAlertCircle, IconLink, IconImage } from "./BeritaIcons";
import DatePicker from "@/components/ui/DatePicker";
import { format } from "date-fns";
import { id } from "date-fns/locale";

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

export function LinkPromptModal({ open, onClose, onSubmit }) {
  const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setUrl("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

      <div className="relative w-full max-w-md animate-in zoom-in slide-in-from-bottom-4 duration-300 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col items-center px-8 py-8 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
            <IconLink className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Sisipkan Tautan
          </h3>
          <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            Masukkan URL lengkap (misal: https://google.com).
          </p>

          <div className="mt-6 w-full">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://"
              onKeyDown={(e) => {
                if (e.key === "Enter") onSubmit(url);
              }}
              autoFocus
              className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500"
            />
          </div>

          <div className="mt-8 flex w-full gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex h-14 flex-1 items-center justify-center rounded-2xl border-2 border-slate-100 bg-white px-6 text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-900 transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => onSubmit(url)}
              className="flex h-14 flex-1 items-center justify-center rounded-2xl bg-blue-600 px-6 text-[10px] sm:text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-blue-700 active:scale-95"
            >
              Simpan Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ImagePromptModal({ open, onClose, onSubmit, isUploading, initialData }) {
  const fileInputRef = React.useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [caption, setCaption] = React.useState("");
  const [date, setDate] = React.useState(null);
  const [previewUrl, setPreviewUrl] = React.useState(null);

  // Generate and cleanup object URL for preview
  React.useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (initialData?.url) {
      setPreviewUrl(initialData.url);
    } else {
      setPreviewUrl(null);
    }
  }, [file, initialData?.url]);

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (open) {
      setFile(null);
      setCaption(initialData?.caption || "");
      setDate(initialData?.rawDate ? new Date(initialData.rawDate) : null);
      setIsDragging(false);
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
    }
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
    }
    e.target.value = "";
  };

  const handleSubmit = () => {
    if (file || initialData) {
      const formattedDate = date ? format(date, "EEEE (d/M/yyyy)", { locale: id }) : "";
      const rawDateStr = date ? date.toISOString() : "";
      onSubmit(file, caption, formattedDate, rawDateStr);
    }
  };

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={!isUploading ? onClose : undefined} />

      <div className="relative w-full max-w-2xl animate-in zoom-in slide-in-from-bottom-4 duration-300 rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col items-center px-8 py-8 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
            <IconImage className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Sisipkan Gambar
          </h3>
          <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            Pilih gambar dan tambahkan keterangannya.
          </p>

          <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Kolom Kiri: Input Keterangan & Tanggal */}
            <div className="flex flex-col space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Keterangan Foto</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Misal: Wakil Menteri Agama memimpin rapat..."
                  disabled={isUploading}
                  className="mt-1.5 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-slate-900 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:focus:border-white disabled:opacity-50"
                />
              </div>

              <div className="relative z-50">
                <DatePicker
                  value={date}
                  onChange={setDate}
                  label="Keterangan Waktu (Opsional)"
                  formatStr="EEEE, d MMMM yyyy"
                  buttonClassName="!h-12 !border-slate-200 !text-slate-900 font-medium !bg-white dark:!bg-slate-800/50 dark:!border-slate-800 dark:!text-white"
                />
              </div>
            </div>

            {/* Kolom Kanan: Dropzone Gambar */}
            <div className="flex flex-col">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1.5">File Gambar</label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`group relative flex flex-1 min-h-[140px] cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed transition-all overflow-hidden ${
                  isUploading ? "opacity-50 cursor-wait border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900" :
                  isDragging
                    ? "border-emerald-500 bg-emerald-500/10 scale-[1.02]"
                    : "border-slate-200 bg-slate-50 hover:border-slate-900 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-white"
                }`}
              >
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleChange} disabled={isUploading} />
                
                {previewUrl ? (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Preview" className="h-24 w-auto rounded-lg object-contain shadow-sm drop-shadow-md" />
                    <span className="max-w-[90%] truncate text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                      {file?.name || initialData?.filename || "Gambar Sisipan"}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-slate-400 transition-colors group-hover:text-slate-900 dark:group-hover:text-white">
                    <IconImage className="h-6 w-6" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                      {isUploading ? "Mengunggah..." : "Pilih Gambar"}
                    </span>
                    {!isUploading && (
                      <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Tarik & lepas atau klik</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex w-full gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="flex h-14 flex-1 items-center justify-center rounded-2xl border-2 border-slate-100 bg-white px-6 text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-900 transition-all hover:bg-slate-50 active:scale-95 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isUploading || (!file && !initialData)}
              className="flex h-14 flex-1 items-center justify-center rounded-2xl bg-emerald-600 px-6 text-[10px] sm:text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
            >
              {isUploading ? "Memproses..." : "Sisipkan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
