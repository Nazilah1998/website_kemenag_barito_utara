"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function YoutubeSectionClient({ initialVideos }) {
  const [activeVideo, setActiveVideo] = useState(null);

  if (!initialVideos || initialVideos.length === 0) return null;

  const currentVideo = activeVideo || initialVideos[0];
  const sideVideos = initialVideos.filter((v) => v.id !== currentVideo.id).slice(0, 4);

  return (
    <section className="relative overflow-hidden bg-white py-20 dark:bg-slate-950 sm:py-32">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-100 to-sky-100 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] dark:from-emerald-900/40 dark:to-sky-900/40"></div>
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="flex flex-col items-center justify-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50/50 px-4 py-1.5 dark:border-red-500/20 dark:bg-red-500/10 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400">
              Kanal Resmi Kemenag Barut
            </span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
            Dokumentasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-400">Video</span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-500 dark:text-slate-400">
            Saksikan berbagai liputan, kegiatan, dan inovasi Kementerian Agama Barito Utara secara eksklusif langsung dari kanal YouTube kami.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          {/* Main Video (Besar) */}
          <div className="lg:col-span-3 flex flex-col group relative overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-200/50 transition-all duration-500 hover:shadow-3xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:shadow-slate-900/50">
            <div className="aspect-video w-full relative bg-slate-900">
              <iframe
                src={`https://www.youtube.com/embed/${currentVideo.youtube_id}?autoplay=0`}
                title={currentVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              ></iframe>
            </div>
            
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-20">
              <div className="flex-1 min-w-0">
                <span className="inline-block px-3 py-1 bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 text-[10px] font-black uppercase tracking-widest rounded-lg mb-3">
                  Sedang Diputar
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight line-clamp-2">
                  {currentVideo.title}
                </h3>
                <div className="mt-3 flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {currentVideo.created_at ? new Date(currentVideo.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : ""}
                  </div>
                </div>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${currentVideo.youtube_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/30 hover:-translate-y-1 active:scale-95"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
                <span>Tonton di YouTube</span>
              </a>
            </div>
          </div>

          {/* List Videos (Kanan) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">Video Lainnya</h4>
              <Link href="/video" className="group flex items-center gap-1.5 cursor-pointer">
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 group-hover:bg-red-50 group-hover:text-red-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-red-900/30 dark:group-hover:text-red-400 px-2.5 py-1 rounded-md uppercase tracking-wider transition-colors">
                  {initialVideos.length} Video
                </span>
                <svg className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-transform group-hover:translate-x-0.5 dark:text-slate-500 dark:group-hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="flex flex-col gap-3 mt-1">
              {sideVideos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setActiveVideo(video)}
                  className="group flex items-start w-full text-left gap-4 sm:gap-5 rounded-2xl p-3 sm:p-4 transition-all duration-300 bg-white border border-transparent shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:bg-slate-50 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 dark:bg-slate-900/40 dark:shadow-none dark:border-slate-800/60 dark:hover:bg-slate-800/80 dark:hover:border-slate-700"
                >
                  <div className="relative shrink-0 w-32 h-20 sm:w-36 sm:h-24 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 shadow-inner">
                    <Image
                      src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                      alt={video.title}
                      fill
                      sizes="(max-width: 640px) 96px, 144px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/30 transition-colors group-hover:bg-red-900/40">
                      <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-red-600">
                        <svg
                          className="w-4 h-4 text-white ml-0.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 pt-0.5 min-w-0 flex flex-col justify-center h-full">
                    <h4
                      className="text-sm font-bold leading-snug line-clamp-2 transition-colors duration-300 text-slate-800 group-hover:text-red-600 dark:text-slate-200 dark:group-hover:text-red-400"
                    >
                      {video.title}
                    </h4>
                    <div className="mt-2.5 flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          YouTube
                        </span>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                        {video.created_at ? new Date(video.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : ""}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
