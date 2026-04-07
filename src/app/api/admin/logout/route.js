import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();

    return NextResponse.json({
      message: "Logout berhasil.",
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat logout." },
      { status: 500 }
    );
  }
}