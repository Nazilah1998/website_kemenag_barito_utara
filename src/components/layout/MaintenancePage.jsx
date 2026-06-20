import React from "react";
import Image from "next/image";

export default function MaintenancePage({ title, message }) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#fafafa] text-slate-800 overflow-x-hidden font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.15)_0%,_rgba(250,250,250,0)_70%)] z-0 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[600px] p-8 flex flex-col items-center text-center">
        <div className="mb-10">
          <div className="w-20 h-20 mx-auto mb-4 drop-shadow-md relative">
            <Image src="/assets/branding/kemenag.svg" alt="Kemenag" fill className="object-contain" />
          </div>
          <div className="text-2xl font-black text-emerald-800 tracking-widest leading-snug">KEMENTERIAN AGAMA<br/>REPUBLIK INDONESIA</div>
          <div className="text-xs font-extrabold text-emerald-500 tracking-[0.15em] mt-2 uppercase">Kantor Kabupaten Barito Utara</div>
        </div>
        
        <div className="bg-white rounded-[1.5rem] p-12 w-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] border-t-4 border-emerald-400 relative">
          <div className="w-14 h-14 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
            {title ? title.split(' ').map((w,i)=><React.Fragment key={i}>{w}<br/></React.Fragment>) : <>Sistem Dalam<br/>Pemeliharaan</>}
          </h1>
          <p className="text-base text-slate-500 leading-relaxed mb-10">
            {message || "Sistem sedang dinonaktifkan oleh admin. Silakan kembali beberapa saat lagi."}
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full text-xs font-bold text-slate-700">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              Sedang Dalam Pengerjaan
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full text-xs font-bold text-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-emerald-500">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              Data Anda Tetap Aman
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-xs text-slate-400 font-medium">
          &copy; {new Date().getFullYear()} Website Kemenag Barito Utara. Hak Cipta Dilindungi.
        </div>
      </div>
    </div>
  );
}
