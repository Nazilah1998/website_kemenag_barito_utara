import { revalidatePath, revalidateTag } from "next/cache";
import { validateAdmin } from "@/lib/cms-utils";
import {
  removeStorageFileByPublicUrl,
  uploadBase64Image,
} from "@/lib/storage-media";
import { AUDIT_ACTIONS, AUDIT_ENTITIES, recordAudit } from "@/lib/audit";
import { cleanString } from "@/lib/validation";
import { apiResponse } from "@/lib/api-helpers";
import { db } from "@/lib/drizzle";
import { galeri } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { broadcastRefresh } from "@/lib/realtime-service";
import { randomUUID } from "crypto";
import { logError } from "@/lib/logger";

export const dynamic = "force-dynamic";

const MAX_IMAGE_SIZE_KB = 500;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_KB * 1024;

function toSafeSizeNumber(value) {
  const parsed = Number(value || 0);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Math.round(parsed);
}

function getBase64PayloadMeta(dataUrl) {
  const input = cleanString(dataUrl, 10_000_000);
  if (!input) return null;
  if (!input.startsWith("data:")) return null;
  const match = input.match(/^data:(.+?);base64,(.+)$/);
  if (!match) return null;

  const base64Payload = match[2];
  const sizeBytes = Buffer.from(base64Payload, "base64").length;
  const sizeKB = Math.ceil(sizeBytes / 1024);

  return {
    sizeBytes,
    sizeKB,
    mimeType: match[1],
  };
}

function revalidateGaleriPaths() {
  revalidatePath("/");
  revalidatePath("/beranda");
  revalidatePath("/galeri");
  revalidatePath("/admin/galeri");
  revalidateTag("home-latest-galeri-v2");
  broadcastRefresh("galeri");
}

export async function GET(request) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(10000, Math.max(1, parseInt(searchParams.get("limit") || "10000")));
    const skip = (page - 1) * limit;

    const [data, [{ count: total }]] = await Promise.all([
      db
        .select()
        .from(galeri)
        .orderBy(desc(galeri.published_at))
        .limit(limit)
        .offset(skip),
      db.select({ count: sql`count(*)` }).from(galeri)
    ]);

    return apiResponse({
      items: data ?? [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logError("galeri_get_error", { error: error?.message });
    return apiResponse(
      { message: error.message || "Gagal mengambil data galeri." },
      500,
    );
  }
}

export async function POST(request) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();

    const publishedAt = body?.published_at
      ? new Date(body.published_at)
      : new Date();

    let base64List = [];
    if (Array.isArray(body?.gallery_uploads) && body.gallery_uploads.length > 0) {
      base64List = body.gallery_uploads.map(b64 => cleanString(b64, 10_000_000)).filter(Boolean);
    } else if (body?.gallery_upload_base64) {
      base64List = [cleanString(body.gallery_upload_base64, 10_000_000)].filter(Boolean);
    }

    if (base64List.length === 0) {
      return apiResponse({ message: "Gambar galeri wajib diupload." }, 400);
    }

    const insertedItems = [];
    const timestamp = Date.now();

    // Process sequentially to avoid storage upload limits/timeouts
    for (let i = 0; i < base64List.length; i++) {
      const uploadBase64 = base64List[i];
      const base64Meta = getBase64PayloadMeta(uploadBase64);
      
      if (!base64Meta) {
        return apiResponse({ message: `Format file pada urutan ke-${i + 1} tidak valid.` }, 400);
      }

      if (base64Meta.sizeBytes > MAX_IMAGE_SIZE_BYTES) {
        return apiResponse({ message: `Ukuran file pada urutan ke-${i + 1} terlalu besar. Maksimal ${MAX_IMAGE_SIZE_KB} KB.` }, 400);
      }

      const uploaded = await uploadBase64Image({
        dataUrl: uploadBase64,
        folder: "galeri",
        fileNameStem: `galeri-${timestamp}-${i}`,
      });

      const [insertedItem] = await db
        .insert(galeri)
        .values({
          title: "",
          image_url: uploaded.publicUrl,
          image_size_kb: base64Meta.sizeKB,
          image_size_bytes: base64Meta.sizeBytes,
          link_url: "",
          source_type: "manual",
          source_id: randomUUID(),
          is_published: true,
          published_at: publishedAt,
        })
        .returning();

      insertedItems.push(insertedItem);
    }

    revalidateGaleriPaths();

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.CREATE,
      entity: AUDIT_ENTITIES.GALERI,
      entityId: insertedItems.length === 1 ? insertedItems[0].id : null,
      summary: `Menambah ${insertedItems.length} item galeri baru secara massal`,
      after: {
        total_items: insertedItems.length,
        published_at: publishedAt,
      },
      request,
    });

    return apiResponse({
      message: `${insertedItems.length} item galeri berhasil disimpan.`,
      items: insertedItems,
      item: insertedItems[0], // for backwards compatibility if needed
    });
  } catch (error) {
    logError("galeri_post_error", { error: error?.message });
    return apiResponse(
      { message: error.message || "Gagal menyimpan galeri." },
      500,
    );
  }
}

export async function PUT(request) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return apiResponse({ message: "ID galeri wajib ada." }, 400);

    const body = await request.json();

    const [existingItem] = await db
      .select()
      .from(galeri)
      .where(eq(galeri.id, id))
      .limit(1);

    if (!existingItem)
      return apiResponse({ message: "Item tidak ditemukan." }, 404);

    const uploadBase64 = cleanString(body?.gallery_upload_base64, 10_000_000);
    const publishedAt = body?.published_at
      ? new Date(body.published_at)
      : existingItem.published_at;

    let finalImageUrl = existingItem.image_url;
    let finalSizeKB = existingItem.image_size_kb;
    let finalSizeBytes = existingItem.image_size_bytes;

    if (uploadBase64) {
      const base64Meta = getBase64PayloadMeta(uploadBase64);
      if (!base64Meta) {
        return apiResponse({ message: "Format file tidak valid." }, 400);
      }
      if (base64Meta.sizeBytes > MAX_IMAGE_SIZE_BYTES) {
        return apiResponse(
          { message: `Ukuran file terlalu besar. Maksimal ${MAX_IMAGE_SIZE_KB} KB.` },
          400,
        );
      }

      const uploaded = await uploadBase64Image({
        dataUrl: uploadBase64,
        folder: "galeri",
        fileNameStem: `galeri-${Date.now()}`,
      });

      if (existingItem.image_url) {
        await removeStorageFileByPublicUrl(existingItem.image_url).catch((e) => logError("galeri_put_storage_delete_error", { error: e?.message }));
      }

      finalImageUrl = uploaded.publicUrl;
      finalSizeKB = base64Meta.sizeKB;
      finalSizeBytes = base64Meta.sizeBytes;
    }

    const [data] = await db
      .update(galeri)
      .set({
        image_url: finalImageUrl,
        image_size_kb: finalSizeKB,
        image_size_bytes: finalSizeBytes,
        published_at: publishedAt,
        updated_at: new Date(),
      })
      .where(eq(galeri.id, id))
      .returning();

    revalidateGaleriPaths();

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.UPDATE,
      entity: AUDIT_ENTITIES.GALERI,
      entityId: id,
      summary: "Memperbarui item galeri secara manual",
      request,
    });

    return apiResponse({
      message: "Item galeri berhasil diperbarui.",
      item: data,
    });
  } catch (error) {
    logError("galeri_put_error", { error: error?.message });
    return apiResponse(
      { message: error.message || "Gagal update galeri." },
      500,
    );
  }
}

export async function DELETE(request) {
  const auth = await validateAdmin();
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return apiResponse({ message: "ID galeri wajib ada." }, 400);

    const [item] = await db
      .select()
      .from(galeri)
      .where(eq(galeri.id, id))
      .limit(1);

    if (!item) return apiResponse({ message: "Item tidak ditemukan." }, 404);

    if (item.image_url) {
      await removeStorageFileByPublicUrl(item.image_url).catch(
        (e) => logError("galeri_delete_storage_error", { error: e?.message }),
      );
    }

    await db.delete(galeri).where(eq(galeri.id, id));

    revalidateGaleriPaths();

    await recordAudit({
      session: auth.session,
      action: AUDIT_ACTIONS.DELETE,
      entity: AUDIT_ENTITIES.GALERI,
      entityId: id,
      summary: "Menghapus item galeri",
      before: item,
      request,
    });

    return apiResponse({ message: "Item galeri berhasil dihapus." });
  } catch (error) {
    logError("galeri_delete_error", { error: error?.message });
    return apiResponse(
      { message: error.message || "Gagal menghapus galeri." },
      500,
    );
  }
}
