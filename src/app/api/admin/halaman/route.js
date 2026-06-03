import { revalidatePath } from "next/cache";
import { validateAdmin } from "@/lib/cms-utils";
import { cleanString } from "@/lib/validation";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import { apiResponse } from "@/lib/api-helpers";
import { db } from "@/lib/drizzle";
import { static_pages } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { broadcastRefresh } from "@/lib/realtime-service";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const auth = await validateAdmin({ allowEditor: true });
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(10000, Math.max(1, parseInt(searchParams.get("limit") || "10000")));
    const skip = (page - 1) * limit;

    const [data, [{ count: total }]] = await Promise.all([
      db
        .select({
          id: static_pages.id,
          slug: static_pages.slug,
          title: static_pages.title,
          description: static_pages.description,
          is_published: static_pages.is_published,
          author_id: static_pages.author_id,
          created_at: static_pages.created_at,
          updated_at: static_pages.updated_at,
        })
        .from(static_pages)
        .orderBy(desc(static_pages.updated_at))
        .offset(skip)
        .limit(limit),
      db.select({ count: sql`count(*)` }).from(static_pages),
    ]);

    return apiResponse({
      items: data,
      pagination: { page, limit, total, totalPages: Math.ceil(Number(total) / limit) },
    });
  } catch (error) {
    logError("halaman_get_error", { error: error?.message });
    return apiResponse({ message: error.message || "Gagal mengambil daftar halaman." }, error.status || 500);
  }
}

export async function POST(request) {
  const auth = await validateAdmin({ allowEditor: true });
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const slug = cleanString(body?.slug);
    const title = cleanString(body?.title);
    const description = cleanString(body?.description);
    const content = typeof body?.content === "string" ? body.content : "{}";
    const is_published = body?.is_published === true;

    if (!slug) return apiResponse({ message: "Slug wajib diisi." }, 400);
    if (!title) return apiResponse({ message: "Judul halaman wajib diisi." }, 400);

    const [existing] = await db
      .select({ id: static_pages.id })
      .from(static_pages)
      .where(eq(static_pages.slug, slug))
      .limit(1);

    if (existing) {
      return apiResponse({ message: `Slug "${slug}" sudah digunakan.` }, 409);
    }

    const [data] = await db
      .insert(static_pages)
      .values({
        slug,
        title,
        description,
        content,
        is_published,
        author_id: auth.session?.profile?.id ?? null,
      })
      .returning();

    revalidatePath("/informasi");
    revalidatePath(`/informasi/${slug}`);
    broadcastRefresh("halaman");

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.HALAMAN,
      entityId: data?.id,
      summary: `Menambah halaman "${title}"`,
      after: { slug, is_published },
      request,
    });

    return apiResponse({ message: "Halaman berhasil ditambahkan.", item: data }, 201);
  } catch (error) {
    logError("halaman_post_error", { error: error?.message });
    return apiResponse({ message: error.message || "Gagal menambahkan halaman." }, error.status || 500);
  }
}
