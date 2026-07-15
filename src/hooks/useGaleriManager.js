import { useState, useEffect, useMemo, useCallback } from "react";
import { compressImageToBase64 } from "@/lib/image-compress";

const ITEMS_PER_PAGE = 10;

const emptyForm = {
  published_at: null,
  gallery_upload_base64: "", // for edit
  gallery_uploads: [],       // for bulk upload
  image_url: "",
};

export function useGaleriManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadItems = useCallback(async (signal, page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/galeri?page=${page}&limit=${ITEMS_PER_PAGE}`, { cache: "no-store", signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal memuat galeri.");
      setItems(data.items || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalItems(data.pagination?.total || 0);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadItems(controller.signal, currentPage);
    return () => controller.abort();
  }, [currentPage, loadItems]);

  const paginatedItems = items; // Already paginated from server

  const imagePreview = useMemo(() => {
    if (editingId && form.gallery_upload_base64) return [form.gallery_upload_base64];
    if (editingId && form.image_url) return [form.image_url];
    if (!editingId && form.gallery_uploads.length > 0) return form.gallery_uploads;
    return [];
  }, [form.gallery_upload_base64, form.image_url, form.gallery_uploads, editingId]);

  function handleOpenCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, published_at: new Date() });
    setOpenForm(true);
  }

  function handleOpenEdit(item) {
    setEditingId(item.id);
    setForm({
      published_at: item.published_at ? new Date(item.published_at) : new Date(),
      image_url: item.image_url || "",
      gallery_upload_base64: "",
      gallery_uploads: [],
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

  async function processImageFiles(files) {
    if (!files || files.length === 0) return;

    try {
      setUploadingImage(true);
      setError("");

      const processedImages = [];
      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;
        
        const compressed = await compressImageToBase64(file, {
          targetSizeKB: 400,
          hardMaxSizeKB: 500,
          throwIfOverHardLimit: false,
          maxWidth: 1200,
          maxHeight: 1600,
        });
        processedImages.push(compressed.base64);
      }

      if (processedImages.length === 0) {
        setError("File harus berupa gambar.");
        return;
      }

      setForm((prev) => {
        if (editingId) {
          // Edit mode only supports 1 image
          return { ...prev, gallery_upload_base64: processedImages[0] };
        } else {
          // Bulk upload mode
          return { ...prev, gallery_uploads: [...prev.gallery_uploads, ...processedImages] };
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleImageFileChange(e) {
    const files = Array.from(e.target.files || []);
    await processImageFiles(files);
  }

  const handleImageDragOver = (e) => {
    e.preventDefault();
    setIsDraggingImage(true);
  };

  const handleImageDragLeave = () => {
    setIsDraggingImage(false);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    setIsDraggingImage(false);
    const files = Array.from(e.dataTransfer.files || []);
    processImageFiles(files);
  };

  async function handleSave() {
    try {
      setSaving(true);
      const url = editingId
        ? `/api/admin/galeri?id=${editingId}`
        : "/api/admin/galeri";
      const method = editingId ? "PUT" : "POST";

      const payload = {
        published_at: form.published_at,
      };

      if (editingId) {
        payload.gallery_upload_base64 = form.gallery_upload_base64;
      } else {
        payload.gallery_uploads = form.gallery_uploads;
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal menyimpan.");

      setMessage(data.message);
      handleCloseForm();
      
      // If we are on page 1, manually reload, else set page 1 to trigger reload
      if (currentPage === 1) {
        await loadItems(null, 1);
      } else {
        setCurrentPage(1);
      }
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
      await loadItems(null, currentPage); // stay on same page
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
    isDraggingImage,
    handleImageDragOver,
    handleImageDragLeave,
    handleImageDrop,
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
    totalItems,
    paginatedItems,
  };
}
