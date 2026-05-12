import { apiResponse, getSafeIdFromContext } from "@/lib/prisma-helpers";
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

const STORAGE_BUCKET = "laporan-documents";

function buildStoragePath(filename) {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `laporan/${year}/${month}/${filename}`;
}

export async function PUT(request, context) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const id = await getSafeIdFromContext(context);
    if (!id) {
      return apiResponse({ message: "ID dokumen tidak valid." }, 400);
    }

    const existingDoc = await prisma.report_documents.findUnique({
      where: { id: id }
    });

    if (!existingDoc) {
      return apiResponse({ message: "Dokumen tidak ditemukan." }, 404);
    }

    const contentType = request.headers.get("content-type") || "";
    let payload = {};
    let replacementFileData = null;
    const supabase = createAdminClient();

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

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(storagePath, buffer, {
            contentType: "application/pdf",
            upsert: false,
          });

        if (uploadError) {
          return apiResponse({ message: "Gagal mengupload file PDF pengganti." }, 500);
        }

        const { data: publicFile } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(storagePath);

        replacementFileData = {
          file_name: safeFilename,
          file_path: storagePath,
          file_url: publicFile?.publicUrl || "",
          mime_type: "application/pdf",
          file_size: BigInt(file.size || 0),
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
      year: payload.year ? Number(payload.year) : null,
      ...(replacementFileData || {}),
      updated_at: new Date(),
    };

    const updatedDoc = await prisma.report_documents.update({
      where: { id: id },
      data: updatePayload
    });

    if (replacementFileData && existingDoc?.file_path) {
      await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([existingDoc.file_path]);
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

    return apiResponse({
      message: "Dokumen berhasil diperbarui.",
      document: updatedDoc,
    });
  } catch (error) {
    console.error("PUT Laporan [id] Error:", error);
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

    const existingDoc = await prisma.report_documents.findUnique({
      where: { id: id }
    });

    if (!existingDoc) {
      return apiResponse({ message: "Dokumen tidak ditemukan." }, 404);
    }

    await prisma.report_documents.delete({
      where: { id: id }
    });

    if (existingDoc.file_path) {
      const supabase = createAdminClient();
      await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([existingDoc.file_path]);
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

    return apiResponse({
      message: "Dokumen berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE Laporan [id] Error:", error);
    return apiResponse(
      { message: error?.message || "Terjadi kesalahan saat menghapus dokumen." },
      500,
    );
  }
}
