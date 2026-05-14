import { useState, useEffect, useMemo } from "react";
import {
  deriveEditorPermissionGroups,
  expandEditorPermissionGroups,
} from "@/lib/permissions";

async function parseSafeJsonResponse(res) {
  const rawText = await res.text();
  const contentType = String(
    res.headers.get("content-type") || "",
  ).toLowerCase();

  if (!rawText) {
    return {};
  }

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(rawText);
    } catch {
      return {};
    }
  }

  try {
    return JSON.parse(rawText);
  } catch {
    return {
      message: res.ok
        ? "Respons server tidak dalam format JSON."
        : "Server mengembalikan respons tidak valid. Silakan coba lagi.",
    };
  }
}

export function useEditorsManagement(initialEditors = []) {
  const [busyAction, setBusyAction] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [editors, setEditors] = useState(initialEditors);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [activeEditor, setActiveEditor] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [savingPermissions, setSavingPermissions] = useState(false);

  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyEditor, setVerifyEditor] = useState(null);
  const [verifyDecision, setVerifyDecision] = useState("approve");

  const [toggleActiveModalOpen, setToggleActiveModalOpen] = useState(false);
  const [toggleActiveEditor, setToggleActiveEditor] = useState(null);
  const [toggleActiveDecision, setToggleActiveDecision] = useState("activate");

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [roleEditor, setRoleEditor] = useState(null);
  const [roleDraft, setRoleDraft] = useState("editor");
  const [savingRole, setSavingRole] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creatingEditor, setCreatingEditor] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    fullName: "",
    email: "",
    unitName: "",
    password: "",
  });

  const [toast, setToast] = useState(null);

  async function loadEditors() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/editors", {
        method: "GET",
        cache: "no-store",
      });

      const data = await parseSafeJsonResponse(res);

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

  useEffect(() => {
    if (!initialEditors?.length) {
      loadEditors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timeout);
  }, [toast]);

  function pushToast(type, text) {
    setToast({ type, text });
  }

  function openPermissions(editor) {
    setActiveEditor(editor);
    const editorPermissions = Array.isArray(editor.permissions)
      ? editor.permissions
      : [];
    setSelectedPermissions(deriveEditorPermissionGroups(editorPermissions));
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
        : [...prev, permission],
    );
  }

  function openConfirmDialog({
    title,
    description,
    confirmLabel = "Lanjutkan",
    confirmTone = "emerald",
    onConfirm,
  }) {
    setConfirmDialog({
      title,
      description,
      confirmLabel,
      confirmTone,
      onConfirm,
    });
  }

  function closeConfirmDialog() {
    setConfirmDialog(null);
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

      const data = await parseSafeJsonResponse(res);

      if (res.status === 403) {
        const forbiddenMessage =
          data?.message ||
          "Sesi Anda bukan super_admin aktif. Silakan login ulang dengan akun super_admin.";
        throw new Error(forbiddenMessage);
      }

      if (!res.ok) {
        throw new Error(data?.message || "Aksi gagal diproses.");
      }

      const successMessage = successText || data?.message || "Aksi berhasil.";
      setMessage(successMessage);
      pushToast("success", successMessage);

      // If it was a delete action, remove from local state immediately for snappy UI
      if (payload.action === "delete") {
        setEditors((prev) => prev.filter((ed) => ed.user_id !== userId));
      }

      await loadEditors();
    } catch (err) {
      const errorMessage =
        err?.message || "Terjadi kesalahan saat memproses aksi.";
      setError(errorMessage);
      pushToast("error", errorMessage);
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
            permissions: expandEditorPermissionGroups(selectedPermissions),
          }),
        },
      );

      const data = await parseSafeJsonResponse(res);

      if (!res.ok) {
        throw new Error(data?.message || "Gagal menyimpan permission.");
      }

      setMessage("Permission editor berhasil disimpan.");
      pushToast("success", "Permission editor berhasil disimpan.");
      closePermissions();
      await loadEditors();
    } catch (err) {
      const errorMessage =
        err?.message || "Terjadi kesalahan saat menyimpan permission.";
      setError(errorMessage);
      pushToast("error", errorMessage);
    } finally {
      setSavingPermissions(false);
    }
  }

  function openVerifyModal(editor) {
    setVerifyEditor(editor);
    setVerifyDecision(editor?.status === "rejected" ? "reject" : "approve");
    setVerifyModalOpen(true);
  }

  function closeVerifyModal() {
    setVerifyModalOpen(false);
    setVerifyEditor(null);
    setVerifyDecision("approve");
  }

  async function saveVerifyDecision() {
    if (!verifyEditor) return;

    await updateEditor(
      verifyEditor.user_id,
      { action: verifyDecision },
      verifyDecision,
      verifyDecision === "approve"
        ? "Akun editor berhasil diapprove."
        : "Akun editor berhasil direject.",
    );

    closeVerifyModal();
  }

  function openToggleActiveModal(editor) {
    setToggleActiveEditor(editor);
    setToggleActiveDecision(editor?.is_active ? "deactivate" : "activate");
    setToggleActiveModalOpen(true);
  }

  function closeToggleActiveModal() {
    setToggleActiveModalOpen(false);
    setToggleActiveEditor(null);
    setToggleActiveDecision("activate");
  }

  async function saveToggleActiveDecision() {
    if (!toggleActiveEditor) return;

    await updateEditor(
      toggleActiveEditor.user_id,
      { action: toggleActiveDecision },
      "toggle",
      toggleActiveDecision === "activate"
        ? "Akun berhasil diaktifkan."
        : "Akun berhasil dinonaktifkan.",
    );

    closeToggleActiveModal();
  }

  function openRoleModal(editor) {
    setRoleEditor(editor);
    setRoleDraft(editor?.role === "admin" ? "admin" : "editor");
    setRoleModalOpen(true);
  }

  function closeRoleModal() {
    setRoleModalOpen(false);
    setRoleEditor(null);
    setRoleDraft("editor");
  }

  async function saveRole() {
    if (!roleEditor) return;

    setSavingRole(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`/api/admin/editors/${roleEditor.user_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set_role",
          role: roleDraft,
        }),
      });

      const data = await parseSafeJsonResponse(res);

      if (!res.ok) {
        throw new Error(data?.message || "Gagal mengubah role.");
      }

      const successMessage = data?.message || "Role akun berhasil diperbarui.";
      setMessage(successMessage);
      pushToast("success", successMessage);
      closeRoleModal();
      await loadEditors();
    } catch (err) {
      const errorMessage =
        err?.message || "Terjadi kesalahan saat mengubah role.";
      setError(errorMessage);
      pushToast("error", errorMessage);
    } finally {
      setSavingRole(false);
    }
  }

  function handleDelete(editor) {
    openConfirmDialog({
      title: "Hapus Akun Editor",
      description: `Hapus akun ${editor.full_name}? Tindakan ini tidak dapat dibatalkan.`,
      confirmLabel: "Hapus Akun",
      confirmTone: "rose",
      onConfirm: () =>
        updateEditor(
          editor.user_id,
          { action: "delete" },
          "delete",
          "Akun berhasil dihapus.",
        ),
    });
  }

  function handleUnlock(editor) {
    openConfirmDialog({
      title: "Buka Kunci Akun",
      description: `Buka kunci akun ${editor.full_name}? Ini akan me-reset jumlah percobaan login yang gagal.`,
      confirmLabel: "Buka Kunci",
      confirmTone: "emerald",
      onConfirm: () =>
        updateEditor(
          editor.user_id,
          { action: "unlock" },
          "unlock",
          "Kunci akun berhasil dibuka.",
        ),
    });
  }

  function openCreateModal() {
    setCreateFormData({
      fullName: "",
      email: "",
      unitName: "",
      password: "",
    });
    setCreateModalOpen(true);
  }

  function closeCreateModal() {
    setCreateModalOpen(false);
  }

  function handleCreateFormDataChange(key, value) {
    setCreateFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function saveCreateEditor() {
    setCreatingEditor(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/admin/editors/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createFormData),
      });

      const data = await parseSafeJsonResponse(res);

      if (!res.ok) {
        throw new Error(data?.message || "Gagal membuat akun editor.");
      }

      pushToast("success", "Akun editor baru berhasil dibuat dan langsung aktif.");
      closeCreateModal();
      await loadEditors();
    } catch (err) {
      const errorMessage = err?.message || "Terjadi kesalahan saat membuat akun.";
      setError(errorMessage);
      pushToast("error", errorMessage);
    } finally {
      setCreatingEditor(false);
    }
  }

  const pendingCount = useMemo(
    () => editors.filter((item) => item.status === "pending").length,
    [editors],
  );

  const filteredEditors = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return editors.filter((item) => {
      const role = String(item.role || "editor").toLowerCase();
      const matchesRole = filterRole === "all" ? true : role === filterRole;

      if (!matchesRole) return false;
      if (!keyword) return true;

      const haystack = [
        item.full_name,
        item.email,
        item.unit_name,
        item.status,
        role,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [editors, search, filterRole]);

  function getPermissionCount(editor) {
    const editorPermissions = Array.isArray(editor?.permissions)
      ? editor.permissions
      : [];
    const selectedGroups = deriveEditorPermissionGroups(editorPermissions);
    return selectedGroups.length;
  }

  return {
    busyAction,
    message,
    error,
    confirmDialog,
    editors,
    loading,
    search,
    setSearch,
    filterRole,
    setFilterRole,
    modalOpen,
    activeEditor,
    selectedPermissions,
    savingPermissions,
    verifyModalOpen,
    verifyEditor,
    verifyDecision,
    setVerifyDecision,
    toggleActiveModalOpen,
    toggleActiveEditor,
    toggleActiveDecision,
    setToggleActiveDecision,
    roleModalOpen,
    roleEditor,
    roleDraft,
    setRoleDraft,
    savingRole,
    toast,
    loadEditors,
    openPermissions,
    closePermissions,
    togglePermission,
    closeConfirmDialog,
    savePermissions,
    openVerifyModal,
    closeVerifyModal,
    saveVerifyDecision,
    openToggleActiveModal,
    closeToggleActiveModal,
    saveToggleActiveDecision,
    openRoleModal,
    closeRoleModal,
    saveRole,
    handleDelete,
    handleUnlock,
    pendingCount,
    filteredEditors,
    getPermissionCount,
    createModalOpen,
    creatingEditor,
    createFormData,
    openCreateModal,
    closeCreateModal,
    handleCreateFormDataChange,
    saveCreateEditor,
  };
}
