import { useState, useEffect, useCallback, useMemo } from "react";

async function readJsonSafely(response) {
  const raw = await response.text();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function useAuditManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const [deletingId, setDeletingId] = useState(null);
  const [clearingAll, setClearingAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [bulkAction, setBulkAction] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/audit?limit=200", {
        method: "GET",
        cache: "no-store",
      });

      const data = await readJsonSafely(response);
      if (!response.ok) {
        throw new Error(data?.message || "Gagal memuat riwayat aktivitas.");
      }

      setItems(Array.isArray(data?.items) ? data.items : []);
      setCurrentPage(1);
    } catch (err) {
      setError(err?.message || "Gagal memuat riwayat aktivitas.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    if (!message && !error) return undefined;
    const timeout = window.setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
    return () => window.clearTimeout(timeout);
  }, [message, error]);

  const totalPages = Math.ceil(items.length / pageSize);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const requestDelete = useCallback((id) => {
    setIdToDelete(id);
    setBulkAction(false);
    setShowDeleteModal(true);
  }, []);

  const requestClearAll = useCallback(() => {
    setBulkAction(true);
    setShowDeleteModal(true);
  }, []);

  const cancelDelete = useCallback(() => {
    setIdToDelete(null);
    setBulkAction(false);
    setShowDeleteModal(false);
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      if (bulkAction) {
        setClearingAll(true);
      } else {
        setDeletingId(idToDelete);
      }

      setError("");
      setMessage("");

      const url = bulkAction
        ? "/api/admin/audit?clear=all"
        : `/api/admin/audit?id=${idToDelete}`;

      const response = await fetch(url, { method: "DELETE" });
      const data = await readJsonSafely(response);

      if (!response.ok) {
        throw new Error(data?.message || "Gagal menghapus log.");
      }

      setMessage(data?.message || "Berhasil menghapus log.");
      setShowDeleteModal(false);
      setIdToDelete(null);
      setBulkAction(false);
      await loadItems();
    } catch (err) {
      setError(err?.message || "Gagal menghapus log.");
    } finally {
      setDeletingId(null);
      setClearingAll(false);
    }
  }, [idToDelete, bulkAction, loadItems]);

  return {
    items,
    paginatedItems,
    loading,
    message,
    setMessage,
    error,
    setError,
    currentPage,
    totalPages,
    handlePageChange,
    showDeleteModal,
    deletingId,
    clearingAll,
    bulkAction,
    requestDelete,
    requestClearAll,
    cancelDelete,
    confirmDelete,
    loadItems,
  };
}
