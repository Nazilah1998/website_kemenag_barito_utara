"use client";

import { useMemo, useState } from "react";

const AVAILABLE_PERMISSIONS = [
    { key: "dashboard:view", label: "Dashboard" },
    { key: "berita:view", label: "Lihat berita" },
    { key: "berita:create", label: "Tambah berita" },
    { key: "berita:update", label: "Edit berita" },
    { key: "berita:delete", label: "Hapus berita" },
    { key: "berita:publish", label: "Publish berita" },
    { key: "halaman:view", label: "Lihat halaman statis" },
    { key: "halaman:create", label: "Tambah halaman statis" },
    { key: "halaman:update", label: "Edit halaman statis" },
    { key: "halaman:delete", label: "Hapus halaman statis" },
    { key: "halaman:publish", label: "Publish halaman statis" },
    { key: "laporan:view", label: "Lihat laporan" },
    { key: "laporan:manage", label: "Kelola laporan" },
    { key: "audit:view", label: "Lihat audit log" },
];

function Badge({ children, tone = "slate" }) {
    const tones = {
        slate: "bg-slate-100 text-slate-700 ring-slate-200",
        emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        amber: "bg-amber-50 text-amber-700 ring-amber-200",
        rose: "bg-rose-50 text-rose-700 ring-rose-200",
        blue: "bg-blue-50 text-blue-700 ring-blue-200",
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${tones[tone]}`}
        >
            {children}
        </span>
    );
}

function EditorCard({
    editor,
    onApprove,
    onReject,
    onToggleActive,
    onOpenPermissions,
    busyAction,
}) {
    const isPending = editor.status === "pending";
    const isApproved = editor.status === "approved";
    const isRejected = editor.status === "rejected";
    const isActive = Boolean(editor.profile?.is_active);

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <h3 className="text-lg font-bold text-slate-900">{editor.full_name}</h3>
                    <p className="mt-1 break-all text-sm text-slate-600">{editor.email}</p>
                    <p className="mt-1 text-sm text-slate-500">
                        Unit kerja:{" "}
                        <span className="font-medium text-slate-700">
                            {editor.unit_name || "-"}
                        </span>
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {isPending ? <Badge tone="amber">Pending</Badge> : null}
                        {isApproved ? <Badge tone="emerald">Approved</Badge> : null}
                        {isRejected ? <Badge tone="rose">Rejected</Badge> : null}
                        <Badge tone={isActive ? "blue" : "slate"}>
                            {isActive ? "Akun aktif" : "Akun nonaktif"}
                        </Badge>
                    </div>

                    <div className="mt-4 text-xs leading-6 text-slate-500">
                        <p>Requested at: {editor.requested_at || "-"}</p>
                        <p>Reviewed at: {editor.reviewed_at || "-"}</p>
                        <p>Permissions: {editor.permissions?.length || 0}</p>
                    </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 lg:w-[320px]">
                    <button
                        type="button"
                        onClick={() => onApprove(editor)}
                        disabled={busyAction === `approve:${editor.user_id}`}
                        className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {busyAction === `approve:${editor.user_id}` ? "Memproses..." : "Approve"}
                    </button>

                    <button
                        type="button"
                        onClick={() => onReject(editor)}
                        disabled={busyAction === `reject:${editor.user_id}`}
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {busyAction === `reject:${editor.user_id}` ? "Memproses..." : "Reject"}
                    </button>

                    <button
                        type="button"
                        onClick={() => onToggleActive(editor)}
                        disabled={busyAction === `toggle:${editor.user_id}`}
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {busyAction === `toggle:${editor.user_id}`
                            ? "Memproses..."
                            : isActive
                                ? "Nonaktifkan akun"
                                : "Aktifkan akun"}
                    </button>

                    <button
                        type="button"
                        onClick={() => onOpenPermissions(editor)}
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                        Atur permission
                    </button>
                </div>
            </div>
        </div>
    );
}

function PermissionsModal({
    open,
    editor,
    selectedPermissions,
    onTogglePermission,
    onClose,
    onSave,
    saving,
}) {
    if (!open || !editor) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
            <div className="w-full max-w-3xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                            Permission Editor
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-slate-900">
                            {editor.full_name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">{editor.email}</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                        ✕
                    </button>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {AVAILABLE_PERMISSIONS.map((item) => {
                        const checked = selectedPermissions.includes(item.key);

                        return (
                            <label
                                key={item.key}
                                className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-4 transition ${checked
                                    ? "border-emerald-300 bg-emerald-50"
                                    : "border-slate-200 bg-white hover:bg-slate-50"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => onTogglePermission(item.key)}
                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                                    <p className="mt-1 text-xs text-slate-500">{item.key}</p>
                                </div>
                            </label>
                        );
                    })}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        onClick={onSave}
                        disabled={saving}
                        className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-700 px-5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {saving ? "Menyimpan..." : "Simpan permission"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function EditorsManagementClient({ initialEditors = [] }) {
    const [busyAction, setBusyAction] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [editors, setEditors] = useState(initialEditors);
    const [loading, setLoading] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [activeEditor, setActiveEditor] = useState(null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [savingPermissions, setSavingPermissions] = useState(false);

    async function loadEditors() {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/editors", {
                method: "GET",
                cache: "no-store",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Gagal memuat data editor.");
            }

            setEditors(Array.isArray(data?.editors) ? data.editors : []);
        } catch (err) {
            setError(err?.message || "Terjadi kesalahan saat memuat editor.");
        } finally {
            setLoading(false);
        }
    }

    function openPermissions(editor) {
        setActiveEditor(editor);
        setSelectedPermissions(Array.isArray(editor.permissions) ? editor.permissions : []);
        setModalOpen(true);
    }

    function closePermissions() {
        setModalOpen(false);
        setActiveEditor(null);
        setSelectedPermissions([]);
    }

    function togglePermission(permission) {
        setSelectedPermissions((prev) =>
            prev.includes(permission)
                ? prev.filter((item) => item !== permission)
                : [...prev, permission]
        );
    }

    async function updateEditor(userId, payload, actionKey, successText) {
        setBusyAction(`${actionKey}:${userId}`);
        setMessage("");
        setError("");

        try {
            const res = await fetch(`/api/admin/editors/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Aksi gagal diproses.");
            }

            setMessage(successText);
            await loadEditors();
        } catch (err) {
            setError(err?.message || "Terjadi kesalahan saat memproses aksi.");
        } finally {
            setBusyAction("");
        }
    }

    async function savePermissions() {
        if (!activeEditor) return;

        setSavingPermissions(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch(
                `/api/admin/editors/${activeEditor.user_id}/permissions`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        permissions: selectedPermissions,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Gagal menyimpan permission.");
            }

            setMessage("Permission editor berhasil disimpan.");
            closePermissions();
            await loadEditors();
        } catch (err) {
            setError(err?.message || "Terjadi kesalahan saat menyimpan permission.");
        } finally {
            setSavingPermissions(false);
        }
    }

    const pendingCount = useMemo(
        () => editors.filter((item) => item.status === "pending").length,
        [editors]
    );

    return (
        <>
            <div className="space-y-6">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                                Super Admin Only
                            </p>
                            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                                Manajemen Editor
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                                Verifikasi akun editor baru, aktifkan atau nonaktifkan akun, dan
                                tentukan akses menu sesuai kebutuhan kerja masing-masing editor.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge tone="amber">Pending: {pendingCount}</Badge>
                            <Badge tone="blue">Total: {editors.length}</Badge>
                        </div>
                    </div>
                </div>

                {message ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {message}
                    </div>
                ) : null}

                {error ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {error}
                    </div>
                ) : null}

                {loading ? (
                    <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
                        <p className="text-sm font-medium text-slate-600">
                            Memuat data editor...
                        </p>
                    </div>
                ) : editors.length ? (
                    <div className="space-y-4">
                        {editors.map((editor) => (
                            <EditorCard
                                key={editor.user_id}
                                editor={editor}
                                busyAction={busyAction}
                                onApprove={(item) =>
                                    updateEditor(
                                        item.user_id,
                                        { action: "approve" },
                                        "approve",
                                        "Akun editor berhasil di-approve."
                                    )
                                }
                                onReject={(item) =>
                                    updateEditor(
                                        item.user_id,
                                        { action: "reject" },
                                        "reject",
                                        "Akun editor berhasil ditolak."
                                    )
                                }
                                onToggleActive={(item) =>
                                    updateEditor(
                                        item.user_id,
                                        {
                                            action: item.profile?.is_active ? "deactivate" : "activate",
                                        },
                                        "toggle",
                                        item.profile?.is_active
                                            ? "Akun editor berhasil dinonaktifkan."
                                            : "Akun editor berhasil diaktifkan."
                                    )
                                }
                                onOpenPermissions={openPermissions}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900">Belum ada editor</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Data pengajuan editor belum tersedia.
                        </p>
                    </div>
                )}
            </div>

            <PermissionsModal
                open={modalOpen}
                editor={activeEditor}
                selectedPermissions={selectedPermissions}
                onTogglePermission={togglePermission}
                onClose={closePermissions}
                onSave={savePermissions}
                saving={savingPermissions}
            />
        </>
    );
}