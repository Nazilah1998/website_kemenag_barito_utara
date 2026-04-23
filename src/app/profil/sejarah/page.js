export const metadata = {
  title: "Sejarah | Kementerian Agama Kabupaten Barito Utara",
  description:
    "Sejarah Kementerian Agama Kabupaten Barito Utara sebagai lembaga pelayanan keagamaan bagi masyarakat.",
};

const timeline = [
  {
    year: "Awal Perjalanan",
    title: "Penguatan Layanan Keagamaan",
    desc: "Kemenag Barito Utara hadir untuk memperkuat pelayanan urusan agama, pendidikan keagamaan, dan pembinaan masyarakat.",
  },
  {
    year: "Transformasi",
    title: "Pelayanan Publik Lebih Terarah",
    desc: "Pelayanan terus dikembangkan melalui tata kelola yang lebih tertib, responsif, dan berorientasi pada kebutuhan masyarakat.",
  },
  {
    year: "Masa Kini",
    title: "Digital, Terbuka, dan Profesional",
    desc: "Kemenag Barito Utara terus bergerak menuju pelayanan modern berbasis integritas, profesionalitas, dan keterbukaan informasi.",
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

export default function SejarahPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-linear-to-brrom-emerald-950 via-emerald-800 to-teal-700">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-300 blur-3xl" />
        </div>

        <div className="relative w-full px-6 py-20 sm:px-10 lg:px-16 xl:px-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-emerald-100 backdrop-blur">
              <SparkIcon />
              Profil Kelembagaan
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
              Sejarah
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-emerald-50 md:text-lg">
              Perjalanan Kementerian Agama Kabupaten Barito Utara dalam
              menghadirkan pelayanan keagamaan yang dekat, inklusif, dan
              bermanfaat bagi masyarakat.
            </p>
          </div>
        </div>
      </section>

      <section className="relative -mt-10 w-full px-6 pb-20 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-xl">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-700">
              Jejak Pengabdian
            </p>

            <h2 className="mt-4 text-3xl font-black text-slate-950">
              Tumbuh Bersama Masyarakat Barito Utara
            </h2>

            <p className="mt-6 text-sm leading-8 text-slate-600">
              Kementerian Agama Kabupaten Barito Utara merupakan bagian dari
              penyelenggaraan pemerintahan di bidang agama yang memiliki peran
              strategis dalam membina kehidupan beragama, pendidikan keagamaan,
              pelayanan umat, dan penguatan kerukunan masyarakat.
            </p>

            <p className="mt-4 text-sm leading-8 text-slate-600">
              Dalam perkembangannya, Kemenag Barito Utara terus memperkuat
              kualitas layanan melalui peningkatan kapasitas aparatur,
              pemanfaatan teknologi informasi, dan tata kelola yang semakin
              akuntabel.
            </p>
          </div>

          <div className="space-y-5">
            {timeline.map((item, index) => (
              <div
                key={item.title}
                className="rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-black text-emerald-800">
                    {index + 1}
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-700">
                      {item.year}
                    </p>
                    <h3 className="mt-2 text-xl font-black text-slate-950">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
