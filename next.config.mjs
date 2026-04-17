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
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseHost = null;

if (supabaseUrl) {
  try {
    supabaseHost = new URL(supabaseUrl).hostname;

    remotePatterns.push({
      protocol: "https",
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
      "'unsafe-eval'",
      "https://va.vercel-scripts.com",
      "https://vercel.live",
    ],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "img-src": [
      "'self'",
      "data:",
      "blob:",
      "https:",
    ],
    "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
    "connect-src": [
      "'self'",
      "https://vitals.vercel-insights.com",
      "https://va.vercel-scripts.com",
      supabase,
      wsSupabase,
    ].filter(Boolean),
    "frame-src": [
      "'self'",
      "https://www.google.com",
      "https://drive.google.com",
      "https://docs.google.com",
    ],
    "frame-ancestors": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
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

const nextConfig = {
  images: {
    remotePatterns,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
