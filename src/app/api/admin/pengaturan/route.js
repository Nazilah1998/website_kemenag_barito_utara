import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { validateAdmin } from "@/lib/cms-utils";
import { recordAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { apiResponse } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await validateAdmin({});
  if (!auth.ok) return auth.response;

  try {
    const settings = await db
      .select({ value: schema.siteSettings.value })
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.key, "identity"))
      .limit(1);

    const defaultValues = {
      nama_kantor: "Kementerian Agama Kabupaten Barito Utara",
      alamat: "",
      telepon: "",
      whatsapp: "",
      email: "",
      instagram: "",
      facebook: "",
      youtube: "",
      jam_layanan_senin: "08:00 - 16:00",
      jam_layanan_selasa: "08:00 - 16:00",
      jam_layanan_rabu: "08:00 - 16:00",
      jam_layanan_kamis: "08:00 - 16:00",
      jam_layanan_jumat: "08:00 - 16:30",
      fitur_anti_copas: false
    };

    return apiResponse({
      ok: true,
      data: settings.length > 0 ? { ...defaultValues, ...settings[0].value } : defaultValues,
    });
  } catch (error) {
    console.error("[Settings API GET Error]:", error);
    return NextResponse.json({ message: "Gagal memuat pengaturan identitas" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await validateAdmin({});
  if (!auth.ok) return auth.response;

  if (auth.session.role !== "super_admin") {
    return NextResponse.json(
      { message: "Forbidden. Only super admin can change global identity settings.", code: "FORBIDDEN" },
      { status: 403 },
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    
    // Validate or sanitize input here if needed. Just taking exactly what was passed.
    const value = {
      nama_kantor: body.nama_kantor || "",
      alamat: body.alamat || "",
      telepon: body.telepon || "",
      whatsapp: body.whatsapp || "",
      email: body.email || "",
      instagram: body.instagram || "",
      facebook: body.facebook || "",
      youtube: body.youtube || "",
      jam_layanan_senin: body.jam_layanan_senin || "",
      jam_layanan_selasa: body.jam_layanan_selasa || "",
      jam_layanan_rabu: body.jam_layanan_rabu || "",
      jam_layanan_kamis: body.jam_layanan_kamis || "",
      jam_layanan_jumat: body.jam_layanan_jumat || "",
      fitur_anti_copas: Boolean(body.fitur_anti_copas),
      updatedBy: auth.session.profile?.email || auth.session.user?.email || null,
      updatedAt: new Date().toISOString(),
    };

    await db
      .insert(schema.siteSettings)
      .values({ key: "identity", value })
      .onConflictDoUpdate({
        target: schema.siteSettings.key,
        set: { value, updatedAt: new Date().toISOString() },
      });

    await recordAudit({
      session: auth.session,
      action: "SETTINGS_UPDATE",
      entity: "site_settings",
      entityId: "identity",
      summary: "Super admin memperbarui pengaturan identitas situs",
      after: value,
    });

    revalidatePath("/", "layout");

    return apiResponse({
      ok: true,
      message: "Pengaturan identitas berhasil disimpan.",
    });
  } catch (error) {
    console.error("[Settings API POST Error]:", error);
    return NextResponse.json(
      { message: error.message || "Gagal menyimpan pengaturan identitas." },
      { status: 500 },
    );
  }
}
