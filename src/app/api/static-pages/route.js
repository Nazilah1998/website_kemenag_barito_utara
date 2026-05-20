import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const page = await prisma.static_pages.findFirst({
        where: { slug, is_published: true },
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          content: true,
          updated_at: true,
        },
      });

      if (!page) {
        return NextResponse.json(
          { error: "Halaman tidak ditemukan." },
          { status: 404 },
        );
      }

      return NextResponse.json(page);
    }

    const pages = await prisma.static_pages.findMany({
      where: { is_published: true },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        updated_at: true,
      },
      orderBy: { updated_at: "desc" },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error("GET Static Pages Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data halaman." },
      { status: 500 },
    );
  }
}
