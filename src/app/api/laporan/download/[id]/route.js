import { NextResponse } from "next/server";
import { apiResponse } from "@/lib/prisma-helpers";
import prisma from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const ip = getClientIp(request);
  const limitCheck = await rateLimit({
    key: `laporan-download:${ip}`,
    limit: 20,
    windowMs: 60_000,
  });

  if (!limitCheck.ok) {
    return apiResponse({ message: "Terlalu banyak permintaan." }, 429);
  }
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return apiResponse({ message: "ID dokumen tidak valid." }, 400);
    }

    const doc = await prisma.report_documents.findUnique({
      where: { id: id },
      select: { id: true, file_url: true, file_name: true, is_published: true }
    });

    if (!doc) {
      return apiResponse({ message: "Dokumen tidak ditemukan." }, 404);
    }

    if (!doc.is_published) {
      return apiResponse({ message: "Dokumen belum dipublikasikan." }, 403);
    }

    if (!doc.file_url) {
      return apiResponse({ message: "URL file dokumen tidak tersedia." }, 404);
    }

    // Increment download count atomically
    await prisma.report_documents.update({
      where: { id: id },
      data: {
        download_count: {
          increment: 1
        }
      }
    });

    // Construct absolute URL if the path is relative
    let targetUrl = doc.file_url;
    if (targetUrl.startsWith("/")) {
      const baseUrl = new URL(request.url).origin;
      targetUrl = `${baseUrl}${targetUrl}`;
    }
    
    // Instead of forcing download through streams (since file could be in R2/S3),
    // redirecting is the easiest way. If the user wants a forced download,
    // they can add ?download=true to the target URL, or the client can handle it.
    // Given the previous setup, redirect is safe.

    const response = NextResponse.redirect(targetUrl);
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "*");
    return response;
  } catch (error) {
    console.error("GET Laporan Download Redirect Error:", error);
    return apiResponse(
      {
        message: error?.message || "Terjadi kesalahan saat mengunduh dokumen.",
      },
      500,
    );
  }
}
