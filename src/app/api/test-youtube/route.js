import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { youtube_videos } from "@/db/schema";
import { desc, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const videos = await db
      .select()
      .from(youtube_videos)
      .orderBy(asc(youtube_videos.sort_order), desc(youtube_videos.updated_at));

    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json(
      { success: false, error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
