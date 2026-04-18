// src/app/api/admin/laporan/upload/route.js

import { NextResponse } from "next/server";
import { requireAdminAccess } from "@/lib/admin-guard";
import {
  buildSafePdfFilename,
  validateDocumentPayload,
  validatePdfFile,
} from "@/lib/laporan-upload-validation";
import { logError, logInfo, logWarn } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const guard = await requireAdminAccess();

  if (!guard.ok) {
    logWarn("admin_laporan_upload_denied", {
      status: guard.status,
      reason: guard.message,
    });
    return NextResponse.json(
      { message: guard.message },
      { status: guard.status },
    );
  }

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
      return NextResponse.json(
        { message: payloadValidation.message },
        { status: 400 },
      );
    }

    const fileValidation = validatePdfFile(file);
    if (!fileValidation.ok) {
      return NextResponse.json(
        { message: fileValidation.message },
        { status: 400 },
      );
    }

    if (!categoryId && !categorySlug) {
      return NextResponse.json(
        { message: "Kategori dokumen tidak valid." },
        { status: 400 },
      );
    }

    let category = null;

    if (categoryId) {
      const { data } = await guard.supabase
        .from("report_categories")
        .select("id, slug, title, is_active")
        .eq("id", categoryId)
        .eq("is_active", true)
        .maybeSingle();
      if (data) category = data;
    }

    if (!category && categorySlug) {
      const { data } = await guard.supabase
        .from("report_categories")
        .select("id, slug, title, is_active")
        .eq("slug", categorySlug)
        .eq("is_active", true)
        .maybeSingle();
      if (data) category = data;
    }

    if (!category) {
      logWarn("admin_laporan_upload_category_not_found", {
        adminUserId: guard.user?.id || null,
        categoryId,
        categorySlug,
      });
      return NextResponse.json(
        { message: "Kategori dokumen tidak ditemukan." },
        { status: 404 },
      );
    }

    const filename = buildSafePdfFilename(file.name, category.slug);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const storagePath = `laporan/${category.slug}/${filename}`;

    const { error: uploadError } = await guard.supabase.storage
      .from("laporan-documents")
      .upload(storagePath, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      logError("admin_laporan_upload_storage_error", {
        adminUserId: guard.user?.id || null,
        categoryId: category.id,
        storagePath,
        message: uploadError.message,
      });
      return NextResponse.json(
        { message: "Gagal mengupload file dokumen." },
        { status: 500 },
      );
    }

    const { data: publicUrlData } = guard.supabase.storage
      .from("laporan-documents")
      .getPublicUrl(storagePath);

    const fileUrl = publicUrlData?.publicUrl || "";

    // BUG FIX: insert ke tabel yang benar
    const { data: document, error: insertError } = await guard.supabase
      .from("report_documents")
      .insert({
        category_id: category.id,
        title: payloadValidation.data.title,
        description: payloadValidation.data.description || null,
        year: payloadValidation.data.year || null,
        is_published: payloadValidation.data.is_published,
        file_name: filename,
        file_path: storagePath,
        file_url: fileUrl,
        mime_type: "application/pdf",
        file_size: file.size,
        sort_order: 0,
        view_count: 0,
        created_by: guard.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (insertError) {
      // Rollback: hapus file yang sudah terupload
      await guard.supabase.storage
        .from("laporan-documents")
        .remove([storagePath]);

      logError("admin_laporan_upload_insert_error", {
        adminUserId: guard.user?.id || null,
        categoryId: category.id,
        message: insertError.message,
      });
      return NextResponse.json(
        { message: "Gagal menyimpan data dokumen." },
        { status: 500 },
      );
    }

    logInfo("admin_laporan_upload_success", {
      adminUserId: guard.user?.id || null,
      documentId: document.id,
      categoryId: category.id,
      isPublished: document.is_published,
    });

    return NextResponse.json({
      message: "Dokumen berhasil diupload.",
      document,
    });
  } catch (error) {
    logError("admin_laporan_upload_unhandled_error", {
      adminUserId: guard.user?.id || null,
      message: error?.message || "Unknown error",
    });
    return NextResponse.json(
      {
        message: error?.message || "Terjadi kesalahan saat mengupload dokumen.",
      },
      { status: 500 },
    );
  }
}
