import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { updateSession } from "./lib/supabase/proxy";

const ADMIN_PUBLIC_PATHS = new Set(["/admin/login"]);
const ADMIN_API_PUBLIC = new Set([
  "/api/admin/login",
  "/api/admin/logout",
  "/api/admin/session",
]);

function isAdminPath(pathname) {
  return pathname.startsWith("/admin");
}

function isAdminApiPath(pathname) {
  return pathname.startsWith("/api/admin");
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

  const response = NextResponse.next({ request });
  const supabase = createEdgeSupabase(request, response);
  if (!supabase) return null;

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
  const guarded = await guardAdmin(request);
  if (guarded) return guarded;

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
