import { describe, it, expect } from "vitest";
import {
  ValidationError,
  cleanString,
  cleanHtml,
  requireFields,
  oneOf,
  toBool,
  toDateISO,
  toSafeNumber,
  toDocumentYear,
  isHttpsUrl,
  isPdfFile,
} from "@/lib/validation";

describe("cleanString", () => {
  it("trims whitespace", () => {
    expect(cleanString("  hello  ")).toBe("hello");
  });

  it("returns empty string for non-string input", () => {
    expect(cleanString(null)).toBe("");
    expect(cleanString(undefined)).toBe("");
    expect(cleanString(42)).toBe("");
  });
});

describe("cleanHtml", () => {
  it("strips script tags and inline handlers", () => {
    const dirty = `<p onclick="bad()">Halo</p><script>alert(1)</script>`;
    const clean = cleanHtml(dirty);

    expect(clean).not.toContain("<script>");
    expect(clean).not.toContain("onclick");
    expect(clean).toContain("Halo");
  });

  it("keeps basic formatting tags", () => {
    const dirty = "<p><strong>tebal</strong> dan <em>miring</em></p>";
    const clean = cleanHtml(dirty);

    expect(clean).toContain("<strong>");
    expect(clean).toContain("<em>");
  });

  it("removes javascript: URIs", () => {
    const dirty = `<a href="javascript:alert(1)">klik</a>`;
    expect(cleanHtml(dirty)).not.toMatch(/javascript\s*:/i);
  });
});

describe("toBool", () => {
  it("converts common truthy values", () => {
    expect(toBool(true)).toBe(true);
    expect(toBool(1)).toBe(true);
    expect(toBool("true")).toBe(true);
    expect(toBool("on")).toBe(true);
  });

  it("converts falsy values", () => {
    expect(toBool(false)).toBe(false);
    expect(toBool(0)).toBe(false);
    expect(toBool("no")).toBe(false);
    expect(toBool(null)).toBe(false);
  });
});

describe("requireFields", () => {
  it("throws when a required field is empty", () => {
    expect(() =>
      requireFields({}, [{ field: "nama", value: "", label: "Nama" }]),
    ).toThrow(ValidationError);
  });

  it("throws when min not satisfied", () => {
    expect(() =>
      requireFields({}, [
        { field: "pesan", value: "ab", min: 3, label: "Pesan" },
      ]),
    ).toThrow(ValidationError);
  });

  it("does not throw when valid", () => {
    expect(() =>
      requireFields({}, [{ field: "nama", value: "Andi", min: 3, max: 50 }]),
    ).not.toThrow();
  });
});

describe("oneOf", () => {
  it("throws when value is not allowed", () => {
    expect(() => oneOf("x", ["a", "b"], { field: "kategori" })).toThrow(
      ValidationError,
    );
  });

  it("accepts allowed values and returns trimmed", () => {
    expect(oneOf(" a ", ["a", "b"], { field: "kategori" })).toBe("a");
  });

  it("returns null for empty value", () => {
    expect(oneOf("", ["a", "b"], { field: "kategori" })).toBeNull();
  });
});

describe("toSafeNumber", () => {
  it("returns parsed number", () => {
    expect(toSafeNumber("25")).toBe(25);
  });

  it("returns null when optional and empty", () => {
    expect(toSafeNumber("")).toBeNull();
    expect(toSafeNumber(null)).toBeNull();
  });

  it("throws when invalid", () => {
    expect(() => toSafeNumber("abc", { field: "angka" })).toThrow(
      ValidationError,
    );
  });

  it("throws when integer required but float provided", () => {
    expect(() =>
      toSafeNumber("12.5", { field: "jumlah", integer: true }),
    ).toThrow(ValidationError);
  });

  it("throws when below minimum", () => {
    expect(() => toSafeNumber("1", { field: "jumlah", min: 5 })).toThrow(
      ValidationError,
    );
  });
});

describe("toDocumentYear", () => {
  it("accepts valid document year", () => {
    expect(toDocumentYear("2025")).toBe(2025);
  });

  it("returns null for empty optional year", () => {
    expect(toDocumentYear("")).toBeNull();
  });

  it("throws for out-of-range year", () => {
    expect(() => toDocumentYear("1800")).toThrow(ValidationError);
    expect(() => toDocumentYear("2200")).toThrow(ValidationError);
  });
});

describe("toDateISO", () => {
  it("returns ISO string for a valid date", () => {
    const iso = toDateISO("2026-04-17T07:00:00Z");
    expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("returns null for empty optional date", () => {
    expect(toDateISO("")).toBeNull();
    expect(toDateISO(null)).toBeNull();
  });

  it("throws on invalid date string", () => {
    expect(() => toDateISO("not-a-date")).toThrow(ValidationError);
  });

  it("throws when required is true and empty", () => {
    expect(() => toDateISO("", { required: true, field: "tanggal" })).toThrow(
      ValidationError,
    );
  });
});

describe("isHttpsUrl", () => {
  it("only accepts https URLs", () => {
    expect(isHttpsUrl("https://example.com")).toBe(true);
    expect(isHttpsUrl("http://example.com")).toBe(false);
    expect(isHttpsUrl("not-a-url")).toBe(false);
  });

  it("respects allowedHosts", () => {
    expect(
      isHttpsUrl("https://drive.google.com/file/d/abc", {
        allowedHosts: ["drive.google.com"],
      }),
    ).toBe(true);

    expect(
      isHttpsUrl("https://evil.com", {
        allowedHosts: ["drive.google.com"],
      }),
    ).toBe(false);
  });
});

describe("isPdfFile", () => {
  it("accepts valid pdf by mime type", () => {
    expect(
      isPdfFile({
        type: "application/pdf",
        name: "laporan.docx",
      }),
    ).toBe(true);
  });

  it("accepts valid pdf by file extension", () => {
    expect(
      isPdfFile({
        type: "",
        name: "dokumen.PDF",
      }),
    ).toBe(true);
  });

  it("rejects non pdf file", () => {
    expect(
      isPdfFile({
        type: "image/png",
        name: "gambar.png",
      }),
    ).toBe(false);
  });
});
