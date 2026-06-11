/** @type {import('next').NextConfig} */

const remotePatterns = [
  {
    protocol: "https",
    hostname: "drive.google.com",
  },
  {
    protocol: "https",
    hostname: "docs.google.com",
  },
  {
    protocol: "https",
    hostname: "cdn.kemenag-baritoutara.com",
  },
  {
    protocol: "https",
    hostname: "tcvwuttdwyufxvkacyal.supabase.co",
  },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseHost = null;

if (supabaseUrl) {
  try {
    const supabaseUrlObj = new URL(supabaseUrl);
    supabaseHost = supabaseUrlObj.hostname;

    remotePatterns.push({
      protocol: supabaseUrlObj.protocol.replace(":", ""),
      hostname: supabaseHost,
    });
  } catch {
    // abaikan jika env tidak valid
  }
}

const isProd = process.env.NODE_ENV === "production";

/**
 * Content Security Policy.
 * Next.js menyuntikkan style inline saat build, jadi kita izinkan unsafe-inline untuk style.
 * Untuk script kita batasi ke self, vercel, dan google analytics.
 */
function buildCsp() {
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
    ],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
    "connect-src": [
      "'self'",
      "https://www.google.com",
      "https://www.gstatic.com",
      "https://challenges.cloudflare.com",
      supabase,
      wsSupabase,
    ].filter(Boolean),
    "frame-src": [
      "'self'",
      "https://www.google.com",
      "https://drive.google.com",
      "https://docs.google.com",
      "https://challenges.cloudflare.com",
    ],
    "frame-ancestors": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "worker-src": ["'self'"],
    "upgrade-insecure-requests": [],
  };

  return Object.entries(directives)
    .map(([key, values]) =>
      values.length === 0 ? key : `${key} ${values.join(" ")}`,
    )
    .join("; ");
}

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Content-Security-Policy", value: buildCsp() },
];

if (isProd) {
  securityHeaders.push({
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  });
}

const cachePublic = (sMaxAge, staleRevalidate) => ({
  key: "Cache-Control",
  value: `public, max-age=0, s-maxage=${sMaxAge}, stale-while-revalidate=${staleRevalidate}`,
});

const cacheImmutable = {
  key: "Cache-Control",
  value: "public, max-age=31536000, immutable",
};

const cacheNoStore = {
  key: "Cache-Control",
  value: "no-store, no-cache, must-revalidate, proxy-revalidate",
};

const nextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns,
    deviceSizes: [640, 1080, 1920],
    imageSizes: [128, 256, 384],
  },
  serverExternalPackages: ["pg", "pdfjs-dist"],
  experimental: {
    inlineCss: true,
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  allowedDevOrigins: ["127.0.0.1"],
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [...securityHeaders, cacheImmutable],
      },
      // Service worker — selalu fresh
      {
        source: "/sw.js",
        headers: [
          ...securityHeaders,
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
      // Admin & API — jangan cache
      {
        source: "/api/:path*",
        headers: [...securityHeaders, cacheNoStore],
      },
      {
        source: "/admin/:path*",
        headers: [...securityHeaders, cacheNoStore],
      },
      {
        source: "/login/:path*",
        headers: [...securityHeaders, cacheNoStore],
      },
      {
        source: "/auth/:path*",
        headers: [...securityHeaders, cacheNoStore],
      },
      // Berita — ISR 60s
      {
        source: "/berita/:path*",
        headers: [...securityHeaders, cachePublic(60, 120)],
      },
      // Galeri — ISR 300s
      {
        source: "/galeri/:path*",
        headers: [...securityHeaders, cachePublic(300, 600)],
      },
      // Laporan — ISR 300s
      {
        source: "/laporan/:path*",
        headers: [...securityHeaders, cachePublic(300, 600)],
      },
      // Informasi — ISR 600s
      {
        source: "/informasi/:path*",
        headers: [...securityHeaders, cachePublic(600, 1200)],
      },
      // Beranda — ISR 300s
      {
        source: "/beranda",
        headers: [...securityHeaders, cachePublic(300, 600)],
      },
      // Halaman profil & layanan — statis, jarang berubah
      {
        source: "/profil/:path*",
        headers: [...securityHeaders, cachePublic(600, 1200)],
      },
      {
        source: "/layanan/:path*",
        headers: [...securityHeaders, cachePublic(600, 1200)],
      },
      {
        source: "/zona-integritas/:path*",
        headers: [...securityHeaders, cachePublic(600, 1200)],
      },
      {
        source: "/(kontak|pencarian|ppid|survey)",
        headers: [...securityHeaders, cachePublic(600, 1200)],
      },
      // Root homepage
      {
        source: "/",
        headers: [...securityHeaders, cachePublic(300, 600)],
      },
      // Catch-all — semua halaman lain (security headers saja)
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/storage/:path*",
        destination: "/api/storage/media/:path*",
      },
      {
        source: "/favicon.ico",
        destination: "/assets/icons/kemenag-192.png",
      },
    ];
  },

  // ====================================================================================
  // PERHATIAN: JANGAN di-uncomment (jangan diaktifkan) sebelum domain go.id aktif 100%!
  // Jika diaktifkan sekarang, pengunjung web akan diarahkan ke domain yang belum jadi.
  // Setelah admin pusat selesai memproses IP dan domain go.id sudah bisa dibuka normal,
  // barulah Anda hapus tanda komentar (//) di bawah ini lalu deploy ulang.
  // ====================================================================================
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "kemenag-baritoutara.com" }],
        destination: "https://baritoutara.kemenag.go.id/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.kemenag-baritoutara.com" }],
        destination: "https://baritoutara.kemenag.go.id/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
