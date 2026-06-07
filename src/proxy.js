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


const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

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
<title>${title} — Kemenag Barito Utara</title>
<meta name="robots" content="noindex, nofollow" />
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;
    background:linear-gradient(135deg,#064e3b 0%,#022c22 50%,#021a17 100%);
    color:#fff;
    min-height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:2rem;
  }
  .card{
    background:rgba(255,255,255,0.04);
    backdrop-filter:blur(24px);
    -webkit-backdrop-filter:blur(24px);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:2.5rem;
    padding:3rem 2.5rem 2.5rem;
    max-width:480px;
    width:100%;
    text-align:center;
    box-shadow:0 25px 60px -16px rgba(0,0,0,0.6);
  }
  .logo{
    width:72px;height:72px;
    margin:0 auto 1.25rem;
    border-radius:1.25rem;
    background:rgba(255,255,255,0.06);
    border:1px solid rgba(255,255,255,0.08);
    display:flex;align-items:center;justify-content:center;
    overflow:hidden;
    padding:12px;
  }
  .logo img{width:100%;height:100%;object-fit:contain}
  .badge{
    display:inline-block;
    background:rgba(16,185,129,0.15);
    color:#34d399;
    font-size:10px;font-weight:800;
    text-transform:uppercase;
    letter-spacing:0.35em;
    padding:0.5rem 1.25rem;
    border-radius:999px;
    border:1px solid rgba(16,185,129,0.2);
    margin-bottom:1.25rem;
  }
  h1{
    font-size:1.5rem;font-weight:900;
    line-height:1.25;margin-bottom:0.75rem;
    letter-spacing:-0.02em;
  }
  p{font-size:0.9375rem;line-height:1.7;color:rgba(255,255,255,0.6);margin-bottom:2rem}
  .status-grid{
    display:grid;grid-template-columns:1fr 1fr;gap:0.625rem;
    margin-bottom:0;
  }
  .status-item{
    background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.06);
    border-radius:1.25rem;
    padding:0.875rem 1rem;
    text-align:left;
  }
  .status-label{
    font-size:8px;font-weight:800;
    text-transform:uppercase;
    letter-spacing:0.25em;
    color:rgba(255,255,255,0.3);
    margin-bottom:0.2rem;
  }
  .status-value{
    font-size:11px;font-weight:700;
    color:rgba(255,255,255,0.85);
  }
  .footer{
    font-size:10px;
    color:rgba(255,255,255,0.25);
    margin-top:1.5rem;
    padding-top:1.25rem;
    border-top:1px solid rgba(255,255,255,0.05);
  }
  .dot-emerald{color:#34d399}
  .dot-rose{color:#fb7185}
  @media(max-width:480px){
    .card{padding:2rem 1.5rem}.status-grid{grid-template-columns:1fr}
    h1{font-size:1.3rem}.logo{width:60px;height:60px}
  }
</style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <img src="/assets/icons/kemenag-512.png" alt="Kemenag" />
    </div>
    <div class="badge">Mode Maintenance</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <div class="status-grid">
      <div class="status-item">
        <div class="status-label">Status</div>
        <div class="status-value dot-emerald">Pemeliharaan</div>
      </div>
      <div class="status-item">
        <div class="status-label">Layanan</div>
        <div class="status-value dot-rose">Ditutup Sementara</div>
      </div>
      <div class="status-item">
        <div class="status-label">Diharapkan</div>
        <div class="status-value">Segera Kembali</div>
      </div>
      <div class="status-item">
        <div class="status-label">Kantor</div>
        <div class="status-value">Kemenag Barito Utara</div>
      </div>
    </div>
    <div class="footer">Kementerian Agama Kabupaten Barito Utara</div>
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

  // COBA 1: Upstash Redis (edge-compatible, sub-millisecond)
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      const res = await fetch(`${UPSTASH_URL}/get/maintenance:mode`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const raw = await res.json();
        if (raw?.result) {
          const data = JSON.parse(raw.result);
          if (data?.active) {
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
          }
          return null;
        }
      }
    } catch {
      // Redis gagal, lanjut ke fallback
    }
  }

  // COBA 2: Internal API fetch (fallback)
  try {
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      request.nextUrl.origin ||
      "http://localhost:3000";

    const res = await fetch(`${origin}/api/maintenance-status`, {
      signal: AbortSignal.timeout(3000),
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
