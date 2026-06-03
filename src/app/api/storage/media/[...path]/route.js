import { CMS_MEDIA_BUCKET } from "@/lib/storage-media";
import { createAdminClient } from "@/lib/supabase/admin";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const pathParts = resolvedParams.path || [];
    const path = pathParts.join("/");

    if (!path) {
      return new Response("Path tidak valid.", { status: 400 });
    }

    const bucketName = CMS_MEDIA_BUCKET;
    const supabase = createAdminClient();

    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(path);

    if (error || !data) {
      logError("media_proxy_not_found", { path, error: error?.message });
      return new Response("File tidak ditemukan.", { status: 404 });
    }

    const ext = path.split(".").pop()?.toLowerCase();
    const contentTypes = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
      svg: "image/svg+xml",
    };
    const contentType = contentTypes[ext] || "application/octet-stream";

    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    logError("media_proxy_error", {
      message: error.message,
    });
    return new Response(`Gagal memuat file: ${error.message}`, { status: 500 });
  }
}
