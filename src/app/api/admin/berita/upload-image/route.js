import { validateAdmin } from "@/lib/cms-utils";
import { uploadBase64Image } from "@/lib/storage-media";
import { apiResponse } from "@/lib/api-helpers";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const adminUser = await validateAdmin(["create:berita", "update:berita"], request);
    if (!adminUser) {
      return apiResponse({ error: "Unauthorized", code: "UNAUTHORIZED" }, 401);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return apiResponse({ error: "Invalid JSON format." }, 400);
    }

    const { image_base64 } = body;

    if (!image_base64) {
      return apiResponse({ error: "Gambar tidak boleh kosong." }, 400);
    }

    // Upload to Supabase CMS bucket under 'berita-content'
    const uploaded = await uploadBase64Image({
      dataUrl: image_base64,
      folder: "berita-content",
      fileNameStem: "inline",
    });

    return apiResponse({ 
      ok: true, 
      url: uploaded.publicUrl 
    });
  } catch (error) {
    logError("upload_image_inline_error", {
      error: error.message,
    });

    const status = error.status || 500;
    const message = error.message || "Terjadi kesalahan internal server.";

    return apiResponse(
      {
        error: message,
        code: status === 500 ? "INTERNAL_ERROR" : "BAD_REQUEST",
      },
      status
    );
  }
}
