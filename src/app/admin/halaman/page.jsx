"use client";

import useHalamanManager from "@/hooks/useHalamanManager";
import HalamanFormModal from "@/components/features/admin/halaman/HalamanFormModal";

function PlusIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
  );
}

function EditIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
  );
}

function StatusPill({ published }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${published ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"}`}>
      {published ? "Tayang" : "Draft"}
    </span>
  );
}

function FloatingFeedback({ message, error }) {
  if (!message && !error) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 rounded-2xl px-6 py-4 shadow-2xl text-sm font-bold backdrop-blur-sm ${message ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>
      {message || error}
    </div>
  );
}

export default function AdminHalamanPage() {
  const m = useHalamanManager();

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#050B14]">
      <div className="w-full px-6 py-8 sm:px-10 lg:px-16 xl:px-20">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Kelola Halaman
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Atur halaman profil statis yang muncul di website.
            </p>
          </div>
          <button
            onClick={m.openCreateForm}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
          >
            <PlusIcon />
            Tambah Halaman
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/80">
                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Judul</th>
                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Slug</th>
                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Terakhir Update</th>
                  <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {m.loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">
                      Memuat data...
                    </td>
                  </tr>
                ) : m.items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">
                      Belum ada halaman. Klik "Tambah Halaman" untuk membuat.
                    </td>
                  </tr>
                ) : (
                  m.items.map((item) => (
                    <tr key={item.id} className="border-b border-slate-50 transition hover:bg-slate-50/50 dark:border-slate-800/50 dark:hover:bg-slate-800/30">
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{item.slug}</span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusPill published={item.is_published} />
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                        {item.updated_at ? new Date(item.updated_at).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "-"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => m.openEditForm(item.id)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 dark:border-slate-700 dark:hover:border-emerald-700 dark:hover:bg-emerald-500/10"
                            title="Edit"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => m.confirmDelete(item)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:hover:border-rose-700 dark:hover:bg-rose-500/10"
                            title="Hapus"
                          >
                            <TrashIcon />
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
      </div>

      {/* Form Modal */}
      <HalamanFormModal
        open={m.formOpen}
        onClose={m.closeForm}
        form={m.form}
        onUpdate={m.updateForm}
        onSave={m.saveForm}
        saving={m.saving}
        dirty={m.dirty}
        editingId={m.editingId}
      />

      {/* Delete Confirm Modal */}
      {m.deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 mx-auto">
              <TrashIcon />
            </div>
            <h3 className="mt-4 text-center text-lg font-black text-slate-900 dark:text-white">Hapus Halaman?</h3>
            <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
              Halaman <strong className="text-slate-700 dark:text-slate-300">{m.deleteTarget.title}</strong> akan dihapus permanen.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => m.setDeleteTarget(null)}
                className="flex-1 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                onClick={m.handleDeleteConfirmed}
                className="flex-1 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-700 active:scale-95"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Toast */}
      <FloatingFeedback message={m.message} error={m.error} />
    </div>
  );
}
