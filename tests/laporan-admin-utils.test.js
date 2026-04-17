import { describe, expect, it } from "vitest";
import {
  EMPTY_DOC_FORM,
  formatBytes,
  normalizeCategoryMap,
  normalizeDocUrl,
  prependDocumentToList,
  removeDocumentFromList,
  replaceDocumentInList,
} from "../src/lib/laporan-admin";

describe("laporan-admin utils", () => {
  it("returns empty map when category slug is missing", () => {
    expect(normalizeCategoryMap(null)).toEqual({});
    expect(normalizeCategoryMap({})).toEqual({});
  });

  it("normalizes category documents by slug", () => {
    const result = normalizeCategoryMap({
      slug: "laporan-tahunan",
      documents: [{ id: 1, title: "Doc A" }],
    });

    expect(result).toEqual({
      "laporan-tahunan": [{ id: 1, title: "Doc A" }],
    });
  });

  it("falls back to empty documents array if documents is invalid", () => {
    const result = normalizeCategoryMap({
      slug: "laporan-tahunan",
      documents: null,
    });

    expect(result).toEqual({
      "laporan-tahunan": [],
    });
  });

  it("normalizes document URL from file_url first", () => {
    expect(
      normalizeDocUrl({
        file_url: " https://example.com/file.pdf ",
        href: "https://fallback.com/x.pdf",
      }),
    ).toBe("https://example.com/file.pdf");
  });

  it("falls back to href when file_url is missing", () => {
    expect(
      normalizeDocUrl({
        href: " https://example.com/fallback.pdf ",
      }),
    ).toBe("https://example.com/fallback.pdf");
  });

  it("returns empty string when document URL fields are absent", () => {
    expect(normalizeDocUrl({})).toBe("");
  });

  it("formats bytes correctly", () => {
    expect(formatBytes(0)).toBe("-");
    expect(formatBytes(500)).toBe("500 B");
    expect(formatBytes(2048)).toBe("2 KB");
    expect(formatBytes(1048576)).toBe("1.00 MB");
  });

  it("prepends document into list", () => {
    const list = [{ id: 2 }, { id: 3 }];
    const result = prependDocumentToList(list, { id: 1 });

    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  it("replaces document in list by id", () => {
    const list = [
      { id: 1, title: "Old" },
      { id: 2, title: "Keep" },
    ];

    const result = replaceDocumentInList(list, 1, {
      id: 1,
      title: "New",
    });

    expect(result).toEqual([
      { id: 1, title: "New" },
      { id: 2, title: "Keep" },
    ]);
  });

  it("removes document from list by id", () => {
    const list = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = removeDocumentFromList(list, 2);

    expect(result).toEqual([{ id: 1 }, { id: 3 }]);
  });

  it("keeps empty form shape stable", () => {
    expect(EMPTY_DOC_FORM).toEqual({
      title: "",
      description: "",
      year: "",
      is_published: true,
    });
  });
});
