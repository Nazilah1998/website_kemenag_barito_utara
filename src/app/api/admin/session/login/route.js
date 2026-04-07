import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim()?.toLowerCase();
    const password = body?.password;

    if (!email || !password) {
      return NextResponse.json(
        {
          ok: false,
          message: "Email dan password wajib diisi.",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message || "Login gagal.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Login berhasil.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Terjadi kesalahan server saat login.",
      },
      { status: 500 }
    );
  }
}