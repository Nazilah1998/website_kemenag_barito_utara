"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { compressImageToBase64 } from "@/lib/image-compress";
import { toCoverPreviewUrl } from "@/lib/cover-image";

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
  content: "",
  cover_image: "",
  cover_upload_base64: "",
  cover_upload_name: "",
  cover_upload_size_kb: 0,
  is_published: true,
  published_at: "",
};

const emptyGalleryForm = {
  berita_id: "",
  title: "",
  slug: "",
  image_url: "",
  gallery_upload_base64: "",
  gallery_upload_name: "",
  gallery_upload_size_kb: 0,
  link_url: "",
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

function getYearKey(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return String(date.getFullYear());
}

function getMonthKey(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function getMonthLabelFromKey(key) {
  if (!key) return "Semua bulan";
  const [year, month] = key.split("-").map(Number);
  if (!year || !month) return key;

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
}

function toDateTimeLocal(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - timezoneOffset);
  return localDate.toISOString().slice(0, 16);
}

function slugPreview(title = "") {
  return String(title || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function stripHtml(html = "") {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
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

function buildExcerptFromHtml(html = "", maxLength = 180) {
  const plain = stripHtml(html);
  if (!plain) return "";
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength - 3).trim()}...`;
}

function isMeaningfulHtml(html = "") {
  return stripHtml(html).length > 0;
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

async function readJsonSafely(response) {
  const raw = await response.text();
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function StatCard({ label, value, helper }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
    </div>
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
  alt = "Preview gambar",
  className = "",
  fallbackText = "Belum ada gambar",
}) {
  const [failedSrc, setFailedSrc] = useState("");

  const showFallback = !src || failedSrc === src;

  if (showFallback) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center text-sm text-slate-500 ${className}`.trim()}
      >
        {fallbackText}
      </div>
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onError={() => setFailedSrc(src)}
        className={`rounded-2xl object-cover ${className}`.trim()}
      />
    </>
  );
}

function ToggleSwitch({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-emerald-600" : "bg-slate-300"
          }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-1"
            }`}
        />
      </button>
    </div>
  );
}

function IconBold() {
  return <span className="text-sm font-black">B</span>;
}

function IconItalic() {
  return <span className="text-sm font-semibold italic">I</span>;
}

function IconUnderline() {
  return <span className="text-sm font-semibold underline">U</span>;
}

function IconH2() {
  return <span className="text-[10px] font-bold">H2</span>;
}

function IconH3() {
  return <span className="text-[10px] font-bold">H3</span>;
}

function IconAlignLeft() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h14" />
      <path d="M4 10h10" />
      <path d="M4 14h14" />
      <path d="M4 18h10" />
    </svg>
  );
}

function IconAlignCenter() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 6h14" />
      <path d="M7 10h10" />
      <path d="M5 14h14" />
      <path d="M7 18h10" />
    </svg>
  );
}

function IconAlignRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6h14" />
      <path d="M10 10h10" />
      <path d="M6 14h14" />
      <path d="M10 18h10" />
    </svg>
  );
}

function IconJustify() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16" />
      <path d="M4 10h16" />
      <path d="M4 14h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

function IconQuote() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M9.2 6C6.7 6.8 5 9 5 11.6V18h6v-6H8.1c.1-1.6 1.2-3 2.9-3.6L9.2 6Zm9 0C15.7 6.8 14 9 14 11.6V18h6v-6h-2.9c.1-1.6 1.2-3 2.9-3.6L18.2 6Z" />
    </svg>
  );
}

function IconBullet() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="5" cy="7" r="1.5" fill="currentColor" />
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="5" cy="17" r="1.5" fill="currentColor" />
      <path d="M9 7h10" />
      <path d="M9 12h10" />
      <path d="M9 17h10" />
    </svg>
  );
}

function IconNumber() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h1.5V4.5" />
      <path d="M4 4.5h2v5" />
      <path d="M4 14.5c0-1.1.9-2 2-2s2 .9 2 2c0 .7-.4 1.3-1 1.7L4 19.5h4" />
      <path d="M10 7h10" />
      <path d="M10 12h10" />
      <path d="M10 17h10" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 1 0-7l1.5-1.5a5 5 0 0 1 7 7L17 13" />
      <path d="M14 11a5 5 0 0 1 0 7L12.5 19.5a5 5 0 0 1-7-7L7 11" />
    </svg>
  );
}

function IconClear() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 20h16" />
      <path d="M8 4h8l2 2-8 8-4-4 2-6Z" />
      <path d="M13 13l5 5" />
    </svg>
  );
}

function ToolbarButton({ title, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
    >
      {children}
    </button>
  );
}

export default function AdminBeritaManager() {
  const editorRef = useRef(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({
    ...emptyForm,
    published_at: toDateTimeLocal(new Date().toISOString()),
  });
  const [editingId, setEditingId] = useState(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  const [openGalleryForm, setOpenGalleryForm] = useState(false);
  const [galleryForm, setGalleryForm] = useState(emptyGalleryForm);
  const [gallerySendingId, setGallerySendingId] = useState(null);
  const [uploadingGalleryImage, setUploadingGalleryImage] = useState(false);

  async function loadItems() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/berita", {
        method: "GET",
        cache: "no-store",
      });

      const data = await readJsonSafely(response);

      if (!response.ok) {
        throw new Error(data?.message || "Gagal memuat daftar berita.");
      }

      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch (err) {
      setError(err.message || "Gagal memuat daftar berita.");
      setItems([]);
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
    setCurrentPage(1);
  }, [query, statusFilter, yearFilter, monthFilter]);

  useEffect(() => {
    setMonthFilter("all");
  }, [yearFilter]);

  const stats = useMemo(() => {
    const total = items.length;
    const published = items.filter((item) => Boolean(item.is_published)).length;
    const draft = total - published;
    const views = items.reduce((acc, item) => acc + Number(item.views || 0), 0);

    return { total, published, draft, views };
  }, [items]);

  const yearOptions = useMemo(() => {
    const map = new Map();

    items.forEach((item) => {
      const key = getYearKey(item?.published_at || item?.created_at);
      if (!key) return;
      map.set(key, (map.get(key) || 0) + 1);
    });

    return Array.from(map.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, count]) => ({
        key,
        label: key,
        count,
      }));
  }, [items]);

  const monthOptions = useMemo(() => {
    const map = new Map();

    items.forEach((item) => {
      const baseDate = item?.published_at || item?.created_at;
      const yearKey = getYearKey(baseDate);
      const monthKey = getMonthKey(baseDate);

      if (!monthKey) return;
      if (yearFilter !== "all" && yearKey !== yearFilter) return;

      map.set(monthKey, (map.get(monthKey) || 0) + 1);
    });

    return Array.from(map.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, count]) => ({
        key,
        label: getMonthLabelFromKey(key),
        count,
      }));
  }, [items, yearFilter]);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return items.filter((item) => {
      const baseDate = item?.published_at || item?.created_at;
      const itemYear = getYearKey(baseDate);
      const itemMonth = getMonthKey(baseDate);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && Boolean(item.is_published)) ||
        (statusFilter === "draft" && !Boolean(item.is_published));

      const matchesYear = yearFilter === "all" || itemYear === yearFilter;
      const matchesMonth = monthFilter === "all" || itemMonth === monthFilter;

      const haystack = [item.title, item.slug, item.category]
        .join(" ")
        .toLowerCase();

      const matchesKeyword = !keyword || haystack.includes(keyword);

      return matchesStatus && matchesYear && matchesMonth && matchesKeyword;
    });
  }, [items, query, statusFilter, yearFilter, monthFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const paginationItems = buildPagination(totalPages, safeCurrentPage);

  const wordCount = useMemo(() => countWords(form.content), [form.content]);
  const readingTime = useMemo(
    () => estimateReadingTime(form.content),
    [form.content]
  );

  const previewSlug = useMemo(() => {
    return (form.slug || slugPreview(form.title) || "judul-berita").trim();
  }, [form.slug, form.title]);

  const coverPreviewSrc = useMemo(() => {
    if (form.cover_upload_base64) return form.cover_upload_base64;
    return toCoverPreviewUrl(form.cover_image);
  }, [form.cover_upload_base64, form.cover_image]);

  const galleryPreviewSrc = useMemo(() => {
    const uploadedPreview = String(galleryForm.gallery_upload_base64 || "").trim();
    if (uploadedPreview) return uploadedPreview;

    const savedGalleryImage = String(galleryForm.image_url || "").trim();
    if (savedGalleryImage) return toCoverPreviewUrl(savedGalleryImage);

    return "";
  }, [galleryForm.gallery_upload_base64, galleryForm.image_url]);

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

    setForm({
      title: item.title || "",
      slug: item.slug || "",
      category: item.category || "Umum",
      content: item.content || "",
      cover_image: item.cover_image || "",
      cover_upload_base64: "",
      cover_upload_name: "",
      cover_upload_size_kb: 0,
      is_published: Boolean(item.is_published),
      published_at: toDateTimeLocal(item.published_at || item.created_at),
    });

    setDirty(false);
    setOpenForm(true);
  }

  function handleCloseForm() {
    if (dirty) {
      const confirmed = window.confirm(
        "Perubahan belum disimpan. Tutup form dan buang perubahan?"
      );
      if (!confirmed) return;
    }

    setOpenForm(false);
    resetForm();
  }

  async function handleOpenGalleryForm(item) {
    setError("");
    setMessage("");

    setGalleryForm({
      berita_id: item.id,
      title: item.title || "",
      slug: item.slug || "",
      image_url: item.cover_image || "",
      gallery_upload_base64: "",
      gallery_upload_name: "",
      gallery_upload_size_kb: 0,
      link_url: `/berita/${item.slug}`,
      published_at: item.published_at || item.created_at || "",
    });

    setOpenGalleryForm(true);

    try {
      const response = await fetch(
        `/api/admin/galeri/from-berita?berita_id=${encodeURIComponent(item.id)}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await readJsonSafely(response);

      if (!response.ok) {
        throw new Error(data?.message || "Gagal mengambil data galeri.");
      }

      if (data?.item) {
        setGalleryForm((prev) => ({
          ...prev,
          image_url: data.item.image_url || prev.image_url || "",
          link_url: data.item.link_url || prev.link_url || "",
          published_at: data.item.published_at || prev.published_at || "",
        }));
      }
    } catch (err) {
      console.error("Prefill galeri gagal:", err);
    }
  }

  function handleCloseGalleryForm() {
    setOpenGalleryForm(false);
    setGalleryForm(emptyGalleryForm);
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
      setError("Toolbar editor tidak didukung browser ini.");
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
    const url = window.prompt("Tempel tautan:", "https://");
    if (!url) return;
    runEditorCommand("createLink", url);
  }

  async function handleCoverFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCover(true);
      setError("");
      setMessage("");

      const compressed = await compressImageToBase64(file, {
        targetSizeKB: 150,
        maxWidth: 1600,
        maxHeight: 1600,
      });

      setForm((prev) => ({
        ...prev,
        cover_upload_base64: compressed.base64,
        cover_upload_name: compressed.fileName,
        cover_upload_size_kb: compressed.sizeKB,
      }));

      setDirty(true);
      setMessage(
        `Cover berita berhasil dikompresi dari ${compressed.originalSizeKB} KB menjadi ${compressed.sizeKB} KB.`
      );
    } catch (err) {
      setError(err.message || "Gagal memproses cover berita.");
    } finally {
      setUploadingCover(false);
      event.target.value = "";
    }
  }

  async function handleGalleryFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingGalleryImage(true);
      setError("");
      setMessage("");

      const compressed = await compressImageToBase64(file, {
        targetSizeKB: 150,
        maxWidth: 1400,
        maxHeight: 1800,
      });

      setGalleryForm((prev) => ({
        ...prev,
        gallery_upload_base64: compressed.base64,
        gallery_upload_name: compressed.fileName,
        gallery_upload_size_kb: compressed.sizeKB,
      }));

      setMessage(
        `Gambar galeri berhasil dikompresi dari ${compressed.originalSizeKB} KB menjadi ${compressed.sizeKB} KB.`
      );
    } catch (err) {
      setError(err.message || "Gagal memproses gambar galeri.");
    } finally {
      setUploadingGalleryImage(false);
      event.target.value = "";
    }
  }

  function clearCoverImage() {
    setForm((prev) => ({
      ...prev,
      cover_image: "",
      cover_upload_base64: "",
      cover_upload_name: "",
      cover_upload_size_kb: 0,
    }));
    setDirty(true);
  }

  function clearGalleryImage() {
    setGalleryForm((prev) => ({
      ...prev,
      image_url: "",
      gallery_upload_base64: "",
      gallery_upload_name: "",
      gallery_upload_size_kb: 0,
    }));
  }

  function buildPayload(nextPublishedState = form.is_published) {
    const currentContent = editorRef.current?.innerHTML || form.content || "";
    const finalSlug = (form.slug || slugPreview(form.title)).trim();
    const autoExcerpt = buildExcerptFromHtml(currentContent, 180);

    if (!form.title.trim()) {
      setError("Judul berita wajib diisi.");
      return null;
    }

    if (!finalSlug) {
      setError("Slug berita wajib diisi.");
      return null;
    }

    if (!isMeaningfulHtml(currentContent)) {
      setError("Isi berita wajib diisi.");
      return null;
    }

    if (!form.cover_image && !form.cover_upload_base64) {
      setError("Cover berita wajib diupload.");
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
      title: form.title.trim(),
      slug: finalSlug,
      category: form.category || "Umum",
      excerpt: autoExcerpt,
      content: currentContent,
      cover_image: form.cover_image || "",
      cover_upload_base64: form.cover_upload_base64 || "",
      cover_upload_name: form.cover_upload_name || "",
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
        }
      );

      const data = await readJsonSafely(response);

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
      `Hapus berita "${item.title}"?\nTindakan ini tidak bisa dibatalkan.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(item.id);
      setError("");
      setMessage("");

      const response = await fetch(`/api/admin/berita/${item.id}`, {
        method: "DELETE",
      });

      const data = await readJsonSafely(response);

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

  async function handleSubmitGallery() {
    if (!galleryForm.image_url && !galleryForm.gallery_upload_base64) {
      setError("Gambar galeri wajib diupload.");
      return;
    }

    try {
      setGallerySendingId(galleryForm.berita_id);
      setError("");
      setMessage("");

      const response = await fetch("/api/admin/galeri/from-berita", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(galleryForm),
      });

      const data = await readJsonSafely(response);

      if (!response.ok) {
        throw new Error(data?.message || "Gagal mengirim berita ke galeri.");
      }

      setMessage(
        data?.message || "Item galeri berhasil disimpan dari data berita."
      );
      handleCloseGalleryForm();
    } catch (err) {
      setError(err.message || "Gagal mengirim berita ke galeri.");
    } finally {
      setGallerySendingId(null);
    }
  }

  return (
    <>
      {(message || error) && (
        <div
          className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${error
            ? "border-rose-200 bg-rose-50 text-rose-700"
            : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
        >
          {error || message}
        </div>
      )}

      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
              Panel Admin
            </span>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Kelola Berita
            </h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total berita"
            value={stats.total}
            helper="Semua artikel pada panel admin"
          />
          <StatCard
            label="Tayang"
            value={stats.published}
            helper="Berita yang sudah dipublikasikan"
          />
          <StatCard
            label="Draft"
            value={stats.draft}
            helper="Berita yang belum tayang"
          />
          <StatCard
            label="Total pembaca"
            value={stats.views}
            helper="Akumulasi view seluruh berita"
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Berita
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                Daftar berita
              </h3>
            </div>

            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              + Tambah berita
            </button>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,2.3fr)_minmax(180px,1fr)_minmax(180px,1fr)_minmax(180px,1fr)] xl:items-end">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Cari berita
              </label>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari judul, slug, atau kategori..."
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

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Filter tahun
              </label>
              <select
                value={yearFilter}
                onChange={(event) => setYearFilter(event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500"
              >
                <option value="all">Semua tahun</option>
                {yearOptions.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label} ({item.count})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Filter bulan
              </label>
              <select
                value={monthFilter}
                onChange={(event) => setMonthFilter(event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500"
              >
                <option value="all">Semua bulan</option>
                {monthOptions.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label} ({item.count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-500">
            Menampilkan {filteredItems.length} dari {items.length} berita.
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-300 w-full border-collapse bg-white">
                <colgroup>
                  <col style={{ width: "6%" }} />
                  <col style={{ width: "54%" }} />
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "8%" }} />
                  <col style={{ width: "9%" }} />
                  <col style={{ width: "12%" }} />
                </colgroup>

                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      No
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Judul
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Kategori
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Dibaca
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-10 text-center text-sm text-slate-500"
                      >
                        Memuat data berita...
                      </td>
                    </tr>
                  ) : paginatedItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-10 text-center text-sm text-slate-500"
                      >
                        Belum ada data yang cocok.
                      </td>
                    </tr>
                  ) : (
                    paginatedItems.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-t border-slate-100 align-top"
                      >
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {startIndex + index + 1}
                        </td>

                        <td className="px-4 py-4">
                          <div className="pr-10">
                            <p className="text-base font-semibold leading-7 text-slate-900">
                              {item.title}
                            </p>
                            <p className="mt-1 wrap-break-word text-xs text-slate-500">
                              /berita/{item.slug}
                            </p>
                            <p className="mt-2 text-xs text-slate-500">
                              {formatDate(item.published_at || item.created_at)}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-700">
                          {item.category || "-"}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-700">
                          {Number(item.views || 0)}
                        </td>

                        <td className="px-4 py-4">
                          <StatusPill published={Boolean(item.is_published)} />
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              disabled={deletingId === item.id}
                              className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId === item.id ? "Menghapus..." : "Hapus"}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenGalleryForm(item)}
                              className="rounded-xl border border-sky-200 px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-50"
                            >
                              Kirim / Edit galeri
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

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Halaman {safeCurrentPage} dari {totalPages}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safeCurrentPage === 1}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sebelumnya
              </button>

              {paginationItems.map((item, index) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-sm text-slate-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCurrentPage(item)}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition ${safeCurrentPage === item
                      ? "bg-emerald-700 text-white"
                      : "border border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
                      }`}
                  >
                    {item}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={safeCurrentPage === totalPages}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>
      </section>

      {openForm ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 p-4">
          <div className="mx-auto flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-slate-50 shadow-2xl">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-3xl border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                  Form berita
                </p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900">
                  {editingId ? "Edit berita" : "Tambah berita"}
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
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-700"
              >
                Tutup
              </button>
            </div>

            <div className="min-h-0 overflow-y-auto p-6">
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
                <div className="space-y-5">
                  <div className="rounded-3xl border border-slate-200 bg-white p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Judul berita
                        </label>
                        <input
                          name="title"
                          value={form.title}
                          onChange={handleChange}
                          placeholder="Masukkan judul berita"
                          className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Slug
                        </label>
                        <input
                          name="slug"
                          value={form.slug}
                          onChange={handleChange}
                          placeholder="slug-berita"
                          className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500"
                        />
                        <p className="mt-2 text-xs text-slate-500">
                          Preview URL: /berita/{previewSlug}
                        </p>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Kategori
                        </label>
                        <select
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500"
                        >
                          {BERITA_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Tanggal publish
                        </label>
                        <input
                          type="datetime-local"
                          name="published_at"
                          value={form.published_at}
                          onChange={handleChange}
                          className="h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6">
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">
                          Editor isi berita
                        </h4>
                        <p className="text-sm text-slate-500">
                          Fokus pada struktur yang rapi dan mudah dibaca.
                        </p>
                      </div>

                      <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600">
                        {wordCount} kata • {readingTime} menit baca
                      </div>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                      <ToolbarButton title="Bold" onClick={() => runEditorCommand("bold")}>
                        <IconBold />
                      </ToolbarButton>

                      <ToolbarButton title="Italic" onClick={() => runEditorCommand("italic")}>
                        <IconItalic />
                      </ToolbarButton>

                      <ToolbarButton title="Underline" onClick={() => runEditorCommand("underline")}>
                        <IconUnderline />
                      </ToolbarButton>

                      <ToolbarButton title="Heading 2" onClick={() => runEditorCommand("formatBlock", "h2")}>
                        <IconH2 />
                      </ToolbarButton>

                      <ToolbarButton title="Heading 3" onClick={() => runEditorCommand("formatBlock", "h3")}>
                        <IconH3 />
                      </ToolbarButton>

                      <ToolbarButton title="Rata kiri" onClick={() => runEditorCommand("justifyLeft")}>
                        <IconAlignLeft />
                      </ToolbarButton>

                      <ToolbarButton title="Tengah" onClick={() => runEditorCommand("justifyCenter")}>
                        <IconAlignCenter />
                      </ToolbarButton>

                      <ToolbarButton title="Rata kanan" onClick={() => runEditorCommand("justifyRight")}>
                        <IconAlignRight />
                      </ToolbarButton>

                      <ToolbarButton title="Rata penuh" onClick={() => runEditorCommand("justifyFull")}>
                        <IconJustify />
                      </ToolbarButton>

                      <ToolbarButton title="Quote" onClick={() => runEditorCommand("formatBlock", "blockquote")}>
                        <IconQuote />
                      </ToolbarButton>

                      <ToolbarButton title="Bullet list" onClick={() => runEditorCommand("insertUnorderedList")}>
                        <IconBullet />
                      </ToolbarButton>

                      <ToolbarButton title="Number list" onClick={() => runEditorCommand("insertOrderedList")}>
                        <IconNumber />
                      </ToolbarButton>

                      <ToolbarButton title="Insert link" onClick={handleInsertLink}>
                        <IconLink />
                      </ToolbarButton>

                      <ToolbarButton title="Clear format" onClick={() => runEditorCommand("removeFormat")}>
                        <IconClear />
                      </ToolbarButton>
                    </div>

                    <div
                      ref={editorRef}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={handleEditorInput}
                      className="h-125 overflow-y-auto rounded-2xl border border-slate-300 bg-white px-4 py-4 text-sm leading-7 text-slate-800 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-200 bg-white p-6">
                    <h4 className="text-lg font-bold text-slate-900">Status</h4>

                    <div className="mt-4">
                      <ToggleSwitch
                        checked={form.is_published}
                        onChange={handlePublishedToggle}
                        label={`Status ${form.is_published ? "Tayang" : "Draft"}`}
                        description="Atur apakah berita langsung dipublikasikan atau disimpan sebagai draft."
                      />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-6">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-lg font-bold text-slate-900">Cover image</h4>

                      {(form.cover_image || form.cover_upload_base64) && (
                        <button
                          type="button"
                          onClick={clearCoverImage}
                          className="text-sm font-semibold text-rose-700 transition hover:text-rose-800"
                        >
                          Hapus cover
                        </button>
                      )}
                    </div>

                    <div className="mt-4 space-y-4">
                      <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleCoverFileChange}
                        />
                        <div>
                          <p className="text-sm font-semibold text-emerald-700">
                            {uploadingCover ? "Memproses cover..." : "Upload cover berita"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            JPG, PNG, atau WEBP. Sistem kompres otomatis mendekati 150 KB.
                          </p>
                        </div>
                      </label>

                      <CoverThumb
                        src={coverPreviewSrc}
                        alt="Preview cover berita"
                        className="h-56 w-full"
                      />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <div className="flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={handleCloseForm}
                        className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Batal
                      </button>

                      <button
                        type="button"
                        onClick={() => saveForm(false)}
                        disabled={saving || uploadingCover}
                        className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {saving ? "Menyimpan..." : "Simpan sebagai draft"}
                      </button>

                      <button
                        type="button"
                        onClick={() => saveForm(true)}
                        disabled={saving || uploadingCover}
                        className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {saving ? "Menyimpan..." : "Simpan & tayangkan"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {openGalleryForm ? (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/50 p-4">
          <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 rounded-t-3xl border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">
                  Form galeri
                </p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900">
                  Kirim ke galeri
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Upload cover galeri dengan kompres otomatis.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseGalleryForm}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-700"
              >
                Tutup
              </button>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Judul berita
                  </label>
                  <input
                    value={galleryForm.title}
                    readOnly
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Link berita
                  </label>
                  <input
                    value={galleryForm.link_url}
                    readOnly
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-600"
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-sky-300 bg-sky-50 px-4 py-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleGalleryFileChange}
                    />
                    <div>
                      <p className="text-sm font-semibold text-sky-700">
                        {uploadingGalleryImage
                          ? "Memproses gambar galeri..."
                          : "Upload cover galeri"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Poster atau banner galeri akan dikompresi otomatis.
                      </p>
                    </div>
                  </label>

                  {(galleryForm.image_url || galleryForm.gallery_upload_base64) && (
                    <button
                      type="button"
                      onClick={clearGalleryImage}
                      className="text-sm font-semibold text-rose-700 transition hover:text-rose-800"
                    >
                      Hapus gambar galeri
                    </button>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleCloseGalleryForm}
                      className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Batal
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmitGallery}
                      disabled={
                        gallerySendingId === galleryForm.berita_id ||
                        uploadingGalleryImage
                      }
                      className="rounded-2xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {gallerySendingId === galleryForm.berita_id
                        ? "Mengirim..."
                        : "Kirim ke galeri"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Preview cover galeri
                </p>

                <div className="mt-4">
                  <CoverThumb
                    src={galleryPreviewSrc}
                    alt="Preview cover galeri"
                    className="h-80 w-full"
                    fallbackText="Preview gambar galeri akan muncul di sini."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}