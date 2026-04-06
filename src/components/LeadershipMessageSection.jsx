import Image from "next/image";
import { leadershipMessage } from "../data/leadershipMessage";

export default function LeadershipMessageSection() {
  return (
    <section className="py-10">
      <div className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="flex flex-col items-center rounded-3xl bg-emerald-50 p-6 text-center">
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-sm">
            <Image
              src={leadershipMessage.image}
              alt={leadershipMessage.name}
              width={96}
              height={96}
              className="h-24 w-24 object-contain"
            />
          </div>

          <h3 className="mt-5 text-xl font-bold text-slate-900">
            {leadershipMessage.name}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {leadershipMessage.position}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Sambutan Pimpinan
          </p>

          <h2 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">
            Komitmen Pelayanan, Pembinaan, dan Keterbukaan Informasi
          </h2>

          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
            {leadershipMessage.message.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}