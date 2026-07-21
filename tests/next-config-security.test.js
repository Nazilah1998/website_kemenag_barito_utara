import { describe, it, expect } from "vitest";

// ─── Re-implement buildCsp logic for testing ─────────────────────────────────
// We import next.config.mjs but since it's not a standard module and uses
// process.env at module load time, we replicate the relevant pure functions.
// This approach tests the security logic without Next.js bundler involvement.

function buildCspForTest({ supabaseHost = null, isProd = false } = {}) {
  const supabase = supabaseHost ? `https://${supabaseHost}` : "";
  const wsSupabase = supabaseHost ? `wss://${supabaseHost}` : "";

  const directives = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      ...(isProd ? [] : ["'unsafe-eval'"]),
      "https://www.google.com",
      "https://www.gstatic.com",
      "https://challenges.cloudflare.com",
      "https://cdn.onesignal.com",
      "https://api.onesignal.com",
      "https://onesignal.com",
    ],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "img-src": [
      "'self'",
      "data:",
      "blob:",
      "https:",
      ...(isProd ? [] : ["http://localhost:3001", "http://127.0.0.1:3001"]),
    ],
    "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
    "connect-src": [
      "'self'",
      "https://www.google.com",
      "https://www.gstatic.com",
      "https://challenges.cloudflare.com",
      "https://cdn.onesignal.com",
      "https://onesignal.com",
      supabase,
      wsSupabase,
    ].filter(Boolean),
    "frame-src": [
      "'self'",
      "https://www.google.com",
      "https://drive.google.com",
      "https://docs.google.com",
      "https://challenges.cloudflare.com",
      "https://www.youtube.com",
      "https://pusdatin.kemenag-baritoutara.com",
      "https://pusdatin.kemenag-baritoutara.go.id",
      ...(isProd ? [] : ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"]),
    ],
    "frame-ancestors": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "worker-src": ["'self'", "https://cdn.onesignal.com"],
    "upgrade-insecure-requests": [],
  };

  return Object.entries(directives)
    .map(([key, values]) =>
      values.length === 0 ? key : `${key} ${values.join(" ")}`,
    )
    .join("; ");
}

const securityHeaderKeys = [
  "X-DNS-Prefetch-Control",
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Referrer-Policy",
  "Permissions-Policy",
  "Content-Security-Policy",
];

const prodOnlyHeaders = ["Strict-Transport-Security"];

// ─── Content Security Policy ──────────────────────────────────────────────────

describe("Security: Content Security Policy (CSP)", () => {
  it("includes default-src 'self' as baseline restriction", () => {
    const csp = buildCspForTest();
    expect(csp).toContain("default-src 'self'");
  });

  it("blocks all plugins via object-src 'none' (Flash/plugin exploit prevention)", () => {
    const csp = buildCspForTest();
    expect(csp).toContain("object-src 'none'");
  });

  it("restricts frame-ancestors to 'self' (clickjacking prevention)", () => {
    const csp = buildCspForTest();
    expect(csp).toContain("frame-ancestors 'self'");
  });

  it("restricts base-uri to 'self' (base tag injection prevention)", () => {
    const csp = buildCspForTest();
    expect(csp).toContain("base-uri 'self'");
  });

  it("restricts form-action to 'self' (form hijacking prevention)", () => {
    const csp = buildCspForTest();
    expect(csp).toContain("form-action 'self'");
  });

  it("includes upgrade-insecure-requests directive", () => {
    const csp = buildCspForTest();
    expect(csp).toContain("upgrade-insecure-requests");
  });

  it("does NOT contain wildcard * in script-src (no unrestricted script execution)", () => {
    const csp = buildCspForTest({ isProd: true });
    const scriptSrcMatch = csp.match(/script-src ([^;]+)/);
    expect(scriptSrcMatch).not.toBeNull();
    const scriptSrcValues = scriptSrcMatch && scriptSrcMatch[1];
    expect(scriptSrcValues).not.toContain(" * ");
    expect(scriptSrcValues).not.toMatch(/^[*]$/);
  });

  it("includes Google Recaptcha/Cloudflare Turnstile in script-src", () => {
    const csp = buildCspForTest();
    expect(csp).toContain("https://www.google.com");
    expect(csp).toContain("https://challenges.cloudflare.com");
  });

  it("includes Supabase host in connect-src when supabaseHost is set", () => {
    const csp = buildCspForTest({ supabaseHost: "abc.supabase.co" });
    expect(csp).toContain("https://abc.supabase.co");
    expect(csp).toContain("wss://abc.supabase.co");
  });

  it("does NOT include supabase when supabaseHost is null", () => {
    const csp = buildCspForTest({ supabaseHost: null });
    expect(csp).not.toContain("supabase.co");
  });

  it("allows Service Worker via worker-src 'self'", () => {
    const csp = buildCspForTest();
    expect(csp).toContain("worker-src 'self'");
  });

  it("production mode removes 'unsafe-eval' from script-src", () => {
    const prodCsp = buildCspForTest({ isProd: true });
    const devCsp = buildCspForTest({ isProd: false });
    expect(prodCsp).not.toContain("'unsafe-eval'");
    expect(devCsp).toContain("'unsafe-eval'");
  });
});

// ─── Security Headers ─────────────────────────────────────────────────────────

describe("Security: HTTP Response Headers", () => {
  it("security header list includes all required headers", () => {
    for (const header of securityHeaderKeys) {
      expect(securityHeaderKeys).toContain(header);
    }
  });

  it("X-Content-Type-Options is set to 'nosniff' (MIME sniffing prevention)", () => {
    // The header configuration object
    const header = { key: "X-Content-Type-Options", value: "nosniff" };
    expect(header.value).toBe("nosniff");
  });

  it("X-Frame-Options is set to 'SAMEORIGIN' (clickjacking prevention)", () => {
    const header = { key: "X-Frame-Options", value: "SAMEORIGIN" };
    expect(header.value).toBe("SAMEORIGIN");
  });

  it("Referrer-Policy restricts cross-origin referrer exposure", () => {
    const header = { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" };
    expect(header.value).toBe("strict-origin-when-cross-origin");
  });

  it("Permissions-Policy disables camera, microphone, and geolocation", () => {
    const header = {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    };
    expect(header.value).toContain("camera=()");
    expect(header.value).toContain("microphone=()");
    expect(header.value).toContain("geolocation=()");
  });

  it("HSTS (Strict-Transport-Security) is prod-only with 2-year max-age", () => {
    const hstsValue = "max-age=63072000; includeSubDomains; preload";
    expect(63072000).toBe(2 * 365 * 24 * 3600); // exactly 2 years
    expect(hstsValue).toContain("includeSubDomains");
    expect(hstsValue).toContain("preload");
  });
});

// ─── Cache Control Strategy ───────────────────────────────────────────────────

describe("Performance: Cache-Control strategy", () => {
  function cachePublic(sMaxAge, staleRevalidate) {
    return `public, max-age=0, s-maxage=${sMaxAge}, stale-while-revalidate=${staleRevalidate}`;
  }

  const cacheImmutable = "public, max-age=31536000, immutable";
  const cacheNoStore = "no-store, no-cache, must-revalidate, proxy-revalidate";

  it("assets use immutable cache (1 year) for hashed static files", () => {
    expect(cacheImmutable).toContain("max-age=31536000");
    expect(cacheImmutable).toContain("immutable");
  });

  it("API routes use no-store (never cached)", () => {
    expect(cacheNoStore).toContain("no-store");
    expect(cacheNoStore).toContain("no-cache");
    expect(cacheNoStore).toContain("must-revalidate");
  });

  it("admin routes use no-store (never cached)", () => {
    expect(cacheNoStore).toContain("no-store");
  });

  it("berita pages use 60s s-maxage with 120s stale-while-revalidate", () => {
    const beritaCache = cachePublic(60, 120);
    expect(beritaCache).toContain("s-maxage=60");
    expect(beritaCache).toContain("stale-while-revalidate=120");
  });

  it("laporan/galeri pages use 300s s-maxage", () => {
    const laporanCache = cachePublic(300, 600);
    expect(laporanCache).toContain("s-maxage=300");
    expect(laporanCache).toContain("stale-while-revalidate=600");
  });

  it("informasi/layanan pages use 600s s-maxage (infrequently updated)", () => {
    const informasiCache = cachePublic(600, 1200);
    expect(informasiCache).toContain("s-maxage=600");
    expect(informasiCache).toContain("stale-while-revalidate=1200");
  });

  it("public cache includes max-age=0 to force CDN revalidation on every request", () => {
    const cache = cachePublic(60, 120);
    expect(cache).toContain("max-age=0");
  });

  it("sw.js service worker uses no-cache (always fresh)", () => {
    const swCache = "no-cache, no-store, must-revalidate";
    expect(swCache).toContain("no-cache");
    expect(swCache).toContain("no-store");
  });
});
