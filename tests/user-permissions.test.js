import { describe, it, expect, vi } from "vitest";

// Mock all server-side dependencies before importing
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

vi.mock("@/lib/auth", () => ({
  getCurrentSessionContext: vi.fn(),
}));

vi.mock("@/lib/drizzle", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn().mockResolvedValue([]),
        })),
      })),
    })),
  },
}));

vi.mock("@/lib/logger", () => ({
  logError: vi.fn(),
  logWarn: vi.fn(),
  logInfo: vi.fn(),
}));

vi.mock("@/db/schema", () => ({
  pusdatinUsers: {},
  pusdatinAppPermissions: {},
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
  and: vi.fn(),
}));

import {
  hasUserPermission,
  hasAnyUserPermission,
} from "@/lib/user-permissions";

// ─── hasUserPermission ────────────────────────────────────────────────────────

describe("hasUserPermission", () => {
  it("returns false when permissionContext is null", () => {
    expect(hasUserPermission(null, "berita:create")).toBe(false);
  });

  it("returns false when permission is null", () => {
    const ctx = {
      isSuperAdmin: false,
      permissions: ["berita:create"],
    };
    expect(hasUserPermission(ctx, null)).toBe(false);
  });

  it("returns true for super_admin regardless of permission list", () => {
    const ctx = {
      isSuperAdmin: true,
      permissions: [],
    };
    expect(hasUserPermission(ctx, "berita:delete")).toBe(true);
    expect(hasUserPermission(ctx, "any:random:permission")).toBe(true);
  });

  it("returns true when permission is in the list", () => {
    const ctx = {
      isSuperAdmin: false,
      permissions: ["berita:create", "galeri:read"],
    };
    expect(hasUserPermission(ctx, "berita:create")).toBe(true);
    expect(hasUserPermission(ctx, "galeri:read")).toBe(true);
  });

  it("returns false when permission is NOT in the list", () => {
    const ctx = {
      isSuperAdmin: false,
      permissions: ["berita:create"],
    };
    expect(hasUserPermission(ctx, "berita:delete")).toBe(false);
    expect(hasUserPermission(ctx, "admin:users")).toBe(false);
  });

  it("returns false when permissions is not an array", () => {
    const ctx = {
      isSuperAdmin: false,
      permissions: null,
    };
    expect(hasUserPermission(ctx, "berita:create")).toBe(false);
  });

  it("returns false for empty permissions list", () => {
    const ctx = {
      isSuperAdmin: false,
      permissions: [],
    };
    expect(hasUserPermission(ctx, "berita:create")).toBe(false);
  });
});

// ─── hasAnyUserPermission ─────────────────────────────────────────────────────

describe("hasAnyUserPermission", () => {
  it("returns false when permissions array is empty", () => {
    const ctx = {
      isSuperAdmin: false,
      permissions: ["berita:create"],
    };
    expect(hasAnyUserPermission(ctx, [])).toBe(false);
  });

  it("returns false when permissionContext is null", () => {
    expect(hasAnyUserPermission(null, ["berita:create"])).toBe(false);
  });

  it("returns true when at least one permission matches", () => {
    const ctx = {
      isSuperAdmin: false,
      permissions: ["berita:create", "galeri:read"],
    };
    expect(
      hasAnyUserPermission(ctx, ["admin:users", "berita:create"])
    ).toBe(true);
  });

  it("returns false when none of the permissions match", () => {
    const ctx = {
      isSuperAdmin: false,
      permissions: ["berita:create"],
    };
    expect(
      hasAnyUserPermission(ctx, ["admin:users", "galeri:delete"])
    ).toBe(false);
  });

  it("returns true for super_admin for any non-empty permissions array", () => {
    const ctx = {
      isSuperAdmin: true,
      permissions: [],
    };
    expect(
      hasAnyUserPermission(ctx, ["admin:nuke", "super:secret"])
    ).toBe(true);
  });

  it("handles single-element permissions array", () => {
    const ctx = {
      isSuperAdmin: false,
      permissions: ["laporan:upload"],
    };
    expect(hasAnyUserPermission(ctx, ["laporan:upload"])).toBe(true);
    expect(hasAnyUserPermission(ctx, ["laporan:delete"])).toBe(false);
  });
});
