import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { youtube_videos } from "@/db/schema";
import { validateAdmin } from "@/lib/cms-utils";
import { recordAudit } from "@/lib/audit";
import { apiResponse } from "@/lib/api-helpers";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

export async function PATCH(request, context) {
  try {
    const isAdmin = await validateAdmin(request, ["admin", "editor"]);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const [updatedVideo] = await db
      .update(youtube_videos)
      .set({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .where(eq(youtube_videos.id, id))
      .returning();

    if (!updatedVideo) {
      return NextResponse.json(
        { error: "Video tidak ditemukan" },
        { status: 404 }
      );
    }

    await recordAudit(request, {
      action: "UPDATE_YOUTUBE",
      resource: "youtube_videos",
      details: `Mengubah data video YouTube: ${updatedVideo.title}`,
    });

    revalidateTag("youtube-videos");

    return apiResponse(updatedVideo);
  } catch (error) {
    console.error(`PATCH /api/admin/youtube/[id] error:`, error);
    return NextResponse.json(
      { error: "Gagal mengubah data video" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const isAdmin = await validateAdmin(request, ["admin"]);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Hanya Admin yang dapat menghapus video" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const [deletedVideo] = await db
      .delete(youtube_videos)
      .where(eq(youtube_videos.id, id))
      .returning();

    if (!deletedVideo) {
      return NextResponse.json(
        { error: "Video tidak ditemukan" },
        { status: 404 }
      );
    }

    await recordAudit(request, {
      action: "DELETE_YOUTUBE",
      resource: "youtube_videos",
      details: `Menghapus video YouTube: ${deletedVideo.title}`,
    });

    revalidateTag("youtube-videos");

    return apiResponse({ success: true });
  } catch (error) {
    console.error(`DELETE /api/admin/youtube/[id] error:`, error);
    return NextResponse.json(
      { error: "Gagal menghapus video" },
      { status: 500 }
    );
  }
}
