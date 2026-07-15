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
import { LAPORAN_DOCUMENTS_BUCKET } from "@/lib/storage-media";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const formData = await request.formData();
    const files = formData.getAll("files");
    const categoryId = String(formData.get("categoryId") || "").trim();
    const categorySlug = String(formData.get("categorySlug") || "").trim();

    if (!files || files.length === 0) {
      return apiResponse({ message: "File PDF wajib dipilih." }, 400);
    }

    const payloadValidation = validateDocumentPayload({
      title: formData.get("title"),
      description: formData.get("description"),
      year: formData.get("year"),
      is_published: formData.get("is_published") === "true",
    }, { requireTitle: files.length === 1 });

    if (!payloadValidation.ok) {
      return apiResponse({ message: payloadValidation.message }, 400);
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

    const supabase = createAdminClient();
    const uploadedDocs = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileValidation = validatePdfFile(file);
      
      if (!fileValidation.ok) {
        logError("laporan_bulk_upload_skip", { file: file.name, reason: fileValidation.message });
        continue; // Skip invalid files
      }

      // Generate title
      let finalTitle = payloadValidation.data.title;
      if (files.length > 1) {
         if (finalTitle) {
           finalTitle = `${finalTitle} - Bagian ${i + 1}`;
         } else {
           finalTitle = file.name.replace(/\.[^/.]+$/, ""); // use filename without extension
         }
      }

      const filename = buildSafePdfFilename(file.name, `${category.slug}-${Date.now()}`);
      const storagePath = `laporan/files/${filename}`;

      const { error: uploadError } = await supabase.storage.from(LAPORAN_DOCUMENTS_BUCKET).upload(storagePath, file, {
        contentType: "application/pdf",
        upsert: true,
      });
      
      if (uploadError) {
        logError("laporan_supabase_upload_error", { error: uploadError.message });
        continue;
      }
      
      const { data: publicUrlData } = supabase.storage.from(LAPORAN_DOCUMENTS_BUCKET).getPublicUrl(storagePath);
      const fileUrl = publicUrlData?.publicUrl || "";

      const [document] = await db
        .insert(report_documents)
        .values({
          category_id: category.id,
          title: finalTitle.slice(0, 180), // limit length
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

      uploadedDocs.push(document);
    }

    if (uploadedDocs.length === 0) {
      return apiResponse({ message: "Tidak ada dokumen yang berhasil diunggah." }, 400);
    }

    // Only audit log once for the bulk action
    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.LAPORAN_DOKUMEN,
      entityId: uploadedDocs[0]?.id,
      summary: `Menambah ${uploadedDocs.length} dokumen laporan pada kategori "${category.name}"`,
      after: { documents: uploadedDocs.map(d => d.id) },
      request,
    });

    revalidatePath("/laporan", "layout");
    broadcastRefresh("laporan");

    return apiResponse({
      message: `${uploadedDocs.length} Dokumen berhasil diupload.`,
      document: uploadedDocs[0], // backward compatibility for UI expecting single doc
      documents: uploadedDocs, // new bulk format
    });
  } catch (error) {
    logError("laporan_upload_error", { error: error?.message });
    return apiResponse(
      { message: error?.message || "Terjadi kesalahan saat mengupload dokumen." },
      500,
    );
  }
}
