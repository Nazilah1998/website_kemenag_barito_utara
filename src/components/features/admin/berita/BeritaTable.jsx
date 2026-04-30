import React from "react";
import { StatusPill, ActionIconButton } from "./BeritaUI";
import { IconPencil, IconTrash, IconGallery, IconViewsStat } from "./BeritaIcons";
import { formatDate, getItemBaseDate, getItemPublishedState } from "@/lib/berita-utils";

export function BeritaTable({
  items,
  loading,
  startIndex,
  onEdit,
  onDelete,
  onGallery,
  deletingId,
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700">
      <div className="overflow-x-auto">
        <table className="min-w-300 w-full border-collapse bg-white dark:bg-slate-900/40">
          <colgroup>
            <col style={{ width: "4%" }} />
            <col style={{ width: "66%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "6%" }} />
            <col style={{ width: "6%" }} />
            <col style={{ width: "8%" }} />
          </colgroup>

          <thead className="bg-slate-50 dark:bg-slate-800/40">
            <tr>
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                No
              </th>
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Judul Berita
              </th>
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Kategori
              </th>
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Dibaca
              </th>
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Status
              </th>
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-20 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse"
                >
                  Memuat data berita...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-20 text-center text-[10px] font-black uppercase tracking-widest text-slate-400"
                >
                  Belum ada data yang cocok.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr
                  key={item.id}
                  className="group border-t border-slate-100 bg-white hover:bg-slate-50 transition-all align-top dark:border-slate-800 dark:bg-transparent dark:hover:bg-white/5"
                >
                  <td className="px-6 py-6 text-xs font-black italic text-slate-400">
                    {startIndex + index + 1}
                  </td>

                  <td className="px-6 py-6">
                    <div>
                      <p className="text-base font-black tracking-tight text-slate-900 dark:text-slate-100 transition-colors">
                        {item.title}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <span className="text-[11px] font-bold text-slate-400">
                          /berita/{item.slug}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                        <span className="text-[11px] font-bold text-slate-400">
                          {formatDate(getItemBaseDate(item))}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                      {item.category || "-"}
                    </span>
                  </td>

                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-slate-100">
                      <span className="text-emerald-500">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </span>
                      {Number(item.views || 0)}
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <StatusPill published={getItemPublishedState(item)} />
                  </td>

                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <ActionIconButton
                        title="Edit berita"
                        onClick={() => onEdit(item)}
                        variant="neutral"
                      >
                        <IconPencil />
                      </ActionIconButton>

                      <ActionIconButton
                        title={
                          deletingId === item.id
                            ? "Menghapus berita"
                            : "Hapus berita"
                        }
                        onClick={() => onDelete(item)}
                        disabled={deletingId === item.id}
                        variant="danger"
                      >
                        <IconTrash />
                      </ActionIconButton>

                      <ActionIconButton
                        title="Kirim atau edit galeri"
                        onClick={() => onGallery(item)}
                        variant="sky"
                      >
                        <IconGallery />
                      </ActionIconButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
