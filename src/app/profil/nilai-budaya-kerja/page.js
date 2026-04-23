export const metadata = {
  title: "Nilai Budaya Kerja | Kementerian Agama Kabupaten Barito Utara",
  description:
    "Nilai budaya kerja Kementerian Agama Kabupaten Barito Utara sebagai dasar pelayanan publik yang berintegritas.",
};

const values = [
  {
    title: "Integritas",
    desc: "Keselarasan antara hati, pikiran, perkataan, dan perbuatan yang baik dan benar.",
  },
  {
    title: "Profesionalitas",
    desc: "Bekerja secara disiplin, kompeten, bertanggung jawab, dan berorientasi pada hasil terbaik.",
  },
  {
    title: "Inovasi",
    desc: "Menyempurnakan proses kerja agar layanan semakin cepat, mudah, adaptif, dan relevan.",
  },
  {
    title: "Tanggung Jawab",
    desc: "Melaksanakan amanah pekerjaan dengan sungguh-sungguh, tuntas, dan dapat dipertanggungjawabkan.",
  },
  {
    title: "Keteladanan",
    desc: "Menjadi contoh dalam sikap, perilaku, etika kerja, dan pelayanan kepada masyarakat.",
  },
];

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <path
        d="M12 2 14.6 8.4 21 11l-6.4 2.6L12 20l-2.6-6.4L3 11l6.4-2.6L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NilaiBudayaKerjaPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-linear-to-br from-emerald-950 via-emerald-800 to-teal-700">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-300 blur-3xl" />
        </div>

        <div className="relative w-full px-6 py-20 sm:px-10 lg:px-16 xl:px-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-emerald-100 backdrop-blur">
              <SparkIcon />
              Budaya Organisasi
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
              Nilai Budaya Kerja
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-emerald-50 md:text-lg">
              Lima nilai budaya kerja menjadi fondasi aparatur dalam membangun
              pelayanan publik yang ramah, profesional, dan berorientasi pada
              kepentingan masyarakat.
            </p>
          </div>
        </div>
      </section>

      <section className="relative -mt-10 w-full px-6 pb-20 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {values.map((value, index) => (
            <div
              key={value.title}
              className="group rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-xl transition hover:-translate-y-1 hover:border-emerald-200"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-black text-emerald-800 transition group-hover:bg-emerald-700 group-hover:text-white">
                {index + 1}
              </div>

              <h2 className="mt-6 text-xl font-black text-slate-950">
                {value.title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {value.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-4xl bg-slate-950 p-8 text-white shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-300">
            Komitmen Aparatur
          </p>

          <h2 className="mt-4 text-3xl font-black">
            Bekerja dengan Nilai, Melayani dengan Hati
          </h2>

          <p className="mt-5 max-w-4xl text-sm leading-8 text-slate-300">
            Nilai budaya kerja tidak hanya menjadi slogan, tetapi menjadi
            pedoman nyata dalam membangun pelayanan yang berintegritas,
            profesional, inovatif, bertanggung jawab, dan memberi keteladanan
            bagi masyarakat.
          </p>
        </div>
      </section>
    </main>
  );
}
