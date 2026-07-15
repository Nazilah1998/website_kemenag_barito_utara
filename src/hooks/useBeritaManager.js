import { useState, useEffect, useMemo, useRef } from "react";
import {
  readJsonSafely,
  getItemPublishedState,
  getItemBaseDate,
  getYearKey,
  getMonthKey,
  getMonthLabelFromKey,
  slugPreview,
  countWords,
  estimateReadingTime,
  sanitizeSlugInput,
  sanitizeEditorHtml,
  buildExcerptFromHtml,
  isMeaningfulHtml,
  buildPagination,
  plainTextToEditorHtml,
  BERITA_CATEGORIES,
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
  published_at: null,
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
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({
    ...emptyForm,
    published_at: new Date(),
  });
  const [editingId, setEditingId] = useState(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [savedSelectionRange, setSavedSelectionRange] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageModalData, setImageModalData] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadItemsAbortRef = useRef(null);

  async function loadItems(signal) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/berita", {
        method: "GET",
        cache: "no-store",
        signal,
      });

      const data = await readJsonSafely(response);

      if (!response.ok) {
        throw new Error(data?.message || "Gagal memuat daftar berita.");
      }

      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message || "Gagal memuat daftar berita.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadItemsAbortRef.current = controller;
    loadItems(controller.signal);
    return () => controller.abort();
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
  }, [query, statusFilter, yearFilter, monthFilter, categoryFilter]);

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

  const categoryOptions = useMemo(() => {
    const map = new Map();
    items.forEach((item) => {
      if (!item.category) return;
      map.set(item.category, (map.get(item.category) || 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => {
        const indexA = BERITA_CATEGORIES.indexOf(a[0]);
        const indexB = BERITA_CATEGORIES.indexOf(b[0]);
        
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        
        return a[0].localeCompare(b[0]);
      })
      .map(([key, count]) => ({
        key,
        label: key,
        count,
      }));
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
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;

      const haystack = [item.title, item.slug, item.category, item.excerpt]
        .join(" ")
        .toLowerCase();

      const matchesKeyword = !keyword || haystack.includes(keyword);

      return matchesStatus && matchesYear && matchesMonth && matchesCategory && matchesKeyword;
    });
  }, [items, query, statusFilter, yearFilter, monthFilter, categoryFilter]);

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

  function resetForm() {
    setForm({
      ...emptyForm,
      published_at: new Date(),
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

    const existingCover = item.cover_image && typeof item.cover_image === "string" && item.cover_image.startsWith("/")
      ? item.cover_image
      : item.cover_image || "";

    setForm({
      title: item.title || "",
      slug: item.slug || "",
      category: item.category || "Umum",
      content: item.content || "",
      cover_image: existingCover,
      cover_upload_base64: "",
      cover_upload_name: "",
      cover_upload_size_kb: 0,
      is_published: getItemPublishedState(item),
      published_at: new Date(getItemBaseDate(item) || new Date()),
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
          ? new Date()
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
    
    // Jangan panggil focus() secara membabi buta karena bisa me-reset highlight teks.
    // Hanya focus jika kursor benar-benar tidak berada di dalam editor.
    if (
      document.activeElement !== editorRef.current &&
      !editorRef.current.contains(document.activeElement)
    ) {
      editorRef.current.focus();
    }

    // Untuk formatBlock (seperti H2, H3), beberapa browser butuh format <H2>
    let finalValue = value;
    if (command === "formatBlock" && value && !value.startsWith("<")) {
      finalValue = `<${value}>`;
    }

    document.execCommand(command, false, finalValue);
    handleEditorInput();
  }

  function handleInsertText(text) {
    if (!editorRef.current) return;
    if (
      document.activeElement !== editorRef.current &&
      !editorRef.current.contains(document.activeElement)
    ) {
      editorRef.current.focus();
    }
    document.execCommand("insertText", false, text);
    handleEditorInput();
  }

  function handleInsertLink() {
    // Simpan teks yang di-highlight sebelum modal muncul (karena modal menghilangkan fokus)
    const selection = window.getSelection();
    let range = null;
    if (selection && selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
    }
    
    setSavedSelectionRange(range);
    setLinkModalOpen(true);
  }

  function handleLinkModalSubmit(url) {
    setLinkModalOpen(false);
    
    if (url) {
      // Kembalikan highlight teks
      const selection = window.getSelection();
      if (savedSelectionRange && selection) {
        selection.removeAllRanges();
        selection.addRange(savedSelectionRange);
      }
      runEditorCommand("createLink", url);
    }
    
    setSavedSelectionRange(null);
  }

  function handleInsertImage() {
    const selection = window.getSelection();
    let range = null;
    if (selection && selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
    }
    
    setSavedSelectionRange(range);
    setImageModalData(null);
    setImageModalOpen(true);
  }

  function handleEditorClick(event) {
    const editBtn = event.target.closest('.edit-image-btn');
    if (editBtn) {
      event.preventDefault();
      const figure = editBtn.closest('figure.image-insertion');
      if (figure) {
        if (!figure.getAttribute('data-id')) {
          figure.setAttribute('data-id', "img-" + Date.now());
        }
        setImageModalData({
          id: figure.getAttribute('data-id'),
          url: figure.getAttribute('data-url'),
          filename: figure.getAttribute('data-filename'),
          caption: figure.getAttribute('data-caption') === "Sisipan Gambar" ? "" : figure.getAttribute('data-caption'),
          date: figure.getAttribute('data-date'),
          rawDate: figure.getAttribute('data-raw-date')
        });
        setImageModalOpen(true);
      }
    }
  }

  async function handleImageModalSubmit(file, caption, date, rawDateStr) {
    if (!file && !imageModalData) return;

    if (imageModalData && !file) {
      const imgId = imageModalData.id;
      if (editorRef.current) {
        const figure = editorRef.current.querySelector(`figure[data-id="${imgId}"]`);
        if (figure) {
          const cap = caption || "Sisipan Gambar";
          figure.setAttribute("data-caption", cap);
          figure.setAttribute("data-date", date || "");
          figure.setAttribute("data-raw-date", rawDateStr || "");
          
          const img = figure.querySelector("img");
          if (img) img.setAttribute("alt", cap);
          
          const figcaption = figure.querySelector("figcaption");
          if (figcaption) {
            figcaption.textContent = caption ? caption + (date ? ", " + date : "") : "";
          }
          handleEditorInput();
        }
      }
      setImageModalOpen(false);
      setImageModalData(null);
      return;
    }

    setUploadingImage(true);
    setError("");

    try {
      const { base64: base64Str } = await compressImageToBase64(file);
      
      const response = await fetch("/api/admin/berita/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_base64: base64Str }),
      });

      const data = await readJsonSafely(response);
      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Gagal mengunggah gambar.");
      }

      const imageUrl = data.url;

      // Restore selection
      const selection = window.getSelection();
      if (savedSelectionRange && selection) {
        selection.removeAllRanges();
        selection.addRange(savedSelectionRange);
      }

      const imgId = imageModalData ? imageModalData.id : "img-" + Date.now();
      const cap = caption || "Sisipan Gambar";

      const imgHtml = `
<figure class="image-insertion w-full my-8 text-center relative group" data-id="${imgId}" data-url="${imageUrl}" data-filename="${file.name}" data-caption="${cap}" data-date="${date || ""}" data-raw-date="${rawDateStr || ""}" contenteditable="false">
  <button type="button" class="edit-image-btn absolute top-2 right-2 bg-white text-slate-900 rounded-full p-2 shadow opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer hover:bg-slate-100 z-10" aria-label="Edit Gambar">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
  </button>
  <img src="${imageUrl}" alt="${cap}" />
  <figcaption>${caption ? caption + (date ? ", " + date : "") : ""}</figcaption>
</figure><p><br></p>
      `.trim().replace(/\n/g, "");

      if (imageModalData) {
        if (editorRef.current) {
          const figure = editorRef.current.querySelector(`figure[data-id="${imgId}"]`);
          if (figure) {
            figure.outerHTML = imgHtml;
            handleEditorInput();
          }
        }
      } else {
        runEditorCommand("insertHTML", imgHtml);
      }
      
      setImageModalOpen(false);
      setImageModalData(null);
    } catch (err) {
      setError(err.message || "Gagal memproses gambar.");
    } finally {
      setUploadingImage(false);
      setSavedSelectionRange(null);
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

  function handleEditorKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const node = range.startContainer;

      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const offset = range.startOffset;

        const bulletMatch = text.match(/^(\s*-\s+)/);
        const numberMatch = text.match(/^(\s*(\d+)\.\s+)/);

        if (bulletMatch || numberMatch) {
          const isNumber = !!numberMatch;
          const prefix = isNumber ? numberMatch[1] : bulletMatch[1];
          const content = text.slice(prefix.length);

          if (content.trim() === "") {
            event.preventDefault();
            range.setStart(node, 0);
            range.setEnd(node, prefix.length);
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand("delete", false, null);
            document.execCommand("insertParagraph", false, null);
            return;
          }

          if (offset === text.length) {
            event.preventDefault();
            
            let nextPrefix = "- ";
            if (isNumber) {
              const currentNum = parseInt(numberMatch[2], 10);
              nextPrefix = `${currentNum + 1}. `;
            } else {
              nextPrefix = bulletMatch[1];
            }

            document.execCommand("insertParagraph", false, null);
            document.execCommand("insertText", false, nextPrefix);
            return;
          }
        }
      }
    }
  }

  async function processCoverFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }

    try {
      setUploadingCover(true);
      setError("");
      setMessage("");

      const compressed = await compressImageToBase64(file, {
        targetSizeKB: 400,
        hardMaxSizeKB: 500,
        throwIfOverHardLimit: false,
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
    }
  }

  async function handleCoverFileChange(event) {
    const file = event.target.files?.[0];
    if (file) await processCoverFile(file);
    event.target.value = "";
  }

  const handleCoverDragOver = (e) => {
    e.preventDefault();
    setIsDraggingCover(true);
  };

  const handleCoverDragLeave = () => {
    setIsDraggingCover(false);
  };

  const handleCoverDrop = (e) => {
    e.preventDefault();
    setIsDraggingCover(false);
    const file = e.dataTransfer.files[0];
    if (file) processCoverFile(file);
  };

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

    // Pastikan cover_image tidak undefined/null, selalu string
    const coverImageValue = typeof form.cover_image === "string" ? form.cover_image : "";

    let publishedAtIso = "";

    if (form.published_at) {
      if (Number.isNaN(form.published_at.getTime())) {
        setError("Tanggal publish tidak valid.");
        return null;
      }

      publishedAtIso = form.published_at.toISOString();
    }

    return {
      title: form.title.trim(),
      slug: finalSlug,
      category: form.category || "Umum",
      excerpt: autoExcerpt,
      content: currentContent,
      cover_image: coverImageValue,
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
    categoryFilter,
    setCategoryFilter,
    categoryOptions,

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
    linkModalOpen,
    setLinkModalOpen,
    handleLinkModalSubmit,
    imageModalOpen,
    imageModalData,
    setImageModalOpen,
    uploadingImage,
    handleImageModalSubmit,
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
    onEditorClick: handleEditorClick,
    onEditorKeyDown: handleEditorKeyDown,
    onRunCommand: runEditorCommand,
    onInsertText: handleInsertText,
    onInsertLink: handleInsertLink,
    onInsertImage: handleInsertImage,
    onCoverChange: handleCoverFileChange,
    isDraggingCover,
    handleCoverDragOver,
    handleCoverDragLeave,
    handleCoverDrop,
    onClearCover: clearCoverImage,
    onSave: saveForm,
    handleAskDelete,
    onDeleteConfirmed: handleDeleteConfirmed,
    onCloseDeleteModal: handleCloseDeleteModal,
    startIndex,
  };
}
