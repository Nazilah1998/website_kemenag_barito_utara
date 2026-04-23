import { describe, it, expect } from "vitest";
import {
  ROLES,
  PERMISSIONS,
  hasPermission,
  canAny,
  canAll,
  normalizeRole,
  isAdminRole,
  isEditorRole,
} from "@/lib/permissions";

describe("normalizeRole", () => {
  it("lowercases and trims", () => {
    expect(normalizeRole("  Super_Admin  ")).toBe("super_admin");
  });

  it("returns null for falsy values", () => {
    expect(normalizeRole(null)).toBeNull();
    expect(normalizeRole(undefined)).toBeNull();
    expect(normalizeRole("")).toBeNull();
  });
});

describe("hasPermission", () => {
  it("super_admin has every permission", () => {
    expect(hasPermission(ROLES.SUPER_ADMIN, PERMISSIONS.USER_DELETE)).toBe(
      true,
    );

    expect(hasPermission(ROLES.SUPER_ADMIN, PERMISSIONS.SETTINGS_MANAGE)).toBe(
      true,
    );
  });

  it("editor cannot publish or delete berita", () => {
    expect(hasPermission(ROLES.EDITOR, PERMISSIONS.BERITA_PUBLISH)).toBe(false);

    expect(hasPermission(ROLES.EDITOR, PERMISSIONS.BERITA_DELETE)).toBe(false);
  });

  it("editor can create berita", () => {
    expect(hasPermission(ROLES.EDITOR, PERMISSIONS.BERITA_CREATE)).toBe(true);
  });

  it("admin has homepage slides permissions", () => {
    expect(hasPermission(ROLES.ADMIN, PERMISSIONS.HOMEPAGE_SLIDES_VIEW)).toBe(
      true,
    );
    expect(hasPermission(ROLES.ADMIN, PERMISSIONS.HOMEPAGE_SLIDES_MANAGE)).toBe(
      true,
    );
  });
});

describe("canAny / canAll", () => {
  it("canAny returns true if at least one permission matches", () => {
    expect(
      canAny(ROLES.EDITOR, [
        PERMISSIONS.BERITA_DELETE,
        PERMISSIONS.BERITA_CREATE,
      ]),
    ).toBe(true);
  });

  it("canAll requires all permissions to match", () => {
    expect(
      canAll(ROLES.EDITOR, [
        PERMISSIONS.BERITA_CREATE,
        PERMISSIONS.BERITA_PUBLISH,
      ]),
    ).toBe(false);

    expect(
      canAll(ROLES.SUPER_ADMIN, [
        PERMISSIONS.BERITA_CREATE,
        PERMISSIONS.BERITA_PUBLISH,
      ]),
    ).toBe(true);
  });
});

describe("role helpers", () => {
  it("isAdminRole covers admin and super_admin", () => {
    expect(isAdminRole(ROLES.ADMIN)).toBe(true);
    expect(isAdminRole(ROLES.SUPER_ADMIN)).toBe(true);
    expect(isAdminRole(ROLES.EDITOR)).toBe(false);
  });

  it("isEditorRole covers editor, admin, and super_admin", () => {
    expect(isEditorRole(ROLES.EDITOR)).toBe(true);
    expect(isEditorRole(ROLES.ADMIN)).toBe(true);
    expect(isEditorRole(ROLES.SUPER_ADMIN)).toBe(true);
    expect(isEditorRole("stranger")).toBe(false);
  });
});
