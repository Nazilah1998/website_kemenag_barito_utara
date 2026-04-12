export const metadata = {
  title: "Visi & Misi | Kementerian Agama Kabupaten Barito Utara",
  description:
    "Visi dan misi Kementerian Agama Kabupaten Barito Utara dalam memberikan pelayanan keagamaan yang berkualitas.",
};

const missions = [
  "Meningkatkan kualitas pemahaman dan pengamalan ajaran agama dalam kehidupan masyarakat.",
  "Memperkuat kerukunan umat beragama melalui moderasi, toleransi, dan harmoni sosial.",
  "Meningkatkan kualitas pendidikan agama dan pendidikan keagamaan yang unggul dan berdaya saing.",
  "Mewujudkan pelayanan publik yang mudah, cepat, transparan, dan akuntabel.",
  "Memperkuat tata kelola kelembagaan yang profesional, bersih, dan berintegritas.",
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

export default function VisiMisiPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-linear-to-br from-emerald-950 via-emerald-800 to-teal-700">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-300 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-emerald-100 backdrop-blur">
              <SparkIcon />
              Arah Kelembagaan
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
              Visi & Misi
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-emerald-50 md:text-lg">
              Menjadi arah strategis dalam membangun pelayanan keagamaan yang
              profesional, moderat, akuntabel, dan berorientasi pada kepentingan
              masyarakat.
            </p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto -mt-10 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-white/70 bg-white p-8 shadow-xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-700">
            Visi
          </p>

          <h2 className="mt-4 text-3xl font-black leading-tight text-slate-950 md:text-4xl">
            Terwujudnya masyarakat Kabupaten Barito Utara yang taat beragama,
            rukun, cerdas, mandiri, dan sejahtera lahir batin.
          </h2>
        </div>

        <div className="mt-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-700">
            Misi
          </p>
          <h2 className="mt-3 text-3xl font-black text-slate-950">
            Langkah Strategis Pelayanan
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {missions.map((mission, index) => (
              <div
                key={mission}
                className="rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-black text-emerald-800">
                  {index + 1}
                </div>

                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Misi {index + 1}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {mission}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
