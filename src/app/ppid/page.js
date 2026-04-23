import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import { siteInfo, siteLinks } from "@/data/site";

export const metadata = {
  title: "PPID - Pejabat Pengelola Informasi dan Dokumentasi",
  description:
    "Layanan Pejabat Pengelola Informasi dan Dokumentasi (PPID) Kementerian Agama Kabupaten Barito Utara sesuai UU No. 14 Tahun 2008.",
};

const informationCategories = [
  {
    title: "Informasi Berkala",
    description:
      "Informasi yang diumumkan secara rutin seperti profil, rencana kerja, laporan kinerja, dan laporan keuangan.",
    href: "/laporan/laporan-kinerja",
  },
  {
    title: "Informasi Serta-Merta",
    description:
      "Informasi yang wajib diumumkan serta-merta karena dapat mengancam hajat hidup orang banyak.",
    href: "/informasi/regulasi",
  },
  {
    title: "Informasi Setiap Saat",
    description:
      "Informasi yang wajib tersedia setiap saat seperti daftar informasi publik, regulasi, dan dokumen organisasi.",
    href: "/informasi/dasar-hukum",
  },
  {
    title: "Informasi Dikecualikan",
    description:
      "Informasi yang dikecualikan sesuai UU KIP Pasal 17 seperti data pribadi, rahasia jabatan, dan keamanan negara.",
    href: "/informasi",
  },
];

const steps = [
  {
    num: "01",
    title: "Ajukan Permohonan",
    text: "Isi formulir permohonan informasi secara tertulis melalui loket, email, atau kanal daring.",
  },
  {
    num: "02",
    title: "Verifikasi Identitas",
    text: "PPID memverifikasi identitas pemohon dan kelengkapan dokumen dalam 1 hari kerja.",
  },
  {
    num: "03",
    title: "Pemrosesan Permohonan",
    text: "PPID memproses permohonan dalam jangka waktu 10 hari kerja (dapat diperpanjang 7 hari).",
  },
  {
    num: "04",
    title: "Pemberitahuan Hasil",
    text: "Pemohon menerima hasil: diterima, sebagian diterima, atau ditolak beserta alasannya.",
  },
];

export default function PpidPage() {
  return (
    <>
      <PageBanner
        title="PPID - Pejabat Pengelola Informasi dan Dokumentasi"
        description="Layanan keterbukaan informasi publik sesuai UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "PPID" },
        ]}
      />

      <main className="bg-slate-50/60 dark:bg-slate-950">
        <section className="w-full px-6 py-10 sm:px-10 md:py-14 lg:px-16 xl:px-20">
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-900/40 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Tentang PPID
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              <p>
                Pejabat Pengelola Informasi dan Dokumentasi (PPID) bertugas
                mengelola dan melayani permintaan informasi publik di lingkungan
                Kementerian Agama Kabupaten Barito Utara.
              </p>
              <p>
                PPID menjamin hak masyarakat untuk memperoleh informasi publik
                secara cepat, tepat, biaya ringan, dan cara sederhana.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Klasifikasi Informasi Publik
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {informationCategories.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700"
                >
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-400">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Alur Permohonan Informasi
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="text-xs font-bold tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                    LANGKAH {step.num}
                  </span>
                  <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-600 to-teal-600 p-6 text-white shadow-sm">
              <h3 className="text-lg font-bold">Kontak PPID</h3>
              <div className="mt-4 space-y-2 text-sm leading-7">
                <p>Alamat: {siteInfo.address}</p>
                <p>Telepon: {siteInfo.phone}</p>
                <p>Email: {siteInfo.email}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={siteLinks.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  WhatsApp
                </Link>
                <Link
                  href="/kontak"
                  className="inline-flex items-center rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Form Pengaduan
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Dasar Hukum
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                <li>UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik</li>
                <li>PP No. 61 Tahun 2010 tentang Pelaksanaan UU KIP</li>
                <li>PermenPAN-RB terkait pelayanan informasi publik</li>
                <li>KMA tentang Pengelolaan Informasi dan Dokumentasi</li>
              </ul>
              <Link
                href="/informasi/dasar-hukum"
                className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
              >
                Lihat Semua Regulasi →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
