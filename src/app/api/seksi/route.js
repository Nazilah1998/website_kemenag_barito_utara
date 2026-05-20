import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const seksiList = await prisma.seksi.findMany();

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

    seksiList.sort((a, b) => {
      let indexA = slugOrder.indexOf(a.slug);
      let indexB = slugOrder.indexOf(b.slug);
      if (indexA === -1) indexA = 999;
      if (indexB === -1) indexB = 999;
      return indexA - indexB;
    });

    const kepalaKantorDb = seksiList.find(s => s.slug === 'kepala-kantor');
    const kepalaKantor = kepalaKantorDb ? {
      name: kepalaKantorDb.nama_kepala,
      position: "Kepala Kantor Kementerian Agama Kabupaten Barito Utara",
      image: kepalaKantorDb.foto_kepala || "/assets/images/pejabat.png",
      imageY: kepalaKantorDb.foto_kepala_y ?? 50,
      description: kepalaKantorDb.deskripsi,
      nip: kepalaKantorDb.nip_kepala || "",
    } : {
      name: "H. Arbaja, S.Ag.,M.A.P",
      position: "Kepala Kantor Kementerian Agama Kabupaten Barito Utara",
      image: "/assets/images/pejabat.png",
      imageY: 50,
      description: "Memimpin arah kebijakan, koordinasi pelayanan, dan penguatan tata kelola kelembagaan di lingkungan Kemenag Barito Utara.",
      nip: "-",
    };

    const dynamicLeaders = seksiList
      .filter(s => s.slug !== 'kua-kantor-urusan-agama' && s.slug !== 'kepala-kantor')
      .map(s => ({
        name: s.nama_kepala,
        position: s.slug === 'sekjen' ? 'Kepala Subbagian Tata Usaha' : s.judul,
        image: s.foto_kepala || "/assets/images/pejabat.png",
        imageY: s.foto_kepala_y ?? 50,
        description: s.deskripsi,
        nip: s.nip_kepala || "",
      }));

    return NextResponse.json([kepalaKantor, ...dynamicLeaders]);
  } catch (error) {
    console.error("GET Public Seksi Error:", error);
    return NextResponse.json({ error: "Failed to fetch seksi data." }, { status: 500 });
  }
}
