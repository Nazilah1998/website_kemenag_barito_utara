import React from "react";
import {
  AVAILABLE_EDITOR_PERMISSION_GROUPS,
  getEditorPermissionGroupLabel,
} from "@/lib/permissions";
import { Button } from "./EditorUI";
import { EyeIcon } from "../login/LoginUI";

function getPasswordStrength(password) {
  if (!password) return 0;
  let strength = 0;
  if (password.length > 7) strength += 1;
  if (password.length > 11) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  return strength;
}

function getStrengthLabel(strength) {
  if (strength <= 1) return { label: "Sangat Lemah", color: "bg-rose-500" };
  if (strength === 2) return { label: "Lemah", color: "bg-orange-500" };
  if (strength === 3) return { label: "Sedang", color: "bg-amber-500" };
  if (strength === 4) return { label: "Kuat", color: "bg-emerald-500" };
  return { label: "Sangat Kuat", color: "bg-blue-500" };
}

function ModalWrapper({ open, onClose, children, maxWidth = "max-w-2xl" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} animate-in zoom-in slide-in-from-bottom-8 duration-300 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-10`}>
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, subtitle, onClose }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-6 mb-8 pb-8 border-b border-slate-100 dark:border-white/5">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2">
          Konfigurasi Keamanan
        </p>
        <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-none uppercase">
          {title}
        </h3>
        {subtitle && <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white dark:bg-white/5 dark:hover:bg-white dark:hover:text-black transition-all"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="4">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function PermissionsModal({
  open,
  editor,
  selectedPermissions,
  onTogglePermission,
  onClose,
  onSave,
  saving,
}) {
  return (
    <ModalWrapper open={open && !!editor} onClose={onClose} maxWidth="max-w-4xl">
      <ModalHeader
        title="Permission Editor"
        subtitle={`Atur hak akses modul untuk personil: ${editor?.full_name}`}
        onClose={onClose}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
        {AVAILABLE_EDITOR_PERMISSION_GROUPS.map((permissionGroup) => {
          const checked = selectedPermissions.includes(permissionGroup);

          return (
            <label
              key={permissionGroup}
              className={`group flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-5 transition-all ${checked
                ? "border-slate-900 bg-slate-50 dark:border-white dark:bg-white/5 shadow-lg"
                : "border-slate-100 bg-white hover:border-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-white"
                }`}
            >
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onTogglePermission(permissionGroup)}
                  className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-200 bg-white transition-all checked:bg-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:checked:bg-white"
                />
                <svg className="pointer-events-none absolute h-6 w-6 p-1 text-white opacity-0 transition-opacity peer-checked:opacity-100 dark:text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className={`text-[11px] font-black uppercase tracking-widest transition-colors ${checked ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>
                  {getEditorPermissionGroupLabel(permissionGroup)}
                </p>
                <p className="mt-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {permissionGroup.replace(/_/g, " ")}
                </p>
              </div>
            </label>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row justify-end gap-3 pt-8 border-t border-slate-100 dark:border-white/5">
        <Button tone="ghost" size="lg" onClick={onClose} disabled={saving}>
          Batalkan
        </Button>
        <Button tone="primary" size="lg" onClick={onSave} loading={saving}>
          Simpan Konfigurasi
        </Button>
      </div>
    </ModalWrapper>
  );
}

export function VerifyStatusModal({
  open,
  editor,
  value,
  onChange,
  onClose,
  onSave,
  saving,
}) {
  return (
    <ModalWrapper open={open && !!editor} onClose={onClose} maxWidth="max-w-md">
      <ModalHeader
        title="Verifikasi Akun"
        subtitle={`Tentukan status pengajuan personil: ${editor?.full_name}`}
        onClose={onClose}
      />

      <div className="space-y-4">
        {[
          { id: "approve", label: "Setujui (Approve)", desc: "Personil diizinkan masuk ke sistem sebagai editor.", tone: "emerald" },
          { id: "reject", label: "Tolak (Reject)", desc: "Pengajuan ditolak, personil tidak dapat mengakses panel.", tone: "rose" }
        ].map((opt) => {
          const isActive = value === opt.id;
          return (
            <label
              key={opt.id}
              className={`flex cursor-pointer items-start gap-5 rounded-[2rem] border-2 p-6 transition-all ${isActive
                ? "border-slate-900 bg-slate-50 dark:border-white dark:bg-white/5 shadow-xl"
                : "border-slate-100 bg-white hover:border-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-white"
                }`}
            >
              <div className="relative flex items-center mt-1">
                <input
                  type="radio"
                  name="verify-status"
                  value={opt.id}
                  checked={isActive}
                  onChange={() => onChange(opt.id)}
                  className="peer h-7 w-7 cursor-pointer appearance-none rounded-full border-2 border-slate-200 bg-white transition-all checked:bg-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:checked:bg-white"
                />
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:bg-black" />
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-black uppercase tracking-widest transition-colors ${isActive ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>
                  {opt.label}
                </p>
                <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-400 dark:text-slate-500">
                  {opt.desc}
                </p>
              </div>
            </label>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col gap-3 pt-8 border-t border-slate-100 dark:border-white/5">
        <Button tone="primary" size="lg" onClick={onSave} loading={saving}>
          Simpan Keputusan
        </Button>
        <Button tone="ghost" size="lg" onClick={onClose} disabled={saving}>
          Batal
        </Button>
      </div>
    </ModalWrapper>
  );
}

export function ToggleActiveModal({
  open,
  editor,
  value,
  onChange,
  onClose,
  onSave,
  saving,
}) {
  return (
    <ModalWrapper open={open && !!editor} onClose={onClose} maxWidth="max-w-md">
      <ModalHeader
        title="Aktivasi Akun"
        subtitle={`Kelola status aktifasi personil: ${editor?.full_name}`}
        onClose={onClose}
      />

      <div className="space-y-4">
        {[
          { id: "activate", label: "Aktifkan (Active)", desc: "Berikan izin login dan akses penuh ke modul terkait.", tone: "blue" },
          { id: "deactivate", label: "Nonaktifkan (Inactive)", desc: "Blokir sementara akses login ke dalam sistem admin.", tone: "slate" }
        ].map((opt) => {
          const isActive = value === opt.id;
          return (
            <label
              key={opt.id}
              className={`flex cursor-pointer items-start gap-5 rounded-[2rem] border-2 p-6 transition-all ${isActive
                ? "border-slate-900 bg-slate-50 dark:border-white dark:bg-white/5 shadow-xl"
                : "border-slate-100 bg-white hover:border-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-white"
                }`}
            >
              <div className="relative flex items-center mt-1">
                <input
                  type="radio"
                  name="active-status"
                  value={opt.id}
                  checked={isActive}
                  onChange={() => onChange(opt.id)}
                  className="peer h-7 w-7 cursor-pointer appearance-none rounded-full border-2 border-slate-200 bg-white transition-all checked:bg-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:checked:bg-white"
                />
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:bg-black" />
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-black uppercase tracking-widest transition-colors ${isActive ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>
                  {opt.label}
                </p>
                <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-400 dark:text-slate-500">
                  {opt.desc}
                </p>
              </div>
            </label>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col gap-3 pt-8 border-t border-slate-100 dark:border-white/5">
        <Button tone="primary" size="lg" onClick={onSave} loading={saving}>
          Simpan Status
        </Button>
        <Button tone="ghost" size="lg" onClick={onClose} disabled={saving}>
          Batal
        </Button>
      </div>
    </ModalWrapper>
  );
}

export function RoleModal({
  open,
  editor,
  roleDraft,
  onChangeRole,
  onClose,
  onSave,
  saving,
}) {
  return (
    <ModalWrapper open={open && !!editor} onClose={onClose} maxWidth="max-w-md">
      <ModalHeader
        title="Level Akses"
        subtitle={`Ubah peran administratif untuk personil: ${editor?.full_name}`}
        onClose={onClose}
      />

      <div className="space-y-4">
        {[
          { id: "editor", label: "Editor Konten", desc: "Akses terbatas hanya pada modul yang diizinkan saja." },
          { id: "admin", label: "Administrator", desc: "Akses lebih luas mencakup pengaturan dan manajemen umum." }
        ].map((opt) => {
          const isActive = roleDraft === opt.id;
          return (
            <label
              key={opt.id}
              className={`flex cursor-pointer items-start gap-5 rounded-[2rem] border-2 p-6 transition-all ${isActive
                ? "border-slate-900 bg-slate-50 dark:border-white dark:bg-white/5 shadow-xl"
                : "border-slate-100 bg-white hover:border-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-white"
                }`}
            >
              <div className="relative flex items-center mt-1">
                <input
                  type="radio"
                  name="role"
                  value={opt.id}
                  checked={isActive}
                  onChange={() => onChangeRole(opt.id)}
                  className="peer h-7 w-7 cursor-pointer appearance-none rounded-full border-2 border-slate-200 bg-white transition-all checked:bg-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:checked:bg-white"
                />
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity peer-checked:opacity-100 dark:bg-black" />
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-black uppercase tracking-widest transition-colors ${isActive ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>
                  {opt.label}
                </p>
                <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-400 dark:text-slate-500">
                  {opt.desc}
                </p>
              </div>
            </label>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col gap-3 pt-8 border-t border-slate-100 dark:border-white/5">
        <Button tone="primary" size="lg" onClick={onSave} loading={saving}>
          Simpan Perubahan Role
        </Button>
        <Button tone="ghost" size="lg" onClick={onClose} disabled={saving}>
          Batal
        </Button>
      </div>
    </ModalWrapper>
  );
}

export function CreateEditorModal({
  open,
  onClose,
  onSave,
  saving,
  formData,
  onChange,
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  const strength = React.useMemo(() => getPasswordStrength(formData.password), [formData.password]);
  const strengthInfo = React.useMemo(() => getStrengthLabel(strength), [strength]);

  return (
    <ModalWrapper open={open} onClose={onClose} maxWidth="max-w-xl">
      <ModalHeader
        title="Registrasi Editor"
        subtitle="Daftarkan personil baru secara manual ke dalam sistem admin."
        onClose={onClose}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
        className="space-y-6"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nama Lengkap</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              placeholder="Masukkan nama lengkap..."
              className="h-12 w-full rounded-xl border-2 border-slate-100 bg-slate-50/50 px-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:focus:border-emerald-500 dark:focus:bg-slate-950"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Unit Kerja</label>
            <input
              type="text"
              required
              value={formData.unitName}
              onChange={(e) => onChange("unitName", e.target.value)}
              placeholder="Contoh: Humas, Bimas..."
              className="h-12 w-full rounded-xl border-2 border-slate-100 bg-slate-50/50 px-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:focus:border-emerald-500 dark:focus:bg-slate-950"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Alamat Email</label>
          <input
            type="email"
            required
            autoComplete="off"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="nama@gmail.com"
            className="h-12 w-full rounded-xl border-2 border-slate-100 bg-slate-50/50 px-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:focus:border-emerald-500 dark:focus:bg-slate-950"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password Baru</label>
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              minLength={8}
              value={formData.password}
              onChange={(e) => onChange("password", e.target.value)}
              placeholder="Minimal 8 karakter..."
              className="h-12 w-full rounded-xl border-2 border-slate-100 bg-slate-50/50 pl-4 pr-12 text-sm font-bold text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:focus:border-emerald-500 dark:focus:bg-slate-950"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white transition-all"
            >
              <EyeIcon isOpen={showPassword} />
            </button>
          </div>
          
          {formData.password && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Kekuatan Password</p>
                <p className={`text-[9px] font-black uppercase tracking-widest ${strengthInfo.color.replace('bg-', 'text-')}`}>
                  {strengthInfo.label}
                </p>
              </div>
              <div className="flex h-1.5 w-full gap-1 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-full flex-1 transition-all duration-500 ${level <= strength ? strengthInfo.color : "bg-transparent"}`}
                  />
                ))}
              </div>
            </div>
          )}

          <p className="text-[10px] font-medium text-slate-400 italic">Berikan password ini kepada editor setelah akun berhasil dibuat.</p>
        </div>

        <div className="mt-10 flex flex-col gap-3 pt-8 border-t border-slate-100 dark:border-white/5">
          <Button type="submit" tone="primary" size="lg" loading={saving}>
            Buat Akun Editor
          </Button>
          <Button type="button" tone="ghost" size="lg" onClick={onClose} disabled={saving}>
            Batal
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}

