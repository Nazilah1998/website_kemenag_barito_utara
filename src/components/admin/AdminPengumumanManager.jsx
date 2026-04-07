"use client";

import { useEffect, useMemo, useState } from "react";

const emptyForm = {
  title: "",
  slug: "",
  category: "Informasi",
  excerpt: "",
  content: "",
  is_important: false,
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

export default function AdminPengumumanManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const titleForm = useMemo(
    () => (editingId ? "Edit pengumuman" : "Tambah pengumuman"),
    [editingId]
  );

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
      is_important: Boolean(item.is_important),
      is_published: Boolean(item.is_published),
      published_at: toDateTimeLocal(item.published_at),
    });
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
          className={`rounded-2xl border px-4 py-3 text-sm ${
            error
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
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-600">
              Pengumuman
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Daftar pengumuman admin
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Kelola pengumuman website: tambah, edit, hapus, dan atur status
              tayang.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            + Tambah Pengumuman
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-5 py-4">No</th>
                <th className="px-5 py-4">Judul</th>
                <th className="px-5 py-4">Kategori</th>
                <th className="px-5 py-4">Publish</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                    Memuat data pengumuman...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                    Belum ada pengumuman.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-5 py-4">{index + 1}</td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="mt-1 text-xs text-slate-500">{item.excerpt}</div>
                    </td>
                    <td className="px-5 py-4">{item.category || "Informasi"}</td>
                    <td className="px-5 py-4">{formatDate(item.published_at)}</td>
                    <td className="px-5 py-4">
                      <div>{item.is_published ? "Tayang" : "Draft"}</div>
                      {item.is_important ? (
                        <div className="mt-1 text-xs font-semibold text-amber-600">
                          Penting
                        </div>
                      ) : null}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
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

      {openForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-600">
                Form pengumuman
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">{titleForm}</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Judul pengumuman
                  </span>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Slug
                  </span>
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="Kosongkan untuk otomatis"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Kategori
                  </span>
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />
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
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Ringkasan
                </span>
                <textarea
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Isi pengumuman
                </span>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={8}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                />
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <input
                    type="checkbox"
                    name="is_important"
                    checked={form.is_important}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Tandai sebagai pengumuman penting
                  </span>
                </label>

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
                  disabled={saving}
                  className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70"
                >
                  {saving
                    ? "Menyimpan..."
                    : editingId
                    ? "Update Pengumuman"
                    : "Simpan Pengumuman"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}