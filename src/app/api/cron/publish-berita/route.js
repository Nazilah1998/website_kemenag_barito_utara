import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

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

  // Berita dengan publish_at <= sekarang tapi belum publish.
  const beritaPending = await prisma.berita.findMany({
    where: {
      is_published: false,
      published_at: {
        not: null,
        lte: now,
      },
    },
    select: { id: true, slug: true, title: true },
  });

  let beritaPublished = 0;
  if (beritaPending && beritaPending.length > 0) {
    const ids = beritaPending.map((b) => b.id);
    
    await prisma.berita.updateMany({
      where: { id: { in: ids } },
      data: { is_published: true },
    });

    beritaPublished = ids.length;
    for (const item of beritaPending) {
      if (item.slug) revalidatePath(`/berita/${item.slug}`);
    }
    revalidatePath("/berita");
    revalidatePath("/");
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
