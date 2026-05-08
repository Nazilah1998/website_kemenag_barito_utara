import React from "react";

export default function SectionHeader({ label, title, color, center = false, align = "left" }) {
    return (
        <div className={`mb-6 ${center ? "text-center" : align === "right" ? "lg:text-right" : "text-left"}`}>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${color}`}>
                {label}
            </p>
            <h2 className="mt-1 text-lg font-black tracking-tight text-slate-900 dark:text-white">
                {title}
            </h2>
        </div>
    );
}
