"use client";

import React, { useState } from "react";
import { 
  Building2, 
  BookOpen, 
  GraduationCap, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  Clock,
  Compass,
  ArrowUpRight,
  ChevronDown
} from "lucide-react";
import PageBanner from "@/components/common/PageBanner";
import { useLanguage } from "@/context/LanguageContext";
import { serviceFlow, serviceRequirements, serviceFaqs } from "@/data/services";

// Helper to match icon based on category title
const getCategoryIcon = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("kua") || t.includes("keagamaan") || t.includes("nikah")) {
    return <Building2 className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />;
  }
  if (t.includes("haji") || t.includes("umrah")) {
    return <BookOpen className="h-6 w-6 text-teal-600 dark:text-teal-400" />;
  }
  if (t.includes("pendidikan") || t.includes("madrasah")) {
    return <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />;
  }
  return <HelpCircle className="h-6 w-6 text-slate-600 dark:text-slate-400" />;
};

// Helper for HSL-tailored gradient accent colors
const getCategoryColorStyles = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("kua") || t.includes("keagamaan") || t.includes("nikah")) {
    return {
      badgeBg: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400",
      borderHover: "hover:border-emerald-300 dark:hover:border-emerald-800/60",
      glowBg: "from-emerald-500/10 to-transparent",
      iconContainer: "bg-emerald-100/60 dark:bg-emerald-950/40",
      bulletColor: "text-emerald-500 dark:text-emerald-400"
    };
  }
  if (t.includes("haji") || t.includes("umrah")) {
    return {
      badgeBg: "bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400",
      borderHover: "hover:border-teal-300 dark:hover:border-teal-800/60",
      glowBg: "from-teal-500/10 to-transparent",
      iconContainer: "bg-teal-100/60 dark:bg-teal-950/40",
      bulletColor: "text-teal-500 dark:text-teal-400"
    };
  }
  if (t.includes("pendidikan") || t.includes("madrasah")) {
    return {
      badgeBg: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400",
      borderHover: "hover:border-blue-300 dark:hover:border-blue-800/60",
      glowBg: "from-blue-500/10 to-transparent",
      iconContainer: "bg-blue-100/60 dark:bg-blue-950/40",
      bulletColor: "text-blue-500 dark:text-blue-400"
    };
  }
  return {
    badgeBg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    borderHover: "hover:border-slate-300 dark:hover:border-slate-700",
    glowBg: "from-slate-500/10 to-transparent",
    iconContainer: "bg-slate-100 dark:bg-slate-800",
    bulletColor: "text-slate-500 dark:text-slate-400"
  };
};

export default function LayananClientPage({ initialServices }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("catalog");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const tabs = [
    { id: "catalog", label: "Katalog Layanan", icon: <Building2 className="h-4 w-4" /> },
    { id: "flow", label: "Alur Pelayanan", icon: <Compass className="h-4 w-4" /> },
    { id: "requirements", label: "Persyaratan Umum", icon: <FileSpreadsheet className="h-4 w-4" /> },
    { id: "faq", label: "Tanya Jawab (FAQ)", icon: <HelpCircle className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 dark:bg-[#050B14] transition-colors duration-300">
      <PageBanner
        title="Layanan Publik"
        description="Pusat informasi satu pintu mengenai jenis layanan, prosedur, persyaratan, dan standardisasi pelayanan publik pada Kantor Kementerian Agama Kabupaten Barito Utara."
        breadcrumb={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.layanan") }
        ]}
        eyebrow="Pusat Pelayanan Terpadu"
      />

      {/* Main Container - FULL WIDTH as per Guidelines */}
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 mt-10 relative z-10 space-y-8">
        
        {/* Navigation Tabs - Glassmorphism, Rounded, Animated */}
        <div className="flex overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
          <div className="flex p-1.5 gap-2 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-[#0B1120] dark:border-slate-800/80 backdrop-blur-md w-full sm:w-auto shrink-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 ${
                    isActive 
                      ? "text-white shadow-sm" 
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  {isActive && (
                    <div
                      className="absolute inset-0 bg-emerald-600 rounded-xl -z-10"
                    />
                  )}
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Tab Contents */}
        <div className="min-h-[500px]">
          {activeTab === "catalog" && (
              <div
                key="catalog"
                className="space-y-6 animate-fade-in-up"
              >
                <div className="max-w-3xl">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Daftar Layanan Publik</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Berikut adalah seluruh layanan yang dikelompokkan berdasarkan seksi dan bidang fungsional.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                  {initialServices.map((item, idx) => {
                    const colors = getCategoryColorStyles(item.title);
                    const serviceItems = Array.isArray(item.items) ? item.items : JSON.parse(item.items || "[]");

                    return (
                      <div
                        key={item.id || idx}
                        className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 ${colors.borderHover} hover:shadow-xl dark:border-slate-800/80 dark:bg-[#0B1120]/80 backdrop-blur-md`}
                      >
                        <div className={`absolute inset-0 bg-radial-to-br ${colors.glowBg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                        <div className="relative z-10 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colors.iconContainer} shadow-inner`}>
                              {getCategoryIcon(item.title)}
                            </div>
                            <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase ${colors.badgeBg}`}>
                              Layanan #{idx + 1}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors duration-200">
                              {item.title}
                            </h4>
                            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-3">
                              {item.description}
                            </p>
                          </div>

                          {serviceItems && serviceItems.length > 0 && (
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/40">
                              <ul className="space-y-2">
                                {serviceItems.map((subItem, sIdx) => (
                                  <li key={sIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                                    <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${colors.bulletColor}`} />
                                    <span className="line-clamp-2 leading-relaxed">{subItem}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/40 relative z-10 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400 group-hover:underline">
                          <span>Seksi & Persyaratan</span>
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "flow" && (
              <div
                key="flow"
                className="space-y-8 animate-fade-in-up"
              >
                <div className="max-w-3xl">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Alur Pelayanan Publik</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Prosedur umum pelibatan masyarakat dalam pengurusan layanan keagamaan dan administrasi di kantor kami.
                  </p>
                </div>

                {/* Animated Flow Steps */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 relative">
                  {serviceFlow.map((flow, idx) => (
                    <div 
                      key={idx}
                      className="relative flex flex-col justify-between p-6 bg-white border border-slate-200 rounded-3xl shadow-sm dark:bg-[#0B1120] dark:border-slate-800/80 hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition-all duration-300"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-4xl font-extrabold text-slate-200 dark:text-slate-800 tracking-tighter">
                            {flow.step}
                          </span>
                          <div className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-400">
                            Tahap
                          </div>
                        </div>

                        <h4 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                          {flow.title}
                        </h4>
                        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          {flow.description}
                        </p>
                      </div>

                      {idx < serviceFlow.length - 1 && (
                        <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-20">
                          <ArrowRight className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "requirements" && (
              <div
                key="requirements"
                className="space-y-8 animate-fade-in-up"
              >
                <div className="max-w-3xl">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Persyaratan Umum</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Persyaratan administrasi mendasar yang berlaku umum untuk mempermudah proses pelayanan.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  {serviceRequirements.map((req, idx) => (
                    <div 
                      key={idx}
                      className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm dark:bg-[#0B1120] dark:border-slate-800/80 space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white tracking-tight">{req.title}</h4>
                      </div>

                      <ul className="space-y-3 pt-2">
                        {req.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "faq" && (
              <div
                key="faq"
                className="space-y-6 animate-fade-in-up"
              >
                <div className="max-w-3xl">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Tanya Jawab Pelayanan</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Pertanyaan yang sering diajukan mengenai pelayanan publik pada Kantor Kementerian Agama Barito Utara.
                  </p>
                </div>

                <div className="max-w-4xl space-y-3">
                  {serviceFaqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div 
                        key={idx}
                        className="bg-white border border-slate-200 rounded-2xl overflow-hidden dark:bg-[#0B1120] dark:border-slate-800/80 transition-all duration-300"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="flex items-center justify-between w-full p-5 text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isOpen && (
                          <div
                            className="overflow-hidden transition-all duration-300"
                          >
                            <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-50 dark:border-slate-900">
                              {faq.answer}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
