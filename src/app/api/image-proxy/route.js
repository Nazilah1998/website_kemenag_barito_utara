import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const MAX_RESPONSE_BYTES = 10_000_000;

function getAllowedHosts() {
  const hosts = new Set([
    "drive.google.com",
    "docs.google.com",
    "lh3.googleusercontent.com",
  ]);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      hosts.add(new URL(supabaseUrl).hostname);
    } catch {
      // abaikan env yang tidak valid
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    try {
      hosts.add(new URL(siteUrl).hostname);
    } catch {
      // abaikan env yang tidak valid
    }
  }

  return hosts;
}

export async function GET(request) {
  const ip = getClientIp(request);
  const limitCheck = await rateLimit({
    key: `image-proxy:${ip}`,
    limit: 30,
    windowMs: 60_000,
  });

  if (!limitCheck.ok) {
    return NextResponse.json(
      { message: "Terlalu banyak permintaan." },
      { status: 429 },
    );
  }

  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json(
      { message: "Parameter url wajib diisi." },
      { status: 400 },
    );
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    return NextResponse.json(
      { message: "URL gambar tidak valid." },
      { status: 400 },
    );
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return NextResponse.json(
      { message: "Protokol URL tidak didukung." },
      { status: 400 },
    );
  }

  const allowedHosts = getAllowedHosts();
  if (!allowedHosts.has(parsedUrl.hostname)) {
    return NextResponse.json(
      { message: "Host gambar tidak diizinkan untuk preview." },
      { status: 403 },
    );
  }

  const upstream = await fetch(parsedUrl.toString(), {
    method: "GET",
    cache: "no-store",
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!upstream.ok) {
    return NextResponse.json(
      { message: "Gagal mengambil gambar dari sumber aslinya." },
      { status: upstream.status },
    );
  }

  const contentType = upstream.headers.get("content-type") || "";

  if (!contentType.startsWith("image/")) {
    return NextResponse.json(
      { message: "Resource yang diminta bukan file gambar." },
      { status: 415 },
    );
  }

  const contentLength = upstream.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_RESPONSE_BYTES) {
    return NextResponse.json(
      { message: "Ukuran gambar melebihi batas maksimal (" + (MAX_RESPONSE_BYTES / 1_000_000) + " MB)." },
      { status: 413 },
    );
  }

  const arrayBuffer = await upstream.arrayBuffer();

  if (arrayBuffer.byteLength > MAX_RESPONSE_BYTES) {
    return NextResponse.json(
      { message: "Ukuran gambar melebihi batas maksimal (" + (MAX_RESPONSE_BYTES / 1_000_000) + " MB)." },
      { status: 413 },
    );
  }

  return new Response(arrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=300",
    },
  });
}
