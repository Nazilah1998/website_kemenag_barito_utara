import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") || "/admin";
  const returnTo = searchParams.get("return_to");

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");
  redirectTo.searchParams.delete("next");
  redirectTo.searchParams.delete("return_to");

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      const isReauthType = type === "reauthentication";
      const returnPath =
        returnTo && String(returnTo).startsWith("/") ? String(returnTo) : null;

      if (isReauthType) {
        const reauthRedirect = request.nextUrl.clone();
        reauthRedirect.pathname = returnPath || "/admin";
        reauthRedirect.searchParams.delete("token_hash");
        reauthRedirect.searchParams.delete("type");
        reauthRedirect.searchParams.delete("next");
        reauthRedirect.searchParams.delete("return_to");
        return NextResponse.redirect(reauthRedirect);
      }

      return NextResponse.redirect(redirectTo);
    }
  }

  redirectTo.pathname = "/error";
  redirectTo.searchParams.set(
    "message",
    "Konfirmasi email gagal atau tautan sudah tidak berlaku.",
  );

  return NextResponse.redirect(redirectTo);
}
