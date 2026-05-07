import React from "react";
import { Badge, IconButton } from "./EditorUI";
import {
  CheckIcon,
  PowerIcon,
  ShieldIcon,
  TrashIcon
} from "./EditorIcons";

export function EditorCard({
  index,
  editor,
  onOpenToggleActiveModal,
  onOpenPermissions,
  onOpenRoleModal,
  onDelete,
  onOpenVerifyModal,
  busyAction,
  getPermissionCount,
}) {
  const role = editor.role === "admin" ? "admin" : "editor";
  const isPending = editor.status === "pending";
  const isApproved = editor.status === "approved";
  const isRejected = editor.status === "rejected";
  const isActive = Boolean(editor.is_active);

  const verifying =
    busyAction === `approve:${editor.user_id}` ||
    busyAction === `reject:${editor.user_id}`;
  const toggling = busyAction === `toggle:${editor.user_id}`;
  const deleting = busyAction === `delete:${editor.user_id}`;

  return (
    <div className={`group relative overflow-hidden rounded-[2.5rem] border-2 bg-white transition-all duration-500 hover:border-slate-900 dark:border-slate-800 dark:bg-slate-800/20 dark:hover:border-white`}>
      <div className="flex flex-col xl:flex-row xl:items-center gap-8 p-8">
        {/* Left: ID & Info */}
        <div className="flex flex-col md:flex-row md:items-center gap-8 flex-1">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] bg-slate-900 text-white shadow-xl group-hover:scale-110 transition-transform dark:bg-white dark:text-black">
            <span className="text-xl font-black">{index}</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {isPending && <Badge tone="amber">Pending Approval</Badge>}
              {isApproved && <Badge tone="emerald">Verified Account</Badge>}
              {isRejected && <Badge tone="rose">Account Rejected</Badge>}
              <Badge tone={isActive ? "blue" : "slate"}>
                {isActive ? "STATUS: AKTIF" : "STATUS: NONAKTIF"}
              </Badge>
              <Badge tone="violet">{role.toUpperCase()}</Badge>
            </div>

            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight uppercase group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {editor.full_name}
            </h3>
            <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400 break-all">
              {editor.email}
            </p>

            {/* Systematic Info Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-50 pt-6 dark:border-white/5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">Unit Kerja</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{editor.unit_name || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">Level Akses</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">{role}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">Kapasitas</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{getPermissionCount(editor)} Modul Terbuka</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Modern Action Section */}
        <div className="shrink-0 bg-slate-50/50 dark:bg-white/5 p-6 rounded-[2rem] border-2 border-slate-100 dark:border-white/5">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center xl:text-left">Kontrol Cepat</p>
          <div className="flex flex-wrap justify-center gap-3">
            <IconButton
              label="Verifikasi"
              icon={<CheckIcon />}
              onClick={() => onOpenVerifyModal(editor)}
              disabled={verifying}
              loading={verifying}
              tone="emerald"
            />
            <IconButton
              label="Toggle Aktif"
              icon={<PowerIcon />}
              onClick={() => onOpenToggleActiveModal(editor)}
              disabled={toggling}
              loading={toggling}
              tone="blue"
            />
            <IconButton
              label="Permission"
              icon={<ShieldIcon />}
              onClick={() => onOpenPermissions(editor)}
              tone="slate"
            />
            <IconButton
              label="Ubah Role"
              icon={<span className="text-[10px] font-black">R</span>}
              onClick={() => onOpenRoleModal(editor)}
              tone="slate"
            />
            <IconButton
              label="Hapus"
              icon={<TrashIcon />}
              onClick={() => onDelete(editor)}
              disabled={deleting}
              loading={deleting}
              tone="rose"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
