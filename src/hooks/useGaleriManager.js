import { useState, useEffect, useMemo } from "react";
import { compressImageToBase64 } from "@/lib/image-compress";

const ITEMS_PER_PAGE = 12;

const emptyForm = {
  published_at: "",
  gallery_upload_base64: "",
  image_url: "",
};

export function useGaleriManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function loadItems() {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/galeri", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal memuat galeri.");
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, currentPage]);

  const imagePreview = useMemo(() => {
    if (form.gallery_upload_base64) return form.gallery_upload_base64;
    return form.image_url || "";
  }, [form.gallery_upload_base64, form.image_url]);

  function handleOpenCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, published_at: new Date().toISOString() });
    setOpenForm(true);
  }

  function handleOpenEdit(item) {
    setEditingId(item.id);
    setForm({
      published_at: item.published_at || new Date().toISOString(),
      image_url: item.image_url || "",
      gallery_upload_base64: "",
    });
    setOpenForm(true);
  }

  function handleCloseForm() {
    setOpenForm(false);
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleImageFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const compressed = await compressImageToBase64(file, {
        targetSizeKB: 120,
        maxWidth: 1200,
        maxHeight: 1600,
      });
      setForm((prev) => ({
        ...prev,
        gallery_upload_base64: compressed.base64,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      const url = editingId
        ? `/api/admin/galeri?id=${editingId}`
        : "/api/admin/galeri";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal menyimpan.");

      setMessage(data.message);
      handleCloseForm();
      await loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(item) {
    setDeleteTarget(item);
    setShowDeleteConfirm(true);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    try {
      setDeletingId(deleteTarget.id);
      const response = await fetch(`/api/admin/galeri?id=${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal menghapus.");
      setMessage("Item berhasil dihapus.");
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      await loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return {
    items,
    loading,
    message,
    setMessage,
    error,
    setError,
    currentPage,
    setCurrentPage,
    openForm,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    editingId,
    form,
    handleChange,
    handleImageFileChange,
    handleSave,
    saving,
    uploadingImage,
    imagePreview,
    handleDelete,
    showDeleteConfirm,
    handleConfirmDelete,
    handleCancelDelete: () => setShowDeleteConfirm(false),
    deletingId,
    totalPages,
    paginatedItems,
  };
}
