// Permission matrix untuk peran admin.
// Dipakai oleh guard API, UI, dan audit.

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  EDITOR: "editor",
};

export const ALL_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR];

// Daftar izin granular.
export const PERMISSIONS = {
  // Berita
  BERITA_VIEW: "berita:view",
  BERITA_CREATE: "berita:create",
  BERITA_UPDATE: "berita:update",
  BERITA_DELETE: "berita:delete",
  BERITA_PUBLISH: "berita:publish",

  // Galeri
  GALERI_VIEW: "galeri:view",
  GALERI_MANAGE: "galeri:manage",

  // Kontak
  KONTAK_VIEW: "kontak:view",
  KONTAK_RESPOND: "kontak:respond",

  // Halaman statis (CMS)
  HALAMAN_VIEW: "halaman:view",
  HALAMAN_CREATE: "halaman:create",
  HALAMAN_UPDATE: "halaman:update",
  HALAMAN_DELETE: "halaman:delete",
  HALAMAN_PUBLISH: "halaman:publish",

  // Dashboard & audit
  DASHBOARD_VIEW: "dashboard:view",
  AUDIT_VIEW: "audit:view",

  // Manajemen pengguna
  USER_VIEW: "user:view",
  USER_INVITE: "user:invite",
  USER_UPDATE_ROLE: "user:update_role",
  USER_DELETE: "user:delete",

  // Pengaturan situs
  SETTINGS_MANAGE: "settings:manage",
};

// Permission matrix: peran -> izin.
const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS), // Semua izin.

  [ROLES.ADMIN]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.AUDIT_VIEW,

    PERMISSIONS.BERITA_VIEW,
    PERMISSIONS.BERITA_CREATE,
    PERMISSIONS.BERITA_UPDATE,
    PERMISSIONS.BERITA_DELETE,
    PERMISSIONS.BERITA_PUBLISH,

    PERMISSIONS.GALERI_VIEW,
    PERMISSIONS.GALERI_MANAGE,

    PERMISSIONS.KONTAK_VIEW,
    PERMISSIONS.KONTAK_RESPOND,

    PERMISSIONS.HALAMAN_VIEW,
    PERMISSIONS.HALAMAN_CREATE,
    PERMISSIONS.HALAMAN_UPDATE,
    PERMISSIONS.HALAMAN_DELETE,
    PERMISSIONS.HALAMAN_PUBLISH,
  ],

  [ROLES.EDITOR]: [
    PERMISSIONS.DASHBOARD_VIEW,

    PERMISSIONS.BERITA_VIEW,
    PERMISSIONS.BERITA_CREATE,
    PERMISSIONS.BERITA_UPDATE,
    // Editor TIDAK boleh delete atau publish tanpa review.

    PERMISSIONS.HALAMAN_VIEW,
    PERMISSIONS.HALAMAN_CREATE,
    PERMISSIONS.HALAMAN_UPDATE,

    PERMISSIONS.GALERI_VIEW,
  ],
};

export function normalizeRole(role) {
  if (!role || typeof role !== "string") return null;
  return role.trim().toLowerCase();
}

export function getRolePermissions(role) {
  const normalized = normalizeRole(role);
  if (!normalized) return [];
  return ROLE_PERMISSIONS[normalized] || [];
}

export function hasPermission(role, permission) {
  const perms = getRolePermissions(role);
  return perms.includes(permission);
}

export function canAny(role, permissions = []) {
  return permissions.some((p) => hasPermission(role, p));
}

export function canAll(role, permissions = []) {
  return permissions.every((p) => hasPermission(role, p));
}

export function isAdminRole(role) {
  const n = normalizeRole(role);
  return n === ROLES.ADMIN || n === ROLES.SUPER_ADMIN;
}

export function isEditorRole(role) {
  const n = normalizeRole(role);
  return n === ROLES.EDITOR || n === ROLES.ADMIN || n === ROLES.SUPER_ADMIN;
}
