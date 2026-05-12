import React from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Download,
  FileText
} from "lucide-react";

export function PdfViewerToolbar({
  currentPage,
  numPages,
  isMobile,
  zoom,
  maxZoom,
  onGoToPage,
  onSetZoom,
  onDownload,
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-white/5 dark:bg-slate-800/30">
      {/* Page Info */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm dark:bg-slate-900">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Halaman</p>
          <p className="text-sm font-black text-slate-900 dark:text-white">
            {currentPage} <span className="font-medium text-slate-400">/</span> {numPages || "-"}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
          <ToolbarButton
            onClick={() => onGoToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            title="Halaman Sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </ToolbarButton>
          
          <div className="h-4 w-px bg-slate-100 mx-1 dark:bg-slate-800" />

          <ToolbarButton
            onClick={() => onGoToPage(currentPage + 1)}
            disabled={!numPages || currentPage >= numPages}
            title="Halaman Berikutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
          <ToolbarButton
            onClick={() => onSetZoom((z) => Math.max(0.6, Number((z - 0.1).toFixed(2))))}
            title="Perkecil"
          >
            <ZoomOut className="h-4 w-4" />
          </ToolbarButton>
          
          <div className="min-w-[50px] text-center text-xs font-black text-slate-700 dark:text-slate-300">
            {Math.round(zoom * 100)}%
          </div>

          <ToolbarButton
            onClick={() => onSetZoom((z) => Math.min(maxZoom, Number((z + 0.1).toFixed(2))))}
            title="Perbesar"
          >
            <ZoomIn className="h-4 w-4" />
          </ToolbarButton>

          <div className="h-4 w-px bg-slate-100 mx-1 dark:bg-slate-800" />

          <ToolbarButton 
            onClick={() => onSetZoom(1)}
            title="Reset Zoom"
          >
            <Maximize className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <button
          type="button"
          onClick={onDownload}
          className="group flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-900/20 active:scale-95"
        >
          <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
          <span className="hidden sm:inline">Download</span>
        </button>
      </div>
    </div>
  );
}

function ToolbarButton({ children, onClick, disabled, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-50 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
    >
      {children}
    </button>
  );
}
