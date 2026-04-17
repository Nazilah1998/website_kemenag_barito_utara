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

const table = "pengumuman";

const LIMITS = {
  title: { min: 3, max: 200 },
  excerpt: { min: 10, max: 500 },
  content: { min: 10, max: 40_000 },
  category: { max: 80 },
};

const selectFields = `
  id,
  slug,
  title,
  excerpt,
  content,
  category,
  is_important,
  is_published,
  published_at,
  author_id,
  attachment_url,
  attachment_name,
  attachment_path,
  attachment_source,
  attachment_type,
  attachment_views,
  created_at,
  updated_at
`;

function createHttpError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function isGoogleDriveUrl(value = "") {
  try {
    const url = new URL(String(value || "").trim());
    return (
      url.protocol === "https:" &&
      (url.hostname === "drive.google.com" ||
        url.hostname === "docs.google.com")
    );
  } catch {
    return false;
  }
}

function normalizeAttachment(body) {
  const attachmentUrl = cleanString(body.attachment_url);

  if (!attachmentUrl) {
    return {
      attachment_url: null,
      attachment_name: null,
      attachment_path: null,
      attachment_source: null,
      attachment_type: null,
    };
  }

  if (!isGoogleDriveUrl(attachmentUrl)) {
    throw createHttpError(
      "Lampiran pengumuman hanya boleh memakai link Google Drive.",
      400,
    );
  }

  return {
    attachment_url: attachmentUrl,
    attachment_name: "Lampiran Pengumuman",
    attachment_path: null,
    attachment_source: "link",
    attachment_type: "link",
  };
}

function buildPayload(body) {
  const title = cleanString(body.title).slice(0, LIMITS.title.max);
  const excerpt = cleanString(body.excerpt).slice(0, LIMITS.excerpt.max);
  const rawContent = typeof body?.content === "string" ? body.content : "";
  const content = cleanHtml(rawContent, LIMITS.content.max);
  const category =
    cleanString(body.category).slice(0, LIMITS.category.max) || "Informasi";
  const isImportant = Boolean(body.is_important);
  const isPublished = Boolean(body.is_published);
  const publishedAtInput = cleanString(body.published_at);

  requireFields({}, [
    {
      field: "title",
      label: "Judul pengumuman",
      value: title,
      min: LIMITS.title.min,
      max: LIMITS.title.max,
    },
    {
      field: "excerpt",
      label: "Ringkasan pengumuman",
      value: excerpt,
      min: LIMITS.excerpt.min,
      max: LIMITS.excerpt.max,
    },
    {
      field: "content",
      label: "Isi pengumuman",
      value: content.replace(/<[^>]*>/g, " ").trim(),
      min: LIMITS.content.min,
    },
  ]);

  const publishedAt = publishedAtInput
    ? new Date(publishedAtInput)
    : new Date();

  if (Number.isNaN(publishedAt.getTime())) {
    throw createHttpError("Tanggal publish pengumuman tidak valid.");
  }

  return {
    title,
    excerpt,
    content,
    category,
    is_important: isImportant,
    is_published: isPublished,
    published_at: publishedAt.toISOString(),
    ...normalizeAttachment(body),
  };
}

function revalidatePengumumanPaths(slug) {
  revalidatePath("/");
  revalidatePath("/pengumuman");
  revalidatePath("/admin/pengumuman");

  if (slug) {
    revalidatePath(`/pengumuman/${slug}`);
  }
}

export async function GET() {
  const auth = await validateAdmin({
    allowEditor: true,
    permission: PERMISSIONS.PENGUMUMAN_VIEW,
  });

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from(table)
      .select(selectFields)
      .order("is_important", { ascending: false })
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ items: data ?? [] });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Gagal mengambil daftar pengumuman." },
      { status: error.status || 500 },
    );
  }
}

export async function POST(request) {
  const auth = await validateAdmin({
    allowEditor: true,
    permission: PERMISSIONS.PENGUMUMAN_CREATE,
  });

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const supabase = createAdminClient();
    const payload = buildPayload(body);

    const slug = await ensureUniqueSlug(
      supabase,
      table,
      cleanString(body.slug),
      payload.title,
    );

    const { data, error } = await supabase
      .from(table)
      .insert({
        ...payload,
        slug,
        author_id: auth.session.profile?.id ?? null,
      })
      .select(selectFields)
      .single();

    if (error) {
      throw error;
    }

    revalidatePengumumanPaths(data?.slug);

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.PENGUMUMAN,
      entityId: data?.id,
      summary: `Menambah pengumuman \"${data?.title || payload.title}\"`,
      after: { slug: data?.slug, is_published: data?.is_published },
      request,
    });

    return NextResponse.json(
      {
        message: "Pengumuman berhasil ditambahkan.",
        item: data,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      const resp = validationErrorResponse(error);
      return NextResponse.json(resp.body, { status: resp.status });
    }
    return NextResponse.json(
      { message: error.message || "Gagal menambahkan pengumuman." },
      { status: error.status || 500 },
    );
  }
}
