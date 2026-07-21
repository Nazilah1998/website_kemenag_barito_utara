import { describe, it, expect, vi } from "vitest";

// ─── Mock all server dependencies ────────────────────────────────────────────
vi.mock("@/lib/auth", () => ({
  getCurrentSessionContext: vi.fn(),
}));

vi.mock("@/lib/user-permissions", () => ({
  getUserPermissionContext: vi.fn(),
  hasUserPermission: vi.fn(),
}));

vi.mock("@/lib/permissions", () => ({
  ROLES: {
    SUPER_ADMIN: "super_admin",
    ADMIN: "admin",
    EDITOR: "editor",
  },
  getRolePermissions: vi.fn(() => []),
}));

vi.mock("@/lib/drizzle", () => ({
  db: {
    select: vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn(() => ({ limit: vi.fn().mockResolvedValue([]) })) })) })),
  },
}));

vi.mock("@/lib/logger", () => ({
  logError: vi.fn(),
  logWarn: vi.fn(),
}));

import { getCurrentSessionContext } from "@/lib/auth";
import { getUserPermissionContext, hasUserPermission } from "@/lib/user-permissions";
import { requireApiPermission } from "@/lib/api-permissions";

// ─── Helper: build permission context ────────────────────────────────────────

function makePermContext(overrides = {}) {
  return {
    role: "editor",
    email: "editor@kemenag.go.id",
    isSuperAdmin: false,
    isAdmin: false,
    isEditor: true,
    isActive: true,
    approved: true,
    requestStatus: "approved",
    permissions: ["berita:create"],
    ...overrides,
  };
}

// ─── requireApiPermission ─────────────────────────────────────────────────────

describe("requireApiPermission", () => {
  it("returns 401 when session is null / unauthenticated", async () => {
    vi.mocked(getCurrentSessionContext).mockResolvedValueOnce(null);

    const result = await requireApiPermission("berita:create");
    expect(result.ok).toBe(false);
    expect(result.status).toBe(401);
    expect(result.message).toMatch(/belum login/i);
  });

  it("returns 401 when session.isAuthenticated is false", async () => {
    vi.mocked(getCurrentSessionContext).mockResolvedValueOnce({
      isAuthenticated: false,
      isEditor: false,
      isAdmin: false,
    });

    const result = await requireApiPermission("berita:create");
    expect(result.ok).toBe(false);
    expect(result.status).toBe(401);
  });

  it("returns 403 when user is authenticated but not editor or admin", async () => {
    vi.mocked(getCurrentSessionContext).mockResolvedValueOnce({
      isAuthenticated: true,
      isEditor: false,
      isAdmin: false,
    });

    const result = await requireApiPermission("berita:create");
    expect(result.ok).toBe(false);
    expect(result.status).toBe(403);
    expect(result.message).toMatch(/admin\/editor/i);
  });

  it("returns ok:true for super_admin without checking specific permission", async () => {
    vi.mocked(getCurrentSessionContext).mockResolvedValueOnce({
      isAuthenticated: true,
      isEditor: true,
      isAdmin: true,
      role: "super_admin",
      profile: { id: "user-1", email: "superadmin@kemenag.go.id" },
    });
    vi.mocked(getUserPermissionContext).mockResolvedValueOnce(
      makePermContext({ isSuperAdmin: true, role: "super_admin" })
    );

    const result = await requireApiPermission("berita:delete");
    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
  });

  it("returns ok:true for admin role without checking specific permission", async () => {
    vi.mocked(getCurrentSessionContext).mockResolvedValueOnce({
      isAuthenticated: true,
      isEditor: true,
      isAdmin: true,
      role: "admin",
      profile: { id: "user-2", email: "admin@kemenag.go.id" },
    });
    vi.mocked(getUserPermissionContext).mockResolvedValueOnce(
      makePermContext({ role: "admin", isAdmin: true })
    );

    const result = await requireApiPermission("galeri:delete");
    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
  });

  it("returns 403 when editor is not approved", async () => {
    vi.mocked(getCurrentSessionContext).mockResolvedValueOnce({
      isAuthenticated: true,
      isEditor: true,
      isAdmin: false,
      role: "editor",
      profile: { id: "user-3", email: "editor@kemenag.go.id" },
    });
    vi.mocked(getUserPermissionContext).mockResolvedValueOnce(
      makePermContext({ approved: false, isSuperAdmin: false })
    );

    const result = await requireApiPermission("berita:create");
    expect(result.ok).toBe(false);
    expect(result.status).toBe(403);
    expect(result.message).toMatch(/belum aktif|belum disetujui/i);
  });

  it("returns 403 when editor account is inactive", async () => {
    vi.mocked(getCurrentSessionContext).mockResolvedValueOnce({
      isAuthenticated: true,
      isEditor: true,
      isAdmin: false,
      role: "editor",
      profile: { id: "user-4", email: "inactive@kemenag.go.id" },
    });
    vi.mocked(getUserPermissionContext).mockResolvedValueOnce(
      makePermContext({ isActive: false, isSuperAdmin: false })
    );

    const result = await requireApiPermission("berita:create");
    expect(result.ok).toBe(false);
    expect(result.status).toBe(403);
  });

  it("returns 403 when editor does not have the required permission", async () => {
    vi.mocked(getCurrentSessionContext).mockResolvedValueOnce({
      isAuthenticated: true,
      isEditor: true,
      isAdmin: false,
      role: "editor",
      profile: { id: "user-5", email: "editor@kemenag.go.id" },
    });
    vi.mocked(getUserPermissionContext).mockResolvedValueOnce(
      makePermContext({ isSuperAdmin: false })
    );
    vi.mocked(hasUserPermission).mockReturnValueOnce(false);

    const result = await requireApiPermission("laporan:delete");
    expect(result.ok).toBe(false);
    expect(result.status).toBe(403);
    expect(result.message).toMatch(/tidak memiliki izin/i);
  });

  it("returns ok:true when editor has the required permission", async () => {
    vi.mocked(getCurrentSessionContext).mockResolvedValueOnce({
      isAuthenticated: true,
      isEditor: true,
      isAdmin: false,
      role: "editor",
      profile: { id: "user-6", email: "editor@kemenag.go.id" },
    });
    vi.mocked(getUserPermissionContext).mockResolvedValueOnce(
      makePermContext({ isSuperAdmin: false })
    );
    vi.mocked(hasUserPermission).mockReturnValueOnce(true);

    const result = await requireApiPermission("berita:create");
    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
  });
});
