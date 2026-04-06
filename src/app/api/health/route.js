import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const [
      { count: profilesCount, error: profilesError },
      { count: categoriesCount, error: categoriesError },
      { count: newsCount, error: newsError },
    ] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase
        .from("categories")
        .select("id", { count: "exact", head: true }),
      supabase.from("news").select("id", { count: "exact", head: true }),
    ]);

    const dbError = profilesError || categoriesError || newsError;

    if (dbError) {
      throw dbError;
    }

    return NextResponse.json({
      ok: true,
      message: "Koneksi backend tahap 1 aktif.",
      counts: {
        profiles: profilesCount ?? 0,
        categories: categoriesCount ?? 0,
        news: newsCount ?? 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error.message || "Health check gagal.",
      },
      { status: 500 }
    );
  }
}
