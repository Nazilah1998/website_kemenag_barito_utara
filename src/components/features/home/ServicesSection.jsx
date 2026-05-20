import React from "react";
import Link from "next/link";
import { 
  Building2, 
  BookOpen, 
  GraduationCap, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  ArrowUpRight
} from "lucide-react";
import { serviceCategories } from "@/data/services";

// Helper to match icon based on category title
const getCategoryIcon = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("kua") || t.includes("keagamaan") || t.includes("nikah")) {
    return <Building2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />;
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

export default function ServicesSection({ services }) {
  // Use DB data if available, fallback to static categories
  const displayServices = services && services.length > 0 
    ? services 
    : serviceCategories;

  return (
    <section className="py-12 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/2 rounded-full blur-3xl pointer-events-none" />

      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="max-w-3xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">
            Layanan Publik
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Katalog Layanan Publik Kemenag
          </h2>
          <p className="text-base text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Daftar komprehensif layanan keagamaan, administrasi, dan bimbingan masyarakat yang diselenggarakan secara transparan dan akuntabel.
          </p>
        </div>

        <Link
          href="/layanan/sekjen"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors self-start md:self-end"
        >
          Lihat Semua Layanan
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 relative z-10">
        {displayServices.map((item, idx) => {
          const colors = getCategoryColorStyles(item.title);
          const serviceItems = Array.isArray(item.items) ? item.items : JSON.parse(item.items || "[]");

          return (
            <div
              key={item.id || idx}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 ${colors.borderHover} hover:shadow-xl dark:border-slate-800/80 dark:bg-[#0B1120]/80 backdrop-blur-md`}
            >
              {/* Radial gradient background hover effect */}
              <div className={`absolute inset-0 bg-radial-to-br ${colors.glowBg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              <div className="relative z-10 space-y-4">
                {/* Header Icon & Top Info */}
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colors.iconContainer} shadow-inner`}>
                    {getCategoryIcon(item.title)}
                  </div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase ${colors.badgeBg}`}>
                    Layanan #{idx + 1}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Sub-items List */}
                {serviceItems && serviceItems.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/40">
                    <ul className="space-y-2">
                      {serviceItems.slice(0, 3).map((subItem, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${colors.bulletColor}`} />
                          <span className="line-clamp-2 leading-relaxed">{subItem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom CTA Arrow Link */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/40 relative z-10 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                <span>Pelajari Persyaratan</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}