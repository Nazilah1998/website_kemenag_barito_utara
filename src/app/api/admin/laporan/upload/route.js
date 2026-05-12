import { apiResponse } from "@/lib/prisma-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  buildSafePdfFilename,
  validateDocumentPayload,
  validatePdfFile,
} from "@/lib/laporan-upload-validation";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import prisma from "@/lib/prisma";

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
      category = await prisma.report_categories.findFirst({
        where: { id: categoryId, is_active: true }
      });
    }

    if (!category && categorySlug) {
      category = await prisma.report_categories.findFirst({
        where: { slug: categorySlug, is_active: true }
      });
    }

    if (!category) {
      return apiResponse({ message: "Kategori dokumen tidak ditemukan." }, 404);
    }

    const filename = buildSafePdfFilename(file.name, category.slug);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const storagePath = `laporan/${category.slug}/${filename}`;
    const supabase = createAdminClient();

    const { error: uploadError } = await supabase.storage
      .from("laporan-documents")
      .upload(storagePath, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("admin_laporan_upload_storage_error", uploadError);
      return apiResponse({ message: "Gagal mengupload file dokumen." }, 500);
    }

    const { data: publicUrlData } = supabase.storage
      .from("laporan-documents")
      .getPublicUrl(storagePath);

    const fileUrl = publicUrlData?.publicUrl || "";

    const document = await prisma.report_documents.create({
      data: {
        category_id: category.id,
        title: payloadValidation.data.title,
        description: payloadValidation.data.description || null,
        year: payloadValidation.data.year || null,
        is_published: payloadValidation.data.is_published,
        file_name: filename,
        file_path: storagePath,
        file_url: fileUrl,
        mime_type: "application/pdf",
        file_size: BigInt(file.size || 0),
        sort_order: 0,
        view_count: BigInt(0),
        created_by: auth.session.user.id,
      }
    });

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.LAPORAN_DOKUMEN,
      entityId: document?.id,
      summary: `Menambah dokumen laporan "${document?.title || payloadValidation.data.title}"`,
      after: document,
      request,
    });

    return apiResponse({
      message: "Dokumen berhasil diupload.",
      document,
    });
  } catch (error) {
    console.error("admin_laporan_upload_unhandled_error", error);
    return apiResponse(
      { message: error?.message || "Terjadi kesalahan saat mengupload dokumen." },
      500,
    );
  }
}
