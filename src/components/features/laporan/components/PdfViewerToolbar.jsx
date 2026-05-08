import React from "react";

export function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

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
    <div className="flex flex-col gap-2 border-b border-slate-200 px-2 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-3 dark:border-slate-700">
      <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
        Halaman {currentPage} / {numPages || "-"}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {!isMobile && (
          <>
            <ToolbarButton
              onClick={() => onGoToPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Prev
            </ToolbarButton>
            <ToolbarButton
              onClick={() => onGoToPage(currentPage + 1)}
              disabled={!numPages || currentPage >= numPages}
            >
              Next
            </ToolbarButton>
          </>
        )}

        <ToolbarButton
          onClick={() => onSetZoom((z) => Math.max(0.6, Number((z - 0.1).toFixed(2))))}
        >
          Zoom -
        </ToolbarButton>
        
        <div className="min-w-[48px] text-center text-[11px] font-semibold text-slate-600 sm:min-w-[56px] sm:text-xs dark:text-slate-300">
          {Math.round(zoom * 100)}%
        </div>

        <ToolbarButton
          onClick={() => onSetZoom((z) => Math.min(maxZoom, Number((z + 0.1).toFixed(2))))}
        >
          Zoom +
        </ToolbarButton>

        <ToolbarButton onClick={() => onSetZoom(1)}>
          Fit
        </ToolbarButton>

        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-700 sm:px-3 sm:text-xs"
        >
          <DownloadIcon />
          Download
        </button>
      </div>
    </div>
  );
}

function ToolbarButton({ children, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-2.5 sm:text-xs dark:border-slate-600 dark:text-slate-200"
    >
      {children}
    </button>
  );
}
