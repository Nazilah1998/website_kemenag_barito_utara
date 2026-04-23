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
  // Dashboard
  DASHBOARD_VIEW: "dashboard:view",

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

  // Laporan
  LAPORAN_VIEW: "laporan:view",
  LAPORAN_MANAGE: "laporan:manage",

  // Slider Beranda
  HOMEPAGE_SLIDES_VIEW: "homepage_slides:view",
  HOMEPAGE_SLIDES_MANAGE: "homepage_slides:manage",

  // Audit
  AUDIT_VIEW: "audit:view",

  // Manajemen pengguna
  USER_VIEW: "user:view",
  USER_INVITE: "user:invite",
  USER_UPDATE_ROLE: "user:update_role",
  USER_DELETE: "user:delete",

  // Pengaturan situs
  SETTINGS_MANAGE: "settings:manage",
};

export const PERMISSION_LABELS = {
  [PERMISSIONS.DASHBOARD_VIEW]: "Dashboard",

  [PERMISSIONS.BERITA_VIEW]: "Lihat berita",
  [PERMISSIONS.BERITA_CREATE]: "Tambah berita",
  [PERMISSIONS.BERITA_UPDATE]: "Edit berita",
  [PERMISSIONS.BERITA_DELETE]: "Hapus berita",
  [PERMISSIONS.BERITA_PUBLISH]: "Publish berita",

  [PERMISSIONS.GALERI_VIEW]: "Lihat galeri",
  [PERMISSIONS.GALERI_MANAGE]: "Kelola galeri",

  [PERMISSIONS.KONTAK_VIEW]: "Lihat kontak",
  [PERMISSIONS.KONTAK_RESPOND]: "Respon kontak",

  [PERMISSIONS.LAPORAN_VIEW]: "Lihat laporan",
  [PERMISSIONS.LAPORAN_MANAGE]: "Kelola laporan",

  [PERMISSIONS.HOMEPAGE_SLIDES_VIEW]: "Lihat slider beranda",
  [PERMISSIONS.HOMEPAGE_SLIDES_MANAGE]: "Kelola slider beranda",

  [PERMISSIONS.AUDIT_VIEW]: "Lihat audit log",

  [PERMISSIONS.USER_VIEW]: "Lihat pengguna",
  [PERMISSIONS.USER_INVITE]: "Undang pengguna",
  [PERMISSIONS.USER_UPDATE_ROLE]: "Ubah role pengguna",
  [PERMISSIONS.USER_DELETE]: "Hapus pengguna",

  [PERMISSIONS.SETTINGS_MANAGE]: "Kelola pengaturan situs",
};

export const AVAILABLE_EDITOR_PERMISSIONS = [
  PERMISSIONS.DASHBOARD_VIEW,

  PERMISSIONS.BERITA_VIEW,
  PERMISSIONS.BERITA_CREATE,
  PERMISSIONS.BERITA_UPDATE,
  PERMISSIONS.BERITA_DELETE,
  PERMISSIONS.BERITA_PUBLISH,

  PERMISSIONS.LAPORAN_VIEW,
  PERMISSIONS.LAPORAN_MANAGE,

  PERMISSIONS.HOMEPAGE_SLIDES_VIEW,
  PERMISSIONS.HOMEPAGE_SLIDES_MANAGE,

  PERMISSIONS.AUDIT_VIEW,
];

const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),

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

    PERMISSIONS.LAPORAN_VIEW,
    PERMISSIONS.LAPORAN_MANAGE,

    PERMISSIONS.HOMEPAGE_SLIDES_VIEW,
    PERMISSIONS.HOMEPAGE_SLIDES_MANAGE,

    PERMISSIONS.USER_VIEW,
  ],

  [ROLES.EDITOR]: [
    PERMISSIONS.DASHBOARD_VIEW,

    PERMISSIONS.BERITA_VIEW,
    PERMISSIONS.BERITA_CREATE,
    PERMISSIONS.BERITA_UPDATE,

    PERMISSIONS.LAPORAN_VIEW,
    PERMISSIONS.LAPORAN_MANAGE,

    PERMISSIONS.HOMEPAGE_SLIDES_VIEW,
    PERMISSIONS.HOMEPAGE_SLIDES_MANAGE,
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

export function getPermissionLabel(permission) {
  return PERMISSION_LABELS[permission] || permission;
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
