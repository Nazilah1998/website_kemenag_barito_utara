import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client } from "@/lib/r2";
import { env } from "@/lib/env";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

const EXT_MAP = {
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
};

function inferContentType(path) {
  const ext = path.split(".").pop()?.toLowerCase();
  return EXT_MAP[ext] || "image/webp";
}

export async function GET(request, { params }) {
  const ip = getClientIp(request);
  const limitCheck = await rateLimit({
    key: `r2-proxy:${ip}`,
    limit: 1000,
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

    const client = getR2Client();
    if (!client) {
      return new Response("R2 Client not configured", { status: 500 });
    }

    const command = new GetObjectCommand({
      Bucket: env.r2.bucketName,
      Key: path,
    });

    const response = await client.send(command);

    let imageBuffer;
    const body = response.Body;

    if (!body) {
      throw new Error("R2 response body is empty");
    }

    if (typeof body.transformToByteArray === "function") {
      imageBuffer = await body.transformToByteArray();
    } else if (typeof body.transformToString === "function") {
      imageBuffer = new TextEncoder().encode(await body.transformToString());
    } else if (typeof body.arrayBuffer === "function") {
      imageBuffer = new Uint8Array(await body.arrayBuffer());
    } else if (typeof body.getReader === "function") {
      const reader = body.getReader();
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      const totalLength = chunks.reduce((acc, c) => acc + c.byteLength, 0);
      imageBuffer = new Uint8Array(totalLength);
      let offset = 0;
      for (const c of chunks) { imageBuffer.set(c, offset); offset += c.byteLength; }
    } else if (typeof body[Symbol.asyncIterator] === "function") {
      const chunks = [];
      for await (const chunk of body) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
      }
      imageBuffer = new Uint8Array(Buffer.concat(chunks));
    } else if (body instanceof Uint8Array || body instanceof Buffer) {
      imageBuffer = new Uint8Array(body);
    } else {
      imageBuffer = new Uint8Array(Buffer.from(body));
    }

    const contentType = response.ContentType || inferContentType(path);

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(imageBuffer.byteLength),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": "inline",
      },
    });
  } catch (error) {
    logError("r2_proxy_error", {
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
