// src/app/api/laporan/view/[id]/route.js

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        { message: "ID dokumen tidak valid." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { data: doc, error: docError } = await supabase
      .from("report_documents")
      .select("id, file_url, is_published")
      .eq("id", id)
      .maybeSingle();

    if (docError) {
      return NextResponse.json(
        { message: docError.message || "Gagal memuat dokumen." },
        { status: 500 },
      );
    }

    if (!doc) {
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
        { message: "URL file dokumen tidak tersedia." },
        { status: 404 },
      );
    }

    await supabase.rpc("increment_report_document_view", {
      doc_id: id,
    });

    return NextResponse.redirect(doc.file_url);
  } catch (error) {
    return NextResponse.json(
      {
        message: error?.message || "Terjadi kesalahan saat membuka dokumen.",
      },
      { status: 500 },
    );
  }
}
