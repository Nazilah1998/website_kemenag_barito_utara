"use client";

import { useEffect, useMemo, useState } from "react";

const CATEGORY_OPTIONS = [
  "Informasi",
  "Edaran",
  "Jadwal",
  "Hasil Seleksi",
  "Layanan",
  "Pemberitahuan",
];

const emptyForm = {
  title: "",
  slug: "",
  category: "Informasi",
  excerpt: "",
  content: "",
  is_published: true,
  is_important: false,
  published_at: "",
  attachment_url: "",
  attachment_name: "",
  attachment_path: "",
  attachment_source: "",
  attachment_type: "",
};

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function toDateTimeLocal(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";

  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - timezoneOffset);

  return localDate.toISOString().slice(0, 16);
}

function slugPreview(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function inferAttachmentTypeFromUrl(url) {
  const lower = String(url || "").toLowerCase();

  if (lower.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?|$)/)) return "image";
  if (lower.match(/\.pdf(\?|$)/)) return "pdf";
  if (lower.includes("drive.google.com")) return "link";

  return "link";
}

function getAttachmentBadge(type) {
  if (type === "image") return "Lampiran Gambar";
  if (type === "pdf") return "Lampiran PDF";
  if (type) return "Lampiran Link";
  return "Tanpa Lampiran";
}

export default function AdminPengumumanManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [attachmentMode, setAttachmentMode] = useState("upload");
  const [form, setForm] = useState({
    ...emptyForm,
    published_at: toDateTimeLocal(new Date().toISOString()),
  });

  const titleForm = useMemo(() => {
    return editingId ? "Edit Pengumuman" : "Tambah Pengumuman";
  }, [editingId]);

  async function loadItems() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/pengumuman", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Gagal memuat data pengumuman.");
      }

      setItems(data?.items || []);
    } catch (err) {
      setError(err.message || "Gagal memuat data pengumuman.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function resetForm() {
    setForm({
      ...emptyForm,
      published_at: toDateTimeLocal(new Date().toISOString()),
    });
    setAttachmentMode("upload");
    setEditingId(null);
  }

  function handleOpenCreate() {
    setMessage("");
    setError("");
    resetForm();
    setOpenForm(true);
  }

  function handleOpenEdit(item) {
    setMessage("");
    setError("");
    setEditingId(item.id);

    setForm({
      title: item.title || "",
      slug: item.slug || "",
      category: item.category || "Informasi",
      excerpt: item.excerpt || "",
      content: item.content || "",
      is_published: Boolean(item.is_published),
      is_important: Boolean(item.is_important),
      published_at: toDateTimeLocal(item.published_at),
      attachment_url: item.attachment_url || "",
      attachment_name: item.attachment_name || "",
      attachment_path: item.attachment_path || "",
      attachment_source: item.attachment_source || "",
      attachment_type: item.attachment_type || "",
    });

    setAttachmentMode(item.attachment_source === "link" ? "link" : "upload");
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

  async function handleAttachmentUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/pengumuman/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Gagal upload lampiran.");
      }

      setForm((prev) => ({
        ...prev,
        attachment_url: data?.item?.attachment_url || "",
        attachment_name: data?.item?.attachment_name || "",
        attachment_path: data?.item?.attachment_path || "",
        attachment_source: data?.item?.attachment_source || "",
        attachment_type: data?.item?.attachment_type || "",
      }));

      setMessage("Lampiran berhasil diupload.");
    } catch (err) {
      setError(err.message || "Gagal upload lampiran.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function handleAttachmentLinkChange(event) {
    const url = event.target.value;

    setForm((prev) => ({
      ...prev,
      attachment_url: url,
      attachment_name: url ? "Link Lampiran" : "",
      attachment_path: "",
      attachment_source: url ? "link" : "",
      attachment_type: url ? inferAttachmentTypeFromUrl(url) : "",
    }));
  }

  function clearAttachment() {
    setForm((prev) => ({
      ...prev,
      attachment_url: "",
      attachment_name: "",
      attachment_path: "",
      attachment_source: "",
      attachment_type: "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch(
        editingId
          ? `/api/admin/pengumuman/${editingId}`
          : "/api/admin/pengumuman",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Gagal menyimpan pengumuman.");
      }

      setMessage(data?.message || "Pengumuman berhasil disimpan.");
      handleCloseForm();
      await loadItems();
    } catch (err) {
      setError(err.message || "Gagal menyimpan pengumuman.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Hapus pengumuman "${item.title}"?\nTindakan ini tidak bisa dibatalkan.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(item.id);
      setError("");
      setMessage("");

      const response = await fetch(`/api/admin/pengumuman/${item.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Gagal menghapus pengumuman.");
      }

      setMessage(data?.message || "Pengumuman berhasil dihapus.");
      await loadItems();
    } catch (err) {
      setError(err.message || "Gagal menghapus pengumuman.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="space-y-6">
      {(message || error) && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${error
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
        >
          {error || message}
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
              Manajemen Pengumuman
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Daftar Pengumuman Admin
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Fokus pengumuman adalah informasi resmi yang ringkas, penting,
              dan bisa ditindaklanjuti. Lampiran dibuat lebih menonjol daripada
              visual seperti pada fitur berita.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center rounded-2xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800"
          >
            + Tambah Pengumuman
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Memuat data pengumuman...
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Belum ada pengumuman
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Tambahkan pengumuman pertama agar informasi resmi bisa tampil di
            website.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item, index) => (
            <article
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                      #{index + 1}
                    </span>
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">
                      {item.category || "Informasi"}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 ${item.is_published
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                        }`}
                    >
                      {item.is_published ? "Tayang" : "Draft"}
                    </span>
                    {item.is_important ? (
                      <span className="rounded-full bg-red-50 px-3 py-1 text-red-700">
                        Penting
                      </span>
                    ) : null}
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-violet-700">
                      {getAttachmentBadge(item.attachment_type)}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      /pengumuman/{item.slug}
                    </p>
                  </div>

                  <p className="text-sm leading-6 text-slate-600">
                    {item.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    <span>Publish: {formatDate(item.published_at)}</span>
                    {item.attachment_url ? (
                      <a
                        href={item.attachment_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-sky-700 hover:text-sky-800"
                      >
                        Buka lampiran
                      </a>
                    ) : null}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    disabled={deletingId === item.id}
                    className="rounded-2xl border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === item.id ? "Menghapus..." : "Hapus"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {openForm ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 p-4">
          <div className="mx-auto max-w-4xl rounded-3xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-xl font-bold text-slate-900">{titleForm}</h2>
              <p className="mt-1 text-sm text-slate-600">
                Gunakan fitur ini untuk konten resmi yang singkat, jelas, dan
                memiliki lampiran atau tindak lanjut.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Judul Pengumuman
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Contoh: Pengumuman Libur Pelayanan Hari Raya"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="Opsional, akan dibuat otomatis jika kosong"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Preview: /pengumuman/
                    {slugPreview(form.slug || form.title) || "slug-otomatis"}
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
                  >
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Tanggal Publish
                  </label>
                  <input
                    type="datetime-local"
                    name="published_at"
                    value={form.published_at}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center gap-6 pt-7">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="is_published"
                      checked={form.is_published}
                      onChange={handleChange}
                    />
                    Tampilkan di website
                  </label>

                  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="is_important"
                      checked={form.is_important}
                      onChange={handleChange}
                    />
                    Tandai penting
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Ringkasan Singkat
                  </label>
                  <textarea
                    name="excerpt"
                    value={form.excerpt}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tuliskan ringkasan singkat pengumuman agar mudah dipahami dari daftar halaman."
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Isi Pengumuman
                  </label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows={8}
                    placeholder="Tulis isi pengumuman dengan gaya formal, jelas, dan mudah ditindaklanjuti."
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
                    required
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Lampiran Pengumuman
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Untuk pengumuman, lampiran lebih penting daripada cover
                      image. Kamu bisa upload file atau pakai link.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAttachmentMode("upload")}
                      className={`rounded-2xl px-4 py-2 text-sm font-medium ${attachmentMode === "upload"
                        ? "bg-sky-700 text-white"
                        : "bg-white text-slate-700 border border-slate-200"
                        }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttachmentMode("link")}
                      className={`rounded-2xl px-4 py-2 text-sm font-medium ${attachmentMode === "link"
                        ? "bg-sky-700 text-white"
                        : "bg-white text-slate-700 border border-slate-200"
                        }`}
                    >
                      Pakai Link
                    </button>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {attachmentMode === "upload" ? (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-800">
                        Upload Lampiran
                      </label>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.gif,.pdf"
                        onChange={handleAttachmentUpload}
                        className="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
                      />
                      <p className="mt-2 text-xs text-slate-500">
                        Format yang didukung: JPG, PNG, WEBP, GIF, PDF.
                      </p>
                      {uploading ? (
                        <p className="mt-2 text-sm text-sky-700">
                          Mengupload lampiran...
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-800">
                        URL Lampiran
                      </label>
                      <input
                        type="url"
                        value={form.attachment_url}
                        onChange={handleAttachmentLinkChange}
                        placeholder="https://..."
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
                      />
                    </div>
                  )}

                  {form.attachment_url ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Lampiran aktif
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {form.attachment_name || "Lampiran Pengumuman"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 break-all">
                            {form.attachment_url}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <a
                            href={form.attachment_url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Buka
                          </a>
                          <button
                            type="button"
                            onClick={clearAttachment}
                            className="rounded-2xl border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                          >
                            Hapus Lampiran
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 md:flex-row md:justify-end">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Simpan Pengumuman"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}