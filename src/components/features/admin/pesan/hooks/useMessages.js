import { useState, useEffect } from "react";

export function useMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  // Filters
  const [filterSubjek, setFilterSubjek] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/pesan");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memuat pesan.");
      setMessages(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

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

  const filteredMessages = messages.filter((msg) => {
    const matchesSubjek =
      filterSubjek === "Semua" || msg.subjek === filterSubjek;
    const matchesStatus =
      filterStatus === "Semua" ||
      msg.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSubjek && matchesStatus;
  });

  return {
    messages,
    loading,
    error,
    selectedMsg,
    setSelectedMsg,
    toast,
    confirmData,
    setConfirmData,
    filterSubjek,
    setFilterSubjek,
    filterStatus,
    setFilterStatus,
    updateStatus,
    deleteMessage,
    filteredMessages,
  };
}
