import { describe, it, expect } from "vitest";
import {
  slugPreview,
  stripHtml,
  escapeHtml,
  countWords,
  estimateReadingTime,
  buildExcerptFromHtml,
  isMeaningfulHtml,
  buildPagination,
  getYearKey,
  getMonthKey,
  getMonthLabelFromKey,
  getItemPublishedState,
  getItemBaseDate,
  plainTextToEditorHtml,
  sanitizeSlugInput,
  BERITA_CATEGORIES,
} from "@/lib/berita-utils";

// ─── BERITA_CATEGORIES ───────────────────────────────────────────────────────

describe("BERITA_CATEGORIES", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(BERITA_CATEGORIES)).toBe(true);
    expect(BERITA_CATEGORIES.length).toBeGreaterThan(0);
  });

  it("contains 'Umum' and 'Kegiatan'", () => {
    expect(BERITA_CATEGORIES).toContain("Umum");
    expect(BERITA_CATEGORIES).toContain("Kegiatan");
  });
});

// ─── slugPreview ─────────────────────────────────────────────────────────────

describe("slugPreview", () => {
  it("converts title to lowercase slug", () => {
    expect(slugPreview("Berita Terbaru")).toBe("berita-terbaru");
  });

  it("strips accented characters", () => {
    expect(slugPreview("Kegiatan Ramadān")).toBe("kegiatan-ramadan");
  });

  it("replaces multiple spaces with single dash", () => {
    expect(slugPreview("berita  hari  ini")).toBe("berita-hari-ini");
  });

  it("removes special characters", () => {
    expect(slugPreview("Berita! @#$ 2025")).toBe("berita-2025");
  });

  it("collapses multiple dashes", () => {
    expect(slugPreview("hello---world")).toBe("hello-world");
  });

  it("trims leading and trailing dashes", () => {
    expect(slugPreview("-judul berita-")).toBe("judul-berita");
  });

  it("returns empty string for empty input", () => {
    expect(slugPreview("")).toBe("");
    expect(slugPreview(null)).toBe("");
  });
});

// ─── sanitizeSlugInput ────────────────────────────────────────────────────────

describe("sanitizeSlugInput", () => {
  it("delegates to slugPreview", () => {
    expect(sanitizeSlugInput("Judul Berita")).toBe(slugPreview("Judul Berita"));
  });
});

// ─── stripHtml ────────────────────────────────────────────────────────────────

describe("stripHtml", () => {
  it("removes HTML tags", () => {
    expect(stripHtml("<p>Hello <strong>World</strong></p>")).toBe("Hello World");
  });

  it("replaces &nbsp; with space", () => {
    expect(stripHtml("Hello&nbsp;World")).toBe("Hello World");
  });

  it("collapses multiple spaces", () => {
    expect(stripHtml("<p>  too   many   spaces  </p>")).toBe("too many spaces");
  });

  it("returns empty string for empty input", () => {
    expect(stripHtml("")).toBe("");
    expect(stripHtml(null)).toBe("");
  });

  it("handles nested tags", () => {
    const result = stripHtml("<div><p><span>text</span></p></div>");
    expect(result).toBe("text");
  });
});

// ─── escapeHtml ───────────────────────────────────────────────────────────────

describe("escapeHtml", () => {
  it("escapes ampersand", () => {
    expect(escapeHtml("a & b")).toBe("a &amp; b");
  });

  it("escapes less-than sign", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("escapes double quotes", () => {
    expect(escapeHtml('say "hello"')).toBe("say &quot;hello&quot;");
  });

  it("escapes single quotes", () => {
    expect(escapeHtml("it's")).toBe("it&#39;s");
  });

  it("returns empty string for falsy input", () => {
    expect(escapeHtml("")).toBe("");
    expect(escapeHtml(null)).toBe("");
  });

  it("does not double-escape", () => {
    // It escapes once — does not try to detect pre-escaped
    expect(escapeHtml("&amp;")).toBe("&amp;amp;");
  });
});

// ─── countWords ───────────────────────────────────────────────────────────────

describe("countWords", () => {
  it("counts words in plain text", () => {
    expect(countWords("satu dua tiga")).toBe(3);
  });

  it("counts words inside HTML tags", () => {
    expect(countWords("<p>satu dua</p>")).toBe(2);
  });

  it("returns 0 for empty or whitespace-only content", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   ")).toBe(0);
    expect(countWords("<p></p>")).toBe(0);
  });

  it("handles multiple spaces between words", () => {
    expect(countWords("satu   dua   tiga")).toBe(3);
  });
});

// ─── estimateReadingTime ──────────────────────────────────────────────────────

describe("estimateReadingTime", () => {
  it("returns at least 1 minute", () => {
    expect(estimateReadingTime("")).toBe(1);
    expect(estimateReadingTime("<p>singkat</p>")).toBe(1);
  });

  it("returns 1 minute for content with 200 words", () => {
    const text = Array(200).fill("kata").join(" ");
    expect(estimateReadingTime(text)).toBe(1);
  });

  it("returns 2 minutes for content with 201-400 words", () => {
    const text = Array(201).fill("kata").join(" ");
    expect(estimateReadingTime(text)).toBe(2);
  });

  it("rounds up reading time", () => {
    const text = Array(250).fill("kata").join(" ");
    expect(estimateReadingTime(text)).toBe(2);
  });
});

// ─── buildExcerptFromHtml ─────────────────────────────────────────────────────

describe("buildExcerptFromHtml", () => {
  it("returns plain text shorter than maxLength unchanged", () => {
    const result = buildExcerptFromHtml("<p>Teks pendek</p>", 180);
    expect(result).toBe("Teks pendek");
  });

  it("truncates and adds ellipsis when text exceeds maxLength", () => {
    const longText = "a".repeat(200);
    const result = buildExcerptFromHtml(`<p>${longText}</p>`, 180);
    expect(result.endsWith("...")).toBe(true);
    expect(result.length).toBeLessThanOrEqual(180);
  });

  it("returns empty string for empty HTML", () => {
    expect(buildExcerptFromHtml("")).toBe("");
    expect(buildExcerptFromHtml("<p></p>")).toBe("");
  });

  it("strips HTML tags from excerpt", () => {
    const result = buildExcerptFromHtml("<p><strong>Penting</strong></p>");
    expect(result).toBe("Penting");
    expect(result).not.toContain("<strong>");
  });
});

// ─── isMeaningfulHtml ─────────────────────────────────────────────────────────

describe("isMeaningfulHtml", () => {
  it("returns true for HTML with text content", () => {
    expect(isMeaningfulHtml("<p>Ada teks</p>")).toBe(true);
  });

  it("returns false for empty HTML", () => {
    expect(isMeaningfulHtml("")).toBe(false);
    expect(isMeaningfulHtml("<p></p>")).toBe(false);
    expect(isMeaningfulHtml("<p><br></p>")).toBe(false);
  });
});

// ─── buildPagination ─────────────────────────────────────────────────────────

describe("buildPagination", () => {
  it("returns all pages when totalPages <= 5", () => {
    expect(buildPagination(3, 1)).toEqual([1, 2, 3]);
    expect(buildPagination(5, 3)).toEqual([1, 2, 3, 4, 5]);
  });

  it("shows first 3 pages + ellipsis + last when currentPage <= 3", () => {
    expect(buildPagination(10, 1)).toEqual([1, 2, 3, "...", 10]);
    expect(buildPagination(10, 2)).toEqual([1, 2, 3, "...", 10]);
    expect(buildPagination(10, 3)).toEqual([1, 2, 3, "...", 10]);
  });

  it("shows first + ellipsis + last 3 pages when currentPage >= totalPages - 2", () => {
    expect(buildPagination(10, 8)).toEqual([1, "...", 8, 9, 10]);
    expect(buildPagination(10, 9)).toEqual([1, "...", 8, 9, 10]);
    expect(buildPagination(10, 10)).toEqual([1, "...", 8, 9, 10]);
  });

  it("shows first + ellipsis + current + ellipsis + last for middle pages", () => {
    expect(buildPagination(10, 5)).toEqual([1, "...", 5, "...", 10]);
    expect(buildPagination(20, 11)).toEqual([1, "...", 11, "...", 20]);
  });
});

// ─── getYearKey ───────────────────────────────────────────────────────────────

describe("getYearKey", () => {
  it("returns year string from ISO date", () => {
    expect(getYearKey("2025-08-17T00:00:00Z")).toBe("2025");
  });

  it("returns empty string for null/undefined/empty", () => {
    expect(getYearKey(null)).toBe("");
    expect(getYearKey(undefined)).toBe("");
    expect(getYearKey("")).toBe("");
  });

  it("returns empty string for invalid date", () => {
    expect(getYearKey("not-a-date")).toBe("");
  });
});

// ─── getMonthKey ──────────────────────────────────────────────────────────────

describe("getMonthKey", () => {
  it("returns YYYY-MM format from ISO date", () => {
    expect(getMonthKey("2025-08-17T00:00:00Z")).toBe("2025-08");
  });

  it("zero-pads single-digit months", () => {
    expect(getMonthKey("2025-03-01T00:00:00Z")).toBe("2025-03");
  });

  it("returns empty string for falsy input", () => {
    expect(getMonthKey(null)).toBe("");
    expect(getMonthKey("")).toBe("");
  });

  it("returns empty string for invalid date", () => {
    expect(getMonthKey("invalid")).toBe("");
  });
});

// ─── getMonthLabelFromKey ─────────────────────────────────────────────────────

describe("getMonthLabelFromKey", () => {
  it("returns 'Semua bulan' for empty key", () => {
    expect(getMonthLabelFromKey("")).toBe("Semua bulan");
    expect(getMonthLabelFromKey(null)).toBe("Semua bulan");
  });

  it("returns human-readable month label in Indonesian", () => {
    const label = getMonthLabelFromKey("2025-08");
    expect(label).toMatch(/agustus/i);
    expect(label).toContain("2025");
  });
});

// ─── getItemPublishedState ────────────────────────────────────────────────────

describe("getItemPublishedState", () => {
  it("reads is_published (snake_case)", () => {
    expect(getItemPublishedState({ is_published: true })).toBe(true);
    expect(getItemPublishedState({ is_published: false })).toBe(false);
  });

  it("falls back to isPublished (camelCase)", () => {
    expect(getItemPublishedState({ isPublished: true })).toBe(true);
    expect(getItemPublishedState({ isPublished: false })).toBe(false);
  });

  it("returns false for null/undefined item", () => {
    expect(getItemPublishedState(null)).toBe(false);
    expect(getItemPublishedState(undefined)).toBe(false);
  });

  it("returns false when property is absent", () => {
    expect(getItemPublishedState({})).toBe(false);
  });
});

// ─── getItemBaseDate ──────────────────────────────────────────────────────────

describe("getItemBaseDate", () => {
  it("returns published_at when available", () => {
    expect(getItemBaseDate({ published_at: "2025-01-01" })).toBe("2025-01-01");
  });

  it("falls back to publishedAt (camelCase)", () => {
    expect(getItemBaseDate({ publishedAt: "2025-02-01" })).toBe("2025-02-01");
  });

  it("falls back to created_at when no published date", () => {
    expect(getItemBaseDate({ created_at: "2025-03-01" })).toBe("2025-03-01");
  });

  it("falls back to createdAt (camelCase)", () => {
    expect(getItemBaseDate({ createdAt: "2025-04-01" })).toBe("2025-04-01");
  });

  it("returns empty string when no date available", () => {
    expect(getItemBaseDate({})).toBe("");
    expect(getItemBaseDate(null)).toBe("");
  });
});

// ─── plainTextToEditorHtml ────────────────────────────────────────────────────

describe("plainTextToEditorHtml", () => {
  it("wraps each line in <p> tags", () => {
    const result = plainTextToEditorHtml("baris satu\nbaris dua");
    expect(result).toContain("<p>baris satu</p>");
    expect(result).toContain("<p>baris dua</p>");
  });

  it("converts empty lines to <p><br></p>", () => {
    const result = plainTextToEditorHtml("baris\n\nbaris dua");
    expect(result).toContain("<p><br></p>");
  });

  it("escapes HTML special characters in text", () => {
    const result = plainTextToEditorHtml("<script>alert(1)</script>");
    expect(result).not.toContain("<script>");
    expect(result).toContain("&lt;script&gt;");
  });

  it("wraps empty/null input as an empty paragraph", () => {
    // An empty string splits into [''], which produces one empty-line <p><br></p>
    expect(plainTextToEditorHtml("")).toBe("<p><br></p>");
    // null is coerced to '' → same result
    expect(plainTextToEditorHtml(null)).toBe("<p><br></p>");
  });

  it("handles Windows line endings (CRLF)", () => {
    const result = plainTextToEditorHtml("baris satu\r\nbaris dua");
    expect(result).toContain("<p>baris satu</p>");
    expect(result).toContain("<p>baris dua</p>");
  });
});
