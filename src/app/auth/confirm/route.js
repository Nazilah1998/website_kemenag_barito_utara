import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") || "/admin";
  const returnTo = searchParams.get("return_to");

  // Jika URL tujuan mengandung step=2 (Reset Password), 
  // langsung izinkan lewat karena biasanya autentikasi sudah ditangani di hash fragment.
  if (next.includes("step=2")) {
    const recoveryRedirect = request.nextUrl.clone();
    recoveryRedirect.pathname = "/admin/forgot-password";
    recoveryRedirect.searchParams.set("step", "2");
    // Hapus parameter yang tidak perlu
    recoveryRedirect.searchParams.delete("token_hash");
    recoveryRedirect.searchParams.delete("type");
    recoveryRedirect.searchParams.delete("next");
    return NextResponse.redirect(recoveryRedirect);
  }

  if (tokenHash && type) {
    const supabase = await createClient();
    
    // Jika jenisnya recovery, arahkan ke halaman reset.
    if (type === "recovery") {
      const recoveryRedirect = request.nextUrl.clone();
      recoveryRedirect.pathname = "/admin/forgot-password";
      recoveryRedirect.searchParams.set("step", "2");
      return NextResponse.redirect(recoveryRedirect);
    }

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
  }

  // Jika sampai sini dan bukan recovery, baru tampilkan error
  const errorRedirect = request.nextUrl.clone();
  errorRedirect.pathname = "/error";
  errorRedirect.searchParams.set(
    "message",
    "Konfirmasi gagal. Jika Anda sedang me-reset password, silakan coba klik link di email sekali lagi."
  );

  return NextResponse.redirect(errorRedirect);
}
