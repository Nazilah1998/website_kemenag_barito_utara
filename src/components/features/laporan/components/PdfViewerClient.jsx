"use client";

import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { usePdfViewer } from "@/hooks/usePdfViewer";
import { PdfViewerToolbar } from "./PdfViewerToolbar";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

try {
  if (typeof pdfjs.verbosityLevel !== "undefined" && typeof pdfjs.VerbosityLevel !== "undefined") {
    pdfjs.verbosity = pdfjs.VerbosityLevel.ERRORS;
  }
} catch {
  // noop
}

const DOCUMENT_OPTIONS = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

export default function PdfViewerClient({ fileUrl, fileName = "dokumen.pdf", onError }) {
  const {
    numPages,
    setNumPages,
    currentPage,
    setCurrentPage,
    zoom,
    setZoom,
    isMobile,
    viewerRef,
    pageRefs,
    maxZoom,
    pageWidth,
    goToPage,
    onScrollUpdateCurrentPage,
    handleDirectDownload,
  } = usePdfViewer(fileUrl, fileName);

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <PdfViewerToolbar
        currentPage={currentPage}
        numPages={numPages}
        isMobile={isMobile}
        zoom={zoom}
        maxZoom={maxZoom}
        onGoToPage={goToPage}
        onSetZoom={setZoom}
        onDownload={handleDirectDownload}
      />

      <div
        ref={viewerRef}
        onScroll={onScrollUpdateCurrentPage}
        className="max-h-[56vh] overflow-y-auto overflow-x-hidden p-2 sm:max-h-[70vh] sm:p-3"
      >
        <Document
          file={fileUrl}
          options={DOCUMENT_OPTIONS}
          loading={<div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">Memuat dokumen...</div>}
          onLoadError={onError}
          onSourceError={onError}
          onLoadSuccess={({ numPages: total }) => {
            setNumPages(total || 0);
            setCurrentPage(1);
          }}
        >
          {Array.from({ length: numPages || 1 }, (_, idx) => {
            const page = idx + 1;
            return (
              <div
                key={`page-${page}`}
                ref={(node) => { if (node) pageRefs.current[page] = node; }}
                className="mb-3 last:mb-0 sm:mb-4"
              >
                <Page
                  pageNumber={page}
                  width={pageWidth}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  loading={<div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">Memuat halaman {page}...</div>}
                />
              </div>
            );
          })}
        </Document>
      </div>
    </div>
  );
}
