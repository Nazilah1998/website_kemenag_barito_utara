import { apiResponse } from "@/lib/prisma-helpers";
import { validateAdmin } from "@/lib/cms-utils";
import prisma from "@/lib/prisma";

import { PERMISSIONS } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await validateAdmin({ permission: PERMISSIONS.SEKSI_MANAGE });
  if (!auth.ok) return auth.response;

  try {
    const data = await prisma.seksi.findMany({
      include: {
        _count: {
          select: {
            pegawai_seksi: true
          }
        }
      }
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

    if (data) {
      data.sort((a, b) => {
        let indexA = slugOrder.indexOf(a.slug);
        let indexB = slugOrder.indexOf(b.slug);
        if (indexA === -1) indexA = 999;
        if (indexB === -1) indexB = 999;
        return indexA - indexB;
      });
    }

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
