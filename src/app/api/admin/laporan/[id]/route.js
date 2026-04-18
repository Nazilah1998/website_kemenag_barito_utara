// src/app/api/admin/laporan/[id]/route.js

import { NextResponse } from "next/server";
import { requireAdminAccess } from "@/lib/admin-guard";
import {
  buildSafePdfFilename,
  validateDocumentPayload,
  validatePdfFile,
} from "@/lib/laporan-upload-validation";

export const dynamic = "force-dynamic";

const STORAGE_BUCKET = "laporan-documents";

function buildStoragePath(filename) {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `laporan/${year}/${month}/${filename}`;
}

export async function PUT(request, context) {
  const guard = await requireAdminAccess();

  if (!guard.ok) {
    return NextResponse.json(
      { message: guard.message },
      { status: guard.status },
    );
  }

  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "ID dokumen tidak valid." },
        { status: 400 },
      );
    }

    const { data: existingDoc, error: existingError } = await guard.supabase
      .from("report_documents")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (existingError || !existingDoc) {
      return NextResponse.json(
        { message: "Dokumen tidak ditemukan." },
        { status: 404 },
      );
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
        return NextResponse.json(
          { message: validation.message },
          { status: 400 },
        );
      }

      payload = validation.data;

      const file = formData.get("file");

      if (file && typeof file === "object" && Number(file.size || 0) > 0) {
        const fileValidation = validatePdfFile(file);

        if (!fileValidation.ok) {
          return NextResponse.json(
            { message: fileValidation.message },
            { status: 400 },
          );
        }

        const safeFilename = buildSafePdfFilename(
          file.name,
          existingDoc?.title || "dokumen-laporan",
        );

        const storagePath = buildStoragePath(safeFilename);
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const { error: uploadError } = await guard.supabase.storage
          .from(STORAGE_BUCKET)
          .upload(storagePath, buffer, {
            contentType: "application/pdf",
            upsert: false,
          });

        if (uploadError) {
          return NextResponse.json(
            { message: "Gagal mengupload file PDF pengganti." },
            { status: 500 },
          );
        }

        const { data: publicFile } = guard.supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(storagePath);

        replacementFileData = {
          file_name: safeFilename,
          file_path: storagePath,
          file_url: publicFile?.publicUrl || "",
          mime_type: "application/pdf",
          file_size: Number(file.size || 0),
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
        return NextResponse.json(
          { message: validation.message },
          { status: 400 },
        );
      }

      payload = validation.data;
    }

    const updatePayload = {
      ...payload,
      ...(replacementFileData || {}),
      updated_at: new Date().toISOString(),
    };

    const { data: updatedDoc, error: updateError } = await guard.supabase
      .from("report_documents")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json(
        { message: "Gagal memperbarui dokumen laporan." },
        { status: 500 },
      );
    }

    if (replacementFileData && existingDoc?.file_path) {
      await guard.supabase.storage
        .from(STORAGE_BUCKET)
        .remove([existingDoc.file_path]);
    }

    return NextResponse.json({
      message: "Dokumen berhasil diperbarui.",
      document: updatedDoc,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error?.message || "Terjadi kesalahan saat memperbarui dokumen.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request, context) {
  const guard = await requireAdminAccess();

  if (!guard.ok) {
    return NextResponse.json(
      { message: guard.message },
      { status: guard.status },
    );
  }

  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "ID dokumen tidak valid." },
        { status: 400 },
      );
    }

    const { data: existingDoc, error: existingError } = await guard.supabase
      .from("report_documents")
      .select("id, file_path")
      .eq("id", id)
      .maybeSingle();

    if (existingError || !existingDoc) {
      return NextResponse.json(
        { message: "Dokumen tidak ditemukan." },
        { status: 404 },
      );
    }

    const { error: deleteError } = await guard.supabase
      .from("report_documents")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json(
        { message: "Gagal menghapus dokumen laporan." },
        { status: 500 },
      );
    }

    if (existingDoc.file_path) {
      await guard.supabase.storage
        .from(STORAGE_BUCKET)
        .remove([existingDoc.file_path]);
    }

    return NextResponse.json({
      message: "Dokumen berhasil dihapus.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error?.message || "Terjadi kesalahan saat menghapus dokumen.",
      },
      { status: 500 },
    );
  }
}
