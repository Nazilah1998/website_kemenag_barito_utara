import React from "react";
import { StatusPill, ActionIconButton } from "./SlidesUI";

export function SlideTable({ items, loading, onEdit, onDelete, deletingId, toNumber }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
              Judul Slide
            </th>
            <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
              Caption
            </th>
            <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800">
              Urutan
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
            <TableMessage colSpan={5} message="Memuat data slide..." loading />
          ) : items.length === 0 ? (
            <TableMessage colSpan={5} message="Belum ada slide yang ditambahkan." />
          ) : (
            items.map((item) => (
              <tr key={item.id} className="group border-t border-slate-100 bg-white hover:bg-slate-50 transition-all align-top dark:border-slate-800 dark:bg-transparent dark:hover:bg-white/5">
                <td className="px-6 py-6">
                  <p className="text-sm font-black tracking-tight text-slate-900 dark:text-slate-100 uppercase">
                    {item.title}
                  </p>
                </td>
                <td className="px-6 py-6">
                  <p className="max-w-md text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                    {item.caption || "-"}
                  </p>
                </td>
                <td className="px-6 py-6">
                  <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                    #{toNumber(item.sort_order, 0)}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <StatusPill published={item.is_published} />
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    <ActionIconButton
                      title="Edit slide"
                      onClick={() => onEdit(item)}
                      variant="neutral"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m4 20 4.1-.8L18 9.3 14.7 6 4.8 15.9 4 20Z" /><path d="m12.9 7.8 3.3 3.3" /></svg>
                    </ActionIconButton>

                    <ActionIconButton
                      title={deletingId === item.id ? "Menghapus..." : "Hapus slide"}
                      onClick={() => onDelete(item.id)}
                      disabled={deletingId === item.id}
                      variant="danger"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 7h16M9 7V4.8a.8.8 0 0 1 .8-.8h4.4a.8.8 0 0 1 .8.8V7M7 7v11a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7M10 11v5M14 11v5" /></svg>
                    </ActionIconButton>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function TableMessage({ colSpan, message, loading }) {
  return (
    <tr>
      <td colSpan={colSpan} className={`px-6 py-20 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 ${loading ? "animate-pulse" : ""}`}>
        {message}
      </td>
    </tr>
  );
}
