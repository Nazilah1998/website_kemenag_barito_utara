import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/lib/drizzle";
import { berita } from "@/db/schema";
import { eq, and, lte, isNotNull, inArray, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

function isAuthorized(request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;

  const header = request.headers.get("authorization") || "";
  if (header === `Bearer ${expected}`) return true;

  const { searchParams } = new URL(request.url);
  return searchParams.get("key") === expected;
}

async function runScheduledPublish() {
  const now = new Date();

  const beritaPending = await db
    .select({ id: berita.id, slug: berita.slug, title: berita.title })
    .from(berita)
    .where(
      and(
        eq(berita.is_published, false),
        isNotNull(berita.published_at),
        lte(berita.published_at, now)
      )
    );

  let beritaPublished = 0;
  if (beritaPending && beritaPending.length > 0) {
    const ids = beritaPending.map((b) => b.id);
    
    await db
      .update(berita)
      .set({ is_published: true })
      .where(inArray(berita.id, ids));

    beritaPublished = ids.length;
    for (const item of beritaPending) {
      if (item.slug) revalidatePath(`/berita/${item.slug}`);
    }
    revalidatePath("/berita");
    revalidatePath("/");
    revalidateTag("home-latest-berita", "max");
    revalidateTag("home-popular-berita", "max");
  }

  return {
    beritaPublished,
    ranAt: now.toISOString(),
  };
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { message: "Unauthorized.", code: "CRON_UNAUTHORIZED" },
      { status: 401 },
    );
  }

  try {
    const result = await runScheduledPublish();
    return NextResponse.json({ message: "OK", ...result });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Gagal menjalankan cron." },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  return GET(request);
}
