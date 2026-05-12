import { apiResponse, getSafeIdFromContext } from "@/lib/prisma-helpers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
  try {
    const id = await getSafeIdFromContext(context);
    if (!id) {
      return apiResponse({ message: "ID dokumen tidak valid." }, 400);
    }

    const doc = await prisma.report_documents.findUnique({
      where: { id: id },
      select: { id: true, file_url: true, is_published: true, view_count: true }
    });

    if (!doc) {
      return apiResponse({ message: "Dokumen tidak ditemukan." }, 404);
    }

    if (!doc.is_published) {
      return apiResponse({ message: "Dokumen belum dipublikasikan." }, 403);
    }

    if (!doc.file_url) {
      return apiResponse({ message: "File dokumen tidak tersedia." }, 404);
    }

    await prisma.report_documents.update({
      where: { id: id },
      data: {
        view_count: {
          increment: 1
        },
        updated_at: new Date(),
      }
    });

    return NextResponse.redirect(doc.file_url, 302);
  } catch (error) {
    console.error("GET Laporan View Redirect Error:", error);
    return apiResponse(
      { message: error?.message || "Terjadi kesalahan saat mencatat view dokumen." },
      500,
    );
  }
}
