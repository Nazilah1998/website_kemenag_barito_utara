import { revalidatePath } from "next/cache";
import { validateAdmin } from "@/lib/cms-utils";
import { cleanString } from "@/lib/validation";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import { apiResponse, getSafeIdFromContext } from "@/lib/api-helpers";
import { broadcastRefresh } from "@/lib/realtime-service";
import { db } from "@/lib/drizzle";
import { static_pages } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
  const auth = await validateAdmin({ allowEditor: true });
  if (!auth.ok) return auth.response;

  try {
    const safeId = await getSafeIdFromContext(context);
    const [data] = await db.select().from(static_pages).where(eq(static_pages.id, safeId)).limit(1);
    if (!data) return apiResponse({ message: "Halaman tidak ditemukan." }, 404);
    return apiResponse(data);
  } catch (error) {
    console.error("GET Halaman Error:", error);
    return apiResponse({ message: error.message || "Gagal memuat halaman." }, error.status || 500);
  }
}

export async function PUT(request, context) {
  const auth = await validateAdmin({ allowEditor: true });
  if (!auth.ok) return auth.response;

  try {
    const safeId = await getSafeIdFromContext(context);
    const body = await request.json();

    const [existing] = await db.select().from(static_pages).where(eq(static_pages.id, safeId)).limit(1);
    if (!existing) return apiResponse({ message: "Halaman tidak ditemukan." }, 404);

    const slug = cleanString(body?.slug) || existing.slug;
    const title = cleanString(body?.title) || existing.title;
    const description = cleanString(body?.description) ?? existing.description;
    const content = typeof body?.content === "string" ? body.content : existing.content;
    const is_published = body?.is_published === true;

    if (!title) return apiResponse({ message: "Judul halaman wajib diisi." }, 400);

    if (slug !== existing.slug) {
      const [duplicate] = await db
        .select({ id: static_pages.id })
        .from(static_pages)
        .where(eq(static_pages.slug, slug))
        .limit(1);
      if (duplicate && duplicate.id !== safeId) {
        return apiResponse({ message: `Slug "${slug}" sudah digunakan.` }, 409);
      }
    }

    const [data] = await db
      .update(static_pages)
      .set({ slug, title, description, content, is_published, updated_at: new Date() })
      .where(eq(static_pages.id, safeId))
      .returning();

    revalidatePath("/informasi");
    revalidatePath("/informasi/" + (data?.slug || slug));
    revalidatePath("/admin/halaman");
    broadcastRefresh("halaman");

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.UPDATE,
      entity: AUDIT_ENTITIES.HALAMAN,
      entityId: data?.id || safeId,
      summary: `Memperbarui halaman "${data?.title || existing.title}"`,
      before: { slug: existing.slug, title: existing.title, is_published: existing.is_published },
      after: { slug, title, is_published },
      request,
    });

    return apiResponse({ message: "Halaman berhasil diperbarui.", item: data });
  } catch (error) {
    console.error("PUT Halaman Error:", error);
    return apiResponse({ message: error.message || "Gagal memperbarui halaman." }, error.status || 500);
  }
}

export async function DELETE(request, context) {
  const auth = await validateAdmin({ allowEditor: true });
  if (!auth.ok) return auth.response;

  try {
    const safeId = await getSafeIdFromContext(context);

    const [existing] = await db
      .select({ id: static_pages.id, slug: static_pages.slug, title: static_pages.title })
      .from(static_pages)
      .where(eq(static_pages.id, safeId))
      .limit(1);

    if (!existing) return apiResponse({ message: "Halaman tidak ditemukan." }, 404);

    await db.delete(static_pages).where(eq(static_pages.id, safeId));

    revalidatePath("/informasi");
    revalidatePath("/admin/halaman");
    broadcastRefresh("halaman");

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.DELETE,
      entity: AUDIT_ENTITIES.HALAMAN,
      entityId: existing.id,
      summary: `Menghapus halaman "${existing.title}"`,
      before: { slug: existing.slug, title: existing.title },
      after: null,
      request,
    });

    return apiResponse({ message: "Halaman berhasil dihapus." });
  } catch (error) {
    console.error("DELETE Halaman Error:", error);
    return apiResponse({ message: error.message || "Gagal menghapus halaman." }, error.status || 500);
  }
}
