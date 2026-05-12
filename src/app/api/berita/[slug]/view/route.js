import { apiResponse } from "@/lib/prisma-helpers";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(_request, context) {
  try {
    const { slug } = await context.params;

    const data = await prisma.berita.update({
      where: { slug },
      data: {
        views: {
          increment: 1
        }
      },
      select: { views: true }
    });

    return apiResponse({
      views: Number(data?.views || 0),
    });
  } catch (error) {
    console.error("POST Berita View Error:", error);
    return apiResponse(
      { message: error.message || "Gagal menambah jumlah pembaca." },
      500
    );
  }
}