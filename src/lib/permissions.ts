export const ROLES = {
  SUPER_ADMIN: "super_admin" as const,
  ADMIN: "admin" as const,
  EDITOR: "editor" as const,
};

export const ALL_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.EDITOR];

export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard:view",
  BERITA_VIEW: "berita:view",
  BERITA_CREATE: "berita:create",
  BERITA_UPDATE: "berita:update",
  BERITA_DELETE: "berita:delete",
  BERITA_PUBLISH: "berita:publish",
  GALERI_VIEW: "galeri:view",
  GALERI_MANAGE: "galeri:manage",
  KONTAK_MANAGE: "kontak:manage",
  LAPORAN_VIEW: "laporan:view",
  LAPORAN_MANAGE: "laporan:manage",
  HOMEPAGE_SLIDES_VIEW: "homepage_slides:view",
  HOMEPAGE_SLIDES_MANAGE: "homepage_slides:manage",
  AUDIT_VIEW: "audit:view",
  USER_VIEW: "user:view",
  USER_INVITE: "user:invite",
  USER_UPDATE_ROLE: "user:update_role",
  USER_DELETE: "user:delete",
  SEKSI_MANAGE: "seksi:manage",
  HALAMAN_VIEW: "halaman:view",
  HALAMAN_MANAGE: "halaman:manage",
  SETTINGS_MANAGE: "settings:manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const PERMISSION_LABELS: Record<string, string> = {
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
  [PERMISSIONS.SEKSI_MANAGE]: "Kelola kepegawaian & seksi",
  [PERMISSIONS.HALAMAN_VIEW]: "Lihat halaman statis",
  [PERMISSIONS.HALAMAN_MANAGE]: "Kelola halaman statis",
  [PERMISSIONS.USER_VIEW]: "Lihat pengguna",
  [PERMISSIONS.USER_INVITE]: "Undang pengguna",
  [PERMISSIONS.USER_UPDATE_ROLE]: "Ubah role pengguna",
  [PERMISSIONS.USER_DELETE]: "Hapus pengguna",
  [PERMISSIONS.SETTINGS_MANAGE]: "Kelola pengaturan situs",
};

export const AVAILABLE_EDITOR_PERMISSIONS: string[] = [
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
  PERMISSIONS.SEKSI_MANAGE,
  PERMISSIONS.HALAMAN_VIEW,
  PERMISSIONS.HALAMAN_MANAGE,
];

export const EDITOR_PERMISSION_GROUPS = {
  DASHBOARD: "dashboard",
  BERITA_MANAGE: "berita_manage",
  GALERI_MANAGE: "galeri_manage",
  LAPORAN_MANAGE: "laporan_manage",
  HOMEPAGE_SLIDES_MANAGE: "homepage_slides_manage",
  KONTAK_MANAGE: "kontak_manage",
  AUDIT_MANAGE: "audit_manage",
  SEKSI_MANAGE: "seksi_manage",
  HALAMAN_MANAGE: "halaman_manage",
} as const;

export const EDITOR_PERMISSION_GROUP_LABELS: Record<string, string> = {
  [EDITOR_PERMISSION_GROUPS.DASHBOARD]: "Dashboard",
  [EDITOR_PERMISSION_GROUPS.BERITA_MANAGE]: "Kelola Berita",
  [EDITOR_PERMISSION_GROUPS.GALERI_MANAGE]: "Kelola Galeri",
  [EDITOR_PERMISSION_GROUPS.LAPORAN_MANAGE]: "Kelola Laporan",
  [EDITOR_PERMISSION_GROUPS.HOMEPAGE_SLIDES_MANAGE]: "Kelola Slider Beranda",
  [EDITOR_PERMISSION_GROUPS.KONTAK_MANAGE]: "Kelola Pesan & Pengaduan",
  [EDITOR_PERMISSION_GROUPS.AUDIT_MANAGE]: "Kelola Audit",
  [EDITOR_PERMISSION_GROUPS.SEKSI_MANAGE]: "Kelola Kepegawaian & Seksi",
  [EDITOR_PERMISSION_GROUPS.HALAMAN_MANAGE]: "Kelola Halaman Statis",
};

export const AVAILABLE_EDITOR_PERMISSION_GROUPS: string[] = [
  EDITOR_PERMISSION_GROUPS.DASHBOARD,
  EDITOR_PERMISSION_GROUPS.BERITA_MANAGE,
  EDITOR_PERMISSION_GROUPS.GALERI_MANAGE,
  EDITOR_PERMISSION_GROUPS.LAPORAN_MANAGE,
  EDITOR_PERMISSION_GROUPS.HOMEPAGE_SLIDES_MANAGE,
  EDITOR_PERMISSION_GROUPS.KONTAK_MANAGE,
  EDITOR_PERMISSION_GROUPS.AUDIT_MANAGE,
  EDITOR_PERMISSION_GROUPS.SEKSI_MANAGE,
  EDITOR_PERMISSION_GROUPS.HALAMAN_MANAGE,
];

export const EDITOR_PERMISSION_GROUP_TO_PERMISSIONS: Record<string, string[]> = {
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
  [EDITOR_PERMISSION_GROUPS.AUDIT_MANAGE]: [PERMISSIONS.AUDIT_VIEW],
  [EDITOR_PERMISSION_GROUPS.SEKSI_MANAGE]: [PERMISSIONS.SEKSI_MANAGE],
  [EDITOR_PERMISSION_GROUPS.HALAMAN_MANAGE]: [
    PERMISSIONS.HALAMAN_VIEW,
    PERMISSIONS.HALAMAN_MANAGE,
  ],
};

export function getEditorPermissionGroupLabel(group: string): string {
  return EDITOR_PERMISSION_GROUP_LABELS[group] || group;
}

export function expandEditorPermissionGroups(groups: string[] = []): string[] {
  const normalized = Array.isArray(groups) ? groups : [];
  const out = new Set<string>();

  for (const group of normalized) {
    const mapped = EDITOR_PERMISSION_GROUP_TO_PERMISSIONS[group] || [];
    for (const permission of mapped) {
      out.add(permission);
    }
  }

  return [...out];
}

export function deriveEditorPermissionGroups(permissions: string[] = []): string[] {
  const normalized = new Set(Array.isArray(permissions) ? permissions : []);
  const selectedGroups: string[] = [];

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

const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),

  [ROLES.ADMIN]: [
    PERMISSIONS.DASHBOARD_VIEW,
  ],

  [ROLES.EDITOR]: [
    PERMISSIONS.DASHBOARD_VIEW,
  ],
};

export function normalizeRole(role: unknown): string | null {
  if (!role || typeof role !== "string") return null;
  return role.trim().toLowerCase();
}

export function getRolePermissions(role: unknown): string[] {
  const normalized = normalizeRole(role);
  if (!normalized) return [];
  return ROLE_PERMISSIONS[normalized] || [];
}

export function getPermissionLabel(permission: string): string {
  return PERMISSION_LABELS[permission] || permission;
}

export function hasPermission(role: unknown, permission: string): boolean {
  const perms = getRolePermissions(role);
  return perms.includes(permission);
}

export function canAny(role: unknown, permissions: string[] = []): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function canAll(role: unknown, permissions: string[] = []): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

export function isAdminRole(role: unknown): boolean {
  const n = normalizeRole(role);
  return n === ROLES.ADMIN || n === ROLES.SUPER_ADMIN;
}

export function isEditorRole(role: unknown): boolean {
  const n = normalizeRole(role);
  return n === ROLES.EDITOR || n === ROLES.ADMIN || n === ROLES.SUPER_ADMIN;
}
