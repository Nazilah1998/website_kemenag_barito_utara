import { describe, it, expect } from "vitest";
import { serializeData, apiResponse, getSafeIdFromContext } from "@/lib/api-helpers";

describe("serializeData", () => {
  it("returns null and undefined as-is", () => {
    expect(serializeData(null)).toBeNull();
    expect(serializeData(undefined)).toBeUndefined();
  });

  it("returns primitives as-is", () => {
    expect(serializeData(42)).toBe(42);
    expect(serializeData("hello")).toBe("hello");
    expect(serializeData(true)).toBe(true);
  });

  it("converts BigInt to Number", () => {
    const result = serializeData({ id: BigInt(9007199254740991) });
    expect(result).toEqual({ id: 9007199254740991 });
  });

  it("recursively serializes nested objects with BigInt", () => {
    const input = {
      user: {
        id: BigInt(1),
        name: "Admin",
        meta: { count: BigInt(99) },
      },
    };
    const result = serializeData(input);
    expect(result).toEqual({
      user: { id: 1, name: "Admin", meta: { count: 99 } },
    });
  });

  it("serializes arrays with BigInt values", () => {
    const input = [{ id: BigInt(1) }, { id: BigInt(2) }];
    const result = serializeData(input);
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it("preserves Date objects without serializing them", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    const result = serializeData({ created: now });
    expect(result.created).toBeInstanceOf(Date);
    expect(result.created).toEqual(now);
  });

  it("handles empty arrays and objects", () => {
    expect(serializeData([])).toEqual([]);
    expect(serializeData({})).toEqual({});
  });

  it("handles deeply nested arrays in objects", () => {
    const input = { items: [{ id: BigInt(10) }, { id: BigInt(20) }] };
    expect(serializeData(input)).toEqual({ items: [{ id: 10 }, { id: 20 }] });
  });
});

describe("apiResponse", () => {
  it("returns a Response with status 200 by default", async () => {
    const res = apiResponse({ ok: true });
    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);
  });

  it("returns a Response with custom status", async () => {
    const res = apiResponse({ message: "Not Found" }, 404);
    expect(res.status).toBe(404);
  });

  it("serializes BigInt values in the response body", async () => {
    const res = apiResponse({ id: BigInt(123) });
    const body = await res.json();
    expect(body).toEqual({ id: 123 });
  });

  it("includes Cache-Control: no-store header", () => {
    const res = apiResponse({});
    expect(res.headers.get("Cache-Control")).toContain("no-store");
  });

  it("includes Pragma: no-cache header", () => {
    const res = apiResponse({});
    expect(res.headers.get("Pragma")).toBe("no-cache");
  });

  it("includes Expires: 0 header", () => {
    const res = apiResponse({});
    expect(res.headers.get("Expires")).toBe("0");
  });

  it("returns correct JSON body", async () => {
    const data = { name: "Kemenag", count: 5 };
    const res = apiResponse(data);
    const body = await res.json();
    expect(body).toEqual(data);
  });

  it("handles null data", async () => {
    const res = apiResponse(null);
    const body = await res.json();
    expect(body).toBeNull();
  });

  it("returns status 201 for create responses", () => {
    const res = apiResponse({ created: true }, 201);
    expect(res.status).toBe(201);
  });

  it("returns status 429 for rate limit responses", async () => {
    const res = apiResponse({ message: "Terlalu banyak permintaan." }, 429);
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.message).toBe("Terlalu banyak permintaan.");
  });
});

describe("getSafeIdFromContext", () => {
  it("resolves id from a plain object params", async () => {
    const ctx = { params: { id: "abc-123" } };
    const id = await getSafeIdFromContext(ctx);
    expect(id).toBe("abc-123");
  });

  it("resolves id from a Promise params (Next.js 15+ App Router)", async () => {
    const ctx = { params: Promise.resolve({ id: "def-456" }) };
    const id = await getSafeIdFromContext(ctx);
    expect(id).toBe("def-456");
  });

  it("throws when id is missing from params", async () => {
    const ctx = { params: {} };
    await expect(getSafeIdFromContext(ctx)).rejects.toThrow(
      "ID parameter is missing"
    );
  });

  it("throws when id is undefined in Promise params", async () => {
    const ctx = { params: Promise.resolve({}) };
    await expect(getSafeIdFromContext(ctx)).rejects.toThrow(
      "ID parameter is missing"
    );
  });
});
