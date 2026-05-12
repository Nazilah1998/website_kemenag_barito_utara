import { NextResponse } from "next/server";
import { apiResponse } from "@/lib/prisma-helpers";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return apiResponse({ message: "ID dokumen tidak valid." }, 400);
    }

    const doc = await prisma.report_documents.findUnique({
      where: { id: id },
      select: { id: true, file_url: true, is_published: true }
    });

    if (!doc) {
      return apiResponse({ message: "Dokumen tidak ditemukan." }, 404);
    }

    if (!doc.is_published) {
      return apiResponse({ message: "Dokumen belum dipublikasikan." }, 403);
    }

    if (!doc.file_url) {
      return apiResponse({ message: "URL file dokumen tidak tersedia." }, 404);
    }

    // Increment view count atomically
    await prisma.report_documents.update({
      where: { id: id },
      data: {
        view_count: {
          increment: 1
        }
      }
    });

    return NextResponse.redirect(doc.file_url);
  } catch (error) {
    console.error("GET Laporan View Redirect Error:", error);
    return apiResponse(
      {
        message: error?.message || "Terjadi kesalahan saat membuka dokumen.",
      },
      500,
    );
  }
}
