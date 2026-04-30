"use client";

import React, { useState, useEffect } from "react";

export default function AdminPesanManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  // Filters
  const [filterSubjek, setFilterSubjek] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedMsg || confirmData) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedMsg, confirmData]);

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
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
      if (selectedMsg?.id === id) setSelectedMsg({ ...selectedMsg, status: newStatus });
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
      }
    });
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSubjek = filterSubjek === "Semua" || msg.subjek === filterSubjek;
    const matchesStatus = filterStatus === "Semua" || msg.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSubjek && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-2xl border-4 border-slate-100 border-t-emerald-500" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Sinkronisasi Data...</p>
        </div>
      </div>
    );
  }

  const subjekOptions = ["Semua", "Pertanyaan", "Masukan", "Pengaduan"];
  const statusOptions = ["Semua", "Baru", "Selesai"];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Controls */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-700 dark:text-emerald-400 italic">Monitoring</p>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight leading-none">Kotak Masuk</h1>
          <p className="mt-4 text-xs font-bold text-slate-500 dark:text-slate-400 max-w-md">Kelola pesan dan pengaduan masyarakat secara sistematis dan terstruktur.</p>
        </div>

        {/* Filters - Adaptive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-full sm:w-auto">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic mb-3 block">Kategori</label>
            <div className="flex flex-wrap gap-1.5 rounded-[1.25rem] border-2 border-slate-50 bg-slate-50/50 p-1.5 dark:border-white/5 dark:bg-white/5">
              {subjekOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilterSubjek(opt)}
                  className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase italic tracking-wider transition-all ${filterSubjek === opt
                    ? "bg-slate-900 text-white shadow-lg dark:bg-white dark:text-black"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic mb-3 block">Status</label>
            <div className="flex gap-1.5 rounded-[1.25rem] border-2 border-slate-50 bg-slate-50/50 p-1.5 dark:border-white/5 dark:bg-white/5">
              {statusOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilterStatus(opt)}
                  className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase italic tracking-wider transition-all ${filterStatus === opt
                    ? "bg-slate-900 text-white shadow-lg dark:bg-white dark:text-black"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-100 bg-white/50 py-32 dark:border-white/5">
          <div className="mb-6 rounded-3xl bg-slate-50 p-6 dark:bg-white/5">
            <svg className="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Arsip Kosong</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-hidden rounded-[2.5rem] border-2 border-slate-50 bg-white shadow-2xl shadow-slate-200/40 dark:border-white/5 dark:bg-slate-900 dark:shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-slate-50 bg-slate-50/30 dark:border-white/5 dark:bg-white/5">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Opsi</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Kronologi</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Identitas Pengirim</th>
                    <th className="px-8 py-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Status</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-50 dark:divide-white/5">
                  {filteredMessages.map((msg, idx) => (
                    <tr key={msg.id} className="group transition-all hover:bg-slate-50/50 dark:hover:bg-white/5">
                      <td className="px-8 py-6">
                        <span className="text-xs font-black text-slate-200 dark:text-slate-800 uppercase italic">#{String(idx + 1).padStart(3, '0')}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-[11px] font-black uppercase italic text-slate-900 dark:text-white leading-none">
                          {new Date(msg.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                        <div className="mt-1.5 text-[10px] font-bold text-slate-400">
                          {new Date(msg.created_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-black uppercase italic text-sm text-slate-900 dark:text-white">{msg.nama}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${msg.subjek === "Pengaduan" ? "bg-rose-500 text-white" :
                            msg.subjek === "Pertanyaan" ? "bg-emerald-500 text-white" : "bg-slate-900 text-white"
                            }`}>
                            {msg.subjek}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">{msg.whatsapp}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 border-2 ${msg.status.toLowerCase() === "baru"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-600"
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                          }`}>
                          <div className={`h-1.5 w-1.5 rounded-full ${msg.status.toLowerCase() === "baru" ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
                          <span className="text-[10px] font-black uppercase italic tracking-widest">{msg.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3 transition-all">
                          <button
                            onClick={() => setSelectedMsg(msg)}
                            className="rounded-xl bg-slate-900 px-5 py-2.5 text-[10px] font-black uppercase italic tracking-widest text-white transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-black"
                          >
                            Buka Pesan
                          </button>
                          <button
                            onClick={() => deleteMessage(msg.id)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-rose-50 text-rose-500 transition-all hover:bg-rose-500 hover:text-white dark:border-rose-900/20"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="grid gap-4 lg:hidden">
            {filteredMessages.map((msg, idx) => (
              <div key={msg.id} className="relative overflow-hidden rounded-[2.5rem] border-2 border-slate-50 bg-white p-6 shadow-xl shadow-slate-200/30 dark:border-white/5 dark:bg-slate-900">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-[10px] font-black uppercase italic tracking-widest text-slate-300 dark:text-slate-700 mb-1">Entry #{String(idx + 1).padStart(3, '0')}</div>
                    <h3 className="text-lg font-black uppercase italic text-slate-900 dark:text-white leading-tight">{msg.nama}</h3>
                    <p className="mt-1 text-xs font-bold text-slate-400">{msg.whatsapp}</p>
                  </div>
                  <div className={`rounded-xl px-4 py-2 border-2 ${msg.status.toLowerCase() === "baru" ? "bg-amber-500/10 border-amber-500/20 text-amber-600" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"}`}>
                    <span className="text-[9px] font-black uppercase italic tracking-widest">{msg.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <span className={`rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-widest ${msg.subjek === "Pengaduan" ? "bg-rose-500 text-white" : msg.subjek === "Pertanyaan" ? "bg-emerald-500 text-white" : "bg-slate-900 text-white"}`}>
                    {msg.subjek}
                  </span>
                  <div className="h-1 w-1 rounded-full bg-slate-200 dark:bg-white/10" />
                  <span className="text-[10px] font-black uppercase italic text-slate-400">
                    {new Date(msg.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t-2 border-slate-50 dark:border-white/5">
                  <button
                    onClick={() => setSelectedMsg(msg)}
                    className="flex h-12 items-center justify-center rounded-2xl bg-slate-900 text-[10px] font-black uppercase italic tracking-widest text-white dark:bg-white dark:text-black"
                  >
                    Rincian
                  </button>
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="flex h-12 items-center justify-center rounded-2xl border-2 border-rose-50 text-rose-500 dark:border-rose-900/20"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Detail Modal - Full Screen Mobile */}
      {selectedMsg && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" onClick={() => setSelectedMsg(null)} />
          <div className="relative flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[92vh] sm:rounded-[3rem] dark:bg-slate-900">
            {/* Modal Header */}
            <div className="shrink-0 flex items-center justify-between border-b-2 border-slate-50 px-8 py-8 dark:border-white/5">
              <div>
                <span className={`rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-widest ${selectedMsg.subjek === "Pengaduan" ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"}`}>
                  {selectedMsg.subjek}
                </span>
                <h2 className="mt-4 text-3xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white leading-none">{selectedMsg.nama}</h2>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{selectedMsg.whatsapp}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMsg(null)}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:bg-white/5"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="relative rounded-[2.5rem] border-2 border-slate-50 bg-slate-50/50 p-10 dark:border-white/5 dark:bg-white/5">
                <p className="text-lg leading-relaxed text-slate-800 dark:text-slate-200 italic font-bold">
                  &ldquo;{selectedMsg.pesan}&rdquo;
                </p>
                <div className="mt-10 flex flex-col gap-1 border-t-2 border-slate-100 pt-8 dark:border-white/10">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Direkam pada</span>
                  <span className="text-xs font-bold text-slate-500">
                    {new Date(selectedMsg.created_at).toLocaleString("id-ID", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="shrink-0 p-8 border-t-2 border-slate-50 dark:border-white/5">
              <button
                onClick={() => {
                  const newStatus = selectedMsg.status.toLowerCase() === "baru" ? "selesai" : "baru";
                  updateStatus(selectedMsg.id, newStatus);
                }}
                className={`group relative flex h-16 w-full items-center justify-center overflow-hidden rounded-2xl text-[11px] font-black uppercase italic tracking-[0.2em] text-white transition-all active:scale-95 shadow-2xl ${selectedMsg.status.toLowerCase() === "baru"
                  ? "bg-emerald-600 shadow-emerald-600/20"
                  : "bg-amber-500 shadow-amber-500/20"
                  }`}
              >
                <span className="relative z-10">{selectedMsg.status.toLowerCase() === "baru" ? "Selesaikan Pesan" : "Buka Kembali Sesi"}</span>
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications & Confirm - Bold Style */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 z-[300] -translate-x-1/2 animate-in slide-in-from-bottom-12 duration-500">
          <div className={`flex items-center gap-4 rounded-[1.5rem] border-2 px-8 py-5 shadow-2xl backdrop-blur-xl ${toast.type === "success"
            ? "border-emerald-500/20 bg-white/90 text-emerald-900 dark:bg-slate-900/90 dark:text-emerald-400"
            : "border-rose-500/20 bg-white/90 text-rose-900 dark:bg-slate-900/90 dark:text-rose-400"
            }`}>
            <div className={`h-2.5 w-2.5 rounded-full animate-pulse ${toast.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`} />
            <p className="text-[10px] font-black uppercase italic tracking-widest">{toast.message}</p>
          </div>
        </div>
      )}

      {confirmData && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setConfirmData(null)} />
          <div className="relative w-full max-w-sm overflow-hidden rounded-[3rem] border-2 border-white bg-white p-10 shadow-2xl animate-in zoom-in duration-300 dark:border-white/5 dark:bg-slate-900">
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 dark:bg-rose-900/30">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-center text-2xl font-black uppercase italic tracking-tight text-slate-900 dark:text-white leading-none">Hapus Permanen?</h3>
            <p className="mt-4 text-center text-xs font-bold text-slate-500 leading-relaxed px-4">{confirmData.message}</p>

            <div className="mt-10 flex flex-col gap-3">
              <button onClick={confirmData.onConfirm} className="h-14 w-full rounded-2xl bg-rose-600 text-[10px] font-black uppercase italic tracking-widest text-white shadow-xl shadow-rose-600/20 hover:bg-rose-700">Ya, Hapus Data</button>
              <button onClick={() => setConfirmData(null)} className="h-14 w-full rounded-2xl bg-slate-50 text-[10px] font-black uppercase italic tracking-widest text-slate-500 hover:bg-slate-100 dark:bg-white/5">Batalkan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
