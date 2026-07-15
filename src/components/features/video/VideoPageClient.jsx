"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function VideoPageClient({ videos }) {
  const [activeVideo, setActiveVideo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 8;
  const totalPages = Math.ceil(videos.length / itemsPerPage);
  
  const currentVideos = videos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeVideo]);

  if (!videos || videos.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Belum Ada Video</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
          Dokumentasi video Youtube saat ini belum tersedia atau sedang dalam proses pembaruan.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">

      {/* Grid of Other Videos */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <h4 className="text-base font-black uppercase tracking-widest text-slate-900 dark:text-white">Daftar Video Dokumentasi</h4>
          <span className="text-xs font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 px-3 py-1.5 rounded-lg uppercase tracking-wider">{videos.length} Video</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentVideos.map((video) => (
            <button
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="group flex flex-col text-left rounded-2xl overflow-hidden transition-all duration-300 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1.5 dark:bg-slate-900/40 dark:shadow-none border border-slate-200 dark:border-slate-800/60 dark:hover:bg-slate-800/80 dark:hover:border-slate-700"
            >
              <div className="relative w-full aspect-video overflow-hidden bg-slate-200 dark:bg-slate-800">
                <Image
                  src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                  alt={video.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/30 transition-colors group-hover:bg-red-900/40">
                  <div className="h-12 w-12 rounded-full backdrop-blur-sm flex items-center justify-center transition-transform group-hover:scale-110 bg-white/20 group-hover:bg-red-600">
                    <svg
                      className="w-5 h-5 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="p-5 flex flex-col justify-between flex-1">
                <h4
                  className="text-sm font-bold leading-relaxed line-clamp-2 transition-colors duration-300 text-slate-800 group-hover:text-red-600 dark:text-slate-200 dark:group-hover:text-red-400 mb-4"
                >
                  {video.title}
                </h4>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      YouTube
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                    {video.created_at ? new Date(video.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : ""}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                    currentPage === i + 1
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Floating Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setActiveVideo(null)}
          ></div>
          <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden bg-black shadow-2xl shadow-black/50 border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-red-600 hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-video w-full relative bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtube_id}?autoplay=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              ></iframe>
            </div>
            <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 flex justify-between items-center gap-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white line-clamp-1">{activeVideo.title}</h3>
              <a 
                href={`https://www.youtube.com/watch?v=${activeVideo.youtube_id}`}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                <span>Buka di YouTube</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
