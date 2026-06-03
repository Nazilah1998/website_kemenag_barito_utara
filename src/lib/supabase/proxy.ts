import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import { logWarn } from "@/lib/logger";

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    env.supabaseUrl,
    env.supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>, headers?: Record<string, string>) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options || {});
          });

          if (headers) {
            Object.entries(headers).forEach(([key, value]) => {
              supabaseResponse.headers.set(key, value);
            });
          }
        },
      },
    },
  );

  try {
    await (supabase as any).auth.getClaims();
  } catch (error) {
    logWarn("supabase_session_invalid", { error: error as Error });

    for (const cookie of request.cookies.getAll()) {
      if (cookie.name.startsWith("sb-")) {
        supabaseResponse.cookies.set(cookie.name, "", {
          path: "/",
          maxAge: 0,
        });
      }
    }
  }

  return supabaseResponse;
}
