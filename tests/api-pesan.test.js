import { describe, it, expect, vi, beforeEach } from "vitest";

const mockDb = vi.hoisted(() => {
  let store = [];

  function extractValue(cond) {
    if (!cond || !cond.queryChunks) return undefined;
    for (const chunk of cond.queryChunks) {
      if (typeof chunk === "string" && chunk !== " = " && chunk !== "=") return chunk;
      if (chunk?.value !== undefined) {
        if (typeof chunk.value === "string") {
          const s = chunk.value.trim();
          if (s && s !== "=" && s !== " = ") return s;
        } else if (Array.isArray(chunk.value)) {
          for (const v of chunk.value) {
            const s = typeof v === "string" ? v.trim() : "";
            if (s && s !== "=" && s !== " = ") return s;
          }
        }
      }
    }
    return undefined;
  }

  return {
    __getStore: () => store,
    __setStore: (s) => { store = s; },
    select: (fields) => {
      const isCount = fields && typeof fields === "object" && "count" in fields;
      return {
        from: () => {
          if (isCount) {
            return {
              where: () => Promise.resolve([{ count: store.length }]),
            };
          }
          const filtered = (cond, data) => {
            if (cond === undefined) return data || store;
            const v = extractValue(cond);
            return v ? (data || store).filter((m) => m.id === v) : (data || []);
          };
          const chain = {
            where: (cond) => ({
              orderBy: () => ({
                limit: () => ({
                  offset: () => Promise.resolve(filtered(cond)),
                }),
              }),
              limit: () => Promise.resolve(filtered(cond)),
            }),
            orderBy: () => ({
              limit: () => ({
                offset: () => Promise.resolve(store),
              }),
            }),
          };
          return chain;
        },
      };
    },
    update: () => ({
      set: (vals) => ({
        where: (cond) => ({
          returning: () => {
            const v = extractValue(cond);
            const idx = store.findIndex((m) => m.id === v);
            if (idx !== -1) { store[idx] = { ...store[idx], ...vals }; return Promise.resolve([store[idx]]); }
            return Promise.resolve([]);
          },
        }),
      }),
    }),
    delete: () => ({
      where: (cond) => {
        const v = extractValue(cond);
        store = store.filter((m) => m.id !== v);
        return Promise.resolve();
      },
    }),
  };
});

vi.mock("@/lib/cms-utils", () => ({ validateAdmin: vi.fn() }));
vi.mock("@/lib/audit", () => ({
  recordAudit: vi.fn(),
  AUDIT_ACTIONS: { UPDATE: "UPDATE", DELETE: "DELETE" },
  AUDIT_ENTITIES: { KONTAK: "KONTAK" },
}));
vi.mock("@/lib/drizzle", () => ({ db: mockDb }));

import { validateAdmin } from "@/lib/cms-utils";
import { GET, PATCH, DELETE } from "@/app/api/admin/pesan/route";

function req(url = "http://localhost/api/admin/pesan", opts = {}) {
  return new Request(url, {
    method: opts.method || "GET",
    headers: { "Content-Type": "application/json", ...opts.headers },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
}

function auth() {
  validateAdmin.mockResolvedValue({ ok: true, session: { user: { id: "a1" }, profile: { id: "a1", role: "super_admin" } }, response: null });
}

function unauth() {
  validateAdmin.mockResolvedValue({ ok: false, session: null, response: new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } }) });
}

describe("GET", () => {
  beforeEach(() => { vi.clearAllMocks(); mockDb.__setStore([]); });

  it("401 tanpa auth", async () => {
    unauth();
    expect((await GET(req())).status).toBe(401);
  });

  it("200 kosong", async () => {
    auth();
    const res = await GET(req());
    const b = await res.json();
    expect(res.status).toBe(200);
    expect(b.items).toEqual([]);
    expect(b.pagination.total).toBe(0);
  });

  it("200 dengan data", async () => {
    auth();
    mockDb.__setStore([
      { id: "1", nama: "Alice", created_at: new Date("2025-06-01") },
      { id: "2", nama: "Bob", created_at: new Date("2025-06-02") },
    ]);
    const res = await GET(req("http://localhost/api/admin/pesan?page=1&limit=10"));
    const b = await res.json();
    expect(res.status).toBe(200);
    expect(b.items).toHaveLength(2);
  });
});

describe("PATCH", () => {
  beforeEach(() => { vi.clearAllMocks(); auth(); mockDb.__setStore([{ id: "m1", nama: "Alice", status: "baru" }]); });

  it("400 tanpa id/status", async () => {
    expect((await PATCH(req("http://localhost/api/admin/pesan", { method: "PATCH", body: {} }))).status).toBe(400);
  });

  it("404 tak ditemukan", async () => {
    expect((await PATCH(req("http://localhost/api/admin/pesan", { method: "PATCH", body: { id: "x", status: "dibaca" } }))).status).toBe(404);
  });

  it("200 sukses", async () => {
    const res = await PATCH(req("http://localhost/api/admin/pesan", { method: "PATCH", body: { id: "m1", status: "dibaca" } }));
    const b = await res.json();
    expect(res.status).toBe(200);
    expect(b.message).toContain("berhasil diperbarui");
    expect(b.item.status).toBe("dibaca");
  });
});

describe("DELETE", () => {
  beforeEach(() => { vi.clearAllMocks(); auth(); mockDb.__setStore([{ id: "m1", nama: "Alice" }]); });

  it("400 tanpa id", async () => {
    expect((await DELETE(req())).status).toBe(400);
  });

  it("404 tak ditemukan", async () => {
    expect((await DELETE(req("http://localhost/api/admin/pesan?id=x"))).status).toBe(404);
  });

  it("200 sukses", async () => {
    const res = await DELETE(req("http://localhost/api/admin/pesan?id=m1"));
    const b = await res.json();
    expect(res.status).toBe(200);
    expect(b.message).toContain("berhasil dihapus");
  });
});
