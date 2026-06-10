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

    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(path);
    const targetUrl = publicUrlData?.publicUrl;

    if (!targetUrl) {
      return new Response("URL file tidak ditemukan.", { status: 404 });
    }

    const fileResponse = await fetch(targetUrl);
    if (!fileResponse.ok) {
      logError("media_proxy_not_found", { path, status: fileResponse.status });
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
      pdf: "application/pdf",
    };
    const contentType = contentTypes[ext] || fileResponse.headers.get("content-type") || "application/octet-stream";

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Disposition", `inline; filename="${pathParts[pathParts.length - 1]}"`);
    headers.set("Cache-Control", "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Access-Control-Allow-Origin", "*");

    return new Response(fileResponse.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    logError("media_proxy_error", { message: error.message });
    return new Response(`Gagal memuat file: ${error.message}`, { status: 500 });
  }
}
