"use client";

import React from "react";
import { useEditorsManagement } from "@/hooks/useEditorsManagement";
import { EditorCard } from "./editors/EditorCard";
import { EditorHeader, EditorFilters } from "./editors/EditorManagementUI";
import { EditorConfirmDialog, EditorToast } from "./editors/EditorDialogs";
import {
  PermissionsModal,
  VerifyStatusModal,
  ToggleActiveModal,
  RoleModal,
} from "./editors/EditorModals";

export default function EditorsManagementClient({ initialEditors = [] }) {
  const e = useEditorsManagement(initialEditors);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 delay-100">
      <div className="rounded-[3.5rem] border border-slate-100 bg-white p-10 shadow-2xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-12">
        <EditorHeader
          pendingCount={e.pendingCount}
          filteredCount={e.filteredEditors.length}
          totalCount={e.editors.length}
        />
        <EditorFilters
          search={e.search} setSearch={e.setSearch}
          filterRole={e.filterRole} setFilterRole={e.setFilterRole}
        />
      </div>

      <div className="space-y-6">
        {e.loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-slate-900 dark:border-slate-800 dark:border-t-white animate-spin mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Sinkronisasi Data Personil...</p>
          </div>
        ) : e.filteredEditors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 rounded-[3.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-300 dark:bg-white/5">
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">Data personil tidak ditemukan</p>
            <p className="mt-2 text-sm font-medium text-slate-300 dark:text-slate-600">Coba sesuaikan kata kunci pencarian Anda.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {e.filteredEditors.map((item, idx) => (
              <EditorCard
                key={item.user_id} index={idx + 1} editor={item}
                onOpenToggleActiveModal={e.openToggleActiveModal}
                onOpenPermissions={e.openPermissions}
                onOpenRoleModal={e.openRoleModal}
                onDelete={e.handleDelete}
                onOpenVerifyModal={e.openVerifyModal}
                busyAction={e.busyAction}
                getPermissionCount={e.getPermissionCount}
              />
            ))}
          </div>
        )}
      </div>

      <PermissionsModal
        open={e.modalOpen} editor={e.activeEditor} selectedPermissions={e.selectedPermissions}
        onTogglePermission={e.togglePermission} onClose={e.closePermissions}
        onSave={e.savePermissions} saving={e.savingPermissions}
      />

      <VerifyStatusModal
        open={e.verifyModalOpen} editor={e.verifyEditor} value={e.verifyDecision}
        onChange={e.setVerifyDecision} onClose={e.closeVerifyModal}
        onSave={e.saveVerifyDecision}
        saving={Boolean(e.verifyEditor) && (e.busyAction === `approve:${e.verifyEditor.user_id}` || e.busyAction === `reject:${e.verifyEditor.user_id}`)}
      />

      <ToggleActiveModal
        open={e.toggleActiveModalOpen} editor={e.toggleActiveEditor} value={e.toggleActiveDecision}
        onChange={e.setToggleActiveDecision} onClose={e.closeToggleActiveModal}
        onSave={e.saveToggleActiveDecision}
        saving={Boolean(e.toggleActiveEditor) && e.busyAction === `toggle:${e.toggleActiveEditor.user_id}`}
      />

      <RoleModal
        open={e.roleModalOpen} editor={e.roleEditor} roleDraft={e.roleDraft}
        onChangeRole={e.setRoleDraft} onClose={e.closeRoleModal}
        onSave={e.saveRole} saving={e.savingRole}
      />

      <EditorConfirmDialog dialog={e.confirmDialog} onClose={e.closeConfirmDialog} />
      <EditorToast toast={e.toast} />
    </div>
  );
}
