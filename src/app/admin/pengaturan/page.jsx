import PengaturanForm from "@/components/features/admin/pengaturan/PengaturanForm";
import { db } from "@/lib/drizzle";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function getIdentitySettings() {
  try {
    const [row] = await db
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
      updatedBy: null,
      updatedAt: null
    };

    return row?.value ? { ...defaultValues, ...row.value } : defaultValues;
  } catch {
    return {
      nama_kantor: "Kementerian Agama Kabupaten Barito Utara",
      alamat: "",
      telepon: "",
      whatsapp: "",
      email: "",
      instagram: "",
      facebook: "",
      youtube: "",
      jam_layanan_senin: "",
      jam_layanan_selasa: "",
      jam_layanan_rabu: "",
      jam_layanan_kamis: "",
      jam_layanan_jumat: "",
      updatedBy: null,
      updatedAt: null
    };
  }
}

export default async function PengaturanPage() {
  const settings = await getIdentitySettings();

  return (
    <div className="min-w-0">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/30">
          <svg className="h-7 w-7 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Pengaturan Identitas Situs
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Kelola informasi kantor, kontak, dan tautan sosial media untuk ditampilkan ke publik
          </p>
        </div>
      </div>

      <PengaturanForm initialSettings={settings} />
    </div>
  );
}
