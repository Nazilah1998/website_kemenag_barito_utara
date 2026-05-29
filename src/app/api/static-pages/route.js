import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { static_pages } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const [page] = await db
        .select({
          id: static_pages.id,
          slug: static_pages.slug,
          title: static_pages.title,
          description: static_pages.description,
          content: static_pages.content,
          updated_at: static_pages.updated_at,
        })
        .from(static_pages)
        .where(
          and(
            eq(static_pages.slug, slug),
            eq(static_pages.is_published, true)
          )
        )
        .limit(1);

      if (!page) {
        return NextResponse.json(
          { error: "Halaman tidak ditemukan." },
          { status: 404 },
        );
      }

      return NextResponse.json(page);
    }

    const pages = await db
      .select({
        id: static_pages.id,
        slug: static_pages.slug,
        title: static_pages.title,
        description: static_pages.description,
        updated_at: static_pages.updated_at,
      })
      .from(static_pages)
      .where(eq(static_pages.is_published, true))
      .orderBy(desc(static_pages.updated_at));

    return NextResponse.json(pages);
  } catch (error) {
    logError("static_pages_error", { error: error?.message });
    return NextResponse.json(
      { error: "Gagal mengambil data halaman." },
      { status: 500 },
    );
  }
}
