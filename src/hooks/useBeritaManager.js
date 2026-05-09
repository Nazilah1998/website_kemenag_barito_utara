import { useState, useEffect, useMemo, useRef } from "react";
import {
  readJsonSafely,
  getItemPublishedState,
  getItemBaseDate,
  getYearKey,
  getMonthKey,
  getMonthLabelFromKey,
  slugPreview,
  toDateTimeLocal,
  getDefaultPublishedAt,
  countWords,
  estimateReadingTime,
  sanitizeSlugInput,
  sanitizeEditorHtml,
  buildExcerptFromHtml,
  isMeaningfulHtml,
  buildPagination,
  plainTextToEditorHtml,
} from "@/lib/berita-utils";
import { compressImageToBase64 } from "@/lib/image-compress";
import { toCoverPreviewUrl } from "@/lib/cover-image";

const ITEMS_PER_PAGE = 5;

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

export function useBeritaManager() {
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
    published_at: getDefaultPublishedAt(),
  });
  const [editingId, setEditingId] = useState(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);

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
    if (!message && !error) return undefined;

    const timeoutId = window.setTimeout(
      () => {
        setMessage("");
        setError("");
      },
      error ? 5000 : 2400,
    );

    return () => window.clearTimeout(timeoutId);
  }, [message, error]);

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
    const published = items.filter((item) =>
      getItemPublishedState(item),
    ).length;
    const draft = total - published;
    const views = items.reduce((acc, item) => acc + Number(item.views || 0), 0);

    return { total, published, draft, views };
  }, [items]);

  const yearOptions = useMemo(() => {
    const map = new Map();

    items.forEach((item) => {
      const key = getYearKey(getItemBaseDate(item));
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
      const baseDate = getItemBaseDate(item);
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
      const baseDate = getItemBaseDate(item);
      const itemYear = getYearKey(baseDate);
      const itemMonth = getMonthKey(baseDate);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && getItemPublishedState(item)) ||
        (statusFilter === "draft" && !getItemPublishedState(item));

      const matchesYear = yearFilter === "all" || itemYear === yearFilter;
      const matchesMonth = monthFilter === "all" || itemMonth === monthFilter;

      const haystack = [item.title, item.slug, item.category, item.excerpt]
        .join(" ")
        .toLowerCase();

      const matchesKeyword = !keyword || haystack.includes(keyword);

      return matchesStatus && matchesYear && matchesMonth && matchesKeyword;
    });
  }, [items, query, statusFilter, yearFilter, monthFilter]);

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

  const wordCount = useMemo(() => countWords(form.content), [form.content]);
  const readingTime = useMemo(
    () => estimateReadingTime(form.content),
    [form.content],
  );

  const previewSlug = useMemo(() => {
    return (form.slug || slugPreview(form.title) || "judul-berita").trim();
  }, [form.slug, form.title]);

  const coverPreviewSrc = useMemo(() => {
    if (form.cover_upload_base64) return form.cover_upload_base64;
    return toCoverPreviewUrl(form.cover_image);
  }, [form.cover_upload_base64, form.cover_image]);

  const galleryPreviewSrc = "";

  function resetForm() {
    setForm({
      ...emptyForm,
      published_at: getDefaultPublishedAt(),
    });
    setEditingId(null);
    setSlugManuallyEdited(false);
    setDirty(false);

    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  }

  function resetForm() {
    setForm({
      ...emptyForm,
      published_at: getDefaultPublishedAt(),
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
      is_published: getItemPublishedState(item),
      published_at: toDateTimeLocal(
        getItemBaseDate(item) || new Date().toISOString(),
      ),
    });

    setDirty(false);
    setOpenForm(true);
  }

  function closeFormAndReset() {
    setOpenForm(false);
    setCloseConfirmOpen(false);
    resetForm();
  }

  function handleCloseForm() {
    if (dirty) {
      setCloseConfirmOpen(true);
      return;
    }

    closeFormAndReset();
  }

  function handleCancelCloseConfirm() {
    setCloseConfirmOpen(false);
  }

  function handleConfirmCloseForm() {
    closeFormAndReset();
  }

  function handleCloseGalleryForm() {}

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
          slug: sanitizeSlugInput(value),
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
      published_at:
        nextValue && !prev.published_at
          ? getDefaultPublishedAt()
          : prev.published_at,
    }));
    setDirty(true);
  }

  function syncEditorToState() {
    const rawHtml = editorRef.current?.innerHTML || "";
    const sanitizedHtml = sanitizeEditorHtml(rawHtml);

    if (editorRef.current && editorRef.current.innerHTML !== sanitizedHtml) {
      editorRef.current.innerHTML = sanitizedHtml;
    }

    setForm((prev) => {
      if (prev.content === sanitizedHtml) return prev;
      return { ...prev, content: sanitizedHtml };
    });

    return sanitizedHtml;
  }

  function handleEditorInput() {
    syncEditorToState();
    setDirty(true);
  }

  function runEditorCommand(command, value = null) {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    handleEditorInput();
  }

  function handleInsertLink() {
    const url = window.prompt("Masukkan URL link:");
    if (url) {
      runEditorCommand("createLink", url);
    }
  }

  function handleEditorPaste(event) {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    const html = event.clipboardData.getData("text/html");

    if (html) {
      const sanitized = sanitizeEditorHtml(html);
      document.execCommand("insertHTML", false, sanitized);
    } else if (text) {
      const formatted = plainTextToEditorHtml(text);
      document.execCommand("insertHTML", false, formatted);
    }
    handleEditorInput();
  }

  async function handleCoverFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCover(true);
      setError("");
      setMessage("");

      const compressed = await compressImageToBase64(file, {
        targetSizeKB: 90,
        hardMaxSizeKB: 100,
        throwIfOverHardLimit: true,
        maxWidth: 1280,
        maxHeight: 1280,
      });

      setForm((prev) => ({
        ...prev,
        cover_upload_base64: compressed.base64,
        cover_upload_name: compressed.fileName,
        cover_upload_size_kb: compressed.sizeKB,
      }));

      setDirty(true);
      setMessage(
        `Cover berita berhasil dikompresi dari ${compressed.originalSizeKB} KB menjadi ${compressed.sizeKB} KB.`,
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
        targetSizeKB: 95,
        hardMaxSizeKB: 180, // Lebih longgar agar tidak gampang error saat kirim ke galeri
        throwIfOverHardLimit: false, // Jangan throw error, biarkan API yang memvalidasi hasil terbaik
        maxWidth: 1200,
        maxHeight: 1600,
      });

      setGalleryForm((prev) => ({
        ...prev,
        gallery_upload_base64: compressed.base64,
        gallery_upload_name: compressed.fileName,
        gallery_upload_size_kb: compressed.sizeKB,
      }));

      setMessage(
        `Gambar galeri berhasil dikompresi dari ${compressed.originalSizeKB} KB menjadi ${compressed.sizeKB} KB.`,
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

  function handleGalleryChange(event) {
    const { name, value } = event.target;
    setGalleryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    const currentContentRaw =
      editorRef.current?.innerHTML || form.content || "";
    const currentContent = sanitizeEditorHtml(currentContentRaw);
    const finalSlug = sanitizeSlugInput(form.slug || slugPreview(form.title));
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
        },
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

  function handleAskDelete(item) {
    setDeleteTarget(item);
  }

  async function handleDeleteConfirmed() {
    if (!deleteTarget?.id) return;

    try {
      setDeletingId(deleteTarget.id);
      setError("");
      setMessage("");

      const response = await fetch(`/api/admin/berita/${deleteTarget.id}`, {
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
      setDeleteTarget(null);
    }
  }

  function handleCloseDeleteModal() {
    if (deletingId) return;
    setDeleteTarget(null);
  }

  return {
    editorRef,
    items,
    loading,
    message,
    setMessage,
    error,
    setError,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    yearFilter,
    setYearFilter,
    monthFilter,
    setMonthFilter,
    currentPage,
    setCurrentPage,
    openForm,
    form,
    setForm,
    editingId,
    dirty,
    saving,
    deletingId,
    deleteTarget,
    uploadingCover,
    closeConfirmOpen,
    stats,
    yearOptions,
    monthOptions,
    filteredItems,
    totalPages,
    safeCurrentPage,
    paginatedItems,
    paginationItems,
    wordCount,
    readingTime,
    previewSlug,
    coverPreviewSrc,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleCancelCloseConfirm,
    handleConfirmCloseForm,
    handleChange,
    handlePublishedToggle,
    onEditorInput: handleEditorInput,
    onEditorPaste: handleEditorPaste,
    onRunCommand: runEditorCommand,
    onInsertLink: handleInsertLink,
    onCoverChange: handleCoverFileChange,
    onClearCover: clearCoverImage,
    onSave: saveForm,
    handleAskDelete,
    onDeleteConfirmed: handleDeleteConfirmed,
    onCloseDeleteModal: handleCloseDeleteModal,
    startIndex,
  };
}
