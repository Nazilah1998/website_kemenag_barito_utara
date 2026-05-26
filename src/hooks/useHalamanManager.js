"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export default function useHalamanManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ slug: "", title: "", description: "", content: "{}", is_published: true });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const feedbackTimeout = useRef(null);

  const showFeedback = useCallback((msg, type = "success") => {
    if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
    if (type === "success") {
      setMessage(msg);
      setError(null);
    } else {
      setError(msg);
      setMessage(null);
    }
    feedbackTimeout.current = setTimeout(() => {
      setMessage(null);
      setError(null);
    }, 5000);
  }, []);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/halaman");
      if (!res.ok) throw new Error("Gagal memuat daftar halaman.");
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      showFeedback(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showFeedback]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const openCreateForm = useCallback(() => {
    setEditingId(null);
    setForm({ slug: "", title: "", description: "", content: "{}", is_published: true });
    setDirty(false);
    setFormOpen(true);
  }, []);

  const openEditForm = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/admin/halaman/${id}`);
      if (!res.ok) throw new Error("Gagal memuat data halaman.");
      const data = await res.json();
      setEditingId(id);
      setForm({
        slug: data.slug || "",
        title: data.title || "",
        description: data.description || "",
        content: data.content || "{}",
        is_published: data.is_published !== false,
      });
      setDirty(false);
      setFormOpen(true);
    } catch (err) {
      showFeedback(err.message, "error");
    }
  }, [showFeedback]);

  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEditingId(null);
    setDirty(false);
  }, []);

  const updateForm = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }, []);

  const saveForm = useCallback(async () => {
    if (!form.title.trim()) {
      showFeedback("Judul halaman wajib diisi.", "error");
      return;
    }
    if (!form.slug.trim()) {
      showFeedback("Slug halaman wajib diisi.", "error");
      return;
    }

    try {
      setSaving(true);
      const url = editingId
        ? `/api/admin/halaman/${editingId}`
        : "/api/admin/halaman";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan halaman.");

      showFeedback(data.message || "Halaman berhasil disimpan.");
      closeForm();
      await loadItems();
    } catch (err) {
      showFeedback(err.message, "error");
    } finally {
      setSaving(false);
    }
  }, [form, editingId, showFeedback, closeForm, loadItems]);

  const confirmDelete = useCallback((item) => {
    setDeleteTarget(item);
  }, []);

  const handleDeleteConfirmed = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/halaman/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menghapus halaman.");
      showFeedback(data.message || "Halaman berhasil dihapus.");
      setDeleteTarget(null);
      await loadItems();
    } catch (err) {
      showFeedback(err.message, "error");
    }
  }, [deleteTarget, showFeedback, loadItems]);

  return {
    items, loading,
    message, error, showFeedback,
    formOpen, editingId, form, dirty, saving,
    openCreateForm, openEditForm, closeForm, updateForm, saveForm,
    deleteTarget, confirmDelete, handleDeleteConfirmed,
    setDeleteTarget,
  };
}
