"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { normalizeCoverImageUrl } from "@/lib/cover-image";
import Image from "next/image";

const BERITA_CATEGORIES = [
  "Umum",
  "Kegiatan",
  "Madrasah",
  "Pelayanan",
  "Pengumuman",
  "Agenda",
  "Pendidikan",
  "Keagamaan",
];

const emptyForm = {
  title: "",
  slug: "",
  category: "Umum",
  excerpt: "",
  content: "",
  cover_image: "",
  is_published: true,
  published_at: "",
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

function slugPreview(title = "") {
  return String(title)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function ToolbarButton({ type = "button", onClick, children, title }) {
  return (
    <button
      type={type}
      onClick={onClick}
      title={title}
      className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      {children}
    </button>
  );
}

export default function AdminBeritaManager() {
  const editorRef = useRef(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [coverMode, setCoverMode] = useState("upload");
  const [form, setForm] = useState({
    ...emptyForm,
    published_at: toDateTimeLocal(new Date().toISOString()),
  });

  const titleForm = useMemo(() => {
    return editingId ? "Edit berita" : "Tambah berita";
  }, [editingId]);

  async function loadItems() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/berita", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Gagal memuat data berita.");
      }

      setItems(data?.items || []);
    } catch (err) {
      setError(err.message || "Gagal memuat data berita.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (!openForm || !editorRef.current) return;

    const nextHtml = form.content || "";
    if (editorRef.current.innerHTML !== nextHtml) {
      editorRef.current.innerHTML = nextHtml;
    }
  }, [openForm, form.content]);

  function resetForm() {
    setForm({
      ...emptyForm,
      published_at: toDateTimeLocal(new Date().toISOString()),
    });
    setCoverMode("upload");
    setEditingId(null);

    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
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

    const normalizedCoverImage = normalizeCoverImageUrl(item.cover_image || "");

    setForm({
      title: item.title || "",
      slug: item.slug || "",
      category: item.category || "Umum",
      excerpt: item.excerpt || "",
      content: item.content || "",
      cover_image: normalizedCoverImage,
      is_published: Boolean(item.is_published),
      published_at: toDateTimeLocal(item.published_at),
    });

    setCoverMode(normalizedCoverImage ? "link" : "upload");
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

  function syncEditorToState() {
    const html = editorRef.current?.innerHTML || "";

    setForm((prev) => ({
      ...prev,
      content: html,
    }));

    return html;
  }

  function handleEditorInput() {
    syncEditorToState();
  }

  function runEditorCommand(command, value = null) {
    editorRef.current?.focus();

    if (typeof document.execCommand !== "function") {
      setError(
        "Toolbar editor tidak didukung browser ini. Anda masih bisa menulis isi berita secara manual.",
      );
      return;
    }

    document.execCommand(command, false, value);
    syncEditorToState();
  }

  function handleBlockFormatChange(event) {
    const value = event.target.value;
    if (!value) return;

    runEditorCommand("formatBlock", value);
    event.target.value = "";
  }

  function enableCssStyling() {
    if (
      typeof document !== "undefined" &&
      typeof document.execCommand === "function"
    ) {
      document.execCommand("styleWithCSS", false, true);
    }
  }

  function handleFontFamilyChange(event) {
    const value = event.target.value;
    if (!value) return;

    editorRef.current?.focus();
    enableCssStyling();
    runEditorCommand("fontName", value);
    event.target.value = "";
  }

  function handleFontSizeChange(event) {
    const value = event.target.value;
    if (!value) return;

    editorRef.current?.focus();
    enableCssStyling();
    runEditorCommand("fontSize", value);
    event.target.value = "";
  }

  async function handleCoverUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/berita/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Gagal upload cover image.");
      }

      const nextCoverImage = normalizeCoverImageUrl(
        data?.cover_image || data?.url || "",
      );

      setForm((prev) => ({
        ...prev,
        cover_image: nextCoverImage,
      }));

      setMessage("Cover image berhasil diupload.");
    } catch (err) {
      setError(err.message || "Gagal upload cover image.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function handleCoverLinkChange(event) {
    const nextValue = event.target.value;
    const normalizedUrl = normalizeCoverImageUrl(nextValue);

    setForm((prev) => ({
      ...prev,
      cover_image: normalizedUrl,
    }));
  }

  function clearCoverImage() {
    setForm((prev) => ({
      ...prev,
      cover_image: "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const currentContent = syncEditorToState();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        ...form,
        is_published: Boolean(form.is_published),
        cover_image: normalizeCoverImageUrl(form.cover_image),
        content: currentContent || form.content || "",
      };

      const response = await fetch(
        editingId ? `/api/admin/berita/${editingId}` : "/api/admin/berita",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Gagal menyimpan berita.");
      }

      setMessage(data?.message || "Berita berhasil disimpan.");
      handleCloseForm();
      await loadItems();
    } catch (err) {
      setError(err.message || "Gagal menyimpan berita.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Hapus berita "${item.title}"?\nTindakan ini tidak bisa dibatalkan.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(item.id);
      setError("");
      setMessage("");

      const response = await fetch(`/api/admin/berita/${item.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Gagal menghapus berita.");
      }

      setMessage(data?.message || "Berita berhasil dihapus.");
      await loadItems();
    } catch (err) {
      setError(err.message || "Gagal menghapus berita.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="space-y-6">
      {(message || error) && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
            error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || message}
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Berita
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Daftar berita admin
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Kelola berita website: tambah, edit, hapus, cover image, kategori,
              dan status tayang.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            + Tambah Berita
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-slate-600">
                  <th className="px-4 py-3 text-left">No</th>
                  <th className="px-4 py-3 text-left">Judul</th>
                  <th className="px-4 py-3 text-left">Kategori</th>
                  <th className="px-4 py-3 text-left">Publish</th>
                  <th className="px-4 py-3 text-left">Dibaca</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      Memuat data berita...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      Belum ada berita.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr key={item.id} className="align-top">
                      <td className="px-4 py-4 text-slate-600">{index + 1}</td>

                      <td className="px-4 py-4">
                        <div className="flex items-start gap-3">
                          {item.cover_image ? (
                            <div className="relative h-16 w-24 overflow-hidden rounded-xl">
                              <Image
                                src={item.cover_image}
                                alt={item.title}
                                fill
                                sizes="96px"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-16 w-24 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400">
                              No image
                            </div>
                          )}

                          <div className="max-w-md">
                            <p className="font-semibold text-slate-900">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              /berita/{item.slug}
                            </p>
                            <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                              {item.excerpt}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-slate-700">
                        {item.category || "Umum"}
                      </td>

                      <td className="px-4 py-4 text-slate-700">
                        <div className="inline-flex items-center gap-2 text-sm">
                          <span>👁</span>
                          <span>
                            {Number(item.views || 0).toLocaleString("id-ID")}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            item.is_published
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {item.is_published ? "Tayang" : "Draft"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === item.id}
                            className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
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

      {openForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Form berita
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {titleForm}
                </h3>
              </div>

              <button
                type="button"
                onClick={handleCloseForm}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Judul berita
                  </span>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Masukkan judul berita"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Slug
                  </span>
                  <input
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder={slugPreview(form.title)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                  />
                  <span className="mt-2 block text-xs text-slate-500">
                    Kosongkan jika ingin dibuat otomatis dari judul.
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Kategori
                  </span>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                  >
                    {BERITA_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Tanggal publish
                  </span>
                  <input
                    type="datetime-local"
                    name="published_at"
                    value={form.published_at}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Ringkasan
                  </span>
                  <textarea
                    name="excerpt"
                    value={form.excerpt}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tulis ringkasan berita"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                    required
                  />
                </label>

                <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                  <div>
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Cover image
                    </span>
                    <p className="text-xs text-slate-500">
                      Bisa upload gambar atau tempel link gambar.
                    </p>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <input
                        type="radio"
                        name="cover_mode"
                        checked={coverMode === "upload"}
                        onChange={() => setCoverMode("upload")}
                      />
                      <span className="text-sm font-medium text-slate-700">
                        Upload file
                      </span>
                    </label>

                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <input
                        type="radio"
                        name="cover_mode"
                        checked={coverMode === "link"}
                        onChange={() => setCoverMode("link")}
                      />
                      <span className="text-sm font-medium text-slate-700">
                        Link gambar / URL
                      </span>
                    </label>
                  </div>

                  {coverMode === "upload" ? (
                    <div className="space-y-3">
                      <input
                        key="cover-upload"
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        onChange={handleCoverUpload}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                      />
                      <p className="text-xs text-slate-500">
                        Format yang didukung: JPG, PNG, WEBP, GIF. Ukuran
                        maksimal 5 MB.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        key="cover-link"
                        type="text"
                        value={form.cover_image ?? ""}
                        onChange={handleCoverLinkChange}
                        placeholder="Tempel link gambar cover"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}

                  {(uploading || form.cover_image) && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      {uploading ? (
                        <p className="text-sm text-slate-600">
                          Sedang upload cover image...
                        </p>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-slate-800">
                            Cover saat ini
                          </p>

                          <div className="relative h-64 w-full overflow-hidden rounded-xl">
                            <Image
                              src={form.cover_image}
                              alt="Preview cover berita"
                              fill
                              sizes="(max-width: 768px) 100vw, 768px"
                              className="object-cover"
                            />
                          </div>

                          <p className="mt-3 break-all text-xs text-slate-500">
                            {form.cover_image}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <a
                              href={form.cover_image}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              Lihat cover
                            </a>

                            <button
                              type="button"
                              onClick={clearCoverImage}
                              className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              Hapus cover
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-4 md:col-span-2">
                  <div>
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Isi berita
                    </span>
                    <p className="text-xs text-slate-500">
                      Gunakan toolbar untuk format teks seperti bold, italic,
                      heading, dan list.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <ToolbarButton
                      onClick={() => runEditorCommand("bold")}
                      title="Bold"
                    >
                      <strong>B</strong>
                    </ToolbarButton>

                    <ToolbarButton
                      onClick={() => runEditorCommand("italic")}
                      title="Italic"
                    >
                      <em>I</em>
                    </ToolbarButton>

                    <ToolbarButton
                      onClick={() => runEditorCommand("underline")}
                      title="Underline"
                    >
                      <span className="underline">U</span>
                    </ToolbarButton>

                    <ToolbarButton
                      onClick={() => runEditorCommand("insertUnorderedList")}
                      title="Bullet List"
                    >
                      • List
                    </ToolbarButton>

                    <ToolbarButton
                      onClick={() => runEditorCommand("insertOrderedList")}
                      title="Number List"
                    >
                      1. List
                    </ToolbarButton>

                    <ToolbarButton
                      onClick={() => runEditorCommand("justifyLeft")}
                      title="Rata kiri"
                    >
                      Left
                    </ToolbarButton>

                    <ToolbarButton
                      onClick={() => runEditorCommand("justifyCenter")}
                      title="Rata tengah"
                    >
                      Center
                    </ToolbarButton>

                    <ToolbarButton
                      onClick={() => runEditorCommand("justifyRight")}
                      title="Rata kanan"
                    >
                      Right
                    </ToolbarButton>

                    <ToolbarButton
                      onClick={() => runEditorCommand("justifyFull")}
                      title="Rata kanan-kiri / justify"
                    >
                      Justify
                    </ToolbarButton>

                    <select
                      onChange={handleFontFamilyChange}
                      defaultValue=""
                      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                    >
                      <option value="" disabled>
                        Font
                      </option>
                      <option value="Arial">Arial</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Tahoma">Tahoma</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Courier New">Courier New</option>
                    </select>

                    <select
                      onChange={handleFontSizeChange}
                      defaultValue=""
                      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                    >
                      <option value="" disabled>
                        Ukuran Font
                      </option>
                      <option value="1">Sangat Kecil</option>
                      <option value="2">Kecil</option>
                      <option value="3">Normal</option>
                      <option value="4">Sedang</option>
                      <option value="5">Besar</option>
                      <option value="6">Sangat Besar</option>
                      <option value="7">Ekstra Besar</option>
                    </select>

                    <select
                      onChange={handleBlockFormatChange}
                      defaultValue=""
                      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"
                    >
                      <option value="" disabled>
                        Ukuran / Heading
                      </option>
                      <option value="p">Paragraf Normal</option>
                      <option value="h1">Heading 1</option>
                      <option value="h2">Heading 2</option>
                      <option value="h3">Heading 3</option>
                      <option value="blockquote">Quote</option>
                    </select>
                  </div>

                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleEditorInput}
                    className="min-h-[280px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm leading-7 text-slate-800 outline-none focus:border-emerald-500"
                    style={{ whiteSpace: "pre-wrap" }}
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={form.is_published}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Langsung tayang ke publik
                  </span>
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70"
                >
                  {saving
                    ? "Menyimpan..."
                    : editingId
                      ? "Update Berita"
                      : "Simpan Berita"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
