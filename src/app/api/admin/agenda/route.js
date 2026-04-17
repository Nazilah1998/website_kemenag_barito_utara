import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cleanString, ensureUniqueSlug, validateAdmin } from "@/lib/cms-utils";
import {
  ValidationError,
  oneOf,
  requireFields,
  toDateISO,
  validationErrorResponse,
} from "@/lib/validation";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import { PERMISSIONS } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const table = "agenda";

const LIMITS = {
  title: { min: 3, max: 200 },
  description: { min: 10, max: 4000 },
  location: { max: 200 },
  category: { max: 80 },
};

const ALLOWED_STATUS = ["Terjadwal", "Berlangsung", "Selesai", "Ditunda", "Dibatalkan"];

const selectFields = `
  id,
  slug,
  title,
  description,
  category,
  status,
  location,
  start_at,
  end_at,
  is_published,
  author_id,
  created_at,
  updated_at
`;

function buildPayload(body) {
  const title = cleanString(body.title).slice(0, LIMITS.title.max);
  const description = cleanString(body.description).slice(
    0,
    LIMITS.description.max,
  );
  const category =
    cleanString(body.category).slice(0, LIMITS.category.max) || "Kegiatan";
  const status =
    oneOf(cleanString(body.status), ALLOWED_STATUS, {
      field: "status",
      label: "Status agenda",
    }) || "Terjadwal";
  const location = cleanString(body.location).slice(0, LIMITS.location.max);
  const isPublished = Boolean(body.is_published);

  requireFields({}, [
    {
      field: "title",
      label: "Judul agenda",
      value: title,
      min: LIMITS.title.min,
      max: LIMITS.title.max,
    },
    {
      field: "description",
      label: "Deskripsi agenda",
      value: description,
      min: LIMITS.description.min,
      max: LIMITS.description.max,
    },
  ]);

  const startAt = toDateISO(body.start_at, {
    required: true,
    field: "start_at",
  });
  const endAt = toDateISO(body.end_at, { field: "end_at" });

  if (endAt && new Date(endAt) < new Date(startAt)) {
    throw new ValidationError("Validasi gagal.", {
      errors: [
        {
          field: "end_at",
          message: "Tanggal selesai tidak boleh sebelum tanggal mulai.",
        },
      ],
    });
  }

  return {
    title,
    description,
    category,
    status,
    location,
    start_at: startAt,
    end_at: endAt,
    is_published: isPublished,
  };
}

export async function GET() {
  const auth = await validateAdmin({
    allowEditor: true,
    permission: PERMISSIONS.AGENDA_VIEW,
  });

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from(table)
      .select(selectFields)
      .order("start_at", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      items: data ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message || "Gagal mengambil daftar agenda.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request) {
  const auth = await validateAdmin({
    allowEditor: true,
    permission: PERMISSIONS.AGENDA_CREATE,
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

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.AGENDA,
      entityId: data?.id,
      summary: `Menambah agenda \"${data?.title || payload.title}\"`,
      after: { slug: data?.slug, start_at: data?.start_at },
      request,
    });

    return NextResponse.json(
      {
        message: "Agenda berhasil ditambahkan.",
        item: data,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      const resp = validationErrorResponse(error);
      return NextResponse.json(resp.body, { status: resp.status });
    }
    return NextResponse.json(
      {
        message: error.message || "Gagal menambahkan agenda.",
      },
      {
        status: error.status || 500,
      },
    );
  }
}
