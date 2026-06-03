import { apiResponse } from "@/lib/api-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import {
  buildSafePdfFilename,
  validateDocumentPayload,
  validatePdfFile,
} from "@/lib/laporan-upload-validation";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import { db } from "@/lib/drizzle";
import { report_categories, report_documents } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { broadcastRefresh } from "@/lib/realtime-service";
import { revalidatePath } from "next/cache";
import { logError } from "@/lib/logger";

// Supabase replacements
import { createAdminClient } from "@/lib/supabase/admin";
import { CMS_MEDIA_BUCKET } from "@/lib/storage-media";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const categoryId = String(formData.get("categoryId") || "").trim();
    const categorySlug = String(formData.get("categorySlug") || "").trim();

    const payloadValidation = validateDocumentPayload({
      title: formData.get("title"),
      description: formData.get("description"),
      year: formData.get("year"),
      is_published: formData.get("is_published") === "true",
    });

    if (!payloadValidation.ok) {
      return apiResponse({ message: payloadValidation.message }, 400);
    }

    const fileValidation = validatePdfFile(file);
    if (!fileValidation.ok) {
      return apiResponse({ message: fileValidation.message }, 400);
    }

    if (!categoryId && !categorySlug) {
      return apiResponse({ message: "Kategori dokumen tidak valid." }, 400);
    }

    let category = null;

    if (categoryId) {
      [category] = await db
        .select()
        .from(report_categories)
        .where(and(eq(report_categories.id, categoryId), eq(report_categories.is_active, true)))
        .limit(1);
    }

    if (!category && categorySlug) {
      [category] = await db
        .select()
        .from(report_categories)
        .where(and(eq(report_categories.slug, categorySlug), eq(report_categories.is_active, true)))
        .limit(1);
    }

    if (!category) {
      return apiResponse({ message: "Kategori dokumen tidak ditemukan." }, 404);
    }

    const filename = buildSafePdfFilename(file.name, category.slug);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const storagePath = `laporan/files/${filename}`;

    // Upload to Supabase Storage
    const supabase = createAdminClient();
    const { error: uploadError } = await supabase.storage.from(CMS_MEDIA_BUCKET).upload(storagePath, buffer, {
      contentType: "application/pdf",
      upsert: true,
    });
    
    if (uploadError) {
      throw new Error(`Gagal upload dokumen ke Supabase: ${uploadError.message}`);
    }
    
    const { data: publicUrlData } = supabase.storage.from(CMS_MEDIA_BUCKET).getPublicUrl(storagePath);
    const fileUrl = publicUrlData?.publicUrl || "";

    const [document] = await db
      .insert(report_documents)
      .values({
        category_id: category.id,
        title: payloadValidation.data.title,
        description: payloadValidation.data.description || null,
        year: payloadValidation.data.year || null,
        is_published: payloadValidation.data.is_published,
        file_name: filename,
        file_path: storagePath,
        file_url: fileUrl,
        mime_type: "application/pdf",
        file_size: file.size || 0,
        sort_order: 0,
        view_count: 0,
        created_by: auth.session.user.id,
      })
      .returning();

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.LAPORAN_DOKUMEN,
      entityId: document?.id,
      summary: `Menambah dokumen laporan "${document?.title || payloadValidation.data.title}"`,
      after: document,
      request,
    });

    revalidatePath("/laporan");
    broadcastRefresh("laporan");

    return apiResponse({
      message: "Dokumen berhasil diupload.",
      document,
    });
  } catch (error) {
    logError("laporan_upload_error", { error: error?.message });
    return apiResponse(
      { message: error?.message || "Terjadi kesalahan saat mengupload dokumen." },
      500,
    );
  }
}
