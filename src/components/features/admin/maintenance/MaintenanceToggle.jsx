"use client";

import React, { useState, useCallback } from "react";
import { AlertTriangle, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

function FloatingFeedback({ message, type, onClose }) {
  const bg =
    type === "success"
      ? "bg-emerald-600"
      : type === "error"
        ? "bg-rose-600"
        : "bg-slate-800";

  React.useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[999] animate-in slide-in-from-right-4 fade-in duration-300">
      <div
        className={`flex items-center gap-3 rounded-2xl px-6 py-4 text-sm font-bold text-white shadow-2xl ${bg}`}
      >
        <span>{type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
        <span>{message}</span>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ active, title, message, onConfirm, onCancel }) {
  if (!active) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-3xl border-2 border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30">
            <AlertTriangle className="h-7 w-7 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {title}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {message}
            </p>
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-black uppercase tracking-wider text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-2xl bg-rose-600 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white transition hover:bg-rose-700"
          >
            Ya, Aktifkan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MaintenanceToggle({ initialStatus }) {
  const [active, setActive] = useState(initialStatus?.active === true);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState(initialStatus?.message || "");
  const [feedback, setFeedback] = useState(null);

  const toggle = useCallback(async () => {
    setLoading(true);
    setShowConfirm(false);
    try {
      const res = await fetch("/api/admin/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setActive(data.active);
      setFeedback({ type: "success", message: data.message });
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Gagal." });
    } finally {
      setLoading(false);
    }
  }, [active, message]);

  const handleToggleClick = () => {
    if (active) {
      toggle();
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-2xl">
        <div className="rounded-4xl border-2 border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                active
                  ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
                  : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
              }`}
            >
              {active ? (
                <AlertTriangle className="h-8 w-8" />
              ) : (
                <ShieldCheck className="h-8 w-8" />
              )}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                Status Saat Ini
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                {active ? "Mode Maintenance AKTIF" : "Mode Maintenance NONAKTIF"}
              </h2>
            </div>
          </div>

          <div className="mt-8">
            <label className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
              Pesan Maintenance (opsional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              rows={3}
              className="mt-2 w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 py-3.5 text-sm font-medium text-slate-900 transition focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-600 dark:focus:ring-emerald-900/30"
              placeholder="Website sedang dalam perbaikan. Mohon kembali lagi beberapa saat."
            />
          </div>

          <div className="mt-8">
            {active ? (
              <button
                type="button"
                onClick={handleToggleClick}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ArrowLeft className="h-5 w-5" />
                )}
                {loading ? "Memproses..." : "Nonaktifkan Mode Maintenance"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleToggleClick}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-6 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-rose-700 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <AlertTriangle className="h-5 w-5" />
                )}
                {loading ? "Memproses..." : "Aktifkan Mode Maintenance"}
              </button>
            )}
          </div>

          <div className="mt-6 rounded-2xl border-2 border-amber-100 bg-amber-50 p-5 dark:border-amber-900/30 dark:bg-amber-950/20">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              Perhatian
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Saat mode maintenance aktif, seluruh halaman publik (
              <strong>beranda, berita, galeri, halaman, API publik, dll</strong>
              ) tidak dapat diakses dan akan menampilkan halaman maintenance
              (HTTP 503). Halaman admin (
              <strong>/admin/*</strong>) tetap bisa diakses oleh admin yang
              sudah login.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-4xl border-2 border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Riwayat Aktivitas
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {initialStatus?.updatedBy
              ? `Terakhir diubah oleh ${initialStatus.updatedBy} pada ${new Date(initialStatus.updatedAt).toLocaleString("id-ID")}`
              : "Belum pernah diubah"}
          </p>
        </div>
      </div>

      <DeleteConfirmModal
        active={showConfirm}
        title="Aktifkan Mode Maintenance?"
        message="Seluruh halaman publik tidak akan bisa diakses. Admin tetap bisa masuk."
        onConfirm={toggle}
        onCancel={() => setShowConfirm(false)}
      />

      <FloatingFeedback
        message={feedback?.message}
        type={feedback?.type}
        onClose={() => setFeedback(null)}
      />
    </>
  );
}
