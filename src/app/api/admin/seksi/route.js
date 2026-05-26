import { apiResponse } from "@/lib/api-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import { PERMISSIONS } from "@/lib/permissions";
import { db } from "@/lib/drizzle";
import { seksi } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await validateAdmin({ permission: PERMISSIONS.SEKSI_MANAGE });
  if (!auth.ok) return auth.response;

  try {
    const rawData = await db.query.seksi.findMany({
      with: {
        pegawai_seksis: {
          columns: { id: true },
        },
      },
    });

    const dataWithCounts = (rawData || []).map((item) => {
      const { pegawai_seksis, ...rest } = item;
      return { ...rest, _count: { pegawai_seksi: pegawai_seksis.length } };
    });

    // Urutan slug sesuai dengan struktur hirarki organisasi Kemenag
    const slugOrder = [
      "kepala-kantor",
      "sekjen",
      "seksi-pendidikan-madrasah",
      "seksi-pendidikan-agama-islam",
      "seksi-pendidikan-diniyah-dan-pondok-pesantren",
      "seksi-bimas-islam",
      "penyelenggara-zakat-wakaf",
      "penyelenggara-hindu",
      "kua-kantor-urusan-agama"
    ];

    const data = dataWithCounts.sort((a, b) => {
      let indexA = slugOrder.indexOf(a.slug);
      let indexB = slugOrder.indexOf(b.slug);
      if (indexA === -1) indexA = 999;
      if (indexB === -1) indexB = 999;
      return indexA - indexB;
    });

    return apiResponse({
      items: data || [],
    });
  } catch (error) {
    console.error("GET Admin Seksi List Error:", error);
    return apiResponse(
      { message: error?.message || "Gagal memuat data seksi kepegawaian." },
      500,
    );
  }
}
