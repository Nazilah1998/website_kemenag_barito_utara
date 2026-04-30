import { useState, useEffect, useMemo, useCallback } from "react";
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

export function useSlidesManager() {
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

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const totalPages = Math.ceil(items.length / pageSize);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const loadItems = useCallback(async () => {
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
      setCurrentPage(1);
    } catch (err) {
      setError(err?.message || "Gagal memuat data slider.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

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

  const resetForm = useCallback(() => {
    setForm(emptyForm);
    setEditingId("");
  }, []);

  const handleOpenCreate = useCallback(() => {
    resetForm();
    setOpenForm(true);
  }, [resetForm]);

  const handleOpenEdit = useCallback((item) => {
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
  }, []);

  const handleCloseForm = useCallback(() => {
    setOpenForm(false);
    resetForm();
  }, [resetForm]);

  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleImageFileChange = useCallback(async (event) => {
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
  }, []);

  const validateForm = useCallback(() => {
    if (!String(form.title || "").trim()) return "Judul slide wajib diisi.";
    if (!String(form.image_url || "").trim() && !form.image_upload_base64) {
      return "Gambar slide wajib diupload.";
    }
    return "";
  }, [form.title, form.image_url, form.image_upload_base64]);

  const handleSave = useCallback(async () => {
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
  }, [form, editingId, validateForm, handleCloseForm, loadItems]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const handleDeleteRequest = useCallback((id) => {
    setIdToDelete(id);
    setShowDeleteConfirm(true);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setIdToDelete(null);
    setShowDeleteConfirm(false);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!idToDelete) return;

    try {
      setDeletingId(idToDelete);
      setError("");
      setMessage("");

      const response = await fetch(`/api/admin/homepage-slides/${idToDelete}`, {
        method: "DELETE",
      });

      const data = await readJsonSafely(response);
      if (!response.ok) {
        throw new Error(data?.message || "Gagal menghapus slide.");
      }

      setMessage(data?.message || "Slide berhasil dihapus.");
      setShowDeleteConfirm(false);
      setIdToDelete(null);
      await loadItems();
    } catch (err) {
      setError(err?.message || "Gagal menghapus slide.");
    } finally {
      setDeletingId("");
    }
  }, [idToDelete, loadItems]);

  return {
    items,
    paginatedItems,
    currentPage,
    totalPages,
    handlePageChange,
    loading,
    openForm,
    editingId,
    form,
    saving,
    uploadingImage,
    deletingId,
    message,
    setMessage,
    error,
    setError,
    totalPublished,
    imagePreview,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleChange,
    handleImageFileChange,
    handleSave,
    handleDelete: handleDeleteRequest,
    showDeleteConfirm,
    handleConfirmDelete,
    handleCancelDelete,
    toNumber,
  };
}
