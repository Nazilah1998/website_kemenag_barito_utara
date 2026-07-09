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
    cookieOptions: {
      name: "sb-website-auth-token",
    },
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
  const pathname = request.nextUrl.pathname;
  
  // Set x-pathname header to be read by layout.js
  request.headers.set("x-pathname", pathname);

  // LANGKAH 0: Maintenance Check Terpusat
  if (
    !isAdminPath(pathname) && 
    !isAdminApiPath(pathname) && 
    !isHealthCheckPath(pathname) &&
    !pathname.startsWith("/api/public/") // Mencegah infinite loop jika URL Pusdatin mengarah ke diri sendiri
  ) {
    try {
      const pusdatinUrl = process.env.NEXT_PUBLIC_PUSDATIN_URL || "https://pusdatin.kemenag-baritoutara.com";
      const appId = "website-kemenag";
      
      const maintenanceRes = await fetch(`${pusdatinUrl}/api/public/apps/${appId}/status`, { next: { revalidate: 30 } });
      if (maintenanceRes.ok) {
        const data = await maintenanceRes.json();
        if (data.status === "maintenance") {
          return new NextResponse(
            `<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sistem Sedang Pemeliharaan</title>
    <link rel="icon" href="${pusdatinUrl}/branding/kemenag.svg" type="image/svg+xml">
    <style>
      body { margin: 0; overflow: hidden; background-color: #f8fafc; }
      iframe { width: 100vw; height: 100vh; border: none; }
    </style>
  </head>
  <body>
    <iframe src="${pusdatinUrl}/maintenance?app=Website+Kemenag" title="Maintenance"></iframe>
  </body>
</html>`,
            {
              status: 503,
              headers: { "Content-Type": "text/html; charset=utf-8" },
            }
          );
        }
      }
    } catch (error) {
      console.error("[PROXY] Failed to fetch maintenance status:", error);
    }
  }

  // LANGKAH 1: Admin guard
  const guarded = await guardAdmin(request);
  if (guarded) return guarded;

  // LANGKAH 2: Session refresh
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
