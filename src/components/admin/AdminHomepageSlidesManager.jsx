"use client";

import { useEffect, useMemo, useState } from "react";
import { compressImageToBase64 } from "@/lib/image-compress";
import { toCoverPreviewUrl } from "@/lib/cover-image";

const emptyForm = {
    title: "",
    caption: "",
    image_url: "",
    image_upload_base64: "",
    image_upload_name: "",
    is_published: true,
    sort_order: 0,
};

async function readJsonSafely(response) {
    const raw = await response.text();
    if (!raw) return {};
    try {
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

function toNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

export default function AdminHomepageSlidesManager() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openForm, setOpenForm] = useState(false);
    const [editingId, setEditingId] = useState("");
    const [form, setForm] = useState(emptyForm);

    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [deletingId, setDeletingId] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function loadItems() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch("/api/admin/homepage-slides", {
                method: "GET",
                cache: "no-store",
            });

            const data = await readJsonSafely(response);
            if (!response.ok) {
                throw new Error(data?.message || "Gagal memuat data slider.");
            }

            setItems(Array.isArray(data?.items) ? data.items : []);
        } catch (err) {
            setError(err?.message || "Gagal memuat data slider.");
            setItems([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadItems();
    }, []);

    useEffect(() => {
        if (!message && !error) return undefined;
        const timeout = window.setTimeout(() => {
            setMessage("");
            setError("");
        }, 3000);
        return () => window.clearTimeout(timeout);
    }, [message, error]);

    const totalPublished = useMemo(
        () => items.filter((item) => Boolean(item?.is_published)).length,
        [items],
    );

    const imagePreview = useMemo(() => {
        if (form.image_upload_base64) return form.image_upload_base64;
        return toCoverPreviewUrl(form.image_url || "");
    }, [form.image_upload_base64, form.image_url]);

    function resetForm() {
        setForm(emptyForm);
        setEditingId("");
    }

    function handleOpenCreate() {
        resetForm();
        setOpenForm(true);
    }

    function handleOpenEdit(item) {
        setEditingId(item.id);
        setForm({
            title: item.title || "",
            caption: item.caption || "",
            image_url: item.image_url || "",
            image_upload_base64: "",
            image_upload_name: "",
            is_published: Boolean(item.is_published),
            sort_order: toNumber(item.sort_order, 0),
        });
        setOpenForm(true);
    }

    function handleCloseForm() {
        setOpenForm(false);
        resetForm();
    }

    function handleChange(event) {
        const { name, value, type, checked } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handleImageFileChange(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            setError("");

            const compressed = await compressImageToBase64(file, {
                targetSizeKB: 100,
                hardMaxSizeKB: 120,
                throwIfOverHardLimit: true,
                maxWidth: 1920,
                maxHeight: 1080,
            });

            setForm((prev) => ({
                ...prev,
                image_upload_base64: compressed.base64,
                image_upload_name: compressed.fileName,
            }));

            setMessage("Gambar berhasil diproses dan siap disimpan.");
        } catch (err) {
            setError(err?.message || "Gagal memproses gambar.");
        } finally {
            setUploadingImage(false);
            event.target.value = "";
        }
    }

    function validateForm() {
        if (!String(form.title || "").trim()) return "Judul slide wajib diisi.";
        if (!String(form.image_url || "").trim() && !form.image_upload_base64) {
            return "Gambar slide wajib diupload.";
        }
        return "";
    }

    async function handleSave() {
        const validation = validateForm();
        if (validation) {
            setError(validation);
            return;
        }

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const payload = {
                title: String(form.title || "").trim(),
                caption: String(form.caption || "").trim(),
                image_url: String(form.image_url || "").trim(),
                image_upload_base64: form.image_upload_base64 || "",
                image_upload_name: form.image_upload_name || "",
                is_published: Boolean(form.is_published),
                sort_order: toNumber(form.sort_order, 0),
            };

            const url = editingId
                ? `/api/admin/homepage-slides/${editingId}`
                : "/api/admin/homepage-slides";
            const method = editingId ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await readJsonSafely(response);
            if (!response.ok) {
                throw new Error(data?.message || "Gagal menyimpan slide.");
            }

            setMessage(data?.message || "Slide berhasil disimpan.");
            handleCloseForm();
            await loadItems();
        } catch (err) {
            setError(err?.message || "Gagal menyimpan slide.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id) {
        const confirmDelete = window.confirm(
            "Yakin ingin menghapus slide ini? Tindakan ini tidak bisa dibatalkan.",
        );
        if (!confirmDelete) return;

        try {
            setDeletingId(id);
            setError("");
            setMessage("");

            const response = await fetch(`/api/admin/homepage-slides/${id}`, {
                method: "DELETE",
            });

            const data = await readJsonSafely(response);
            if (!response.ok) {
                throw new Error(data?.message || "Gagal menghapus slide.");
            }

            setMessage(data?.message || "Slide berhasil dihapus.");
            await loadItems();
        } catch (err) {
            setError(err?.message || "Gagal menghapus slide.");
        } finally {
            setDeletingId("");
        }
    }

    return (
        <section className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                            Slider Beranda
                        </p>
                        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                            Manajemen Slide Beranda
                        </h1>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Total {items.length} slide • {totalPublished} dipublikasikan
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleOpenCreate}
                        className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                    >
                        Tambah Slide
                    </button>
                </div>

                {message ? (
                    <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                        {message}
                    </div>
                ) : null}

                {error ? (
                    <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
                        {error}
                    </div>
                ) : null}

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse bg-white dark:bg-slate-900/40">
                            <thead className="bg-slate-50 dark:bg-slate-800/70">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Judul
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Caption
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Urutan
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-10 text-center text-sm text-slate-500"
                                        >
                                            Memuat data slide...
                                        </td>
                                    </tr>
                                ) : items.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-10 text-center text-sm text-slate-500"
                                        >
                                            Belum ada slide.
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-t border-slate-100 align-top dark:border-slate-800"
                                        >
                                            <td className="px-4 py-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                {item.title}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                                                {item.caption || "-"}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                                                {toNumber(item.sort_order, 0)}
                                            </td>
                                            <td className="px-4 py-4 text-sm">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.is_published
                                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                                        : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                                                        }`}
                                                >
                                                    {item.is_published ? "Publish" : "Draft"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-sm">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenEdit(item)}
                                                        className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-200"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item.id)}
                                                        disabled={deletingId === item.id}
                                                        className="rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900/60 dark:text-rose-300"
                                                    >
                                                        {deletingId === item.id ? "Menghapus..." : "Hapus"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {openForm ? (
                <div className="fixed inset-0 z-70 overflow-y-auto bg-slate-950/70 p-4">
                    <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
                        <div className="flex items-start justify-between gap-4 rounded-t-3xl border-b border-slate-200 px-6 py-5 dark:border-slate-800">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                                    Form Slider
                                </p>
                                <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                                    {editingId ? "Edit Slide" : "Tambah Slide"}
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={handleCloseForm}
                                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-700 dark:border-slate-700 dark:text-slate-300"
                            >
                                Tutup
                            </button>
                        </div>

                        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_260px]">
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Judul
                                    </label>
                                    <input
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        placeholder="Judul slide"
                                        className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Caption
                                    </label>
                                    <textarea
                                        name="caption"
                                        value={form.caption}
                                        onChange={handleChange}
                                        placeholder="Teks di bawah gambar"
                                        rows={4}
                                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Urutan
                                        </label>
                                        <input
                                            type="number"
                                            name="sort_order"
                                            value={form.sort_order}
                                            onChange={handleChange}
                                            className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                                        />
                                    </div>

                                    <label className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <input
                                            type="checkbox"
                                            name="is_published"
                                            checked={Boolean(form.is_published)}
                                            onChange={handleChange}
                                            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        Publish
                                    </label>
                                </div>

                                <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                                    <label className="block text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                                        Upload gambar slide
                                    </label>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        JPG/PNG/WEBP. Gambar akan diproses sebelum disimpan.
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageFileChange}
                                        className="mt-3 block w-full text-sm text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-emerald-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700"
                                    />
                                    {uploadingImage ? (
                                        <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-300">
                                            Memproses gambar...
                                        </p>
                                    ) : null}
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCloseForm}
                                        className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                    >
                                        Batal
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        disabled={saving || uploadingImage}
                                        className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
                                    >
                                        {saving ? "Menyimpan..." : "Simpan Slide"}
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    Preview gambar
                                </p>

                                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                                    {imagePreview ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={imagePreview}
                                            alt="Preview slide"
                                            className="h-64 w-full object-contain bg-slate-100 dark:bg-slate-800"
                                        />
                                    ) : (
                                        <div className="flex h-48 items-center justify-center px-4 text-center text-sm text-slate-500 dark:text-slate-400">
                                            Preview gambar akan muncul di sini.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}
