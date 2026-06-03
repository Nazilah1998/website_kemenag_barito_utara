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
      const isCountQuery = fields && typeof fields === "object" && "count" in fields;
      return {
        from: () => {
          if (isCountQuery) {
            return Promise.resolve([{ count: store.length }]);
          }
          const chain = {
            orderBy: () => chain,
            limit: () => ({
              offset: () => Promise.resolve(store),
            }),
            where: (cond) => ({
              limit: () => {
                const val = extractValue(cond);
                if (val) {
                  return Promise.resolve(store.filter((item) => item.id === val));
                }
                return Promise.resolve([]);
              },
            }),
          };
          return chain;
        },
      };
    },
    insert: () => ({
      values: (vals) => ({
        returning: () => {
          const inserted = { id: "mock-id-999", ...vals };
          store.push(inserted);
          return Promise.resolve([inserted]);
        },
      }),
    }),
    update: () => ({
      set: (vals) => ({
        where: (cond) => ({
          returning: () => {
            const val = extractValue(cond);
            const idx = store.findIndex((item) => item.id === val);
            if (idx !== -1) {
              store[idx] = { ...store[idx], ...vals };
              return Promise.resolve([store[idx]]);
            }
            return Promise.resolve([]);
          },
        }),
      }),
    }),
    delete: () => ({
      where: (cond) => {
        const val = extractValue(cond);
        store = store.filter((item) => item.id !== val);
        return Promise.resolve();
      },
    }),
  };
});

vi.mock("@/lib/cms-utils", () => ({ validateAdmin: vi.fn() }));
vi.mock("@/lib/audit", () => ({
  recordAudit: vi.fn(),
  AUDIT_ACTIONS: { CREATE: "CREATE", UPDATE: "UPDATE", DELETE: "DELETE" },
  AUDIT_ENTITIES: { GALERI: "GALERI" },
}));
vi.mock("@/lib/storage-media", () => ({
  uploadBase64Image: vi.fn(),
  removeStorageFileByPublicUrl: vi.fn().mockResolvedValue(true),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn() }));
vi.mock("@/lib/realtime-service", () => ({ broadcastRefresh: vi.fn() }));
vi.mock("@/lib/drizzle", () => ({ db: mockDb }));

import { validateAdmin } from "@/lib/cms-utils";
import { uploadBase64Image, removeStorageFileByPublicUrl } from "@/lib/storage-media";
import { GET, POST, PUT, DELETE } from "@/app/api/admin/galeri/route";

function req(url = "http://localhost/api/admin/galeri", opts = {}) {
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

  it("200 items kosong", async () => {
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
      { id: "1", title: "A", image_url: "/a.jpg", published_at: new Date("2025-01-01") },
      { id: "2", title: "B", image_url: "/b.jpg", published_at: new Date("2025-01-02") },
    ]);
    const res = await GET(req("http://localhost/api/admin/galeri?page=1&limit=10"));
    const b = await res.json();
    expect(res.status).toBe(200);
    expect(b.items).toHaveLength(2);
    expect(b.pagination.total).toBe(2);
  });
});

describe("POST", () => {
  beforeEach(() => { vi.clearAllMocks(); mockDb.__setStore([]); auth(); });

  it("400 tanpa gambar", async () => {
    const res = await POST(req("http://localhost/api/admin/galeri", { method: "POST", body: {} }));
    expect(res.status).toBe(400);
  });

  it("400 format base64 invalid", async () => {
    const res = await POST(req("http://localhost/api/admin/galeri", { method: "POST", body: { gallery_upload_base64: "invalid" } }));
    expect(res.status).toBe(400);
  });

  it("400 ukuran > 500KB", async () => {
    const res = await POST(req("http://localhost/api/admin/galeri", { method: "POST", body: { gallery_upload_base64: "data:image/webp;base64," + "A".repeat(800_000) } }));
    expect(res.status).toBe(400);
  });

  it("201 sukses", async () => {
    uploadBase64Image.mockResolvedValue({ publicUrl: "https://storage.test/img.webp", mimeType: "image/webp", sizeBytes: 50000 });
    const res = await POST(req("http://localhost/api/admin/galeri", { method: "POST", body: { gallery_upload_base64: "data:image/webp;base64," + "a".repeat(100) } }));
    const b = await res.json();
    expect(res.status).toBe(200);
    expect(b.message).toContain("berhasil disimpan");
    expect(b.item.image_url).toBe("https://storage.test/img.webp");
  });
});

describe("PUT", () => {
  beforeEach(() => {
    vi.clearAllMocks(); auth();
    mockDb.__setStore([{ id: "g-1", title: "Lama", image_url: "https://storage.test/lama.webp", image_size_kb: 100, image_size_bytes: 100000, published_at: new Date("2025-01-01") }]);
  });

  it("400 tanpa id", async () => {
    expect((await PUT(req("http://localhost/api/admin/galeri", { method: "PUT", body: {} }))).status).toBe(400);
  });

  it("404 item tak ditemukan", async () => {
    expect((await PUT(req("http://localhost/api/admin/galeri?id=x", { method: "PUT", body: {} }))).status).toBe(404);
  });

  it("200 update sukses", async () => {
    const res = await PUT(req("http://localhost/api/admin/galeri?id=g-1", { method: "PUT", body: { published_at: "2025-06-01" } }));
    const b = await res.json();
    expect(res.status).toBe(200);
    expect(b.message).toContain("berhasil diperbarui");
    expect(b.item.image_url).toBe("https://storage.test/lama.webp");
  });
});

describe("DELETE", () => {
  beforeEach(() => {
    vi.clearAllMocks(); auth();
    mockDb.__setStore([{ id: "g-1", image_url: "https://storage.test/lama.webp" }]);
  });

  it("400 tanpa id", async () => {
    expect((await DELETE(req())).status).toBe(400);
  });

  it("404 item tak ditemukan", async () => {
    expect((await DELETE(req("http://localhost/api/admin/galeri?id=x"))).status).toBe(404);
  });

  it("200 hapus sukses + hapus storage", async () => {
    const res = await DELETE(req("http://localhost/api/admin/galeri?id=g-1"));
    const b = await res.json();
    expect(res.status).toBe(200);
    expect(b.message).toContain("berhasil dihapus");
    expect(removeStorageFileByPublicUrl).toHaveBeenCalledWith("https://storage.test/lama.webp");
  });
});
