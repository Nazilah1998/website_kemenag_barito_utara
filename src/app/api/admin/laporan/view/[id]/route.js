// src/app/api/laporan/view/[id]/route.js

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(_request, context) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "ID dokumen tidak valid." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { data: doc, error: docError } = await supabase
      .from("report_documents")
      .select("id, file_url, is_published, view_count")
      .eq("id", id)
      .maybeSingle();

    if (docError || !doc) {
      return NextResponse.json(
        { message: "Dokumen tidak ditemukan." },
        { status: 404 },
      );
    }

    if (!doc.is_published) {
      return NextResponse.json(
        { message: "Dokumen belum dipublikasikan." },
        { status: 403 },
      );
    }

    if (!doc.file_url) {
      return NextResponse.json(
        { message: "File dokumen tidak tersedia." },
        { status: 404 },
      );
    }

    const nextViewCount = Number(doc.view_count || 0) + 1;

    await supabase
      .from("report_documents")
      .update({
        view_count: nextViewCount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    return NextResponse.redirect(doc.file_url, 302);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error?.message || "Terjadi kesalahan saat mencatat view dokumen.",
      },
      { status: 500 },
    );
  }
}
