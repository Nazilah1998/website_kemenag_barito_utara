import React from "react";
import {
  ToolbarButton,
  ToggleSwitch,
  CoverThumb,
  ModernSelect
} from "./BeritaUI";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconH2,
  IconH3,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconJustify,
  IconQuote,
  IconBullet,
  IconNumber,
  IconLink,
  IconClear
} from "./BeritaIcons";
import { BERITA_CATEGORIES } from "@/lib/berita-utils";

export function BeritaFormModal({
  open,
  editingId,
  form,
  dirty,
  saving,
  uploadingCover,
  wordCount,
  readingTime,
  previewSlug,
  coverPreviewSrc,
  editorRef,
  onClose,
  onChange,
  onPublishedToggle,
  onEditorInput,
  onEditorPaste,
  onRunCommand,
  onInsertLink,
  onCoverChange,
  onClearCover,
  onSave,
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
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose} />

      <div className="relative flex h-full w-full max-w-7xl animate-in zoom-in slide-in-from-bottom-8 duration-500 flex-col overflow-hidden bg-slate-50 shadow-2xl sm:h-[92vh] sm:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 dark:bg-slate-900">

        {/* Header - Fixed */}
        <div className="shrink-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30 sm:px-8 sm:py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/20 dark:bg-white dark:text-black dark:shadow-none">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white sm:text-xl">
                {editingId ? "Update Berita" : "Buat Berita Baru"}
              </h3>
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${dirty ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  {dirty ? "Ada perubahan" : "Draft Tersimpan"}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-all hover:bg-rose-50 hover:text-rose-600 active:scale-90 dark:bg-slate-800 dark:hover:bg-rose-900/40"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto sm:overflow-hidden">
          <div className="flex flex-col sm:grid sm:h-full sm:grid-cols-1 xl:grid-cols-[1fr_360px]">

            {/* Left Column - Main Form & Editor */}
            <div className="flex flex-col border-r border-slate-100 dark:border-slate-800/50 sm:h-full sm:overflow-hidden">
              {/* Top Fields */}
              <div className="shrink-0 space-y-6 p-6 sm:p-8 sm:pb-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Judul Utama</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={onChange}
                    placeholder="Tulis judul berita..."
                    className="mt-1.5 h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-base font-bold text-slate-900 outline-none transition-all focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:focus:border-white"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="md:col-span-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Slug URL</label>
                    <input
                      name="slug"
                      value={form.slug}
                      onChange={onChange}
                      placeholder="slug-berita"
                      className="mt-1.5 h-12 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-900 outline-none transition-all focus:border-slate-900 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:focus:border-white"
                    />
                  </div>
                  <div>
                    <ModernSelect
                      label="Kategori"
                      name="category"
                      value={form.category}
                      options={BERITA_CATEGORIES}
                      onChange={onChange}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Publikasi</label>
                    <input
                      type="datetime-local"
                      name="published_at"
                      value={form.published_at}
                      onChange={onChange}
                      className="mt-1.5 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Editor Section */}
              <div className="flex flex-col p-6 pt-2 sm:p-8 sm:pt-4 sm:flex-1 sm:min-h-0 sm:overflow-hidden">
                <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-800/20 dark:shadow-none sm:h-full sm:overflow-hidden">
                  <div className="shrink-0 flex items-center justify-between px-1">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Isi Konten</h4>
                    <div className="flex items-center gap-3 rounded-full bg-slate-900 px-3 py-1.5 dark:bg-slate-800">
                      <span className="text-[9px] font-black uppercase text-white dark:text-slate-400">{wordCount} Kata</span>
                      <div className="h-2 w-[1px] bg-white/20 dark:bg-slate-600" />
                      <span className="text-[9px] font-black uppercase text-white/60 dark:text-slate-400">{readingTime} Min</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-wrap items-center gap-1 rounded-xl bg-slate-50 p-1 border border-slate-100 dark:bg-slate-800/50 dark:border-none">
                    <ToolbarButton title="Bold" onClick={() => onRunCommand("bold")}><IconBold /></ToolbarButton>
                    <ToolbarButton title="Italic" onClick={() => onRunCommand("italic")}><IconItalic /></ToolbarButton>
                    <ToolbarButton title="Underline" onClick={() => onRunCommand("underline")}><IconUnderline /></ToolbarButton>
                    <div className="mx-1 h-4 w-px bg-slate-200 dark:bg-slate-700" />
                    <ToolbarButton title="H2" onClick={() => onRunCommand("formatBlock", "h2")}><IconH2 /></ToolbarButton>
                    <ToolbarButton title="H3" onClick={() => onRunCommand("formatBlock", "h3")}><IconH3 /></ToolbarButton>
                    <div className="mx-1 h-4 w-px bg-slate-200 dark:bg-slate-700" />
                    <ToolbarButton title="L" onClick={() => onRunCommand("justifyLeft")}><IconAlignLeft /></ToolbarButton>
                    <ToolbarButton title="C" onClick={() => onRunCommand("justifyCenter")}><IconAlignCenter /></ToolbarButton>
                    <ToolbarButton title="R" onClick={() => onRunCommand("justifyRight")}><IconAlignRight /></ToolbarButton>
                    <ToolbarButton title="J" onClick={() => onRunCommand("justifyFull")}><IconJustify /></ToolbarButton>
                    <div className="mx-1 h-4 w-px bg-slate-200 dark:bg-slate-700" />
                    <ToolbarButton title="Quote" onClick={() => onRunCommand("formatBlock", "blockquote")}><IconQuote /></ToolbarButton>
                    <ToolbarButton title="Bullet" onClick={() => onRunCommand("insertUnorderedList")}><IconBullet /></ToolbarButton>
                    <ToolbarButton title="Link" onClick={onInsertLink}><IconLink /></ToolbarButton>
                  </div>

                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={onEditorInput}
                    onPaste={onEditorPaste}
                    className="min-h-[300px] sm:flex-1 overflow-y-auto custom-scrollbar rounded-xl border border-slate-100 bg-slate-50/30 px-6 py-5 text-sm leading-relaxed text-slate-700 outline-none focus:ring-4 focus:ring-slate-900/5 dark:border-slate-800/50 dark:bg-slate-900/40 dark:text-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="flex flex-col bg-slate-50/50 p-6 sm:p-8 dark:bg-slate-900/20 sm:h-full sm:overflow-y-auto custom-scrollbar">
              <div className="space-y-8">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-800/20 dark:shadow-none">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Status Tayang</label>
                  <div className="mt-4">
                    <ToggleSwitch
                      checked={form.is_published}
                      onChange={onPublishedToggle}
                      label={form.is_published ? "PUBLIK" : "DRAFT"}
                      description="Konten akan tampil jika diset Publik."
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-800/20 dark:shadow-none">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Gambar Utama</label>
                    {coverPreviewSrc && (
                      <button type="button" onClick={onClearCover} className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Hapus</button>
                    )}
                  </div>

                  <label className="group relative flex h-32 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-slate-900 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-white">
                    <input type="file" accept="image/*" className="hidden" onChange={onCoverChange} />
                    <div className="flex flex-col items-center gap-1.5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                      <span className="text-[9px] font-black uppercase tracking-widest">Pilih Gambar</span>
                    </div>
                  </label>

                  {coverPreviewSrc && (
                    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                      <CoverThumb src={coverPreviewSrc} alt="Preview" className="h-32 w-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-2 pb-10 sm:pb-0">
                  <button
                    type="button"
                    onClick={() => onSave(true)}
                    disabled={saving || uploadingCover}
                    className="flex h-14 w-full items-center justify-center rounded-2xl bg-slate-900 px-6 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:shadow-none"
                  >
                    {saving ? "Menyimpan..." : "Publish Berita"}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSave(false)}
                    disabled={saving || uploadingCover}
                    className="flex h-14 w-full items-center justify-center rounded-2xl border-2 border-slate-200 bg-white px-6 text-xs font-black uppercase tracking-widest text-slate-900 transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                  >
                    Simpan Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
