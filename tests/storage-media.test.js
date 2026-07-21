import { describe, it, expect, vi } from "vitest";

// ─── Mock env + Supabase admin client & logger ───────────────────────────────
// storage-media.ts → supabase/admin.js → env.ts which throws if SUPABASE_URL missing.
// We must mock these BEFORE importing storage-media.
vi.mock("@/lib/env", () => ({
  env: {
    supabaseUrl: "https://mock.supabase.co",
    supabasePublishableKey: "mock-anon-key",
    supabaseServiceRoleKey: "mock-service-role-key",
    siteUrl: "http://localhost:3000",
    turnstileSiteKey: "",
    turnstileSecretKey: "",
  },
  assertServiceRoleKey: vi.fn(() => "mock-service-role-key"),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(() => ({
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ data: { path: "test/path.webp" }, error: null }),
        getPublicUrl: vi.fn(() => ({
          data: { publicUrl: "https://mock.supabase.co/storage/v1/object/public/cms-media/test/path.webp" },
        })),
        remove: vi.fn().mockResolvedValue({ data: [{}], error: null }),
      })),
    },
  })),
}));

vi.mock("@/lib/logger", () => ({
  logError: vi.fn(),
}));

import {
  isCmsStoragePublicUrl,
  CMS_MEDIA_BUCKET,
  LAPORAN_DOCUMENTS_BUCKET,
} from "@/lib/storage-media";

// ─── Bucket name constants ────────────────────────────────────────────────────

describe("Storage bucket constants", () => {
  it("CMS_MEDIA_BUCKET defaults to 'cms-media'", () => {
    expect(CMS_MEDIA_BUCKET).toBe("cms-media");
  });

  it("LAPORAN_DOCUMENTS_BUCKET defaults to 'laporan-documents'", () => {
    expect(LAPORAN_DOCUMENTS_BUCKET).toBe("laporan-documents");
  });
});

// ─── isCmsStoragePublicUrl ────────────────────────────────────────────────────

describe("isCmsStoragePublicUrl", () => {
  it("returns true for Supabase storage v1 public URL", () => {
    const url = "https://abc.supabase.co/storage/v1/object/public/cms-media/foto.webp";
    expect(isCmsStoragePublicUrl(url)).toBe(true);
  });

  it("returns true for internal /api/storage/media/ proxy URL", () => {
    const url = "https://baritoutara.kemenag.go.id/api/storage/media/seksi/2025/07/foto.webp";
    expect(isCmsStoragePublicUrl(url)).toBe(true);
  });

  it("returns false for arbitrary external URLs", () => {
    expect(isCmsStoragePublicUrl("https://example.com/image.jpg")).toBe(false);
    expect(isCmsStoragePublicUrl("https://drive.google.com/file/d/abc")).toBe(false);
  });

  it("returns false for empty/null input", () => {
    expect(isCmsStoragePublicUrl("")).toBe(false);
    expect(isCmsStoragePublicUrl(undefined)).toBe(false);
  });

  it("returns false for local file paths", () => {
    expect(isCmsStoragePublicUrl("/assets/images/foto.jpg")).toBe(false);
  });
});

// ─── Data URL security validation (via parseDataUrl internal logic) ──────────
// We test the validation boundary by calling uploadBase64Image with bad input
// and checking it throws correctly. The Supabase client is mocked above.

describe("uploadBase64Image — MIME type security validation", () => {
  it("throws for unsupported MIME type (PDF disguised as data URL)", async () => {
    const { uploadBase64Image } = await import("@/lib/storage-media");
    // PDF data URL — should be rejected, not uploaded
    const fakePdfDataUrl = "data:application/pdf;base64,JVBERi0xLjQK";
    await expect(
      uploadBase64Image({ dataUrl: fakePdfDataUrl, folder: "test" })
    ).rejects.toThrow("tidak didukung");
  });

  it("throws for SVG data URL (XSS vector)", async () => {
    const { uploadBase64Image } = await import("@/lib/storage-media");
    const fakeSvgDataUrl = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==";
    await expect(
      uploadBase64Image({ dataUrl: fakeSvgDataUrl, folder: "test" })
    ).rejects.toThrow("tidak didukung");
  });

  it("throws for invalid data URL format (no base64 prefix)", async () => {
    const { uploadBase64Image } = await import("@/lib/storage-media");
    await expect(
      uploadBase64Image({ dataUrl: "https://example.com/image.jpg", folder: "test" })
    ).rejects.toThrow("tidak valid");
  });

  it("throws for empty data URL", async () => {
    const { uploadBase64Image } = await import("@/lib/storage-media");
    await expect(
      uploadBase64Image({ dataUrl: "", folder: "test" })
    ).rejects.toThrow();
  });

  it("accepts valid JPEG data URL format", async () => {
    const { uploadBase64Image } = await import("@/lib/storage-media");
    // Minimal valid JPEG base64 header
    const fakeJpegDataUrl = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBD";
    // Should not throw on MIME check (may throw on Supabase mock if needed, but passes validation)
    await expect(
      uploadBase64Image({ dataUrl: fakeJpegDataUrl, folder: "test", fileNameStem: "cover" })
    ).resolves.toBeDefined();
  });

  it("accepts valid WebP data URL format", async () => {
    const { uploadBase64Image } = await import("@/lib/storage-media");
    const fakeWebpDataUrl = "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCd";
    await expect(
      uploadBase64Image({ dataUrl: fakeWebpDataUrl, folder: "test", fileNameStem: "cover" })
    ).resolves.toBeDefined();
  });
});

// ─── Storage path extraction from public URL ─────────────────────────────────

describe("extractStoragePathFromPublicUrl (via isCmsStoragePublicUrl)", () => {
  it("correctly identifies nested Supabase storage URL paths", () => {
    const url = "https://abc.supabase.co/storage/v1/object/public/cms-media/seksi/2025/07/foto.webp";
    expect(isCmsStoragePublicUrl(url)).toBe(true);
  });

  it("correctly identifies multi-level nested paths", () => {
    const url = "https://abc.supabase.co/storage/v1/object/public/cms-media/berita/2025/12/cover-image.jpg";
    expect(isCmsStoragePublicUrl(url)).toBe(true);
  });

  it("returns false for URLs that merely contain 'storage' in path but not Supabase pattern", () => {
    const url = "https://example.com/storage/files/image.jpg";
    expect(isCmsStoragePublicUrl(url)).toBe(false);
  });
});
