"use client";

import Image from "next/image";
import { useMemo } from "react";

const COLORS = [
  "from-emerald-500 to-emerald-600",
  "from-blue-500 to-blue-600",
  "from-violet-500 to-violet-600",
  "from-amber-500 to-amber-600",
  "from-rose-500 to-rose-600",
  "from-cyan-500 to-cyan-600",
  "from-indigo-500 to-indigo-600",
  "from-teal-500 to-teal-600",
  "from-pink-500 to-pink-600",
  "from-orange-500 to-orange-600",
];

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
}

function getColorIndex(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % COLORS.length;
}

export default function Avatar({ src, alt, className = "", priority, sizes, style, foto_kepala_y = 50 }) {
  const initials = useMemo(() => getInitials(alt || ""), [alt]);
  const gradient = useMemo(() => COLORS[getColorIndex(alt || "")], [alt]);

  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition: `50% ${foto_kepala_y}%`, ...style }}
        />
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br ${gradient} flex items-center justify-center ${className}`}
      aria-label={alt}
    >
      <span className="select-none text-white font-black leading-none text-xl lg:text-2xl">
        {initials}
      </span>
    </div>
  );
}
