"use client";

import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { motion } from "framer-motion";
import PageBanner from "@/components/common/PageBanner";
import { createClient } from "@/lib/supabase/client";


// Sub-component for individual Profile Cards
const ProfileNode = ({ data, variant = "secondary", className = "", delay = 0 }) => {
  if (!data) return null;
  
  const isPrimary = variant === 'primary';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`w-[160px] sm:w-[180px] lg:w-[200px] flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 relative z-10 ${className}
      ${isPrimary 
        ? 'bg-gradient-to-br from-[#052033] via-[#0b3b46] to-[#0e5f55] border-transparent shadow-2xl shadow-emerald-900/30 ring-4 ring-emerald-500/20' 
        : 'bg-white border-slate-100 shadow-lg shadow-slate-100/80 hover:shadow-xl hover:border-emerald-200 dark:bg-slate-900/80 dark:border-slate-800 dark:hover:border-emerald-800'}
    `}>
      <div className={`relative h-20 w-20 sm:h-24 sm:w-24 mb-4 rounded-full overflow-hidden border-4 shadow-lg flex items-center justify-center shrink-0 
        ${isPrimary ? 'border-white/20 ring-4 ring-emerald-400/20' : 'border-slate-50 ring-4 ring-slate-100 dark:border-slate-800 dark:ring-slate-700/50'}`}>
        {data.image && data.image !== "/assets/branding/kemenag.svg" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.image} alt={data.name} className="h-full w-full object-cover" style={{ objectPosition: `50% ${data.imageY ?? 50}%` }} />
        ) : (
          <User className={`h-10 w-10 sm:h-12 sm:w-12 ${isPrimary ? 'text-white/60' : 'text-slate-400'}`} />
        )}
      </div>
      {/* Name Container */}
      <div className="min-h-[44px] flex flex-col items-center justify-start w-full mb-2">
        <h4 className={`font-black text-[13px] sm:text-[14px] leading-tight ${isPrimary ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
          {data.name}
        </h4>
        {data.nip && data.nip !== "-" && (
          <div className={`mt-1.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 border ${isPrimary ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700'}`}>
            <p className={`text-[9px] sm:text-[10px] font-mono tracking-wide ${isPrimary ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
              NIP. {data.nip}
            </p>
          </div>
        )}
      </div>
      
      {/* Job Title Container */}
      <div className={`w-full pt-2.5 border-t flex flex-col items-center ${isPrimary ? 'border-white/10' : 'border-slate-100 dark:border-slate-800/50'}`}>
        <p className={`text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] leading-relaxed ${isPrimary ? 'text-emerald-300' : 'text-emerald-600 dark:text-emerald-400'}`}>
          {data.position}
        </p>
      </div>
    </motion.div>
  );
};

export default function StrukturOrganisasiUI({ breadcrumb, leadershipData = [] }) {
  // Local state - diinisialisasi dari data SSR (initial load cepat, SEO-friendly)
  const [leadershipList, setLeadershipList] = useState(leadershipData);

  useEffect(() => {
    // Sync jika prop server-side berubah (misal navigasi)
    setLeadershipList(leadershipData);
  }, [leadershipData]);

  // Fungsi untuk mengambil data terbaru dari API publik
  const fetchLatestData = async () => {
    try {
      const res = await fetch("/api/seksi", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setLeadershipList(data);
      }
    } catch (e) {
      // Silent fail – jangan ganggu UX pengguna
    }
  };

  useEffect(() => {
    // 1. Polling periodik setiap 5 detik sebagai fallback handal
    const interval = setInterval(fetchLatestData, 5000);

    // 2. Supabase Realtime: dengarkan sinyal broadcast dari admin
    const supabase = createClient();
    const channel = supabase.channel("site-updates");
    channel
      .on("broadcast", { event: "refresh-content" }, (payload) => {
        // Langsung refresh jika sinyal terkait seksi/organisasi
        const entity = payload?.payload?.entity;
        if (!entity || entity === "seksi" || entity === "content") {
          fetchLatestData();
        }
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  // Extract specific roles based on live state
  const kepalaKantor = leadershipList.find(p => p.position.includes("Kepala Kantor"));
  const kasubbag = leadershipList.find(p => p.position.includes("Kepala Subbagian") || p.position.includes("Kasubbag"));
  const kasiList = leadershipList.filter(p => !p.position.includes("Kepala Kantor") && !p.position.includes("Kepala Subbagian") && !p.position.includes("Kasubbag"));

  // Jabatan Fungsional (Fallback if not in data)
  let jabatanFungsional = leadershipList.find(p => p.position.toLowerCase().includes("fungsional") || (p.name && p.name.toLowerCase().includes("fungsional")));
  if (!jabatanFungsional) {
    jabatanFungsional = {
      name: "Kelompok Jabatan",
      position: "Fungsional",
      image: "" // Will trigger default User icon
    };
  }

  // Get current month and year in Indonesian
  const date = new Date();
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const currentMonth = monthNames[date.getMonth()];
  const currentYear = date.getFullYear();

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 dark:bg-[#050B14]">
      <PageBanner
        title="Struktur Organisasi"
        description="Bagan hierarki kepemimpinan dan struktural Kantor Kementerian Agama Kabupaten Barito Utara."
        breadcrumb={breadcrumb}
        eyebrow="Informasi Publik"
      />

      <div className="w-full px-4 sm:px-6 lg:px-10 mt-8 relative z-10">
        
        {/* Auto-updating Label (Top Right) */}
        <div className="w-full flex justify-end mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            * Bagan Struktur Organisasi Instansi ini diperbarui per bulan <span className="font-semibold text-emerald-600 dark:text-emerald-400 ml-1">{currentMonth} {currentYear}</span>.
          </div>
        </div>

        {/* Scrollable Container for Mobile to prevent Tree compression */}
        <div className="w-full overflow-x-auto pb-12 pt-2 hide-scrollbar">
          {/* More responsive min-width to fit within standard desktop screens at 100% zoom */}
          <div className="min-w-[1000px] lg:min-w-[1200px] w-full flex flex-col items-center">
            
            {/* LEVEL 1: Kepala Kantor */}
            <div className="relative z-10">
              <ProfileNode data={kepalaKantor} variant="primary" delay={0.1} />
            </div>

            {/* MAIN VERTICAL STEM & KASUBBAG BRANCH */}
            <div className="relative w-full flex justify-center" style={{ height: "240px" }}>
              {/* Main Vertical Line */}
              <div className="w-[2px] h-full bg-emerald-500 dark:bg-emerald-600"></div>
              
              {/* Horizontal line extending right */}
              <div className="absolute top-1/2 left-1/2 w-24 sm:w-32 lg:w-48 h-[2px] bg-emerald-500 dark:bg-emerald-600 -translate-y-1/2"></div>
              
              {/* Kasubbag Node (Perfectly centered on the profile image) */}
              <div className="absolute top-1/2 left-[calc(50%+6rem)] sm:left-[calc(50%+8rem)] lg:left-[calc(50%+12rem)] -translate-y-[56px] sm:-translate-y-[68px] z-10">
                <ProfileNode data={kasubbag} delay={0.3} />
              </div>
            </div>

            {/* LEVEL 3: 6 Kasi & Penyelenggara (Full Width Distribution, Equal Heights) */}
            <div className="w-full flex flex-row items-stretch justify-between relative">
              
              {/* Vertical line passing through the middle of Level 3 for Level 4 */}
              <div className="absolute top-0 left-1/2 -ml-[1px] w-[2px] h-full bg-emerald-500 dark:bg-emerald-600 z-0"></div>

              {kasiList.map((kasi, idx) => (
                <div key={idx} className="relative flex flex-col items-center flex-1 px-1">
                  
                  {/* Connecting vertical line to horizontal bar */}
                  <div className="absolute top-0 left-1/2 -ml-[1px] w-[2px] h-10 bg-emerald-500 dark:bg-emerald-600"></div>
                  
                  {/* The horizontal bar segment spanning across this item */}
                  <div className={`absolute top-0 h-[2px] bg-emerald-500 dark:bg-emerald-600
                    ${idx === 0 ? 'left-1/2 right-0' : idx === kasiList.length - 1 ? 'left-0 right-1/2' : 'left-0 right-0'}
                  `}></div>

                  {/* Node Wrapper with top padding and flex-grow to stretch */}
                  <div className="pt-10 w-full flex justify-center relative z-10 grow">
                    <ProfileNode data={kasi} className="h-full flex-1" delay={0.5 + (idx * 0.1)} />
                  </div>
                </div>
              ))}
            </div>

            {/* STEM TO LEVEL 4 */}
            <div className="relative w-full flex justify-center" style={{ height: "60px" }}>
              <div className="w-[2px] h-full bg-emerald-500 dark:bg-emerald-600"></div>
            </div>

            {/* LEVEL 4: Jabatan Fungsional */}
              <div className="w-full flex justify-end relative z-10 mt-12 pr-4 sm:pr-8 lg:pr-12">
                <ProfileNode data={jabatanFungsional} delay={0.8} />
              </div>

          </div>
        </div>
      </div>

      {/* Custom styles for hide-scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
