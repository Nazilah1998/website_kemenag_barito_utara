"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function BeritaReactions({ slug, initialReactions }) {
  const { locale } = useLanguage();
  const [reactions, setReactions] = useState({
    bermanfaat: initialReactions?.reaction_bermanfaat || 0,
    inspiratif: initialReactions?.reaction_inspiratif || 0,
    informatif: initialReactions?.reaction_informatif || 0
  });
  const [selectedType, setSelectedType] = useState(null);
  const [userReacted, setUserReacted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(null);

  useEffect(() => {
    let mounted = true;

    // Check local storage for user's previous reaction
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        const savedReaction = localStorage.getItem(`react_berita_${slug}`);
        if (savedReaction) {
          setUserReacted(true);
          setSelectedType(savedReaction);
        }
      }
    }, 0);

    // Fetch real-time reaction counts from the server
    async function fetchReactions() {
      try {
        const res = await fetch(`/api/berita/${slug}/react`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (mounted && data) {
            setReactions({
              bermanfaat: data.reaction_bermanfaat || 0,
              inspiratif: data.reaction_inspiratif || 0,
              informatif: data.reaction_informatif || 0
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch latest reactions:", err);
      }
    }
    
    fetchReactions();

    return () => {
      clearTimeout(timer);
      mounted = false;
    };
  }, [slug]);

  const handleReact = async (type) => {
    let action = "add";
    let previousType = null;

    if (userReacted) {
      if (selectedType === type) {
        action = "remove";
      } else {
        action = "switch";
        previousType = selectedType;
      }
    }

    // Optimistic UI update
    setIsAnimating(type);
    
    setReactions(prev => {
      const next = { ...prev };
      if (action === "remove") {
        next[type] = Math.max(0, next[type] - 1);
      } else if (action === "switch") {
        next[previousType] = Math.max(0, next[previousType] - 1);
        next[type] = next[type] + 1;
      } else {
        next[type] = next[type] + 1;
      }
      return next;
    });

    if (action === "remove") {
      setUserReacted(false);
      setSelectedType(null);
      if (typeof window !== "undefined") localStorage.removeItem(`react_berita_${slug}`);
    } else {
      setUserReacted(true);
      setSelectedType(type);
      if (typeof window !== "undefined") localStorage.setItem(`react_berita_${slug}`, type);
    }

    try {
      const res = await fetch(`/api/berita/${slug}/react`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, action, previousType }),
      });
      
      if (!res.ok) {
        // Revert if failed
        setReactions(prev => {
           const revert = { ...prev };
           if (action === "remove") {
             revert[type] = revert[type] + 1;
           } else if (action === "switch") {
             revert[previousType] = revert[previousType] + 1;
             revert[type] = Math.max(0, revert[type] - 1);
           } else {
             revert[type] = Math.max(0, revert[type] - 1);
           }
           return revert;
        });
        
        if (action === "remove") {
          setUserReacted(true);
          setSelectedType(type);
          if (typeof window !== "undefined") localStorage.setItem(`react_berita_${slug}`, type);
        } else if (action === "switch") {
          setUserReacted(true);
          setSelectedType(previousType);
          if (typeof window !== "undefined") localStorage.setItem(`react_berita_${slug}`, previousType);
        } else {
          setUserReacted(false);
          setSelectedType(null);
          if (typeof window !== "undefined") localStorage.removeItem(`react_berita_${slug}`);
        }
        
        if (res.status === 429) {
          alert("Anda terlalu sering mengubah reaksi. Silakan coba lagi nanti.");
        }
      }
    } catch (err) {
      // Revert if failed (network error)
      setReactions(prev => {
         const revert = { ...prev };
         if (action === "remove") {
           revert[type] = revert[type] + 1;
         } else if (action === "switch") {
           revert[previousType] = revert[previousType] + 1;
           revert[type] = Math.max(0, revert[type] - 1);
         } else {
           revert[type] = Math.max(0, revert[type] - 1);
         }
         return revert;
      });
      
      if (action === "remove") {
        setUserReacted(true);
        setSelectedType(type);
        if (typeof window !== "undefined") localStorage.setItem(`react_berita_${slug}`, type);
      } else if (action === "switch") {
        setUserReacted(true);
        setSelectedType(previousType);
        if (typeof window !== "undefined") localStorage.setItem(`react_berita_${slug}`, previousType);
      } else {
        setUserReacted(false);
        setSelectedType(null);
        if (typeof window !== "undefined") localStorage.removeItem(`react_berita_${slug}`);
      }
    }
    
    setTimeout(() => setIsAnimating(null), 1000);
  };

  const reactionOptions = [
    { type: 'bermanfaat', icon: '👍', label: locale === 'en' ? 'Helpful' : 'Bermanfaat', count: reactions.bermanfaat },
    { type: 'inspiratif', icon: '👏', label: locale === 'en' ? 'Inspiring' : 'Inspiratif', count: reactions.inspiratif },
    { type: 'informatif', icon: '💡', label: locale === 'en' ? 'Informative' : 'Informatif', count: reactions.informatif }
  ];

  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          {locale === 'en' ? 'What do you think about this article?' : 'Apa pendapat Anda tentang artikel ini?'}
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          {locale === 'en' ? 'Give your reaction below' : 'Berikan reaksi Anda di bawah ini'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto">
        {reactionOptions.map((opt) => {
          const isSelected = selectedType === opt.type;
          const animating = isAnimating === opt.type;
          
          return (
            <button
              key={opt.type}
              onClick={() => handleReact(opt.type)}
              className={`
                relative group flex flex-col items-center justify-center py-3 px-1 sm:p-4 rounded-3xl transition-all duration-300
                hover:-translate-y-1 cursor-pointer
                ${isSelected ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/50 shadow-inner' : 'bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800 hover:shadow-md'}
                border w-full active:scale-95
              `}
            >
              <div className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">
                <span className={animating ? 'inline-block animate-bounce' : 'inline-block'}>
                  {opt.icon}
                </span>
              </div>
              <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wide mb-1 text-center ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                {opt.label}
              </span>
              <span className={`text-sm font-black ${isSelected ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}>
                {opt.count}
              </span>
              
              {/* Ripple Effect Background when clicked */}
              {animating && (
                <span className="absolute inset-0 rounded-3xl border-2 border-emerald-400 animate-ping opacity-20"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
