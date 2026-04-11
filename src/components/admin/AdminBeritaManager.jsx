"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  normalizeCoverImageUrl,
  toCoverPreviewUrl,
} from "@/lib/cover-image";

const ITEMS_PER_PAGE = 5;

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
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

function stripHtml(html = "") {
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateText(value = "", maxLength = 120) {
  if (!value) return "";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3).trim()}...`;
}

function countWords(value = "") {
  const plain = stripHtml(value);
  return plain ? plain.split(/\s+/).filter(Boolean).length : 0;
}

function estimateReadingTime(value = "") {
  const totalWords = countWords(value);
  if (totalWords === 0) return 1;
  return Math.max(1, Math.ceil(totalWords / 200));
}

function isMeaningfulHtml(html = "") {
  return stripHtml(html).length > 0;
}

function isHttpUrl(value = "") {
  try {
    const url = new URL(String(value || "").trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getAllowedCoverHosts() {
  const hosts = new Set(["drive.google.com", "docs.google.com"]);

  if (typeof window !== "undefined") {
    hosts.add(window.location.hostname);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      hosts.add(new URL(supabaseUrl).hostname);
    } catch {
      // abaikan env tidak valid
    }
  }

  return hosts;
}

function isAllowedCoverUrl(value = "") {
  if (!value) return true;
  if (!isHttpUrl(value)) return false;

  try {
    const url = new URL(value);
    return getAllowedCoverHosts().has(url.hostname);
  } catch {
    return false;
  }
}

function buildPagination(totalPages, currentPage) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage, "...", totalPages];
}

function StatCard({ label, value, helper }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>
    </div>
  );
}

function ToolbarButton({ type = "button", onClick, children, title }) {
  return (
    <button
      type={type}
      onClick={onClick}
      title={title}
      className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
    >
      {children}
    </button>
  );
}

function StatusPill({ published }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${published
        ? "bg-emerald-100 text-emerald-700"
        : "bg-amber-100 text-amber-700"
        }`}
    >
      {published ? "Tayang" : "Draft"}
    </span>
  );
}

function CoverThumb({
  src,
  alt = "Cover berita",
  className = "",
  fallbackText = "Belum ada cover",
}) {
  const [failedSrc, setFailedSrc] = useState("");

  const showFallback = !src || failedSrc === src;

  if (showFallback) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm text-slate-400 ${className}`.trim()}
      >
        {fallbackText}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailedSrc(src)}
      className={`rounded-2xl object-cover ${className}`.trim()}
    />
  );
}

function FieldCounter({ current, helper }) {
  return (
    <div className="flex items-center justify-between text-xs text-slate-500">
      <span>{helper}</span>
      <span>{current}</span>
    </div>
  );
}

function ToggleSwitch({ checked, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-emerald-600" : "bg-slate-300"
          }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${checked ? "left-6" : "left-1"
            }`}
        />
      </button>
    </div>
  );
}

export default function AdminBeritaManager() {
  const editorRef = useRef(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [dirty, setDirty] = useState(false);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [form, setForm] = useState({
    ...emptyForm,
    published_at: toDateTimeLocal(new Date().toISOString()),
  });

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

      setItems(Array.isArray(data?.items) ? data.items : []);
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

  useEffect(() => {
    if (!openForm || !dirty) return;

    function handleBeforeUnload(event) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [openForm, dirty]);

  const titleForm = useMemo(() => {
    return editingId ? "Edit berita" : "Tambah berita";
  }, [editingId]);

  const stats = useMemo(() => {
    const total = items.length;
    const published = items.filter((item) => Boolean(item.is_published)).length;
    const draft = total - published;
    const views = items.reduce((acc, item) => acc + Number(item.views || 0), 0);

    return {
      total,
      published,
      draft,
      views,
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && Boolean(item.is_published)) ||
        (statusFilter === "draft" && !Boolean(item.is_published));

      const haystack = [item.title, item.slug, item.category, item.excerpt]
        .join(" ")
        .toLowerCase();

      const matchesKeyword = !keyword || haystack.includes(keyword);

      return matchesStatus && matchesKeyword;
    });
  }, [items, query, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / ITEMS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );
  const paginationItems = buildPagination(totalPages, safeCurrentPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const wordCount = useMemo(() => countWords(form.content), [form.content]);
  const readingTime = useMemo(
    () => estimateReadingTime(form.content || form.excerpt),
    [form.content, form.excerpt],
  );

  const previewCover = useMemo(
    () => normalizeCoverImageUrl(form.cover_image || ""),
    [form.cover_image],
  );

  const coverPreviewUrl = useMemo(() => {
    return toCoverPreviewUrl(previewCover);
  }, [previewCover]);

  const previewSlug = useMemo(() => {
    return (form.slug || slugPreview(form.title) || "judul-berita").trim();
  }, [form.slug, form.title]);

  function resetForm() {
    setForm({
      ...emptyForm,
      published_at: toDateTimeLocal(new Date().toISOString()),
    });
    setEditingId(null);
    setSlugManuallyEdited(false);
    setDirty(false);

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
    setSlugManuallyEdited(true);

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

    setDirty(false);
    setOpenForm(true);
  }

  function confirmDiscardChanges() {
    if (!dirty) return true;

    return window.confirm(
      "Perubahan belum disimpan. Tutup form dan buang perubahan?",
    );
  }

  function handleCloseForm() {
    if (!confirmDiscardChanges()) return;
    setOpenForm(false);
    resetForm();
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((prev) => {
      if (name === "title") {
        const nextTitle = value;

        return {
          ...prev,
          title: nextTitle,
          slug: slugManuallyEdited ? prev.slug : slugPreview(nextTitle),
        };
      }

      if (name === "slug") {
        return {
          ...prev,
          slug: value,
        };
      }

      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });

    if (name === "slug") {
      setSlugManuallyEdited(true);
    }

    setDirty(true);
  }

  function handlePublishedToggle(nextValue) {
    setForm((prev) => ({
      ...prev,
      is_published: nextValue,
    }));
    setDirty(true);
  }

  function syncEditorToState() {
    const html = editorRef.current?.innerHTML || "";

    setForm((prev) => {
      if (prev.content === html) return prev;
      return { ...prev, content: html };
    });

    return html;
  }

  function handleEditorInput() {
    syncEditorToState();
    setDirty(true);
  }

  function runEditorCommand(command, value = null) {
    editorRef.current?.focus();

    if (
      typeof document === "undefined" ||
      typeof document.execCommand !== "function"
    ) {
      setError(
        "Toolbar editor tidak didukung browser ini. Anda masih bisa menulis isi berita secara manual.",
      );
      return;
    }

    try {
      document.execCommand(command, false, value);
      syncEditorToState();
      setDirty(true);
    } catch {
      setError("Perintah editor gagal dijalankan.");
    }
  }

  function handleInsertLink() {
    const url = window.prompt(
      "Tempel tautan yang ingin dimasukkan:",
      "https://",
    );
    if (!url) return;
    runEditorCommand("createLink", url);
  }

  function handleCoverLinkChange(event) {
    const normalizedUrl = normalizeCoverImageUrl(event.target.value);
    setForm((prev) => ({
      ...prev,
      cover_image: normalizedUrl,
    }));
    setDirty(true);
  }

  function clearCoverImage() {
    setForm((prev) => ({
      ...prev,
      cover_image: "",
    }));
    setDirty(true);
  }

  function buildPayload(nextPublishedState = form.is_published) {
    const currentContent = syncEditorToState();
    const normalizedCoverImage = normalizeCoverImageUrl(form.cover_image);
    const finalSlug = (form.slug || slugPreview(form.title)).trim();

    if (!form.title.trim()) {
      setError("Judul berita wajib diisi.");
      return null;
    }

    if (!finalSlug) {
      setError("Slug berita wajib diisi.");
      return null;
    }

    if (!form.excerpt.trim()) {
      setError("Ringkasan berita wajib diisi.");
      return null;
    }

    if (!isMeaningfulHtml(currentContent || form.content)) {
      setError("Isi berita wajib diisi.");
      return null;
    }

    if (normalizedCoverImage && !isAllowedCoverUrl(normalizedCoverImage)) {
      setError(
        "Link cover hanya mendukung Google Drive, domain website sendiri, atau Supabase Storage publik.",
      );
      return null;
    }

    let publishedAtIso = "";
    if (form.published_at) {
      const publishedDate = new Date(form.published_at);

      if (Number.isNaN(publishedDate.getTime())) {
        setError("Tanggal publish tidak valid.");
        return null;
      }

      publishedAtIso = publishedDate.toISOString();
    }

    return {
      ...form,
      title: form.title.trim(),
      slug: finalSlug,
      category: form.category || "Umum",
      excerpt: form.excerpt.trim(),
      content: currentContent || form.content || "",
      cover_image: normalizedCoverImage,
      is_published: Boolean(nextPublishedState),
      published_at: publishedAtIso,
    };
  }

  async function saveForm(nextPublishedState = form.is_published) {
    const payload = buildPayload(nextPublishedState);
    if (!payload) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch(
        editingId ? `/api/admin/berita/${editingId}` : "/api/admin/berita",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Gagal menyimpan berita.");
      }

      setMessage(data?.message || "Berita berhasil disimpan.");
      setDirty(false);
      setOpenForm(false);
      resetForm();
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
          className={`rounded-2xl border px-4 py-3 text-sm ${error
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
        >
          {error || message}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total berita"
          value={stats.total.toLocaleString("id-ID")}
          helper="Seluruh berita yang tersimpan di panel admin."
        />
        <StatCard
          label="Sedang tayang"
          value={stats.published.toLocaleString("id-ID")}
          helper="Jumlah berita yang sudah tampil di website publik."
        />
        <StatCard
          label="Draft"
          value={stats.draft.toLocaleString("id-ID")}
          helper="Berita yang masih ditahan dan belum ditayangkan."
        />
        <StatCard
          label="Total pembaca"
          value={stats.views.toLocaleString("id-ID")}
          helper="Akumulasi views dari seluruh berita."
        />
      </div>

      <div className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
              Berita
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Daftar berita admin
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Kelola artikel, cari data lebih cepat, lalu buka form editor dengan
              workflow yang lebih rapi.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            + Tambah berita
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_220px]">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Cari berita
            </label>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari judul, slug, kategori, atau ringkasan..."
              className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Filter status
            </label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500"
            >
              <option value="all">Semua status</option>
              <option value="published">Tayang</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-500">
          Menampilkan {paginatedItems.length.toLocaleString("id-ID")} dari{" "}
          {filteredItems.length.toLocaleString("id-ID")} berita
        </div>

        <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                <th className="w-16 px-5 py-4">No</th>
                <th className="px-5 py-4">Judul</th>
                <th className="px-5 py-4">Kategori</th>
                <th className="px-5 py-4">Publish</th>
                <th className="px-5 py-4">Dibaca</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-sm text-slate-500"
                  >
                    Memuat data berita...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-sm text-slate-500"
                  >
                    Belum ada berita yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item, index) => {
                  const rowNumber = startIndex + index + 1;

                  return (
                    <tr key={item.id} className="align-top">
                      <td className="px-5 py-4 text-sm font-semibold text-slate-500">
                        {rowNumber}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-emerald-700">
                          /berita/{item.slug}
                        </p>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                          {truncateText(
                            item.excerpt || "Tidak ada ringkasan.",
                            120,
                          )}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {item.category || "Umum"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {formatDate(item.published_at)}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {Number(item.views || 0).toLocaleString("id-ID")}
                      </td>

                      <td className="px-5 py-4">
                        <StatusPill published={Boolean(item.is_published)} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === item.id}
                            className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === item.id ? "Menghapus..." : "Hapus"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredItems.length > ITEMS_PER_PAGE ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              Halaman {safeCurrentPage} dari {totalPages}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safeCurrentPage === 1}
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ←
              </button>

              {paginationItems.map((item, index) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="inline-flex h-10 min-w-10 items-center justify-center px-2 text-sm font-semibold text-slate-500"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCurrentPage(item)}
                    className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition ${item === safeCurrentPage
                      ? "border-emerald-700 bg-emerald-700 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
                      }`}
                  >
                    {item}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={safeCurrentPage === totalPages}
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                →
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {openForm ? (
        <div className="fixed inset-0 z-50 bg-slate-950/55 p-3 md:p-5">
          <div className="mx-auto flex h-full max-w-330 flex-col overflow-hidden rounded-4xl bg-white shadow-2xl ring-1 ring-slate-200">
            <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 md:flex-row md:items-start md:justify-between md:px-6 md:py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                  Form berita
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {titleForm}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {dirty
                    ? "Ada perubahan yang belum disimpan."
                    : "Form siap disimpan."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseForm}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                saveForm(form.is_published);
              }}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-6 md:py-6">
                <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="min-w-0 space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <label className="space-y-2 md:col-span-2">
                        <span className="block text-sm font-medium text-slate-700">
                          Judul berita
                        </span>
                        <input
                          type="text"
                          name="title"
                          value={form.title}
                          onChange={handleChange}
                          placeholder="Tulis judul berita"
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                        />
                        <FieldCounter
                          current={form.title.length}
                          helper="Usahakan judul tetap padat dan jelas."
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="block text-sm font-medium text-slate-700">
                          Slug
                        </span>
                        <input
                          type="text"
                          name="slug"
                          value={form.slug}
                          onChange={handleChange}
                          placeholder="slug-berita"
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                        />
                        <FieldCounter
                          current={previewSlug.length}
                          helper={`/berita/${previewSlug}`}
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="block text-sm font-medium text-slate-700">
                          Kategori
                        </span>
                        <select
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                        >
                          {BERITA_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="space-y-2">
                        <span className="block text-sm font-medium text-slate-700">
                          Tanggal publish
                        </span>
                        <input
                          type="datetime-local"
                          name="published_at"
                          value={form.published_at}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                        />
                      </label>

                      <label className="space-y-2 md:col-span-2">
                        <span className="block text-sm font-medium text-slate-700">
                          Ringkasan
                        </span>
                        <textarea
                          name="excerpt"
                          value={form.excerpt}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Tulis ringkasan singkat berita"
                          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                        />
                        <FieldCounter
                          current={form.excerpt.length}
                          helper="Ringkasan ini tampil di listing berita publik."
                        />
                      </label>
                    </div>

                    <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 md:p-5">
                      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Editor isi berita
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Fokus pada struktur yang rapi, heading seperlunya, dan
                            isi yang enak dibaca.
                          </p>
                        </div>

                        <div className="text-xs text-slate-500">
                          {wordCount.toLocaleString("id-ID")} kata •{" "}
                          {readingTime} menit baca
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <ToolbarButton
                          onClick={() => runEditorCommand("bold")}
                          title="Bold"
                        >
                          Bold
                        </ToolbarButton>
                        <ToolbarButton
                          onClick={() => runEditorCommand("italic")}
                          title="Italic"
                        >
                          Italic
                        </ToolbarButton>
                        <ToolbarButton
                          onClick={() => runEditorCommand("underline")}
                          title="Underline"
                        >
                          Underline
                        </ToolbarButton>
                        <ToolbarButton
                          onClick={() => runEditorCommand("formatBlock", "h2")}
                          title="Heading 2"
                        >
                          H2
                        </ToolbarButton>
                        <ToolbarButton
                          onClick={() => runEditorCommand("formatBlock", "h3")}
                          title="Heading 3"
                        >
                          H3
                        </ToolbarButton>
                        <ToolbarButton
                          onClick={() =>
                            runEditorCommand("formatBlock", "blockquote")
                          }
                          title="Quote"
                        >
                          Quote
                        </ToolbarButton>
                        <ToolbarButton
                          onClick={() => runEditorCommand("insertUnorderedList")}
                          title="Bullet list"
                        >
                          • List
                        </ToolbarButton>
                        <ToolbarButton
                          onClick={() => runEditorCommand("insertOrderedList")}
                          title="Number list"
                        >
                          1. List
                        </ToolbarButton>
                        <ToolbarButton onClick={handleInsertLink} title="Tautan">
                          Link
                        </ToolbarButton>
                        <ToolbarButton
                          onClick={() => runEditorCommand("removeFormat")}
                          title="Hapus format"
                        >
                          Reset format
                        </ToolbarButton>
                      </div>

                      <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={handleEditorInput}
                        className="mt-4 min-h-80 w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm leading-7 text-slate-800 outline-none focus:border-emerald-500 md:min-h-95 xl:min-h-107.5"
                        style={{ whiteSpace: "pre-wrap" }}
                      />

                      <p className="mt-3 text-xs leading-6 text-slate-500">
                        Gunakan heading dan list seperlunya. Hindari formatting
                        berlebihan agar tampilan artikel tetap konsisten di website
                        publik.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 xl:sticky xl:top-0 xl:max-h-[calc(100vh-13rem)] xl:self-start xl:overflow-y-auto xl:pr-1">
                    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-sm font-semibold text-slate-900">
                        Pengaturan publikasi
                      </p>

                      <div className="mt-4">
                        <ToggleSwitch
                          checked={form.is_published}
                          onChange={handlePublishedToggle}
                          label="Tayangkan setelah disimpan"
                          description="Aktifkan untuk langsung menampilkan berita di website publik."
                        />
                      </div>

                      <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm">
                        <div className="flex items-start justify-between gap-4 py-2">
                          <span className="text-slate-500">Status</span>
                          <span className="font-semibold text-slate-900">
                            {form.is_published ? "Tayang" : "Draft"}
                          </span>
                        </div>
                        <div className="flex items-start justify-between gap-4 py-2">
                          <span className="text-slate-500">Kategori</span>
                          <span className="font-semibold text-slate-900">
                            {form.category}
                          </span>
                        </div>
                        <div className="flex items-start justify-between gap-4 py-2">
                          <span className="text-slate-500">Jumlah kata</span>
                          <span className="font-semibold text-slate-900">
                            {wordCount.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <div className="flex items-start justify-between gap-4 py-2">
                          <span className="text-slate-500">Estimasi baca</span>
                          <span className="font-semibold text-slate-900">
                            {readingTime} menit
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900">
                          Cover image
                        </p>

                        {form.cover_image ? (
                          <button
                            type="button"
                            onClick={clearCoverImage}
                            className="text-xs font-semibold text-red-600 transition hover:text-red-700"
                          >
                            Hapus cover
                          </button>
                        ) : null}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Gunakan link gambar publik dari Google Drive, Supabase
                        Storage, atau domain website sendiri.
                      </p>

                      <input
                        type="text"
                        value={form.cover_image ?? ""}
                        onChange={handleCoverLinkChange}
                        placeholder="Tempel link gambar cover"
                        className="mt-4 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                      />

                      <div className="mt-4">
                        <CoverThumb
                          src={coverPreviewUrl}
                          alt="Preview cover berita"
                          className="h-44 w-full"
                          fallbackText="Preview cover tidak tersedia"
                        />
                      </div>

                      <div className="mt-3 space-y-2 text-xs leading-6 text-slate-500">
                        {form.cover_image ? (
                          <p className="break-all">{form.cover_image}</p>
                        ) : null}

                        <p>
                          Jika preview tetap tidak muncul, pastikan file Google
                          Drive diatur ke
                          <span className="font-semibold text-slate-700">
                            {" "}
                            Siapa saja yang memiliki link
                          </span>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 bg-white/95 px-5 py-4 shadow-[0_-8px_24px_rgba(15,23,42,0.06)] backdrop-blur md:px-6">
                <div className="flex flex-wrap items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    onClick={() => saveForm(false)}
                    disabled={saving}
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-amber-300 bg-amber-50 px-5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Menyimpan..." : "Simpan sebagai draft"}
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? "Menyimpan..."
                      : form.is_published
                        ? editingId
                          ? "Simpan & tayangkan"
                          : "Publikasikan berita"
                        : "Simpan perubahan"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}