import { apiResponse } from "@/lib/api-helpers";
import { incrementView } from "@/lib/view-counter";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { logError } from "@/lib/logger";

export async function POST(request, context) {
  const ip = getClientIp(request);
  const { slug } = await context.params;
  // IP limit dinaikkan dari 30 menjadi 1000 karena di kantor (satu WiFi) semua orang berbagi 1 IP.
  const limitCheck = await rateLimit({
    key: `berita-view:${slug}:${ip}`,
    limit: 1000,
    windowMs: 60_000,
  });

  if (!limitCheck.ok) {
    return apiResponse({ message: "Terlalu banyak permintaan." }, 429);
  }
  try {
    const views = await incrementView(slug);

    return apiResponse({ ok: true, views });
  } catch (error) {
    logError("berita_view_error", { error: error?.message });
    return apiResponse(
      { message: error.message || "Gagal menambah jumlah pembaca." },
      500
    );
  }
}