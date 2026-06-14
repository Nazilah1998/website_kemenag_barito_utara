"use client";

import React, { useState, useEffect } from "react";
import CoverImageWithFallback from "./CoverImageWithFallback";

export default function CoverImageLightbox({ src, alt, ...props }) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <div 
        className="group relative block w-full aspect-[16/9] cursor-pointer overflow-hidden bg-slate-50 dark:bg-slate-900"
        onClick={() => setIsOpen(true)}
        title="Klik untuk memperbesar gambar"
      >
        <CoverImageWithFallback src={src} alt={alt} {...props} />
        
        {/* Hover overlay icon */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center pointer-events-none">
           <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 dark:bg-black/50 p-3 rounded-full backdrop-blur-sm text-emerald-600 dark:text-emerald-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
           </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        >
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            title="Tutup (Esc)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          
          <div className="relative w-full max-w-6xl h-full flex items-center justify-center animate-in zoom-in-95 duration-200">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img 
               src={src || "/assets/branding/kemenag.svg"} 
               alt={alt} 
               className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default"
               onClick={(e) => e.stopPropagation()}
             />
          </div>
        </div>
      )}
    </>
  );
}
