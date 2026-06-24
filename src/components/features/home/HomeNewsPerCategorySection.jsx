"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import FillImageWithFallback from "@/components/features/berita/components/FillImageWithFallback";

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

export default function HomeNewsPerCategorySection({ groupedBerita = [] }) {
  if (!groupedBerita || groupedBerita.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-4 pb-12 pt-0 sm:px-10 lg:px-16 lg:pb-20 xl:px-20 overflow-hidden -mt-6 lg:-mt-12 relative z-10">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={staggerContainer}
      >
        {groupedBerita.map((group) => (
          <motion.div key={group.category} variants={fadeInUp} className="flex flex-col">
            <div className="rounded-2xl sm:rounded-3xl border border-slate-200/60 bg-white p-4 sm:p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/50 backdrop-blur-md flex flex-col h-full hover:border-emerald-200 dark:hover:border-slate-700 transition-colors duration-500">
              
              {/* Category Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-3 sm:pb-4 sm:mb-4">
                <div>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
                    Kategori
                  </span>
                  <h3 className="text-lg sm:text-xl font-black mt-0.5 sm:mt-1 text-slate-900 dark:text-white leading-tight">
                    {group.category}
                  </h3>
                </div>
                <Link 
                  href={`/berita?kategori=${encodeURIComponent(group.category)}`}
                  className="group/btn flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-800/70 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors shrink-0"
                >
                  <span>{group.totalCount} berita</span>
                  <ArrowRightIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 transition-transform group-hover/btn:translate-x-0.5" />
                </Link>
              </div>

              {/* News List */}
              <div className="flex flex-col gap-2 sm:gap-3">
                {group.items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/berita/${item.slug}`}
                    className="group flex gap-3 sm:gap-4 items-center p-1.5 sm:p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-800/50"
                  >
                    {/* Cover Image */}
                    <div className="relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-800">
                      <FillImageWithFallback
                        src={item.coverImage}
                        fallbackSrc="/assets/branding/kemenag.svg"
                        alt={item.title}
                        sizes="96px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Info Content */}
                    <div className="flex-1 min-w-0 py-0.5 sm:py-1 flex flex-col justify-center">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        <span>{item.date}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 truncate hidden sm:inline-block">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Bottom Action (Optional, can be added later) */}
              {/* <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800/50 text-center">
                <Link href={`/berita?kategori=${group.category}`} className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                  Lihat Semua {group.category} &rarr;
                </Link>
              </div> */}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function ArrowRightIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
