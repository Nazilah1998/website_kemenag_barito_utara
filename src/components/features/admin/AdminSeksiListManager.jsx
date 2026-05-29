"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  User,
  Users,
  ChevronRight,
  Loader2,
  Trash2,
} from "lucide-react";
import { FloatingFeedback, DeleteConfirmModal } from "./slides/SlidesUI";
import { logWarn, logError } from "@/lib/logger";

export default function AdminSeksiListManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null, judul: "" });

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/admin/session", { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          setIsSuperAdmin(data?.permissions?.role === "super_admin");
        }
      } catch (e) {
        if (e?.name === "AbortError") return;
        logWarn("seksi_list_session_warn", { error: e?.message });
      } finally {
        if (!controller.signal.aborted) fetchSeksi();
      }
    })();
    return () => controller.abort();
  }, []);

  const fetchSeksi = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/seksi");
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("Sesi telah berakhir atau akses ditolak. Silakan login kembali.");
        }
        throw new Error("Gagal mengambil data seksi.");
      }
      const data = await res.json();
      setItems(data?.items || []);
    } catch (err) {
      logError("seksi_list_fetch_error", { error: err?.message });
      setError(err?.message || "Terjadi kesalahan koneksi saat memuat data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, judul) => {
    if (!id) return;
    setConfirmModal({ open: true, id, judul: judul || "-" });
  };

  const handleConfirmDelete = async () => {
    const { id } = confirmModal;
    setConfirmModal({ open: false, id: null, judul: "" });

    setDeletingId(id);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`/api/admin/seksi/${id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Gagal menghapus seksi.");
      }

      setMessage(data?.message || "Seksi berhasil dihapus.");
      await fetchSeksi();
    } catch (err) {
      logError("seksi_list_delete_error", { error: err?.message });
      setError(err?.message || "Gagal menghapus seksi.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmModal({ open: false, id: null, judul: "" });
  };

  return (
    <section className="space-y-12">
      <FloatingFeedback
        message={message}
        error={error}
        onClose={() => {
          setMessage("");
          setError("");
        }}
      />

      <DeleteConfirmModal
        open={confirmModal.open}
        loading={deletingId === confirmModal.id}
        title="Hapus Seksi / Bidang?"
        description={`Anda akan menghapus seksi "${confirmModal.judul}" beserta seluruh data pegawai di dalamnya. Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            Manajemen Kepegawaian
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            Kelola profil Kepala Seksi, deskripsi seksi, serta struktur pegawai bawahan di tiap bidang.
          </p>
        </div>
      </div>

      {/* Stats Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-50/50 p-8 shadow-2xl shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-slate-300/60 dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none">
          <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:bg-slate-800/50" />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 group-hover:text-slate-600 transition-colors dark:group-hover:text-slate-300">
                Total Seksi / Bidang
              </p>
              <p className="mt-3 text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                {items.length}
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-slate-900 text-white shadow-xl shadow-slate-900/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 dark:bg-white dark:text-black dark:shadow-none">
              <Briefcase className="w-7 h-7" />
            </div>
          </div>
          <div className="relative z-10 mt-8 flex items-center gap-2 border-t border-slate-100 pt-5 dark:border-slate-800/50">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Sinkron dengan Halaman Publik
            </p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-50/50 p-8 shadow-2xl shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-slate-300/60 dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none">
          <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:bg-slate-800/50" />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 group-hover:text-slate-600 transition-colors dark:group-hover:text-slate-300">
                Total Seluruh Pegawai
              </p>
              <p className="mt-3 text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                {items.reduce((acc, curr) => acc + (curr._count?.pegawai_seksi || 0), 0)}
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-slate-900 text-white shadow-xl shadow-slate-900/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 dark:bg-white dark:text-black dark:shadow-none">
              <Users className="w-7 h-7" />
            </div>
          </div>
          <div className="relative z-10 mt-8 flex items-center gap-2 border-t border-slate-100 pt-5 dark:border-slate-800/50">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Dapat diedit dinamis oleh admin
            </p>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="rounded-[2.5rem] border border-slate-200 bg-slate-50/50 p-8 shadow-2xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none">
        <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-6 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Daftar Struktur Organisasi per Bidang
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  Nama Bidang / Seksi
                </th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  Kepala Seksi / Pejabat
                </th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  Total Pegawai
                </th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Memuat data seksi...</span>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Belum ada seksi yang ditambahkan atau dimigrasi ke database.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="group border-t border-slate-100 bg-white hover:bg-slate-50/80 transition-all align-middle dark:border-slate-800 dark:bg-transparent dark:hover:bg-white/5">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-150 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black tracking-tight text-slate-900 dark:text-slate-100 uppercase">
                            {item.judul}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                            Slug: <span className="font-mono text-emerald-600 dark:text-emerald-400">{item.slug}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden ring-2 ring-white dark:ring-slate-900 shadow-sm">
                          {item.foto_kepala ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.foto_kepala} alt={item.nama_kepala} className="h-full w-full object-cover" style={{ objectPosition: `50% ${item.foto_kepala_y ?? 50}%` }} />
                          ) : (
                            <User className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {item.nama_kepala || "-"}
                          </p>
                          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                            NIP. {item.nip_kepala || "-"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        <Users className="h-3 w-3" />
                        {item._count?.pegawai_seksi || 0} Pegawai
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          href={`/admin/seksi/${item.id}`}
                          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95"
                        >
                          <span>Kelola Seksi</span>
                          <ChevronRight className="h-3.5 w-3.5 stroke-[3]" />
                        </Link>

                        {isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.judul)}
                            disabled={deletingId === item.id}
                            className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-rose-600/20 transition-all hover:bg-rose-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {deletingId === item.id ? "Menghapus..." : "Hapus"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
