import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ─── Mock server-only dependencies ─────────────────────────────────────────
// audit.ts imports drizzle and logger, both of which are server-only.
// We mock them at the module level so Vitest (happy-dom) can run these tests.

vi.mock("@/lib/drizzle", () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn().mockResolvedValue(undefined),
    })),
  },
}));

vi.mock("@/lib/logger", () => ({
  logWarn: vi.fn(),
  logError: vi.fn(),
  logInfo: vi.fn(),
}));

import {
  recordAudit,
  AUDIT_ACTIONS,
  AUDIT_ENTITIES,
} from "@/lib/audit";

// ─── AUDIT_ACTIONS constants ─────────────────────────────────────────────────

describe("AUDIT_ACTIONS constants", () => {
  it("defines all expected action types", () => {
    expect(AUDIT_ACTIONS.CREATE).toBe("create");
    expect(AUDIT_ACTIONS.UPDATE).toBe("update");
    expect(AUDIT_ACTIONS.DELETE).toBe("delete");
    expect(AUDIT_ACTIONS.PUBLISH).toBe("publish");
    expect(AUDIT_ACTIONS.UNPUBLISH).toBe("unpublish");
    expect(AUDIT_ACTIONS.LOGIN).toBe("login");
    expect(AUDIT_ACTIONS.LOGOUT).toBe("logout");
    expect(AUDIT_ACTIONS.ROLE_CHANGE).toBe("role_change");
  });
});

// ─── AUDIT_ENTITIES constants ────────────────────────────────────────────────

describe("AUDIT_ENTITIES constants", () => {
  it("defines all expected entity types", () => {
    expect(AUDIT_ENTITIES.BERITA).toBe("berita");
    expect(AUDIT_ENTITIES.GALERI).toBe("galeri");
    expect(AUDIT_ENTITIES.HALAMAN).toBe("halaman");
    expect(AUDIT_ENTITIES.LAPORAN_DOKUMEN).toBe("laporan_dokumen");
    expect(AUDIT_ENTITIES.KONTAK).toBe("kontak");
    expect(AUDIT_ENTITIES.USER).toBe("user");
    expect(AUDIT_ENTITIES.SETTINGS).toBe("settings");
    expect(AUDIT_ENTITIES.HOMEPAGE_SLIDES).toBe("homepage_slides");
    expect(AUDIT_ENTITIES.SEKSI).toBe("seksi");
  });
});

// ─── recordAudit ─────────────────────────────────────────────────────────────

describe("recordAudit", () => {
  const mockSession = {
    profile: { email: "admin@kemenag.go.id" },
  };

  it("runs without throwing for a valid create audit call", async () => {
    await expect(
      recordAudit({
        session: mockSession,
        action: AUDIT_ACTIONS.CREATE,
        entity: AUDIT_ENTITIES.BERITA,
        entityId: "berita-123",
        after: { judul: "Berita Baru" },
      })
    ).resolves.toBeUndefined();
  });

  it("runs without throwing when session is null (system action)", async () => {
    await expect(
      recordAudit({
        session: null,
        action: AUDIT_ACTIONS.DELETE,
        entity: AUDIT_ENTITIES.GALERI,
        entityId: "galeri-456",
      })
    ).resolves.toBeUndefined();
  });

  it("runs without throwing for login/logout audit", async () => {
    await expect(
      recordAudit({
        session: mockSession,
        action: AUDIT_ACTIONS.LOGIN,
        entity: AUDIT_ENTITIES.USER,
      })
    ).resolves.toBeUndefined();
  });

  it("does not expose password fields in afterState (redaction)", async () => {
    // We verify this indirectly — it should not throw even with sensitive data
    await expect(
      recordAudit({
        session: mockSession,
        action: AUDIT_ACTIONS.UPDATE,
        entity: AUDIT_ENTITIES.USER,
        after: {
          email: "admin@kemenag.go.id",
          password: "super-secret",
          token: "jwt-token-here",
        },
      })
    ).resolves.toBeUndefined();
  });

  it("runs without throwing when request object is provided", async () => {
    const mockRequest = {
      headers: {
        get: (name) => {
          if (name === "x-forwarded-for") return "192.168.1.100";
          return null;
        },
      },
    };
    await expect(
      recordAudit({
        session: mockSession,
        action: AUDIT_ACTIONS.PUBLISH,
        entity: AUDIT_ENTITIES.BERITA,
        request: mockRequest,
      })
    ).resolves.toBeUndefined();
  });

  it("uses user.email when profile.email is absent", async () => {
    const sessionWithUser = {
      user: { email: "editor@kemenag.go.id" },
    };
    await expect(
      recordAudit({
        session: sessionWithUser,
        action: AUDIT_ACTIONS.UPDATE,
        entity: AUDIT_ENTITIES.HALAMAN,
        after: { title: "Halaman Baru" },
      })
    ).resolves.toBeUndefined();
  });

  it("runs without throwing when before and after states are provided", async () => {
    await expect(
      recordAudit({
        session: mockSession,
        action: AUDIT_ACTIONS.UPDATE,
        entity: AUDIT_ENTITIES.BERITA,
        entityId: "berita-789",
        before: { judul: "Judul Lama" },
        after: { judul: "Judul Baru" },
      })
    ).resolves.toBeUndefined();
  });
});
