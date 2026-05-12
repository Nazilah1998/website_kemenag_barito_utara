"use client";

import React, { useState, useEffect } from "react";
import { 
  History, 
  User, 
  Calendar, 
  Activity, 
  Search, 
  Filter,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Eye,
  Info,
  Trash2,
  Trash
} from "lucide-react";

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [clearing, setClearing] = useState(false);

  const fetchLogs = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/audit?page=${page}&limit=15`);
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      setLogs(data.logs);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus log ini secara permanen?")) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/audit?id=${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal menghapus log.");

      fetchLogs();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("PERHATIAN: Apakah Anda yakin ingin MENGHAPUS SEMUA riwayat log? Tindakan ini tidak dapat dibatalkan.")) return;

    try {
      setClearing(true);
      const res = await fetch("/api/admin/audit", { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal membersihkan log.");

      setPage(1);
      fetchLogs();
    } catch (err) {
      alert(err.message);
    } finally {
      setClearing(false);
    }
  };

  const getActionColor = (action) => {
    switch (action.toLowerCase()) {
      case "create": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "update": return "bg-blue-100 text-blue-700 border-blue-200";
      case "delete": return "bg-red-100 text-red-700 border-red-200";
      case "login": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-slate-900">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-xl font-black">Akses Dibatasi</h2>
        <p className="mt-2 text-slate-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-3 text-slate-900 dark:text-white">
            <History className="h-7 w-7 text-emerald-600" />
            Audit Log Aktivitas
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Rekam jejak setiap aksi yang dilakukan oleh administrator di sistem.
          </p>
        </div>
        
        {logs.length > 0 && (
          <button
            onClick={handleClearAll}
            disabled={clearing}
            className="flex items-center gap-2 rounded-xl bg-rose-50 px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-rose-600 transition-all hover:bg-rose-600 hover:text-white disabled:opacity-30"
          >
            {clearing ? (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Bersihkan Log
          </button>
        )}
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/50">
                <th className="px-6 py-4 font-black text-slate-900 dark:text-white">Admin</th>
                <th className="px-6 py-4 font-black text-slate-900 dark:text-white">Aksi</th>
                <th className="px-6 py-4 font-black text-slate-900 dark:text-white">Entitas</th>
                <th className="px-6 py-4 font-black text-slate-900 dark:text-white">Ringkasan</th>
                <th className="px-6 py-4 font-black text-slate-900 dark:text-white">Waktu</th>
                <th className="px-6 py-4 font-black text-slate-900 dark:text-white text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-6 py-8">
                      <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800"></div>
                    </td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    Belum ada data aktivitas tercatat.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white leading-none">
                            {log.actor_email}
                          </p>
                          <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-400">
                            {log.actor_role}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-400">
                        <Activity className="h-4 w-4" />
                        {log.entity}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="max-w-xs truncate text-slate-500 italic" title={log.summary}>
                        &quot;{log.summary}&quot;
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 whitespace-nowrap">
                        <Calendar className="h-4 w-4" />
                        {new Date(log.created_at).toLocaleString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(log.id)}
                        disabled={deletingId === log.id}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30"
                        title="Hapus Log"
                      >
                        {deletingId === log.id ? (
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-rose-600 border-t-transparent" />
                        ) : (
                          <Trash className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">
            Halaman <span className="font-bold text-slate-900 dark:text-white">{page}</span> dari {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-30 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-30 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
