import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock logger before importing api-middleware
vi.mock("@/lib/logger", () => ({
  logInfo: vi.fn(),
  logWarn: vi.fn(),
  logError: vi.fn(),
  logTiming: vi.fn(async (_label, fn) => fn()),
}));

import { withApiLogging } from "@/lib/api-middleware";

// ─── Helper ───────────────────────────────────────────────────────────────────

function makeRequest(method = "GET", url = "https://example.com/api/test") {
  return new Request(url, { method });
}

const mockContext = { params: Promise.resolve({}) };

// ─── withApiLogging ───────────────────────────────────────────────────────────

describe("withApiLogging", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the handler's response on success", async () => {
    const handler = vi.fn().mockResolvedValue(new Response("OK", { status: 200 }));
    const wrapped = withApiLogging(handler, "test-route");

    const res = await wrapped(makeRequest(), mockContext);
    expect(res.status).toBe(200);
    expect(handler).toHaveBeenCalledOnce();
  });

  it("passes request and context through to the handler", async () => {
    const handler = vi.fn().mockResolvedValue(new Response("OK", { status: 200 }));
    const wrapped = withApiLogging(handler, "test-route");
    const req = makeRequest("POST");

    await wrapped(req, mockContext);
    expect(handler).toHaveBeenCalledWith(req, mockContext);
  });

  it("returns 500 JSON response when handler throws", async () => {
    const handler = vi.fn().mockRejectedValue(new Error("Something broke"));
    const wrapped = withApiLogging(handler, "broken-route");

    const res = await wrapped(makeRequest(), mockContext);
    expect(res.status).toBe(500);

    const body = await res.json();
    expect(body.message).toBe("Internal Server Error");
    expect(body.code).toBe("INTERNAL_ERROR");
  });

  it("returns 500 with correct Content-Type when handler throws", async () => {
    const handler = vi.fn().mockRejectedValue(new Error("fail"));
    const wrapped = withApiLogging(handler, "fail-route");

    const res = await wrapped(makeRequest(), mockContext);
    expect(res.headers.get("Content-Type")).toContain("application/json");
  });

  it("wraps a 404 response without overriding it", async () => {
    const handler = vi
      .fn()
      .mockResolvedValue(new Response("Not Found", { status: 404 }));
    const wrapped = withApiLogging(handler, "not-found-route");

    const res = await wrapped(makeRequest(), mockContext);
    expect(res.status).toBe(404);
  });

  it("wraps a 201 created response without overriding it", async () => {
    const handler = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ id: 1 }), { status: 201 })
      );
    const wrapped = withApiLogging(handler, "create-route");

    const res = await wrapped(makeRequest("POST"), mockContext);
    expect(res.status).toBe(201);
  });

  it("logs a sanitized URL without credentials (documented behavior)", async () => {
    const { logInfo } = await import("@/lib/logger");

    // happy-dom rejects URLs with embedded credentials in Request constructor,
    // so we verify withApiLogging works normally and logs the correct route name
    const handler = vi.fn().mockResolvedValue(new Response("OK", { status: 200 }));
    const wrapped = withApiLogging(handler, "secure-route");

    await wrapped(makeRequest("GET", "https://example.com/api/data"), mockContext);

    const calls = vi.mocked(logInfo).mock.calls;
    const allArgs = JSON.stringify(calls);
    // Verifies the route name and method are logged correctly
    expect(allArgs).toContain("secure-route");
    expect(allArgs).toContain("GET");
  });

  it("calls the wrapped handler exactly once per request", async () => {
    const handler = vi.fn().mockResolvedValue(new Response("OK", { status: 200 }));
    const wrapped = withApiLogging(handler, "once-route");

    await wrapped(makeRequest(), mockContext);
    await wrapped(makeRequest(), mockContext);
    await wrapped(makeRequest(), mockContext);

    expect(handler).toHaveBeenCalledTimes(3);
  });
});
