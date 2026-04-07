"use client";

import { useEffect, useMemo, useState } from "react";

const emptyForm = {
  title: "",
  slug: "",
  category: "Kegiatan",
  status: "Terjadwal",
  location: "",
  description: "",
  start_at: "",
  end_at: "",
  is_published: true,
};

function formatDateTime(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function toDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset() * 60000;
  const local = new Date(date.getTime() - offset);

  return local.toISOString().slice(0, 16);
}

export default function AdminAgendaManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const formTitle = useMemo(() => {
    return editingId ? "Edit agenda" : "Tambah agenda";
  }, [editingId]);

  async function loadItems() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/agenda", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Gagal memuat data agenda.");
      }

      setItems(data?.items || []);
    } catch (err) {
      setError(err.message || "Gagal memuat data agenda.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function resetForm() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      start_at: toDateTimeLocal(new Date().toISOString()),
      end_at: "",
    });
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
      category: item.category || "Kegiatan",
      status: item.status || "Terjadwal",
      location: item.location || "",
      description: item.description || "",
      start_at: toDateTimeLocal(item.start_at),
      end_at: toDateTimeLocal(item.end_at),
      is_published: Boolean(item.is_published),
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
      setMessage("");
      setError("");

      const response = await fetch(
        editingId ? `/api/admin/agenda/${editingId}` : "/api/admin/agenda",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Gagal menyimpan agenda.");
      }

      setMessage(data?.message || "Agenda berhasil disimpan.");
      handleCloseForm();
      await loadItems();
    } catch (err) {
      setError(err.message || "Gagal menyimpan agenda.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Hapus agenda "${item.title}"?\nTindakan ini tidak bisa dibatalkan.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(item.id);
      setMessage("");
      setError("");

      const response = await fetch(`/api/admin/agenda/${item.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Gagal menghapus agenda.");
      }

      setMessage(data?.message || "Agenda berhasil dihapus.");
      await loadItems();
    } catch (err) {
      setError(err.message || "Gagal menghapus agenda.");
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
              Agenda
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Daftar agenda admin
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Kelola agenda website: tambah, edit, hapus, dan atur status tayang.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            + Tambah Agenda
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
                <th className="px-5 py-4">Waktu</th>
                <th className="px-5 py-4">Lokasi</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                    Memuat data agenda...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                    Belum ada agenda.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-5 py-4">{index + 1}</td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {item.category || "Kegiatan"}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div>{formatDateTime(item.start_at)}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {item.end_at ? `Selesai: ${formatDateTime(item.end_at)}` : "-"}
                      </div>
                    </td>
                    <td className="px-5 py-4">{item.location || "-"}</td>
                    <td className="px-5 py-4">
                      <div>{item.status || "Terjadwal"}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {item.is_published ? "Tayang" : "Draft"}
                      </div>
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
                Form agenda
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {formTitle}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Judul agenda
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
                    Status agenda
                  </span>
                  <input
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Lokasi
                  </span>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Mulai
                  </span>
                  <input
                    type="datetime-local"
                    name="start_at"
                    value={form.start_at}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Selesai
                  </span>
                  <input
                    type="datetime-local"
                    name="end_at"
                    value={form.end_at}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Deskripsi agenda
                </span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                />
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
                    ? "Update Agenda"
                    : "Simpan Agenda"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}