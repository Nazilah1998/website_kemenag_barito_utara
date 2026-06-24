import { useState, useMemo, useCallback } from "react";

const DOCS_PER_PAGE = 6;

export function usePublicDocumentBrowser(documents) {
  const [year, setYear] = useState("");
  const [page, setPage] = useState(1);
  const [viewCounts, setViewCounts] = useState({});

  const yearOptions = useMemo(() => {
    return [...new Set(documents.map((doc) => doc?.year).filter(Boolean))].sort(
      (a, b) => b - a,
    );
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    if (!year) return documents;
    return documents.filter((doc) => String(doc?.year || "") === year);
  }, [documents, year]);

  const totalPages = Math.ceil(filteredDocuments.length / DOCS_PER_PAGE);

  const pagedDocuments = useMemo(() => {
    const start = (page - 1) * DOCS_PER_PAGE;
    return filteredDocuments.slice(start, start + DOCS_PER_PAGE);
  }, [filteredDocuments, page]);

  function handleYearChange(nextYear) {
    setYear(nextYear);
    setPage(1);
  }

  const handleViewDoc = useCallback((doc) => {
    const url = String(doc?.href || doc?.file_url || "").trim();
    if (!url) return;

    const docId = String(doc?.id || "");
    if (docId) {
      setViewCounts((prev) => ({
        ...prev,
        [docId]: (prev[docId] || Number(doc?.view_count || 0)) + 1,
      }));
      // View count sudah dihitung oleh GET proxy di /api/laporan/view/[...path]
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  return {
    year,
    setYear,
    page,
    setPage,
    viewCounts,
    yearOptions,
    totalPages,
    pagedDocuments,
    handleYearChange,
    handleViewDoc,
    docsPerPage: DOCS_PER_PAGE,
  };
}
