import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    env.supabaseUrl,
    env.supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
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
    await supabase.auth.getClaims();
  } catch (error) {
    console.warn(
      "Supabase session invalid, clearing stale cookies...",
      error?.message,
    );

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
