import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client } from "@/lib/r2";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  let currentPath = "unknown";
  try {
    const resolvedParams = await params;
    const pathParts = resolvedParams.path || [];
    const path = pathParts.join("/");
    currentPath = path;

    const client = getR2Client();

    if (!client) {
      return new Response("Storage not configured", { status: 500 });
    }

    const command = new GetObjectCommand({
      Bucket: env.r2.bucketName,
      Key: path,
    });

    const response = await client.send(command);

    // Stream the body
    const stream = response.Body.transformToWebStream();

    return new Response(stream, {
      headers: {
        "Content-Type": response.ContentType || "application/octet-stream",
        "Content-Length": response.ContentLength?.toString() || "",
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
