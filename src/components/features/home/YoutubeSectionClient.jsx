"use client";

import React, { useState } from "react";
import Image from "next/image";

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
        <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Dokumentasi Video
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-500 dark:text-slate-400">
            Saksikan berbagai liputan, kegiatan, dan inovasi Kementerian Agama
            Barito Utara melalui kanal YouTube resmi kami.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          {/* Main Video (Besar) */}
          <div className="lg:col-span-3 group relative overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl shadow-slate-900/20 transition-all duration-500 hover:shadow-3xl hover:-translate-y-1">
            <div className="aspect-video w-full relative">
              <iframe
                src={`https://www.youtube.com/embed/${currentVideo.youtube_id}?autoplay=0`}
                title={currentVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              ></iframe>
            </div>
            <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border-x border-b border-slate-100 dark:border-slate-800 rounded-b-[2rem] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {currentVideo.title}
                </h3>
                <div className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {currentVideo.created_at ? new Date(currentVideo.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : ""}
                </div>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${currentVideo.youtube_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 dark:bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:scale-95"
              >
                <span>Tonton di YouTube</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* List Videos (Kanan) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {sideVideos.map((video) => (
              <button
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="group flex items-start w-full text-left gap-4 sm:gap-5 rounded-2xl p-4 transition-all duration-300 active:scale-95 bg-white border border-slate-100 shadow-sm hover:bg-slate-50 hover:border-emerald-100 hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1 dark:bg-slate-900/60 dark:border-slate-800 dark:hover:bg-slate-800/80 dark:hover:border-emerald-900/30"
              >
                <div className="relative shrink-0 w-32 h-20 sm:w-40 sm:h-24 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 shadow-inner">
                  <Image
                    src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                    alt={video.title}
                    fill
                    sizes="(max-width: 640px) 96px, 128px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized // YouTube images domain
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 transition-colors group-hover:bg-emerald-900/40">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-md"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 pt-1 min-w-0 flex flex-col justify-center h-full">
                  <h4
                    className="text-sm sm:text-base font-bold leading-snug line-clamp-2 transition-colors duration-300 text-slate-800 group-hover:text-emerald-600 dark:text-slate-200 dark:group-hover:text-emerald-400"
                  >
                    {video.title}
                  </h4>
                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        YouTube
                      </span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {video.created_at ? new Date(video.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : ""}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
