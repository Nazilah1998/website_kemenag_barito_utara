"use client";

import React, { useState, useEffect } from "react";
import { FloatingFeedback, DeleteConfirmModal, ActionIconButton, StatusPill } from "../slides/SlidesUI";

export default function YoutubeManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    youtube_id: "",
    is_published: true,
  });

  const extractYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/youtube");
      if (!res.ok) throw new Error("Gagal memuat data");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenCreate = () => {
    setForm({ title: "", youtube_id: "", is_published: true });
    setEditingId(null);
    setOpenForm(true);
  };

  const handleOpenEdit = (item) => {
    setForm({
      title: item.title,
      youtube_id: item.youtube_id,
      is_published: item.is_published,
    });
    setEditingId(item.id);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        youtube_id: extractYoutubeId(form.youtube_id),
      };

      const url = editingId ? `/api/admin/youtube/${editingId}` : "/api/admin/youtube";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan");

      setMessage(editingId ? "Video berhasil diperbarui" : "Video berhasil ditambahkan");
      fetchItems();
      setOpenForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/admin/youtube/${deletingId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus");

      setMessage("Video berhasil dihapus");
      fetchItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleMove = async (index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === items.length - 1) return;

    const newItems = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // Swap elements
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

    // Update sort_order locally
    const updatedItems = newItems.map((item, idx) => ({ ...item, sort_order: idx }));
    setItems(updatedItems);

    try {
      // Background save for the two swapped items
      await Promise.all([
        fetch(`/api/admin/youtube/${updatedItems[index].id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort_order: updatedItems[index].sort_order }),
        }),
        fetch(`/api/admin/youtube/${updatedItems[targetIndex].id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort_order: updatedItems[targetIndex].sort_order }),
        })
      ]);
    } catch (err) {
      console.error("Gagal mengubah urutan", err);
      fetchItems(); // revert on fail
    }
  };

  return (
    <section className="space-y-6 sm:space-y-12">
      <FloatingFeedback
        message={message}
        error={error}
        onClose={() => {
          setMessage("");
          setError("");
        }}
      />

      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Dokumentasi YouTube
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            Kelola video YouTube yang tampil di beranda website. Video teratas (urutan pertama) akan menjadi video utama yang berukuran besar.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-slate-900 px-6 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/30 active:scale-95 dark:bg-white dark:text-black dark:shadow-none dark:hover:bg-slate-200"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Video</span>
        </button>
      </div>

      {/* Content Card */}
      <div className="rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-200 bg-slate-50/50 p-4 sm:p-8 shadow-2xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-none">
        
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <p className="text-slate-500">Belum ada video YouTube yang ditambahkan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100 uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold rounded-tl-2xl">Urutan</th>
                  <th className="px-6 py-4 font-bold">Thumbnail</th>
                  <th className="px-6 py-4 font-bold">Informasi Video</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right rounded-tr-2xl">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {items.map((item, index) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <button 
                          onClick={() => handleMove(index, "up")}
                          disabled={index === 0}
                          className="text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
                        </button>
                        <span className="font-bold text-slate-700 dark:text-slate-200">{index + 1}</span>
                        <button 
                          onClick={() => handleMove(index, "down")}
                          disabled={index === items.length - 1}
                          className="text-slate-400 hover:text-emerald-600 disabled:opacity-30 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative h-20 w-36 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={`https://img.youtube.com/vi/${item.youtube_id}/maxresdefault.jpg`} 
                          alt={item.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://img.youtube.com/vi/${item.youtube_id}/hqdefault.jpg`;
                          }}
                        />
                        {index === 0 && (
                          <div className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">UTAMA</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-2 max-w-sm">{item.title}</p>
                      <a href={`https://youtube.com/watch?v=${item.youtube_id}`} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">
                        youtu.be/{item.youtube_id}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill published={item.is_published} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <ActionIconButton title="Edit" onClick={() => handleOpenEdit(item)} variant="sky">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </ActionIconButton>
                        <ActionIconButton title="Hapus" onClick={() => setDeletingId(item.id)} variant="danger">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </ActionIconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {openForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={handleCloseForm} />
          
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl dark:bg-slate-900 dark:shadow-slate-900/50 flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {editingId ? "Edit Video" : "Tambah Video Baru"}
              </h2>
            </div>
            
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Judul Video</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-400"
                  placeholder="Masukkan judul video..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">URL / ID YouTube</label>
                <input
                  type="text"
                  required
                  value={form.youtube_id}
                  onChange={(e) => setForm({...form, youtube_id: e.target.value})}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-400"
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="mt-2 text-xs text-slate-500">Anda dapat memasukkan URL penuh atau ID videonya saja.</p>
              </div>

              <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={form.is_published}
                    onChange={(e) => setForm({...form, is_published: e.target.checked})}
                  />
                  <div className="h-7 w-12 rounded-full bg-slate-300 transition-all peer-checked:bg-emerald-500 dark:bg-slate-600"></div>
                  <div className="absolute left-[3px] top-[3px] h-5.5 w-5.5 rounded-full bg-white shadow-sm transition-all peer-checked:translate-x-[20px]"></div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 dark:text-white">Status Tayang</p>
                  <p className="text-xs text-slate-500">Tampilkan video ini di halaman beranda</p>
                </div>
              </label>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="rounded-xl px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 hover:shadow-xl disabled:opacity-70 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                >
                  {saving ? "Menyimpan..." : "Simpan Video"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        open={Boolean(deletingId)}
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
        loading={false}
        title="Hapus Video?"
        description="Video ini akan dihapus dari sistem."
      />
    </section>
  );
}
