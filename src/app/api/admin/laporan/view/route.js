import { apiResponse } from "@/lib/prisma-helpers";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const id = String(body?.id || "").trim();

    if (!id) {
      return apiResponse({ message: "ID dokumen tidak valid." }, 400);
    }

    const document = await prisma.report_documents.update({
      where: { id: id },
      data: {
        view_count: {
          increment: 1
        }
      },
      select: { view_count: true }
    });

    return apiResponse({ views: document.view_count });
  } catch (error) {
    console.error("POST Laporan View Error:", error);
    return apiResponse(
      { message: error?.message || "Gagal mencatat pembaca." },
      500,
    );
  }
}
