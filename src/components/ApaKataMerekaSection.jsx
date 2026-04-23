import Image from "next/image";
import { apaKataMereka } from "../data/apaKataMereka";

export default function ApaKataMerekaSection() {
    return (
        <section className="py-16 lg:py-20">
            <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
                <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-[0.32em] text-blue-700 dark:text-blue-300">
                        Pembinaan Kerukunan Umat Beragama
                    </p>
                    <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 lg:text-4xl dark:text-white">
                        Apa Kata Mereka
                    </h2>
                    <p className="theme-text-muted mx-auto mt-3 max-w-2xl text-sm leading-7">
                        Komitmen dan pesan inspiratif dari para pimpinan untuk memperkuat layanan umat.
                    </p>
                </div>

                <div className="mt-10 grid gap-6 md:items-stretch md:grid-cols-3">
                    {apaKataMereka.map((person, index) => (
                        <article
                            key={`${person.name}-${person.position}-${index}`}
                            className="theme-news-card group relative flex h-full overflow-hidden rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                        >
                            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl transition-all duration-500 group-hover:bg-blue-500/20 group-hover:blur-3xl" />

                            <div className="relative flex h-full w-full flex-col">
                                <div className="space-y-4 text-justify text-sm leading-7 text-slate-700 dark:text-slate-300 md:text-base">
                                    {person.quote.map((line, lineIndex) => (
                                        <p key={lineIndex}>{line}</p>
                                    ))}
                                </div>

                                <div className="mt-auto pt-8 flex flex-col items-center text-center">
                                    <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg ring-2 ring-blue-500/20 md:h-24 md:w-24 dark:border-slate-800 dark:bg-slate-800">
                                        <Image
                                            src={person.image}
                                            alt={person.name}
                                            width={96}
                                            height={96}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <h3 className="mt-4 text-base font-black text-slate-900 dark:text-white md:text-lg">
                                        {person.name}
                                    </h3>
                                    <p className="mt-1 text-xs font-semibold text-blue-700 dark:text-blue-300 md:text-sm">
                                        {person.position}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
