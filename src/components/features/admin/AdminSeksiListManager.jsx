"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
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
    <section className="space-y-6 sm:space-y-12">
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
      <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            Manajemen Kepegawaian
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            Kelola profil Kepala Seksi, deskripsi seksi, serta struktur pegawai bawahan di tiap bidang.
          </p>
        </div>
      </div>

      {/* Stats Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="group relative overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-200 bg-slate-50/50 p-4 sm:p-8 shadow-2xl shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-slate-300/60 dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none">
          <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:bg-slate-800/50" />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest sm:tracking-[0.25em] text-slate-400 group-hover:text-slate-600 transition-colors dark:group-hover:text-slate-300 truncate">
                Total Seksi / Bidang
              </p>
              <p className="mt-2 sm:mt-3 text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                {items.length}
              </p>
            </div>
            <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl sm:rounded-[1.5rem] bg-slate-900 text-white shadow-xl shadow-slate-900/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 dark:bg-white dark:text-black dark:shadow-none">
              <Briefcase className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
          </div>
          <div className="relative z-10 mt-6 sm:mt-8 flex items-center gap-2 border-t border-slate-100 pt-4 sm:pt-5 dark:border-slate-800/50">
            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate">
              Sinkron dengan Halaman Publik
            </p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-200 bg-slate-50/50 p-4 sm:p-8 shadow-2xl shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-slate-300/60 dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none">
          <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:bg-slate-800/50" />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest sm:tracking-[0.25em] text-slate-400 group-hover:text-slate-600 transition-colors dark:group-hover:text-slate-300 truncate">
                Total Seluruh Pegawai
              </p>
              <p className="mt-2 sm:mt-3 text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                {items.reduce((acc, curr) => acc + (curr._count?.pegawai_seksi || 0), 0)}
              </p>
            </div>
            <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl sm:rounded-[1.5rem] bg-slate-900 text-white shadow-xl shadow-slate-900/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 dark:bg-white dark:text-black dark:shadow-none">
              <Users className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
          </div>
          <div className="relative z-10 mt-6 sm:mt-8 flex items-center gap-2 border-t border-slate-100 pt-4 sm:pt-5 dark:border-slate-800/50">
            <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate">
              Dapat diedit dinamis oleh admin
            </p>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-200 bg-slate-50/50 p-4 sm:p-8 shadow-2xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none">
        <div className="mb-6 sm:mb-8 flex items-center justify-between border-b border-slate-100 pb-5 sm:pb-6 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Daftar Struktur Organisasi per Bidang
            </p>
          </div>
        </div>

        <div className="w-full">
          <table className="w-full border-collapse block md:table">
            <thead className="hidden md:table-header-group">
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
            <tbody className="block md:table-row-group">
              {loading ? (
                <tr className="block md:table-row">
                  <td colSpan={4} className="block md:table-cell px-6 py-10 md:py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Memuat data seksi...</span>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr className="block md:table-row">
                  <td colSpan={4} className="block md:table-cell px-6 py-10 md:py-20 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Belum ada seksi yang ditambahkan atau dimigrasi ke database.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="group flex flex-col gap-3 md:gap-0 p-5 md:p-0 border-b md:border-b-0 border-slate-100 bg-white hover:bg-slate-50/80 transition-all align-middle dark:border-slate-800 dark:bg-transparent dark:hover:bg-white/5 md:table-row md:border-t">
                    <td className="block md:table-cell md:px-6 md:py-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-150 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black tracking-tight text-slate-900 dark:text-slate-100 uppercase">
                            {item.judul}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5 break-all">
                            Slug: <span className="font-mono text-emerald-700 dark:text-emerald-400">{item.slug}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="block md:table-cell md:px-6 md:py-6">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden ring-2 ring-white dark:ring-slate-900 shadow-sm">
                          {item.foto_kepala ? (
                            <Image src={item.foto_kepala} alt={item.nama_kepala} fill sizes="40px" className="object-cover" style={{ objectPosition: `50% ${item.foto_kepala_y ?? 50}%` }} />
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
                    <td className="block md:table-cell md:px-6 md:py-6">
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        <Users className="h-3 w-3" />
                        {item._count?.pegawai_seksi || 0} Pegawai
                      </span>
                    </td>
                    <td className="block md:table-cell mt-2 md:mt-0 pt-4 md:pt-6 border-t border-slate-100 dark:border-slate-800/50 md:border-none md:px-6 md:py-6">
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          href={`/admin/seksi/${item.id}`}
                          className="flex-1 md:flex-none inline-flex justify-center items-center gap-2 rounded-xl sm:rounded-2xl bg-emerald-600 px-4 sm:px-5 py-3 text-[10px] sm:text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95"
                        >
                          <span>Kelola Seksi</span>
                          <ChevronRight className="h-3.5 w-3.5 stroke-[3]" />
                        </Link>

                        {isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.judul)}
                            disabled={deletingId === item.id}
                            className="inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-rose-600 px-4 sm:px-4 py-3 text-[10px] sm:text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-rose-600/20 transition-all hover:bg-rose-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {deletingId === item.id ? "..." : "Hapus"}
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
