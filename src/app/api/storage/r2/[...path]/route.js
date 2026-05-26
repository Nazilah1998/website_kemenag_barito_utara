import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client } from "@/lib/r2";
import { env } from "@/lib/env";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const ip = getClientIp(request);
  const limitCheck = await rateLimit({
    key: `r2-proxy:${ip}`,
    limit: 60,
    windowMs: 60_000,
  });

  if (!limitCheck.ok) {
    return new Response("Terlalu banyak permintaan.", { status: 429 });
  }
  let currentPath = "unknown";
  try {
    const resolvedParams = await params;
    const pathParts = resolvedParams.path || [];
    const path = pathParts.join("/");
    currentPath = path;

    // Kita ambil file langsung dari R2 tanpa redirect ke CDN.
    // Hal ini memastikan next/image selalu bisa memproses gambar tanpa terblokir domain external.
    const client = getR2Client();
    if (!client) {
      return new Response("R2 Client not configured", { status: 500 });
    }

    const command = new GetObjectCommand({
      Bucket: env.r2.bucketName,
      Key: path,
    });

    const response = await client.send(command);
    
    // Convert Node.js stream to Web Stream to prevent Next.js Response object errors
    const stream = response.Body.transformToWebStream ? response.Body.transformToWebStream() : response.Body;

    return new Response(stream, {
      headers: {
        "Content-Type": response.ContentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("R2 Proxy Error Details:", {
      message: error.message,
      code: error.code,
      name: error.name,
      requestId: error.$metadata?.requestId,
      path: currentPath,
    });

    if (error.name === "NoSuchKey" || error.code === "NoSuchKey") {
      return new Response(`File tidak ditemukan di storage: ${currentPath}`, { status: 404 });
    }
    
    return new Response(`Gagal mengambil file dari storage R2: ${error.message} (${error.code || error.name})`, { status: 500 });
  }
}
