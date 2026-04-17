import { describe, it, expect } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit (in-memory fallback)", () => {
  it("allows up to limit and blocks after", async () => {
    const key = `test-${Math.random()}`;
    const config = { key, limit: 3, windowMs: 5_000 };

    const a = await rateLimit(config);
    expect(a.ok).toBe(true);

    const b = await rateLimit(config);
    expect(b.ok).toBe(true);

    const c = await rateLimit(config);
    expect(c.ok).toBe(true);

    const d = await rateLimit(config);
    expect(d.ok).toBe(false);
    expect(d.retryAfter).toBeGreaterThan(0);
  });

  it("isolates keys", async () => {
    const r1 = await rateLimit({ key: "k-a", limit: 1, windowMs: 5_000 });
    const r2 = await rateLimit({ key: "k-b", limit: 1, windowMs: 5_000 });
    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
  });
});
