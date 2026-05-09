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
  KONTAK_MANAGE: "kontak:manage",

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

  [PERMISSIONS.KONTAK_MANAGE]: "Kelola pesan & pengaduan",

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

  PERMISSIONS.KONTAK_MANAGE,

  PERMISSIONS.AUDIT_VIEW,
];

export const EDITOR_PERMISSION_GROUPS = {
  DASHBOARD: "dashboard",
  BERITA_MANAGE: "berita_manage",
  GALERI_MANAGE: "galeri_manage",
  LAPORAN_MANAGE: "laporan_manage",
  HOMEPAGE_SLIDES_MANAGE: "homepage_slides_manage",
  KONTAK_MANAGE: "kontak_manage",
};

export const EDITOR_PERMISSION_GROUP_LABELS = {
  [EDITOR_PERMISSION_GROUPS.DASHBOARD]: "Dashboard",
  [EDITOR_PERMISSION_GROUPS.BERITA_MANAGE]: "Kelola Berita",
  [EDITOR_PERMISSION_GROUPS.GALERI_MANAGE]: "Kelola Galeri",
  [EDITOR_PERMISSION_GROUPS.LAPORAN_MANAGE]: "Kelola Laporan",
  [EDITOR_PERMISSION_GROUPS.HOMEPAGE_SLIDES_MANAGE]: "Kelola Slider Beranda",
  [EDITOR_PERMISSION_GROUPS.KONTAK_MANAGE]: "Kelola Pesan & Pengaduan",
};

export const AVAILABLE_EDITOR_PERMISSION_GROUPS = [
  EDITOR_PERMISSION_GROUPS.DASHBOARD,
  EDITOR_PERMISSION_GROUPS.BERITA_MANAGE,
  EDITOR_PERMISSION_GROUPS.GALERI_MANAGE,
  EDITOR_PERMISSION_GROUPS.LAPORAN_MANAGE,
  EDITOR_PERMISSION_GROUPS.HOMEPAGE_SLIDES_MANAGE,
  EDITOR_PERMISSION_GROUPS.KONTAK_MANAGE,
];

export const EDITOR_PERMISSION_GROUP_TO_PERMISSIONS = {
  [EDITOR_PERMISSION_GROUPS.DASHBOARD]: [PERMISSIONS.DASHBOARD_VIEW],
  [EDITOR_PERMISSION_GROUPS.BERITA_MANAGE]: [
    PERMISSIONS.BERITA_VIEW,
    PERMISSIONS.BERITA_CREATE,
    PERMISSIONS.BERITA_UPDATE,
    PERMISSIONS.BERITA_DELETE,
    PERMISSIONS.BERITA_PUBLISH,
  ],
  [EDITOR_PERMISSION_GROUPS.GALERI_MANAGE]: [
    PERMISSIONS.GALERI_VIEW,
    PERMISSIONS.GALERI_MANAGE,
  ],
  [EDITOR_PERMISSION_GROUPS.LAPORAN_MANAGE]: [
    PERMISSIONS.LAPORAN_VIEW,
    PERMISSIONS.LAPORAN_MANAGE,
  ],
  [EDITOR_PERMISSION_GROUPS.HOMEPAGE_SLIDES_MANAGE]: [
    PERMISSIONS.HOMEPAGE_SLIDES_VIEW,
    PERMISSIONS.HOMEPAGE_SLIDES_MANAGE,
  ],
  [EDITOR_PERMISSION_GROUPS.KONTAK_MANAGE]: [PERMISSIONS.KONTAK_MANAGE],
};

export function getEditorPermissionGroupLabel(group) {
  return EDITOR_PERMISSION_GROUP_LABELS[group] || group;
}

export function expandEditorPermissionGroups(groups = []) {
  const normalized = Array.isArray(groups) ? groups : [];
  const out = new Set();

  for (const group of normalized) {
    const mapped = EDITOR_PERMISSION_GROUP_TO_PERMISSIONS[group] || [];
    for (const permission of mapped) {
      out.add(permission);
    }
  }

  return [...out];
}

export function deriveEditorPermissionGroups(permissions = []) {
  const normalized = new Set(Array.isArray(permissions) ? permissions : []);
  const selectedGroups = [];

  for (const group of AVAILABLE_EDITOR_PERMISSION_GROUPS) {
    const requiredPermissions =
      EDITOR_PERMISSION_GROUP_TO_PERMISSIONS[group] || [];
    if (!requiredPermissions.length) continue;

    const hasAll = requiredPermissions.every((permission) =>
      normalized.has(permission),
    );

    if (hasAll) {
      selectedGroups.push(group);
    }
  }

  return selectedGroups;
}

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

    PERMISSIONS.KONTAK_MANAGE,

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
    PERMISSIONS.BERITA_DELETE,
    PERMISSIONS.BERITA_PUBLISH,

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
