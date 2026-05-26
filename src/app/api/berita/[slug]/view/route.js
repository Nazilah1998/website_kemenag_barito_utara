import { apiResponse } from "@/lib/api-helpers";
import { incrementView } from "@/lib/view-counter";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request, context) {
  const ip = getClientIp(request);
  const limitCheck = await rateLimit({
    key: `berita-view:${ip}`,
    limit: 30,
    windowMs: 60_000,
  });

  if (!limitCheck.ok) {
    return apiResponse({ message: "Terlalu banyak permintaan." }, 429);
  }
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