import { NextResponse } from "next/server";
import { requireAdminAccess } from "@/lib/admin-guard";
import { validateDocumentPayload } from "@/lib/laporan-upload-validation";
import { logError, logInfo, logWarn } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function PUT(request, context) {
  const guard = await requireAdminAccess();

  if (!guard.ok) {
    logWarn("admin_laporan_update_denied", {
      status: guard.status,
      reason: guard.message,
    });

    return NextResponse.json(
      { message: guard.message },
      { status: guard.status },
    );
  }

  try {
    const { id } = await context.params;
    const payload = await request.json();

    if (!id) {
      logWarn("admin_laporan_update_invalid_id", {
        adminUserId: guard.user?.id || null,
      });

      return NextResponse.json(
        { message: "ID dokumen tidak valid." },
        { status: 400 },
      );
    }

    const validation = validateDocumentPayload(payload);

    if (!validation.ok) {
      logWarn("admin_laporan_update_invalid_payload", {
        adminUserId: guard.user?.id || null,
        documentId: id,
        reason: validation.message,
      });

      return NextResponse.json(
        { message: validation.message },
        { status: 400 },
      );
    }

    const { data: existing, error: existingError } = await guard.supabase
      .from("laporan_documents")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (existingError || !existing) {
      logWarn("admin_laporan_update_not_found", {
        adminUserId: guard.user?.id || null,
        documentId: id,
      });

      return NextResponse.json(
        { message: "Dokumen tidak ditemukan." },
        { status: 404 },
      );
    }

    const updatePayload = {
      ...validation.data,
      updated_by: guard.user.id,
      updated_at: new Date().toISOString(),
    };

    const { data: document, error: updateError } = await guard.supabase
      .from("laporan_documents")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      logError("admin_laporan_update_query_error", {
        adminUserId: guard.user?.id || null,
        documentId: id,
        message: updateError.message,
      });

      return NextResponse.json(
        { message: "Gagal memperbarui dokumen." },
        { status: 500 },
      );
    }

    logInfo("admin_laporan_update_success", {
      adminUserId: guard.user?.id || null,
      documentId: id,
      isPublished: document?.is_published ?? null,
    });

    return NextResponse.json({
      message: "Dokumen berhasil diperbarui.",
      document,
    });
  } catch (error) {
    logError("admin_laporan_update_unhandled_error", {
      adminUserId: guard.user?.id || null,
      message: error?.message || "Unknown error",
    });

    return NextResponse.json(
      { message: error?.message || "Terjadi kesalahan saat update dokumen." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request, context) {
  const guard = await requireAdminAccess();

  if (!guard.ok) {
    logWarn("admin_laporan_delete_denied", {
      status: guard.status,
      reason: guard.message,
    });

    return NextResponse.json(
      { message: guard.message },
      { status: guard.status },
    );
  }

  try {
    const { id } = await context.params;

    if (!id) {
      logWarn("admin_laporan_delete_invalid_id", {
        adminUserId: guard.user?.id || null,
      });

      return NextResponse.json(
        { message: "ID dokumen tidak valid." },
        { status: 400 },
      );
    }

    const { data: existing, error: existingError } = await guard.supabase
      .from("laporan_documents")
      .select("id, file_path")
      .eq("id", id)
      .maybeSingle();

    if (existingError || !existing) {
      logWarn("admin_laporan_delete_not_found", {
        adminUserId: guard.user?.id || null,
        documentId: id,
      });

      return NextResponse.json(
        { message: "Dokumen tidak ditemukan." },
        { status: 404 },
      );
    }

    if (existing.file_path) {
      const { error: storageDeleteError } = await guard.supabase.storage
        .from("documents")
        .remove([existing.file_path]);

      if (storageDeleteError) {
        logWarn("admin_laporan_delete_storage_warning", {
          adminUserId: guard.user?.id || null,
          documentId: id,
          filePath: existing.file_path,
          message: storageDeleteError.message,
        });
      }
    }

    const { error: deleteError } = await guard.supabase
      .from("laporan_documents")
      .delete()
      .eq("id", id);

    if (deleteError) {
      logError("admin_laporan_delete_query_error", {
        adminUserId: guard.user?.id || null,
        documentId: id,
        message: deleteError.message,
      });

      return NextResponse.json(
        { message: "Gagal menghapus dokumen." },
        { status: 500 },
      );
    }

    logInfo("admin_laporan_delete_success", {
      adminUserId: guard.user?.id || null,
      documentId: id,
    });

    return NextResponse.json({
      message: "Dokumen berhasil dihapus.",
    });
  } catch (error) {
    logError("admin_laporan_delete_unhandled_error", {
      adminUserId: guard.user?.id || null,
      message: error?.message || "Unknown error",
    });

    return NextResponse.json(
      {
        message: error?.message || "Terjadi kesalahan saat menghapus dokumen.",
      },
      { status: 500 },
    );
  }
}
