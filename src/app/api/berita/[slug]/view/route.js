import { apiResponse } from "@/lib/prisma-helpers";
import { incrementView } from "@/lib/view-counter";

export async function POST(_request, context) {
  try {
    const { slug } = await context.params;
    incrementView(slug);

    return apiResponse({ ok: true });
  } catch (error) {
    console.error("POST Berita View Error:", error);
    return apiResponse(
      { message: error.message || "Gagal menambah jumlah pembaca." },
      500
    );
  }
}