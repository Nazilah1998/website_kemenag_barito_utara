"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Users,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Save,
  Upload,
  X,
} from "lucide-react";
import { FloatingFeedback, DeleteConfirmModal } from "./slides/SlidesUI";
import { compressImageToBase64 } from "@/lib/image-compress";
import { logError } from "@/lib/logger";

export default function AdminSeksiDetailManager({ id }) {
  const router = useRouter();

  // Seksi states
  const [seksiData, setSeksiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingSeksi, setSavingSeksi] = useState(false);

  // Form Seksi states
  const [seksiForm, setSeksiForm] = useState({
    judul: "",
    deskripsi: "",
    nama_kepala: "",
    nip_kepala: "",
    foto_kepala: "",
    foto_kepala_y: 50,
  });
  const [fotoKepalaBase64, setFotoKepalaBase64] = useState("");
  const [fotoKepalaPreview, setFotoKepalaPreview] = useState("");
  const fileInputKasiRef = useRef(null);

  // Pegawai states
  const [pegawaiList, setPegawaiList] = useState([]);
  const [loadingPegawai, setLoadingPegawai] = useState(false);

  // Pegawai CRUD Modal states
  const [openPegawaiModal, setOpenPegawaiModal] = useState(false);
  const [editingPegawai, setEditingPegawai] = useState(null); // null means adding
  const [pegawaiForm, setPegawaiForm] = useState({
    nama: "",
    nip: "",
    jabatan: "",
    foto: "",
    foto_y: 50,
    sort_order: 0,
  });
  const [fotoPegawaiBase64, setFotoPegawaiBase64] = useState("");
  const [fotoPegawaiPreview, setFotoPegawaiPreview] = useState("");
  const fileInputPegawaiRef = useRef(null);
  const [savingPegawai, setSavingPegawai] = useState(false);

  // Delete Pegawai states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingPegawaiId, setDeletingPegawaiId] = useState(null);
  const [deletingPegawaiName, setDeletingPegawaiName] = useState("");

  // Drag and Drop states
  const [isDraggingKasi, setIsDraggingKasi] = useState(false);
  const [isDraggingPegawai, setIsDraggingPegawai] = useState(false);

  // Feedback states
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchSeksiDetail = useCallback(async (signal) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/seksi/${id}`, { signal });
      if (!res.ok) {
        throw new Error("Gagal memuat detail seksi.");
      }
      const data = await res.json();
      setSeksiData(data);
      setSeksiForm({
        judul: data.judul || "",
        deskripsi: data.deskripsi || "",
        nama_kepala: data.nama_kepala || "",
        nip_kepala: data.nip_kepala || "",
        foto_kepala: data.foto_kepala || "",
        foto_kepala_y: data.foto_kepala_y ?? 50,
      });
      setFotoKepalaPreview(data.foto_kepala || "");
      setPegawaiList(data.pegawai_seksis || []);
    } catch (err) {
      if (err?.name === "AbortError") return;
      logError("seksi_detail_fetch_error", { error: err?.message });
      setError(err?.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    fetchSeksiDetail(controller.signal);
    return () => controller.abort();
  }, [id, fetchSeksiDetail]);

  // Handle Seksi profile save
  const handleSaveSeksi = async (e) => {
    e.preventDefault();
    setSavingSeksi(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        ...seksiForm,
        ...(fotoKepalaBase64 && {
          foto_kepala_base64: fotoKepalaBase64,
          foto_kepala_name: `kasi-${seksiForm.nama_kepala.replace(/\s+/g, "-").toLowerCase()}`,
        }),
      };

      const res = await fetch(`/api/admin/seksi/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal memperbarui profil seksi.");
      }

      setSeksiData(data.item);
      setSeksiForm((prev) => ({
        ...prev,
        foto_kepala_y: data.item.foto_kepala_y ?? 50,
      }));
      setFotoKepalaBase64("");
      setFotoKepalaPreview(data.item.foto_kepala || "");
      setMessage("Profil seksi berhasil diperbarui.");
      router.refresh();
    } catch (err) {
      logError("seksi_detail_save_error", { error: err?.message });
      setError(err?.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSavingSeksi(false);
    }
  };

  // Drag and Drop Kasi Handlers
  const handleKasiDragOver = (e) => {
    e.preventDefault();
    setIsDraggingKasi(true);
  };

  const handleKasiDragLeave = () => {
    setIsDraggingKasi(false);
  };

  const handleKasiDrop = (e) => {
    e.preventDefault();
    setIsDraggingKasi(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processKasiFile(file);
    }
  };

  const processKasiFile = async (file) => {
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("Ukuran foto maksimal 15MB sebelum kompresi.");
      return;
    }

    try {
      setError("");
      setMessage("");
      const compressed = await compressImageToBase64(file, {
        targetSizeKB: 400,
        hardMaxSizeKB: 500,
        throwIfOverHardLimit: false,
        maxWidth: 1280,
        maxHeight: 1280,
      });

      setFotoKepalaBase64(compressed.base64);
      setFotoKepalaPreview(compressed.base64);
      setMessage(
        `Foto kepala seksi berhasil diproses (${compressed.originalSizeKB} KB -> ${compressed.sizeKB} KB).`,
      );
    } catch (err) {
      logError("seksi_detail_kasi_compress_error", { error: err?.message });
      setError(err?.message || "Gagal memproses dan mengompresi gambar.");
    }
  };

  // Handle file change for Kasi photo
  const handleKasiPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) processKasiFile(file);
  };

  // Open Pegawai modal for addition
  const handleOpenAddPegawai = () => {
    setEditingPegawai(null);
    setPegawaiForm({
      nama: "",
      nip: "",
      jabatan: "",
      foto: "",
      foto_y: 50,
      sort_order: pegawaiList.length + 1,
    });
    setFotoPegawaiBase64("");
    setFotoPegawaiPreview("");
    setOpenPegawaiModal(true);
  };

  // Open Pegawai modal for editing
  const handleOpenEditPegawai = (pegawai) => {
    setEditingPegawai(pegawai);
    setPegawaiForm({
      nama: pegawai.nama || "",
      nip: pegawai.nip || "",
      jabatan: pegawai.jabatan || "",
      foto: pegawai.foto || "",
      foto_y: pegawai.foto_y ?? 50,
      sort_order: pegawai.sort_order || 0,
    });
    setFotoPegawaiBase64("");
    setFotoPegawaiPreview(pegawai.foto || "");
    setOpenPegawaiModal(true);
  };

  // Drag and Drop Pegawai Handlers
  const handlePegawaiDragOver = (e) => {
    e.preventDefault();
    setIsDraggingPegawai(true);
  };

  const handlePegawaiDragLeave = () => {
    setIsDraggingPegawai(false);
  };

  const handlePegawaiDrop = (e) => {
    e.preventDefault();
    setIsDraggingPegawai(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processPegawaiFile(file);
    }
  };

  const processPegawaiFile = async (file) => {
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("Ukuran foto maksimal 15MB sebelum kompresi.");
      return;
    }

    try {
      setError("");
      setMessage("");
      const compressed = await compressImageToBase64(file, {
        targetSizeKB: 400,
        hardMaxSizeKB: 500,
        throwIfOverHardLimit: false,
        maxWidth: 1280,
        maxHeight: 1280,
      });

      setFotoPegawaiBase64(compressed.base64);
      setFotoPegawaiPreview(compressed.base64);
      setMessage(
        `Foto pegawai berhasil diproses (${compressed.originalSizeKB} KB -> ${compressed.sizeKB} KB).`,
      );
    } catch (err) {
      logError("seksi_detail_pegawai_compress_error", { error: err?.message });
      setError(err?.message || "Gagal memproses dan mengompresi gambar.");
    }
  };

  // Handle Pegawai file change
  const handlePegawaiPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) processPegawaiFile(file);
  };

  // Save Pegawai (Create or Update)
  const handleSavePegawai = async (e) => {
    e.preventDefault();
    if (!pegawaiForm.nama.trim()) {
      setError("Nama pegawai wajib diisi.");
      return;
    }
    if (!pegawaiForm.jabatan.trim()) {
      setError("Jabatan pegawai wajib diisi.");
      return;
    }

    setSavingPegawai(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        ...pegawaiForm,
        ...(fotoPegawaiBase64 && {
          foto_base64: fotoPegawaiBase64,
          foto_name: `pegawai-${pegawaiForm.nama.replace(/\s+/g, "-").toLowerCase()}`,
        }),
      };

      const url = editingPegawai
        ? `/api/admin/seksi/${id}/pegawai/${editingPegawai.id}`
        : `/api/admin/seksi/${id}/pegawai`;

      const method = editingPegawai ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan data pegawai.");
      }

      // Refresh list
      if (editingPegawai) {
        setPegawaiList((prev) =>
          prev
            .map((p) => (p.id === editingPegawai.id ? data.item : p))
            .sort((a, b) => a.sort_order - b.sort_order),
        );
        setMessage("Data staf pegawai berhasil diperbarui.");
      } else {
        setPegawaiList((prev) =>
          [...prev, data.item].sort((a, b) => a.sort_order - b.sort_order),
        );
        setMessage("Staf pegawai baru berhasil ditambahkan.");
      }

      setOpenPegawaiModal(false);
      router.refresh();
    } catch (err) {
      logError("seksi_detail_pegawai_save_error", { error: err?.message });
      setError(
        err?.message || "Terjadi kesalahan saat menyimpan data pegawai.",
      );
    } finally {
      setSavingPegawai(false);
    }
  };

  // Trigger Delete confirmation
  const handleDeletePegawaiClick = (pegawai) => {
    setDeletingPegawaiId(pegawai.id);
    setDeletingPegawaiName(pegawai.nama);
    setShowDeleteConfirm(true);
  };

  // Perform actual deletion
  const handleConfirmDeletePegawai = async () => {
    if (!deletingPegawaiId) return;

    setLoadingPegawai(true);
    setError("");
    setMessage("");
    setShowDeleteConfirm(false);

    try {
      const res = await fetch(
        `/api/admin/seksi/${id}/pegawai/${deletingPegawaiId}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal menghapus staf pegawai.");
      }

      setPegawaiList((prev) => prev.filter((p) => p.id !== deletingPegawaiId));
      setMessage(`Staf pegawai "${deletingPegawaiName}" berhasil dihapus.`);
      router.refresh();
    } catch (err) {
      logError("seksi_detail_pegawai_delete_error", { error: err?.message });
      setError(
        err?.message || "Terjadi kesalahan saat menghapus staf pegawai.",
      );
    } finally {
      setLoadingPegawai(false);
      setDeletingPegawaiId(null);
      setDeletingPegawaiName("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
          Memuat detail seksi & staf...
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-5 sm:space-y-8 pb-12">
      <FloatingFeedback
        message={message}
        error={error}
        onClose={() => {
          setMessage("");
          setError("");
        }}
      />

      {/* Top Navigation / Breadcrumb */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href="/admin/seksi"
          className="inline-flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border-2 border-slate-100 bg-white text-slate-500 transition-all hover:border-slate-900 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-white dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            Kembali ke Daftar
          </span>
          <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white uppercase leading-none tracking-tight mt-0.5 truncate">
            {seksiData?.judul || "Kelola Seksi"}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
        {/* LEFT COLUMN: Seksi & Kepala Seksi Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 bg-white p-4 sm:p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-sm sm:text-base font-black uppercase tracking-widest text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-emerald-500" />
              Profil Seksi & Pejabat
            </h2>

            <form onSubmit={handleSaveSeksi} className="mt-5 sm:mt-6 space-y-4 sm:space-y-5">
              {/* Judul Seksi */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Nama Seksi / Bidang
                </label>
                <input
                  type="text"
                  required
                  value={seksiForm.judul}
                  onChange={(e) =>
                    setSeksiForm({ ...seksiForm, judul: e.target.value })
                  }
                  placeholder="Contoh: Seksi Bimbingan Masyarakat Islam"
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-4 py-3.5 text-sm font-semibold text-slate-900 transition focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:border-white dark:focus:bg-slate-950"
                />
              </div>

              {/* Nama Kepala Seksi */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Nama Kepala Seksi
                </label>
                <input
                  type="text"
                  required
                  value={seksiForm.nama_kepala}
                  onChange={(e) =>
                    setSeksiForm({ ...seksiForm, nama_kepala: e.target.value })
                  }
                  placeholder="Contoh: H. Ahmad, S.Ag"
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-4 py-3.5 text-sm font-bold text-slate-900 transition focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:border-white dark:focus:bg-slate-950"
                />
              </div>

              {/* NIP Kepala Seksi */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  NIP Kepala Seksi
                </label>
                <input
                  type="text"
                  value={seksiForm.nip_kepala}
                  onChange={(e) =>
                    setSeksiForm({ ...seksiForm, nip_kepala: e.target.value })
                  }
                  placeholder="Masukkan NIP (18 digit angka)"
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-4 py-3.5 text-sm font-semibold text-slate-900 transition focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:border-white dark:focus:bg-slate-950"
                />
              </div>

              {/* Foto Kepala Seksi Upload (Drag & Drop) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Foto Kepala Seksi
                </label>
                <div
                  onDragOver={handleKasiDragOver}
                  onDragLeave={handleKasiDragLeave}
                  onDrop={handleKasiDrop}
                  className={`flex flex-col items-center justify-center p-5 sm:p-6 rounded-3xl border-2 border-dashed transition-all duration-350 ${
                    isDraggingKasi
                      ? "border-emerald-500 bg-emerald-500/10 scale-[1.02]"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-transparent"
                  }`}
                >
                  <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden ring-4 ring-emerald-500/10 shadow-inner mb-4">
                    {fotoKepalaPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={fotoKepalaPreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        style={{ objectPosition: `50% ${seksiForm.foto_kepala_y ?? 50}%` }}
                      />
                    ) : (
                      <User className="h-10 w-10 text-slate-400" />
                    )}
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Tarik & lepas foto di sini, atau
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputKasiRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-700 shadow-sm hover:border-slate-900 transition dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-white"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Pilih File
                    </button>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Maks 15MB (Kompresi Otomatis &lt; 500KB)
                    </p>
                    <input
                      type="file"
                      ref={fileInputKasiRef}
                      onChange={handleKasiPhotoChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
                {fotoKepalaPreview && (
                  <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-[1.5rem] border border-slate-100 dark:border-slate-800/80 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Posisi Foto Vertikal</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">{seksiForm.foto_kepala_y ?? 50}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={seksiForm.foto_kepala_y ?? 50}
                      onChange={(e) =>
                        setSeksiForm({ ...seksiForm, foto_kepala_y: parseInt(e.target.value, 10) })
                      }
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-wider">
                      Geser slider untuk menyesuaikan posisi kepala pejabat struktural
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={savingSeksi}
                className="w-full flex h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50 mt-4"
              >
                {savingSeksi ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Pegawai Seksi CRUD (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 bg-white p-4 sm:p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-3 sm:gap-0">
              <h2 className="text-sm sm:text-base font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-500" />
                Struktur Staf Pegawai ({pegawaiList.length})
              </h2>

              <button
                type="button"
                onClick={handleOpenAddPegawai}
                className="inline-flex justify-center items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 transition dark:bg-white dark:text-black dark:hover:bg-slate-250 active:scale-95"
              >
                <Plus className="h-3.5 w-3.5 stroke-[3]" />
                Tambah Staf
              </button>
            </div>

            {/* List grid of Pegawai */}
            <div className="mt-6">
              {loadingPegawai ? (
                <div className="flex py-20 justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                </div>
              ) : pegawaiList.length === 0 ? (
                <div className="py-20 text-center rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-900 flex flex-col items-center justify-center">
                  <Users className="h-10 w-10 text-slate-300 mb-3" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Belum ada pegawai bawahan di seksi ini.
                  </p>
                  <p className="text-[9px] font-semibold text-slate-400 mt-1 uppercase">
                    Klik tombol &quot;Tambah Staf&quot; untuk menambahkan
                    anggota pertama.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pegawaiList.map((pegawai) => (
                    <div
                      key={pegawai.id}
                      className="group flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-emerald-250 hover:bg-white transition-all dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-emerald-800 dark:hover:bg-slate-950 relative"
                    >
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden ring-2 ring-white dark:ring-slate-900 shadow-sm">
                        {pegawai.foto ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={pegawai.foto}
                            alt={pegawai.nama}
                            className="h-full w-full object-cover"
                            style={{ objectPosition: `50% ${pegawai.foto_y ?? 50}%` }}
                          />
                        ) : (
                          <User className="h-6 w-6 text-slate-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pr-16">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate mt-1.5 leading-none">
                          {pegawai.nama}
                        </h4>
                        <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 tracking-wide mt-1.5 truncate">
                          {pegawai.jabatan}
                        </p>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                          NIP. {pegawai.nip || "-"}
                        </p>
                      </div>

                      {/* Action buttons (floating in top right corner on hover) */}
                      <div className="absolute right-3 top-3 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditPegawai(pegawai)}
                          title="Edit staf"
                          className="h-8 w-8 inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 shadow-sm transition hover:border-slate-900 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-white dark:hover:text-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePegawaiClick(pegawai)}
                          title="Hapus staf"
                          className="h-8 w-8 inline-flex items-center justify-center rounded-xl bg-rose-50 border border-rose-100 text-rose-500 shadow-sm transition hover:bg-rose-600 hover:text-white hover:border-rose-600 dark:bg-slate-900 dark:border-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PEGAWAI CRUD MODAL (ADD / EDIT) */}
      {openPegawaiModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setOpenPegawaiModal(false)}
          />

          <div className="relative w-full max-w-lg max-h-[95vh] flex flex-col animate-in zoom-in slide-in-from-bottom-8 duration-300 overflow-hidden rounded-3xl sm:rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-4 sm:px-8 sm:py-6">
              <h3 className="text-sm sm:text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white">
                {editingPegawai ? "Edit Data Pegawai" : "Tambah Pegawai Baru"}
              </h3>
              <button
                type="button"
                onClick={() => setOpenPegawaiModal(false)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            <div className="overflow-y-auto overflow-x-hidden flex-1">
              <form onSubmit={handleSavePegawai} className="p-5 sm:p-8 space-y-4 sm:space-y-5">
              {/* Nama Pegawai */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Nama Lengkap Pegawai
                </label>
                <input
                  type="text"
                  required
                  value={pegawaiForm.nama}
                  onChange={(e) =>
                    setPegawaiForm({ ...pegawaiForm, nama: e.target.value })
                  }
                  placeholder="Masukkan nama beserta gelar akademik"
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-4 py-3.5 text-sm font-semibold text-slate-900 transition focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:border-white dark:focus:bg-slate-950"
                />
              </div>

              {/* Jabatan Pegawai */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Jabatan / Peran
                </label>
                <input
                  type="text"
                  required
                  value={pegawaiForm.jabatan}
                  onChange={(e) =>
                    setPegawaiForm({ ...pegawaiForm, jabatan: e.target.value })
                  }
                  placeholder="Contoh: Analis Kebijakan / Staf Bimas"
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-4 py-3.5 text-sm font-bold text-slate-900 transition focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:border-white dark:focus:bg-slate-950"
                />
              </div>

              {/* NIP Pegawai */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  NIP Pegawai (Opsional)
                </label>
                <input
                  type="text"
                  value={pegawaiForm.nip}
                  onChange={(e) =>
                    setPegawaiForm({ ...pegawaiForm, nip: e.target.value })
                  }
                  placeholder="Masukkan NIP jika PNS (18 digit angka)"
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-4 py-3.5 text-sm font-semibold text-slate-900 transition focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:border-white dark:focus:bg-slate-950"
                />
              </div>

              {/* Foto Pegawai Drag & Drop Upload */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Unggah Foto Pegawai
                </label>
                <div
                  onDragOver={handlePegawaiDragOver}
                  onDragLeave={handlePegawaiDragLeave}
                  onDrop={handlePegawaiDrop}
                  className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-dashed transition-all duration-300 ${
                    isDraggingPegawai
                      ? "border-emerald-500 bg-emerald-500/10 scale-[1.02]"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
                  }`}
                >
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden ring-4 ring-emerald-500/10 shadow-inner mb-3">
                    {fotoPegawaiPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={fotoPegawaiPreview}
                        alt="Pegawai Preview"
                        className="h-full w-full object-cover"
                        style={{ objectPosition: `50% ${pegawaiForm.foto_y ?? 50}%` }}
                      />
                    ) : (
                      <User className="h-8 w-8 text-slate-400" />
                    )}
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Tarik & lepas foto staf di sini, atau
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputPegawaiRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-350 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-700 shadow-sm hover:border-slate-900 transition dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-white"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Pilih File
                    </button>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Maks 15MB (Kompresi Otomatis &lt; 500KB)
                    </p>
                    <input
                      type="file"
                      ref={fileInputPegawaiRef}
                      onChange={handlePegawaiPhotoChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
                {fotoPegawaiPreview && (
                  <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-[1.5rem] border border-slate-100 dark:border-slate-850 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Posisi Foto Vertikal</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">{pegawaiForm.foto_y ?? 50}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={pegawaiForm.foto_y ?? 50}
                      onChange={(e) =>
                        setPegawaiForm({ ...pegawaiForm, foto_y: parseInt(e.target.value, 10) })
                      }
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-wider">
                      Geser slider untuk menyesuaikan posisi foto staf pegawai
                    </p>
                  </div>
                )}
              </div>

              {/* Photo preview wrapper */}
              {fotoPegawaiPreview && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl relative">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fotoPegawaiPreview}
                      alt="Pegawai Preview"
                      className="h-full w-full object-cover"
                      style={{ objectPosition: `50% ${pegawaiForm.foto_y ?? 50}%` }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate">
                      Preview Foto Terpilih
                    </p>
                    <p className="text-[9px] text-slate-400 truncate">
                      Akan tersimpan saat formulir disubmit.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFotoPegawaiBase64("");
                      setFotoPegawaiPreview("");
                    }}
                    className="absolute right-3 h-6 w-6 inline-flex items-center justify-center rounded-full bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-600 hover:text-white transition"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="mt-8 flex gap-3">
                <button
                  type="submit"
                  disabled={savingPegawai}
                  className="flex-1 flex h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                >
                  {savingPegawai ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Data</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenPegawaiModal(false)}
                  disabled={savingPegawai}
                  className="flex-1 flex h-14 items-center justify-center rounded-2xl border-2 border-slate-100 bg-white text-[11px] font-black uppercase tracking-widest text-slate-400 transition hover:border-slate-900 hover:text-slate-900 active:scale-95 disabled:opacity-50 dark:border-slate-800 dark:bg-transparent dark:hover:border-white dark:hover:text-white"
                >
                  Batalkan
                </button>
              </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <DeleteConfirmModal
        open={showDeleteConfirm}
        onConfirm={handleConfirmDeletePegawai}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeletingPegawaiId(null);
          setDeletingPegawaiName("");
        }}
        title="Hapus Staf Pegawai?"
        description={`Apakah Anda yakin ingin menghapus staf "${deletingPegawaiName}" dari struktur organisasi seksi ini? Tindakan ini bersifat permanen.`}
      />
    </section>
  );
}
