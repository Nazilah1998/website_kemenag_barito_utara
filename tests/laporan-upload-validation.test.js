import { describe, it, expect } from "vitest";
import {
  sanitizeBaseFilename,
  hasAllowedPdfExtension,
  validatePdfFile,
  buildSafePdfFilename,
  validateDocumentPayload,
} from "@/lib/laporan-upload-validation";

// ─── sanitizeBaseFilename ───────────────────────────────────────────────────

describe("sanitizeBaseFilename", () => {
  it("lowercases and trims input", () => {
    expect(sanitizeBaseFilename("  Laporan Kinerja  ")).toBe("laporan-kinerja");
  });

  it("replaces spaces and underscores with dashes", () => {
    expect(sanitizeBaseFilename("laporan_tahunan 2025")).toBe("laporan-tahunan-2025");
  });

  it("removes special characters except word chars and dash", () => {
    expect(sanitizeBaseFilename("laporan! @#$%.pdf")).toBe("laporan-pdf");
  });

  it("collapses multiple consecutive dashes", () => {
    expect(sanitizeBaseFilename("a---b")).toBe("a-b");
  });

  it("truncates to 80 characters", () => {
    const long = "a".repeat(100);
    expect(sanitizeBaseFilename(long).length).toBeLessThanOrEqual(80);
  });

  it("handles empty input gracefully", () => {
    expect(sanitizeBaseFilename("")).toBe("");
    expect(sanitizeBaseFilename(undefined)).toBe("");
  });

  it("normalizes Unicode NFKD characters (strips combining accents)", () => {
    // NFKD decomposes 'é' → base 'e' + combining accent; \w keeps 'e', strips combining marks
    const result = sanitizeBaseFilename("café");
    expect(result).toBe("cafe");
  });
});

// ─── hasAllowedPdfExtension ─────────────────────────────────────────────────

describe("hasAllowedPdfExtension", () => {
  it("accepts .pdf extension (lowercase)", () => {
    expect(hasAllowedPdfExtension("laporan.pdf")).toBe(true);
  });

  it("accepts .PDF extension (uppercase)", () => {
    expect(hasAllowedPdfExtension("LAPORAN.PDF")).toBe(true);
  });

  it("rejects .docx extension", () => {
    expect(hasAllowedPdfExtension("laporan.docx")).toBe(false);
  });

  it("rejects empty filename", () => {
    expect(hasAllowedPdfExtension("")).toBe(false);
  });

  it("rejects filename with no extension", () => {
    expect(hasAllowedPdfExtension("laporan")).toBe(false);
  });
});

// ─── validatePdfFile ────────────────────────────────────────────────────────

describe("validatePdfFile", () => {
  function makeFile({ name = "laporan.pdf", type = "application/pdf", size = 1024 } = {}) {
    return { name, type, size };
  }

  it("returns ok: true for valid PDF file", () => {
    expect(validatePdfFile(makeFile())).toEqual({ ok: true });
  });

  it("returns error when file is null/undefined", () => {
    expect(validatePdfFile(null).ok).toBe(false);
    expect(validatePdfFile(undefined).ok).toBe(false);
  });

  it("returns error when file size is 0", () => {
    const result = validatePdfFile(makeFile({ size: 0 }));
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/kosong/i);
  });

  it("returns error when file size exceeds 50 MB", () => {
    const result = validatePdfFile(makeFile({ size: 51 * 1024 * 1024 }));
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/50 MB/i);
  });

  it("returns error for non-.pdf extension", () => {
    const result = validatePdfFile(makeFile({ name: "laporan.docx", type: "application/pdf" }));
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/ekstensi/i);
  });

  it("returns error for wrong MIME type", () => {
    const result = validatePdfFile(makeFile({ type: "image/png" }));
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/tipe file/i);
  });
});

// ─── buildSafePdfFilename ───────────────────────────────────────────────────

describe("buildSafePdfFilename", () => {
  it("strips .pdf from original name and adds .pdf", () => {
    expect(buildSafePdfFilename("Laporan Kinerja.pdf")).toBe("laporan-kinerja.pdf");
  });

  it("uses prefix as fallback for empty name", () => {
    expect(buildSafePdfFilename("", "dok")).toBe("dok.pdf");
  });

  it("uses 'laporan' as default prefix", () => {
    expect(buildSafePdfFilename("")).toBe("laporan.pdf");
  });

  it("sanitizes special characters in name", () => {
    const result = buildSafePdfFilename("Data/Laporan 2025!.pdf");
    expect(result).toMatch(/\.pdf$/);
    expect(result).not.toContain("/");
    expect(result).not.toContain("!");
  });
});

// ─── validateDocumentPayload ────────────────────────────────────────────────

describe("validateDocumentPayload", () => {
  it("returns ok: true for valid payload", () => {
    const result = validateDocumentPayload({
      title: "Laporan 2025",
      description: "Deskripsi",
      year: "2025",
      is_published: true,
    });
    expect(result.ok).toBe(true);
    expect(result.data.title).toBe("Laporan 2025");
    expect(result.data.year).toBe(2025);
    expect(result.data.is_published).toBe(true);
  });

  it("returns error when title is empty and required", () => {
    const result = validateDocumentPayload({ title: "" });
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/judul/i);
  });

  it("does not require title when requireTitle is false", () => {
    const result = validateDocumentPayload(
      { title: "" },
      { requireTitle: false }
    );
    expect(result.ok).toBe(true);
  });

  it("returns error when title exceeds 180 characters", () => {
    const result = validateDocumentPayload({ title: "a".repeat(181) });
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/180/);
  });

  it("returns error when description exceeds 2000 characters", () => {
    const result = validateDocumentPayload({
      title: "Valid",
      description: "x".repeat(2001),
    });
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/2000/);
  });

  it("returns error for year outside 2000-2100 range", () => {
    expect(validateDocumentPayload({ title: "T", year: "1999" }).ok).toBe(false);
    expect(validateDocumentPayload({ title: "T", year: "2101" }).ok).toBe(false);
  });

  it("accepts valid edge-case years 2000 and 2100", () => {
    expect(validateDocumentPayload({ title: "T", year: "2000" }).ok).toBe(true);
    expect(validateDocumentPayload({ title: "T", year: "2100" }).ok).toBe(true);
  });

  it("returns null year when year is not provided", () => {
    const result = validateDocumentPayload({ title: "Laporan" });
    expect(result.ok).toBe(true);
    expect(result.data.year).toBeNull();
  });

  it("coerces is_published to boolean", () => {
    const result = validateDocumentPayload({ title: "T", is_published: "true" });
    expect(typeof result.data.is_published).toBe("boolean");
  });
});
