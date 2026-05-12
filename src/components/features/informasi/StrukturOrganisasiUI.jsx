import React from "react";
import { User } from "lucide-react";
import PageBanner from "@/components/common/PageBanner";

// Sub-component for individual Profile Cards
const ProfileNode = ({ data, variant = "secondary", className = "" }) => {
  if (!data) return null;
  
  return (
    <div className={`w-[160px] sm:w-[180px] lg:w-[200px] flex flex-col items-center text-center p-3 sm:p-4 rounded-xl border bg-white shadow-sm transition-all hover:shadow-md dark:bg-[#0B1120] relative z-10 ${className}
      ${variant === 'primary' ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700/50'}
    `}>
      <div className="relative h-16 w-16 sm:h-20 sm:w-20 mb-3 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-inner flex items-center justify-center shrink-0">
        {data.image && data.image !== "/kemenag.svg" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.image} alt={data.name} className="h-full w-full object-cover" />
        ) : (
          <User className="h-8 w-8 sm:h-10 sm:w-10 text-slate-400" />
        )}
      </div>
      {/* Name Container with fixed min-height to ensure consistent baseline for job titles */}
      <div className="min-h-[40px] flex items-start justify-center w-full mb-2">
        <h4 className="font-bold text-[12px] sm:text-[13px] text-slate-900 dark:text-white leading-tight">{data.name}</h4>
      </div>
      
      {/* Job Title Container - Aligned to the top, extra space falls to the bottom of the card */}
      <div className="w-full pt-2 border-t border-slate-100 dark:border-slate-800/50 flex flex-col items-center">
        <p className="text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider leading-relaxed">{data.position}</p>
      </div>
    </div>
  );
};

export default function StrukturOrganisasiUI({ breadcrumb, leadershipData = [] }) {
  // Extract specific roles based on data
  const kepalaKantor = leadershipData.find(p => p.position.includes("Kepala Kantor"));
  const kasubbag = leadershipData.find(p => p.position.includes("Kepala Subbagian") || p.position.includes("Kasubbag"));
  const kasiList = leadershipData.filter(p => !p.position.includes("Kepala Kantor") && !p.position.includes("Kepala Subbagian") && !p.position.includes("Kasubbag"));

  // Jabatan Fungsional (Fallback if not in data)
  let jabatanFungsional = leadershipData.find(p => p.position.toLowerCase().includes("fungsional") || (p.name && p.name.toLowerCase().includes("fungsional")));
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
              <ProfileNode data={kepalaKantor} variant="primary" />
            </div>

            {/* MAIN VERTICAL STEM & KASUBBAG BRANCH */}
            <div className="relative w-full flex justify-center" style={{ height: "240px" }}>
              {/* Main Vertical Line */}
              <div className="w-[2px] h-full bg-emerald-500 dark:bg-emerald-600"></div>
              
              {/* Horizontal line extending right */}
              <div className="absolute top-1/2 left-1/2 w-24 sm:w-32 lg:w-48 h-[2px] bg-emerald-500 dark:bg-emerald-600 -translate-y-1/2"></div>
              
              {/* Kasubbag Node (Perfectly centered vertically on the line) */}
              <div className="absolute top-1/2 left-[calc(50%+6rem)] sm:left-[calc(50%+8rem)] lg:left-[calc(50%+12rem)] -translate-y-1/2 z-10">
                <ProfileNode data={kasubbag} />
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
                    <ProfileNode data={kasi} className="h-full flex-1" />
                  </div>
                </div>
              ))}
            </div>

            {/* STEM TO LEVEL 4 */}
            <div className="relative w-full flex justify-center" style={{ height: "60px" }}>
              <div className="w-[2px] h-full bg-emerald-500 dark:bg-emerald-600"></div>
            </div>

            {/* LEVEL 4: Jabatan Fungsional */}
            <div className="relative z-10">
              <ProfileNode data={jabatanFungsional} />
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
