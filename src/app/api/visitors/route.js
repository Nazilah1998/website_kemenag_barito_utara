import { apiResponse } from "@/lib/api-helpers";
import { getVisitorStats, incrementVisitorStats } from "@/lib/visitor-tracker";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET() {
  try {
    const stats = await getVisitorStats();
    return apiResponse(stats);
  } catch (error) {
    return apiResponse({ message: "Gagal memuat statistik pengunjung", error: error?.message }, 500);
  }
}

export async function POST(req) {
  try {
    // Rate limit: 60 req per IP per minute (naik dari 2 untuk page view tracking)
    const isAllowed = await rateLimit(req, "visitor_post", 60, 60);
    if (!isAllowed) {
      return apiResponse({ message: "Too many requests" }, 429);
    }

    // Path opsional — backward compatible dengan request tanpa body
    let path = null;
    try {
      const body = await req.json();
      path = body?.path || null;
    } catch { /* body kosong — tetap jalan */ }

    await incrementVisitorStats(path);
    return apiResponse({ success: true });
  } catch (error) {
    return apiResponse({ message: "Gagal mencatat pengunjung", error: error?.message }, 500);
  }
}
