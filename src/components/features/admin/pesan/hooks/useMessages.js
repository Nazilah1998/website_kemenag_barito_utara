import { useState, useEffect, useRef, useCallback } from "react";

export function useMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  // Server-side pagination & filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubjek, setFilterSubjek] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const debounceRef = useRef(null);
  const mountedRef = useRef(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const buildQueryString = useCallback((p, q, subjek, status) => {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", p);
    if (q) params.set("q", q);
    if (subjek) params.set("subjek", subjek);
    if (status) params.set("status", status);
    const qs = params.toString();
    return qs ? `/api/admin/pesan?${qs}` : "/api/admin/pesan";
  }, []);

  const fetchMessages = useCallback(async (p, q, subjek, status, signal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(buildQueryString(p, q, subjek, status), { signal });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memuat pesan.");
      if (!mountedRef.current) return;
      setMessages(data.items || []);
      setPage(data.pagination?.page || 1);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
    } catch (err) {
      if (err.name === "AbortError") return;
      if (mountedRef.current) setError(err.message);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [buildQueryString]);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Fetch when filters change (with debounce) — resets to page 1
  useEffect(() => {
    const controller = new AbortController();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchMessages(1, searchQuery, filterSubjek, filterStatus, controller.signal);
    }, 400);
    return () => {
      controller.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, filterSubjek, filterStatus, fetchMessages]);

  // Fetch when page changes (but skip if filters just triggered a reset)
  useEffect(() => {
    if (page === 1) return;
    const controller = new AbortController();
    fetchMessages(page, searchQuery, filterSubjek, filterStatus, controller.signal);
    return () => controller.abort();
  }, [page, searchQuery, filterSubjek, filterStatus, fetchMessages]);

  const handleSetPage = (p) => {
    setPage(p);
  };

  const handleSetSearchQuery = (val) => {
    setSearchQuery(val);
  };

  const handleSetFilterSubjek = (val) => {
    setFilterSubjek(val === "Semua" ? "" : val);
  };

  const handleSetFilterStatus = (val) => {
    setFilterStatus(val === "Semua" ? "" : val);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch("/api/admin/pesan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m)),
      );
      if (selectedMsg?.id === id)
        setSelectedMsg({ ...selectedMsg, status: newStatus });
      showToast("Status berhasil diperbarui");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const deleteMessage = async (id) => {
    setConfirmData({
      message: "Apakah Anda yakin ingin menghapus pesan ini secara permanen?",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/pesan?id=${id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message);

          setMessages((prev) => prev.filter((m) => m.id !== id));
          showToast("Pesan telah dihapus");
        } catch (err) {
          showToast(err.message, "error");
        } finally {
          setConfirmData(null);
        }
      },
    });
  };

  const displaySubjek = filterSubjek || "Semua";
  const displayStatus = filterStatus || "Semua";

  return {
    messages,
    loading,
    error,
    selectedMsg,
    setSelectedMsg,
    toast,
    confirmData,
    setConfirmData,
    page,
    totalPages,
    total,
    setPage: handleSetPage,
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    filterSubjek: displaySubjek,
    setFilterSubjek: handleSetFilterSubjek,
    filterStatus: displayStatus,
    setFilterStatus: handleSetFilterStatus,
    updateStatus,
    deleteMessage,
  };
}
