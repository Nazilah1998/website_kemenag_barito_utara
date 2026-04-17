import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

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
  const supabase = createAdminClient();
  const nowIso = new Date().toISOString();

  // Berita dengan publish_at <= sekarang tapi belum publish.
  const { data: beritaPending, error: beritaErr } = await supabase
    .from("berita")
    .select("id, slug, title")
    .eq("is_published", false)
    .not("published_at", "is", null)
    .lte("published_at", nowIso);

  let beritaPublished = 0;
  if (!beritaErr && beritaPending && beritaPending.length > 0) {
    const ids = beritaPending.map((b) => b.id);
    const { error: upErr } = await supabase
      .from("berita")
      .update({ is_published: true })
      .in("id", ids);

    if (!upErr) {
      beritaPublished = ids.length;
      for (const item of beritaPending) {
        if (item.slug) revalidatePath(`/berita/${item.slug}`);
      }
      revalidatePath("/berita");
      revalidatePath("/");
    }
  }

  // Pengumuman dengan published_at <= sekarang tapi belum publish.
  let pengumumanPublished = 0;
  try {
    const { data: pengPending } = await supabase
      .from("pengumuman")
      .select("id, slug")
      .eq("is_published", false)
      .not("published_at", "is", null)
      .lte("published_at", nowIso);

    if (pengPending && pengPending.length > 0) {
      const ids = pengPending.map((p) => p.id);
      const { error } = await supabase
        .from("pengumuman")
        .update({ is_published: true })
        .in("id", ids);

      if (!error) {
        pengumumanPublished = ids.length;
        revalidatePath("/");
        for (const p of pengPending) {
          if (p.slug) revalidatePath(`/pengumuman/${p.slug}`);
        }
      }
    }
  } catch {
    // tabel belum siap
  }

  return {
    beritaPublished,
    pengumumanPublished,
    ranAt: nowIso,
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
