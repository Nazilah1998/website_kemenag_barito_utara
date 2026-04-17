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
      logWarn("admin_laporan_upload_invalid_payload", {
        adminUserId: guard.user?.id || null,
        categoryId: categoryId || null,
        categorySlug: categorySlug || null,
        reason: payloadValidation.message,
      });

      return NextResponse.json(
        { message: payloadValidation.message },
        { status: 400 },
      );
    }

    const fileValidation = validatePdfFile(file);

    if (!fileValidation.ok) {
      logWarn("admin_laporan_upload_invalid_file", {
        adminUserId: guard.user?.id || null,
        categoryId: categoryId || null,
        categorySlug: categorySlug || null,
        reason: fileValidation.message,
        fileName: file?.name || null,
        fileType: file?.type || null,
        fileSize: file?.size || null,
      });

      return NextResponse.json(
        { message: fileValidation.message },
        { status: 400 },
      );
    }

    if (!categoryId && !categorySlug) {
      logWarn("admin_laporan_upload_missing_category", {
        adminUserId: guard.user?.id || null,
      });

      return NextResponse.json(
        { message: "Kategori dokumen tidak valid." },
        { status: 400 },
      );
    }

    let category = null;

    if (categoryId) {
      const { data, error } = await guard.supabase
        .from("report_categories")
        .select("id, slug, title, is_active")
        .eq("id", categoryId)
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("[upload] category lookup by id error:", error);
      }

      if (data) {
        category = data;
      }
    }

    if (!category && categorySlug) {
      const { data, error } = await guard.supabase
        .from("report_categories")
        .select("id, slug, title, is_active")
        .eq("slug", categorySlug)
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("[upload] category lookup by slug error:", error);
      }

      if (data) {
        category = data;
      }
    }

    if (!category) {
      console.error("[upload] category not found", {
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

    const insertPayload = {
      id: crypto.randomUUID(),
      category_id: category.id,
      title: payloadValidation.data.title,
      description: payloadValidation.data.description,
      year: payloadValidation.data.year,
      is_published: payloadValidation.data.is_published,
      file_name: filename,
      file_path: storagePath,
      file_url: publicUrlData?.publicUrl || "",
      file_size: file.size,
      mime_type: "application/pdf",
      sort_order: 0,
      created_by: guard.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      view_count: 0,
    };

    const { data: document, error: insertError } = await guard.supabase
      .from("report_documents")
      .insert(insertPayload)
      .select("*")
      .single();

    if (insertError) {
      logError("admin_laporan_upload_insert_error", {
        adminUserId: guard.user?.id || null,
        categoryId: category.id,
        storagePath,
        message: insertError.message,
      });

      return NextResponse.json(
        { message: "Gagal menyimpan metadata dokumen." },
        { status: 500 },
      );
    }

    logInfo("admin_laporan_upload_success", {
      adminUserId: guard.user?.id || null,
      categoryId: category.id,
      documentId: document?.id || null,
      fileSize: file.size,
      storagePath,
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
      { message: error?.message || "Terjadi kesalahan pada proses upload." },
      { status: 500 },
    );
  }
}
