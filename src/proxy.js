import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { updateSession } from "./lib/supabase/proxy";

const ADMIN_PUBLIC_PATHS = new Set([
  "/admin/login",
  "/admin/forgot-password",  // Halaman lupa password — tidak perlu login
  "/admin/update-password",  // Halaman reset password via link email
]);
const ADMIN_API_PUBLIC = new Set([
  "/api/admin/login",
  "/api/admin/logout",
  "/api/admin/session",
  "/api/admin/reset-password",   // Kirim email reset — tidak perlu login
  "/api/admin/update-password",  // Update password via token email — tidak perlu login
]);



function isAdminPath(pathname) {
  return pathname.startsWith("/admin");
}

function isAdminApiPath(pathname) {
  return pathname.startsWith("/api/admin");
}

function isMaintenanceApiPath(pathname) {
  return pathname === "/api/maintenance-status";
}

function isHealthCheckPath(pathname) {
  return pathname === "/api/health";
}

function isPublicAsset(pathname) {
  return (
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image") ||
    pathname === "/favicon.ico" ||
    /\.(?:svg|png|jpg|jpeg|gif|webp)$/i.test(pathname)
  );
}

function buildLoginRedirect(request) {
  const url = request.nextUrl.clone();
  const params = new URLSearchParams();
  params.set("next", request.nextUrl.pathname + (request.nextUrl.search || ""));
  url.pathname = "/admin/login";
  url.search = `?${params.toString()}`;
  return NextResponse.redirect(url);
}

function createEdgeSupabase(request, response) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set({ name, value, ...options });
        });
      },
    },
  });
}

function maintenancePageHTML({ title, message }) {
  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Sistem Dalam Pemeliharaan — Kemenag Barito Utara</title>
<meta name="robots" content="noindex, nofollow" />
<link rel="icon" href="/assets/branding/kemenag.svg" type="image/svg+xml" />
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family:-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
    background-color:#fafafa;
    color:#1e293b;
    min-height:100vh;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    position:relative;
    overflow-x:hidden;
  }
  .bg-glow {
    position:absolute;
    top:0;
    left:50%;
    transform:translateX(-50%);
    width:800px;
    height:500px;
    background:radial-gradient(ellipse at top, rgba(16,185,129,0.15) 0%, rgba(250,250,250,0) 70%);
    z-index:0;
    pointer-events:none;
  }
  .container {
    position:relative;
    z-index:1;
    width:100%;
    max-width:600px;
    padding:2rem;
    display:flex;
    flex-direction:column;
    align-items:center;
    text-align:center;
  }
  .header {
    margin-bottom:2.5rem;
  }
  .logo {
    width:80px;
    height:80px;
    margin:0 auto 1rem;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
  }
  .logo img {
    width:100%;
    height:100%;
    object-fit:contain;
  }
  .title-main {
    font-size:1.5rem;
    font-weight:900;
    color:#065f46;
    letter-spacing:0.1em;
    line-height:1.3;
  }
  .title-sub {
    font-size:0.75rem;
    font-weight:800;
    color:#10b981;
    letter-spacing:0.15em;
    margin-top:0.5rem;
    text-transform:uppercase;
  }
  .card {
    background:#ffffff;
    border-radius:1.5rem;
    padding:3rem 2.5rem;
    width:100%;
    box-shadow:0 20px 40px -10px rgba(0,0,0,0.05);
    border-top:4px solid #34d399;
    position:relative;
  }
  .icon-wrapper {
    width:56px;
    height:56px;
    background:#fff7ed;
    border:1px solid #ffedd5;
    border-radius:1rem;
    display:flex;
    align-items:center;
    justify-content:center;
    margin:0 auto 1.5rem;
    color:#f97316;
  }
  .icon-wrapper svg {
    width:28px;
    height:28px;
  }
  .card h1 {
    font-size:2rem;
    font-weight:900;
    color:#0f172a;
    margin-bottom:1rem;
    letter-spacing:-0.03em;
  }
  .card p {
    font-size:1rem;
    color:#64748b;
    line-height:1.6;
    margin-bottom:2.5rem;
  }
  .badges {
    display:flex;
    gap:1rem;
    justify-content:center;
    flex-wrap:wrap;
  }
  .badge {
    display:flex;
    align-items:center;
    gap:0.5rem;
    background:#f8fafc;
    border:1px solid #e2e8f0;
    padding:0.5rem 1rem;
    border-radius:999px;
    font-size:0.75rem;
    font-weight:700;
    color:#334155;
  }
  .badge.orange .dot {
    width:8px;
    height:8px;
    background:#f59e0b;
    border-radius:50%;
  }
  .badge.green svg {
    width:14px;
    height:14px;
    color:#10b981;
  }
  .footer {
    margin-top:4rem;
    font-size:0.75rem;
    color:#94a3b8;
    font-weight:500;
  }
  @media(max-width:480px){
    .card { padding:2rem 1.5rem; }
    .card h1 { font-size:1.5rem; }
    .title-main { font-size:1.2rem; }
  }
</style>
</head>
<body>
  <div class="bg-glow"></div>
  <div class="container">
    <div class="header">
      <div class="logo">
        <img src="/assets/branding/kemenag.svg" alt="Kemenag" />
      </div>
      <div class="title-main">KEMENTERIAN AGAMA<br/>REPUBLIK INDONESIA</div>
      <div class="title-sub">Kantor Kabupaten Barito Utara</div>
    </div>
    <div class="card">
      <div class="icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
      </div>
      <h1>Sistem Dalam<br/>Pemeliharaan</h1>
      <p>Sistem sedang dinonaktifkan oleh admin. Silakan kembali beberapa saat lagi.</p>
      
      <div class="badges">
        <div class="badge orange">
          <div class="dot"></div>
          Sedang Dalam Pengerjaan
        </div>
        <div class="badge green">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
          Data Anda Tetap Aman
        </div>
      </div>
    </div>
    
    <div class="footer">
      &copy; 2026 Website Kemenag Barito Utara. Hak Cipta Dilindungi.
    </div>
  </div>
</body>
</html>`;
}

async function checkMaintenance(request) {
  const { pathname } = request.nextUrl;

  if (isAdminPath(pathname) || isAdminApiPath(pathname)) return null;
  if (isMaintenanceApiPath(pathname)) return null;
  if (isHealthCheckPath(pathname)) return null;
  if (isPublicAsset(pathname)) return null;

  // Cek ke internal API
  try {
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      request.nextUrl.origin ||
      "http://localhost:3000";

    const res = await fetch(`${origin}/api/maintenance-status`, {
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data?.active) return null;

    return new Response(
      maintenancePageHTML({
        title: data.title || "Pemeliharaan Sistem",
        message:
          data.message ||
          "Website sedang dalam perbaikan. Mohon kembali lagi beberapa saat.",
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store, must-revalidate",
          "Retry-After": "3600",
        },
      },
    );
  } catch {
    return null;
  }
}

async function guardAdmin(request) {
  const { pathname } = request.nextUrl;
  const adminPage = isAdminPath(pathname);
  const adminApi = isAdminApiPath(pathname);

  if (!adminPage && !adminApi) return null;

  if (adminPage && ADMIN_PUBLIC_PATHS.has(pathname)) return null;
  if (adminApi && ADMIN_API_PUBLIC.has(pathname)) return null;
  if (isHealthCheckPath(pathname)) return null;

  const response = NextResponse.next({ request });
  const supabase = createEdgeSupabase(request, response);

  // FAIL-CLOSED:
  // Jika tidak bisa membuat client Supabase edge (mis. env tidak ada),
  // maka admin page/admin api harus tetap ditahan.
  if (!supabase) {
    if (adminApi) {
      return NextResponse.json(
        { message: "Unauthorized.", code: "AUTH_REQUIRED" },
        {
          status: 401,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }
    return buildLoginRedirect(request);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (adminApi) {
      return NextResponse.json(
        { message: "Unauthorized.", code: "AUTH_REQUIRED" },
        {
          status: 401,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }
    return buildLoginRedirect(request);
  }

  return null;
}

export async function proxy(request) {
  // LANGKAH 1: Cek maintenance mode (sebelum admin guard)
  const maintenanceBlock = await checkMaintenance(request);
  if (maintenanceBlock) return maintenanceBlock;

  // LANGKAH 2: Admin guard
  const guarded = await guardAdmin(request);
  if (guarded) return guarded;

  // LANGKAH 3: Session refresh
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
