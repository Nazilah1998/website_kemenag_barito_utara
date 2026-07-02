import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { youtube_videos } from "@/db/schema";
import { validateAdmin } from "@/lib/cms-utils";
import { recordAudit } from "@/lib/audit";
import { apiResponse } from "@/lib/api-helpers";
import { revalidateTag } from "next/cache";
import { desc, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const isAdmin = await validateAdmin(request, ["admin", "editor"]);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const videos = await db
      .select()
      .from(youtube_videos)
      .orderBy(asc(youtube_videos.sort_order), desc(youtube_videos.updated_at));

    return apiResponse(videos);
  } catch (error) {
    console.error("GET /api/admin/youtube error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data video YouTube" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const isAdmin = await validateAdmin(request, ["admin", "editor"]);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, youtube_id, is_published, sort_order } = body;

    if (!title || !youtube_id) {
      return NextResponse.json(
        { error: "Judul dan ID YouTube wajib diisi" },
        { status: 400 }
      );
    }

    const [newVideo] = await db
      .insert(youtube_videos)
      .values({
        title,
        youtube_id,
        is_published: is_published ?? true,
        sort_order: sort_order ?? 0,
      })
      .returning();

    await recordAudit(request, {
      action: "CREATE_YOUTUBE",
      resource: "youtube_videos",
      details: `Menambahkan video YouTube: ${title}`,
    });

    revalidateTag("youtube-videos");

    return apiResponse(newVideo);
  } catch (error) {
    console.error("POST /api/admin/youtube error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan video YouTube" },
      { status: 500 }
    );
  }
}
