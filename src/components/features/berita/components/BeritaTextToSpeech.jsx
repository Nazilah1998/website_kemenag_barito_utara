"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

const normalizeTextForSpeech = (text) => {
  let result = text;
  
  // Gelar Kehormatan & Agama
  result = result.replace(/\bH\.\s/g, "Haji ");
  result = result.replace(/\bHj\.\s/g, "Hajjah ");
  result = result.replace(/\bProf\.\s/gi, "Profesor ");
  result = result.replace(/\bDr\.\s/g, "Doktor ");
  result = result.replace(/\bdr\.\s/g, "Dokter ");
  result = result.replace(/\bDrs\.\s/gi, "Doktorandus ");
  result = result.replace(/\bDra\.\s/gi, "Doktoranda ");
  
  // Gelar Akademik
  result = result.replace(/\bS\.Ag\./gi, "Sarjana Agama");
  result = result.replace(/\bM\.A\.P\./gi, "Magister Administrasi Publik");
  result = result.replace(/\bS\.Pd\.I\./gi, "Sarjana Pendidikan Islam");
  result = result.replace(/\bM\.Pd\.I\./gi, "Magister Pendidikan Islam");
  result = result.replace(/\bS\.Pd\./gi, "Sarjana Pendidikan");
  result = result.replace(/\bM\.Pd\./gi, "Magister Pendidikan");
  result = result.replace(/\bS\.E\./gi, "Sarjana Ekonomi");
  result = result.replace(/\bS\.H\./gi, "Sarjana Hukum");
  result = result.replace(/\bM\.H\./gi, "Magister Hukum");
  result = result.replace(/\bM\.Si\./gi, "Magister Sains");
  result = result.replace(/\bS\.Sos\./gi, "Sarjana Sosial");
  result = result.replace(/\bM\.M\./gi, "Magister Manajemen");
  
  // Singkatan Instansi Kemenag
  result = result.replace(/\bMTsN\b/gi, "Madrasah Tsanawiyah Negeri ");
  result = result.replace(/\bMIN\b/g, "Madrasah Ibtidaiyah Negeri ");
  result = result.replace(/\bMAN\b/g, "Madrasah Aliyah Negeri ");
  result = result.replace(/\bKUA\b/gi, "Kantor Urusan Agama ");
  result = result.replace(/\bBarut\b/gi, "Barito Utara");
  result = result.replace(/\bKemenag\b/gi, "Kementerian Agama");
  result = result.replace(/\bKanwil\b/gi, "Kantor Wilayah");
  
  // Singkatan umum
  result = result.replace(/\ba\.n\./gi, "atas nama");
  result = result.replace(/\bdkk\./gi, "dan kawan kawan");
  
  // Bersihkan koma bertumpuk
  result = result.replace(/,\s*,/g, ", ");
  
  return result;
};

export default function BeritaTextToSpeech({ title, content }) {
  const { locale } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [progressData, setProgressData] = useState({ current: 0, total: 0 });
  const [estimatedMinutes, setEstimatedMinutes] = useState(0);
  
  const shouldPlay = useRef(false);
  
  useEffect(() => {
    // Estimasi waktu baca kasar (130 kata per menit)
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    const words = plainText.trim().split(/\s+/).length;
    setEstimatedMinutes(Math.max(1, Math.ceil(words / 130)));

    if (typeof window !== "undefined" && window.speechSynthesis) {
      setIsSupported(true);
      // Pancing browser agar me-load daftar suara (terutama untuk Chrome)
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
    
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        shouldPlay.current = false;
        window.speechSynthesis.cancel();
      }
    };
  }, [content]);

  const handleTogglePlay = () => {
    if (!window.speechSynthesis) return;

    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }

    if (isPlaying && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    // Mulai pemutaran dari awal
    shouldPlay.current = true;
    window.speechSynthesis.cancel(); // Bersihkan antrian
    
    // Ekstraksi teks dari HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    
    // Normalisasi singkatan dan gelar sebelum dibaca
    const normalizedTitle = normalizeTextForSpeech(title);
    const normalizedContent = normalizeTextForSpeech(plainText);
    const fullText = `${normalizedTitle}... ${normalizedContent}`; 
    
    // Pecah teks menjadi kalimat-kalimat kecil untuk menghindari bug browser 
    // HANYA memecah berdasarkan titik, tanda seru/tanya, dan enter. 
    // Koma (,) TIDAK lagi dipakai memecah agar tidak tersendat-sendat.
    const chunks = fullText.match(/[^.!?\n]+[.!?\n]+|\s*[^.!?\n]+$/g) || [fullText];
    let currentIndex = 0;
    setProgressData({ current: 0, total: chunks.length });

    const playNextChunk = () => {
      if (!shouldPlay.current || currentIndex >= chunks.length) {
        setIsPlaying(false);
        setIsPaused(false);
        shouldPlay.current = false;
        setProgressData(prev => ({ ...prev, current: 0 }));
        return;
      }

      setProgressData({ current: currentIndex + 1, total: chunks.length });
      const chunk = chunks[currentIndex].trim();
      if (!chunk) {
        currentIndex++;
        playNextChunk();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = locale === "en" ? "en-US" : "id-ID";
      utterance.rate = 0.9; // Sedikit turun agar artikulasi jelas
      utterance.pitch = 1.15; // Pitch dinaikkan agar terdengar lebih tinggi/feminin, mengantisipasi jika browser hanya punya suara pria
      
      // Cari suara "Wanita" / Penyiar berita perempuan
      const voices = window.speechSynthesis.getVoices();
      const targetLang = locale === "en" ? "en" : "id";
      const availableVoices = voices.filter(v => v.lang.toLowerCase().includes(targetLang));
      
      // Prioritas 1: Suara yang pasti perempuan
      let femaleVoice = availableVoices.find(v => 
        v.name.includes("Siti") || // Suara perempuan natural MS Edge
        v.name.includes("Gadis") ||
        v.name.includes("Female") || 
        v.name.includes("Wanita") ||
        (v.name.includes("Google") && !v.name.includes("Male")) || // Google Bahasa Indonesia biasanya perempuan
        (v.name.includes("Natural") && !v.name.includes("Ardi") && !v.name.includes("Andi") && !v.name.includes("Male"))
      );
      
      // Prioritas 2: Jika tidak ada, ambil suara APA SAJA yang BUKAN laki-laki
      if (!femaleVoice) {
        femaleVoice = availableVoices.find(v => 
          !v.name.includes("Ardi") && 
          !v.name.includes("Andi") && 
          !v.name.includes("Andika") && // Windows Andika adalah laki-laki
          !v.name.includes("Male") &&
          !v.name.includes("Pria")
        );
      }
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      } else if (availableVoices.length > 0) {
        // Fallback terakhir
        utterance.voice = availableVoices[0];
      }

      utterance.onend = () => {
        if (!shouldPlay.current) return;
        currentIndex++;
        playNextChunk();
      };
      
      utterance.onerror = (e) => {
        // Abaikan error "interrupted" atau "canceled" karena itu terjadi saat ganti antrian
        if (e.error !== "interrupted" && e.error !== "canceled") {
          console.error("Speech synthesis error", e);
          setIsPlaying(false);
          setIsPaused(false);
          shouldPlay.current = false;
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    setIsPlaying(true);
    setIsPaused(false);
    playNextChunk();
  };
  
  const handleStop = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      shouldPlay.current = false;
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setProgressData({ current: 0, total: 0 });
    }
  }

  if (!isSupported) return null;

  const progressPercent = progressData.total > 0 
    ? Math.min(100, Math.round((progressData.current / progressData.total) * 100)) 
    : 0;

  return (
    <div className="rounded-[24px] sm:rounded-[28px] border border-emerald-200 bg-emerald-50 p-4 sm:p-5 shadow-sm transition-colors dark:border-emerald-900/30 dark:bg-emerald-900/10 mb-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-400 truncate">
            Dengarkan Berita
          </p>
          <p className="text-[10px] sm:text-[11px] font-medium text-emerald-600/80 dark:text-emerald-500/80 mt-1 uppercase tracking-wider leading-relaxed line-clamp-2">
            {!isPlaying ? `Estimasi waktu: ~${estimatedMinutes} Menit` : 'Sedang membacakan...'}
          </p>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
            {isPlaying && (
                <button
                    onClick={handleStop}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                    aria-label="Stop reading"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                        <path d="M6 6h12v12H6z" />
                    </svg>
                </button>
            )}
            
            <button
              onClick={handleTogglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md transition hover:bg-emerald-700 hover:shadow-lg dark:bg-emerald-500 dark:hover:bg-emerald-600"
              aria-label={isPlaying && !isPaused ? "Pause" : "Play"}
            >
              {isPlaying && !isPaused ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 ml-0.5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
        </div>
      </div>
      
      {isPlaying && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-[10px] font-bold text-emerald-700 dark:text-emerald-400 mb-1.5 px-0.5">
             <span className="flex items-center gap-1.5">
               {isPaused ? "Dijeda" : (
                 <>
                   <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
                   Proses membaca
                 </>
               )}
             </span>
             <span>{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-emerald-200/50 dark:bg-emerald-900/40 rounded-full overflow-hidden">
             <div 
               className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
               style={{ width: `${progressPercent}%` }}
             />
          </div>
        </div>
      )}
    </div>
  );
}
