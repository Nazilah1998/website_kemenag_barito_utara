import { NextResponse } from "next/server";
import { validateAdmin } from "@/lib/cms-utils";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const isAdmin = await validateAdmin(request, ["admin", "editor"]);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "No video ID provided" }, { status: 400 });
    }

    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!res.ok) {
      throw new Error("Gagal mengambil data dari YouTube");
    }

    const data = await res.json();
    
    return NextResponse.json({ title: data.title });
  } catch (error) {
    console.error("GET /api/admin/youtube/info error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil judul video YouTube" },
      { status: 500 }
    );
  }
}
