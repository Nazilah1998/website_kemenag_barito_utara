import { apiResponse, getSafeIdFromContext } from "@/lib/api-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import {
  buildSafePdfFilename,
  validateDocumentPayload,
  validatePdfFile,
} from "@/lib/laporan-upload-validation";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import { broadcastRefresh } from "@/lib/realtime-service";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/drizzle";
import { report_documents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logError } from "@/lib/logger";

// Supabase replacements
import { createAdminClient } from "@/lib/supabase/admin";
import { LAPORAN_DOCUMENTS_BUCKET } from "@/lib/storage-media";

export const dynamic = "force-dynamic";

function buildStoragePath(filename) {
  return `laporan/files/${filename}`;
}

export async function PUT(request, context) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const id = await getSafeIdFromContext(context);
    if (!id) {
      return apiResponse({ message: "ID dokumen tidak valid." }, 400);
    }

    const [existingDoc] = await db
      .select()
      .from(report_documents)
      .where(eq(report_documents.id, id))
      .limit(1);

    if (!existingDoc) {
      return apiResponse({ message: "Dokumen tidak ditemukan." }, 404);
    }

    const contentType = request.headers.get("content-type") || "";
    let payload = {};
    let replacementFileData = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      const validation = validateDocumentPayload({
        title: formData.get("title"),
        description: formData.get("description"),
        year: formData.get("year"),
        is_published: formData.get("is_published") === "true",
      });

      if (!validation.ok) {
        return apiResponse({ message: validation.message }, 400);
      }

      payload = validation.data;

      const file = formData.get("file");

      if (file && typeof file === "object" && Number(file.size || 0) > 0) {
        const fileValidation = validatePdfFile(file);

        if (!fileValidation.ok) {
          return apiResponse({ message: fileValidation.message }, 400);
        }

        const safeFilename = buildSafePdfFilename(
          file.name,
          existingDoc?.title || "dokumen-laporan",
        );

        const storagePath = buildStoragePath(safeFilename);
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Supabase Storage
        const supabase = createAdminClient();
        const { error: uploadError } = await supabase.storage.from(LAPORAN_DOCUMENTS_BUCKET).upload(storagePath, buffer, {
          contentType: "application/pdf",
          upsert: true,
        });
        
        if (uploadError) {
          throw new Error(`Gagal upload PDF ke Supabase: ${uploadError.message}`);
        }
        
        const { data: publicUrlData } = supabase.storage.from(LAPORAN_DOCUMENTS_BUCKET).getPublicUrl(storagePath);
        const fileUrl = publicUrlData?.publicUrl || "";

        replacementFileData = {
          file_name: safeFilename,
          file_path: storagePath,
          file_url: fileUrl,
          mime_type: "application/pdf",
          file_size: file.size || 0,
        };
      }
    } else {
      const body = await request.json();

      const validation = validateDocumentPayload({
        title: body?.title,
        description: body?.description,
        year: body?.year,
        is_published: body?.is_published,
      });

      if (!validation.ok) {
        return apiResponse({ message: validation.message }, 400);
      }

      payload = validation.data;
    }

    const updatePayload = {
      ...payload,
      year: payload.year !== undefined && payload.year !== null && payload.year !== '' ? Number(payload.year) : null,
      ...(replacementFileData || {}),
      updated_at: new Date(),
    };

    const [updatedDoc] = await db
      .update(report_documents)
      .set(updatePayload)
      .where(eq(report_documents.id, id))
      .returning();

    if (replacementFileData && existingDoc?.file_path) {
      const supabase = createAdminClient();
      await supabase.storage.from(LAPORAN_DOCUMENTS_BUCKET).remove([existingDoc.file_path]);
    }

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.UPDATE,
      entity: AUDIT_ENTITIES.LAPORAN_DOKUMEN,
      entityId: id,
      summary: `Memperbarui dokumen laporan "${updatedDoc?.title || existingDoc?.title || id}"`,
      before: existingDoc,
      after: updatedDoc,
      request,
    });

    revalidatePath("/laporan", "layout");
    broadcastRefresh("laporan");

    return apiResponse({
      message: "Dokumen berhasil diperbarui.",
      document: updatedDoc,
    });
  } catch (error) {
    logError("laporan_id_put_error", { error: error?.message });
    return apiResponse(
      { message: error?.message || "Terjadi kesalahan saat memperbarui dokumen." },
      500,
    );
  }
}

export async function DELETE(request, context) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const id = await getSafeIdFromContext(context);
    if (!id) {
      return apiResponse({ message: "ID dokumen tidak valid." }, 400);
    }

    const [existingDoc] = await db
      .select()
      .from(report_documents)
      .where(eq(report_documents.id, id))
      .limit(1);

    if (!existingDoc) {
      return apiResponse({ message: "Dokumen tidak ditemukan." }, 404);
    }

    await db.delete(report_documents).where(eq(report_documents.id, id));

    if (existingDoc.file_path) {
      const supabase = createAdminClient();
      await supabase.storage.from(LAPORAN_DOCUMENTS_BUCKET).remove([existingDoc.file_path]);
    }

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.DELETE,
      entity: AUDIT_ENTITIES.LAPORAN_DOKUMEN,
      entityId: id,
      summary: `Menghapus dokumen laporan "${existingDoc?.title || id}"`,
      before: existingDoc,
      request,
    });

    revalidatePath("/laporan", "layout");
    broadcastRefresh("laporan");

    return apiResponse({
      message: "Dokumen berhasil dihapus.",
    });
  } catch (error) {
    logError("laporan_id_delete_error", { error: error?.message });
    return apiResponse(
      { message: error?.message || "Terjadi kesalahan saat menghapus dokumen." },
      500,
    );
  }
}
