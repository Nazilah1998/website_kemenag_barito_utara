import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateAdmin } from "@/lib/cms-utils";
import { PERMISSIONS } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const table = "kontak_pesan";

function createNoStoreResponse(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

export async function GET() {
  const auth = await validateAdmin({
    allowEditor: true,
    permission: PERMISSIONS.KONTAK_MANAGE,
  });
  if (!auth.ok) return auth.response;

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return createNoStoreResponse({
      items: data ?? [],
    });
  } catch (error) {
    return createNoStoreResponse(
      {
        message: error.message || "Gagal mengambil daftar pesan.",
      },
      error.status || 500,
    );
  }
}

export async function PATCH(request) {
  const auth = await validateAdmin({
    allowEditor: true,
    permission: PERMISSIONS.KONTAK_MANAGE,
  });
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return createNoStoreResponse(
        { message: "ID dan status wajib diisi." },
        400,
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from(table)
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return createNoStoreResponse(
      {
        message: "Status pesan berhasil diperbarui.",
        item: data,
      },
      200,
    );
  } catch (error) {
    return createNoStoreResponse(
      {
        message: error.message || "Gagal memperbarui status pesan.",
      },
      error.status || 500,
    );
  }
}

export async function DELETE(request) {
  const auth = await validateAdmin({
    allowEditor: true,
    permission: PERMISSIONS.KONTAK_MANAGE,
  });
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return createNoStoreResponse({ message: "ID pesan wajib diisi." }, 400);
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) throw error;

    return createNoStoreResponse({ message: "Pesan berhasil dihapus." });
  } catch (error) {
    return createNoStoreResponse(
      {
        message: error.message || "Gagal menghapus pesan.",
      },
      500,
    );
  }
}
