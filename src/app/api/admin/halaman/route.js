import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cleanString, ensureUniqueSlug, validateAdmin } from "@/lib/cms-utils";
import {
  ValidationError,
  cleanHtml,
  requireFields,
  validationErrorResponse,
} from "@/lib/validation";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import { PERMISSIONS } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const table = "static_pages";

const LIMITS = {
  title: { min: 3, max: 200 },
  description: { min: 0, max: 500 },
  content: { min: 10, max: 80_000 },
};

const selectFields = `
  id, slug, title, description, content, is_published, updated_at, created_at, author_id
`;

function normalizePayload(body, { isUpdate = false } = {}) {
  const required = isUpdate ? [] : ["title", "content"];
  requireFields(body, required);

  const title = cleanString(body.title);
  const content = cleanString(body.content);
  const description = cleanString(body.description || "");
  const slug = cleanString(body.slug || "");

  if (title.length < LIMITS.title.min || title.length > LIMITS.title.max) {
    throw new ValidationError(
      `Judul harus ${LIMITS.title.min}-${LIMITS.title.max} karakter.`,
      "title",
    );
  }

  const sanitizedContent = cleanHtml(content);
  const strippedLen = sanitizedContent.replace(/<[^>]+>/g, "").trim().length;
  if (strippedLen < LIMITS.content.min) {
    throw new ValidationError(
      `Konten minimal ${LIMITS.content.min} karakter.`,
      "content",
    );
  }
  if (sanitizedContent.length > LIMITS.content.max) {
    throw new ValidationError(
      `Konten terlalu panjang (maks ${LIMITS.content.max} karakter).`,
      "content",
    );
  }

  if (description.length > LIMITS.description.max) {
    throw new ValidationError(
      `Deskripsi terlalu panjang (maks ${LIMITS.description.max} karakter).`,
      "description",
    );
  }

  return {
    title,
    slug,
    description,
    content: sanitizedContent,
    is_published: Boolean(body.is_published),
  };
}

export async function GET() {
  try {
    const { error: authError } = await validateAdmin({
      permission: PERMISSIONS.HALAMAN_VIEW,
    });
    if (authError) return authError;

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from(table)
      .select(selectFields)
      .order("updated_at", { ascending: false })
      .limit(200);

    if (error) throw error;

    return NextResponse.json({ items: data || [] });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Gagal memuat halaman." },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { error: authError, session } = await validateAdmin({
      permission: PERMISSIONS.HALAMAN_CREATE,
    });
    if (authError) return authError;

    const body = await request.json().catch(() => ({}));

    let payload;
    try {
      payload = normalizePayload(body);
    } catch (err) {
      return validationErrorResponse(err);
    }

    const supabase = createAdminClient();
    const slug = await ensureUniqueSlug(
      supabase,
      table,
      payload.slug,
      payload.title,
    );

    const { data, error } = await supabase
      .from(table)
      .insert({
        ...payload,
        slug,
        author_id: session?.user?.id || null,
      })
      .select(selectFields)
      .single();

    if (error) throw error;

    await recordAudit({
      session,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.HALAMAN,
      entity_id: data.id,
      summary: `Halaman statis dibuat: ${data.title}`,
      after: data,
      request,
    });

    revalidatePath("/halaman/[slug]", "page");
    revalidatePath(`/halaman/${data.slug}`);

    return NextResponse.json({ item: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Gagal menyimpan halaman." },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const { error: authError, session } = await validateAdmin({
      permission: PERMISSIONS.HALAMAN_UPDATE,
    });
    if (authError) return authError;

    const body = await request.json().catch(() => ({}));
    const id = cleanString(body.id);

    if (!id) {
      return NextResponse.json(
        { message: "ID halaman wajib diisi." },
        { status: 400 },
      );
    }

    let payload;
    try {
      payload = normalizePayload(body, { isUpdate: true });
    } catch (err) {
      return validationErrorResponse(err);
    }

    const supabase = createAdminClient();

    const { data: before, error: beforeError } = await supabase
      .from(table)
      .select(selectFields)
      .eq("id", id)
      .maybeSingle();
    if (beforeError) throw beforeError;
    if (!before) {
      return NextResponse.json(
        { message: "Halaman tidak ditemukan." },
        { status: 404 },
      );
    }

    let finalSlug = before.slug;
    if (payload.slug && payload.slug !== before.slug) {
      finalSlug = await ensureUniqueSlug(
        supabase,
        table,
        payload.slug,
        payload.title,
        id,
      );
    }

    const { data, error } = await supabase
      .from(table)
      .update({
        ...payload,
        slug: finalSlug,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(selectFields)
      .single();

    if (error) throw error;

    await recordAudit({
      session,
      action: AUDIT_ACTIONS.UPDATE,
      entity: AUDIT_ENTITIES.HALAMAN,
      entity_id: data.id,
      summary: `Halaman statis diperbarui: ${data.title}`,
      before,
      after: data,
      request,
    });

    revalidatePath(`/halaman/${data.slug}`);
    if (before.slug && before.slug !== data.slug) {
      revalidatePath(`/halaman/${before.slug}`);
    }

    return NextResponse.json({ item: data });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Gagal memperbarui halaman." },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { error: authError, session } = await validateAdmin({
      permission: PERMISSIONS.HALAMAN_DELETE,
    });
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const id = cleanString(searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        { message: "ID halaman wajib diisi." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { data: before, error: beforeError } = await supabase
      .from(table)
      .select(selectFields)
      .eq("id", id)
      .maybeSingle();
    if (beforeError) throw beforeError;
    if (!before) {
      return NextResponse.json(
        { message: "Halaman tidak ditemukan." },
        { status: 404 },
      );
    }

    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw error;

    await recordAudit({
      session,
      action: AUDIT_ACTIONS.DELETE,
      entity: AUDIT_ENTITIES.HALAMAN,
      entity_id: id,
      summary: `Halaman statis dihapus: ${before.title}`,
      before,
      request,
    });

    revalidatePath(`/halaman/${before.slug}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "Gagal menghapus halaman." },
      { status: 500 },
    );
  }
}
