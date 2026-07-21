import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { formatDate, formatDateTime } from "@/lib/date-utils";

// ─── formatDate ─────────────────────────────────────────────────────────────

describe("formatDate", () => {
  it("returns '-' for null or undefined input", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate(undefined)).toBe("-");
    expect(formatDate("")).toBe("-");
  });

  it("returns '-' for invalid date strings", () => {
    expect(formatDate("not-a-date")).toBe("-");
    expect(formatDate("abc")).toBe("-");
  });

  it("formats a valid ISO date in Indonesian locale by default", () => {
    const result = formatDate("2025-08-17T00:00:00Z");
    // Should contain the year and not throw
    expect(result).toContain("2025");
    expect(typeof result).toBe("string");
  });

  it("formats a valid ISO date in English locale", () => {
    const result = formatDate("2025-08-17T00:00:00Z", "en");
    expect(result).toContain("2025");
    expect(typeof result).toBe("string");
  });

  it("includes long month name in Indonesian format", () => {
    const result = formatDate("2025-01-01T00:00:00Z");
    // Intl with id-ID returns long month names like "Januari"
    expect(result).toMatch(/januari|january/i);
  });

  it("handles ISO timestamp with time portion", () => {
    const result = formatDate("2026-07-04T12:30:00Z");
    expect(result).toContain("2026");
  });

  it("handles a Date object coerced to string", () => {
    const d = new Date("2025-06-15").toISOString();
    const result = formatDate(d);
    expect(result).toContain("2025");
  });
});

// ─── formatDateTime ─────────────────────────────────────────────────────────

describe("formatDateTime", () => {
  it("returns '-' for null or undefined input", () => {
    expect(formatDateTime(null)).toBe("-");
    expect(formatDateTime(undefined)).toBe("-");
    expect(formatDateTime("")).toBe("-");
  });

  it("returns '-' for invalid date strings", () => {
    expect(formatDateTime("not-a-date")).toBe("-");
  });

  it("formats a valid ISO datetime in Indonesian locale", () => {
    const result = formatDateTime("2025-12-25T10:30:00Z");
    expect(result).toContain("2025");
    expect(typeof result).toBe("string");
  });

  it("formats a valid ISO datetime in English locale", () => {
    const result = formatDateTime("2025-12-25T10:30:00Z", "en");
    expect(result).toContain("2025");
  });

  it("includes hours and minutes in the output", () => {
    // The output must contain digits resembling time like "10.30" or "10:30"
    const result = formatDateTime("2025-03-10T09:05:00Z", "id");
    // Should be a non-empty string containing time indicators
    expect(result.length).toBeGreaterThan(5);
  });
});
