import { apiResponse } from "@/lib/api-helpers";
import { getVisitorStats, incrementVisitorStats } from "@/lib/visitor-tracker";
import { rateLimit } from "@/lib/rate-limit";

// Disable caching to get real-time stats
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
    // Basic rate limit: 2 requests per IP per minute
    const isAllowed = await rateLimit(req, "visitor_post", 2, 60);
    if (!isAllowed) {
      return apiResponse({ message: "Too many requests" }, 429);
    }

    await incrementVisitorStats();
    return apiResponse({ success: true });
  } catch (error) {
    return apiResponse({ message: "Gagal mencatat pengunjung", error: error?.message }, 500);
  }
}
