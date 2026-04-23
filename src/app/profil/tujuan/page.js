export const metadata = {
  title: "Tujuan | Kementerian Agama Kabupaten Barito Utara",
  description:
    "Tujuan kelembagaan Kementerian Agama Kabupaten Barito Utara dalam meningkatkan kualitas pelayanan keagamaan.",
};

const goals = [
  {
    title: "Meningkatkan Kualitas Layanan",
    desc: "Menghadirkan pelayanan keagamaan yang mudah, cepat, transparan, dan responsif terhadap kebutuhan masyarakat.",
  },
  {
    title: "Memperkuat Kerukunan Umat",
    desc: "Membangun kehidupan beragama yang damai, toleran, moderat, dan saling menghormati.",
  },
  {
    title: "Meningkatkan Mutu Pendidikan",
    desc: "Mendorong kualitas pendidikan agama dan pendidikan keagamaan yang unggul, inklusif, dan berkarakter.",
  },
  {
    title: "Mewujudkan Tata Kelola Bersih",
    desc: "Memperkuat birokrasi yang akuntabel, profesional, transparan, dan berorientasi pada pelayanan publik.",
  },
  {
    title: "Mengoptimalkan Transformasi Digital",
    desc: "Memanfaatkan teknologi informasi untuk mempercepat layanan dan meningkatkan keterbukaan informasi publik.",
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

export default function TujuanPage() {
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
              Sasaran Strategis
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
              Tujuan
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-emerald-50 md:text-lg">
              Tujuan kelembagaan diarahkan untuk memperkuat kualitas pelayanan,
              meningkatkan kepercayaan publik, dan menghadirkan manfaat nyata
              bagi masyarakat Kabupaten Barito Utara.
            </p>
          </div>
        </div>
      </section>

      <section className="relative -mt-10 w-full px-6 pb-20 sm:px-10 lg:px-16 xl:px-20">
        <div className="space-y-5">
          {goals.map((goal, index) => (
            <div
              key={goal.title}
              className="grid gap-5 rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-xl transition hover:-translate-y-1 hover:border-emerald-200 md:grid-cols-[90px_1fr]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-black text-emerald-800">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  {goal.title}
                </h2>
                <p className="mt-3 text-sm leading-8 text-slate-600">
                  {goal.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-4xl bg-linear-to-r from-emerald-700 to-teal-700 p-8 text-white shadow-xl">
          <h2 className="text-3xl font-black">
            Tujuan yang Terukur, Pelayanan yang Berdampak
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-8 text-emerald-50">
            Setiap tujuan diarahkan untuk memperkuat pelayanan keagamaan yang
            unggul, meningkatkan tata kelola yang bersih, serta membangun
            hubungan yang semakin dekat antara Kemenag dan masyarakat.
          </p>
        </div>
      </section>
    </main>
  );
}
