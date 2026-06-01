"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  LogOut,
  User,
  Palette,
  Moon,
  Sun,
  ChevronDown,
  Settings,
  UserCircle,
  Lock,
} from "lucide-react";
import Link from "next/link";
import PasswordUpdateModal from "@/components/features/admin/PasswordUpdateModal";
import ProfileUpdateModal from "@/components/features/admin/ProfileUpdateModal";

export default function AdminUserMenu({
  profile,
  role,
  compactName,
  isDark,
  toggleTheme,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(profile);
  const menuRef = useRef(null);

  useEffect(() => {
    if (profile) {
      setCurrentProfile(profile);
    }
  }, [profile]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      setLoading(true);
      await fetch("/api/admin/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-2xl border-2 border-slate-50 bg-slate-50/50 pl-2 pr-3 py-1.5 dark:border-white/5 dark:bg-white/5 transition-all hover:border-slate-200 dark:hover:border-white/10"
      >
        {currentProfile?.avatar_url ? (
          <Image 
            src={currentProfile.avatar_url} 
            alt="Avatar" 
            width={32}
            height={32}
            className="h-8 w-8 rounded-xl object-cover shadow-sm"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
            <User size={16} strokeWidth={2.5} />
          </div>
        )}
        <div className="hidden sm:block text-left">
          <p className="truncate text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white leading-tight">
            {currentProfile?.full_name || compactName}
          </p>
          <p className="truncate text-[10px] font-bold text-slate-400 dark:text-slate-500 leading-tight mt-0.5">
            Level Akses: {role ? role.replace(/_/g, " ") : "-"}
          </p>
        </div>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl shadow-slate-200/50 ring-1 ring-black/5 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:shadow-none animate-in fade-in zoom-in-95 duration-100 z-50">
          <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1 sm:hidden">
            <p className="truncate text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
              {currentProfile?.full_name || compactName}
            </p>
            <p className="truncate text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">
              Level Akses: {role ? role.replace(/_/g, " ") : "-"}
            </p>
          </div>

          <div className="space-y-0.5">
            <button
              onClick={() => {
                toggleTheme();
                setIsOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-600 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-emerald-400"
            >
              <div className="flex items-center gap-2.5">
                <Palette size={16} />
                <span>Pilih Tema Warna</span>
              </div>
              {isDark ? (
                <Moon size={14} className="text-slate-400" />
              ) : (
                <Sun size={14} className="text-slate-400" />
              )}
            </button>

            <button
              onClick={() => {
                setIsProfileModalOpen(true);
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-600 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-emerald-400"
            >
              <UserCircle size={16} />
              <span>Ubah Profil</span>
            </button>

            <button
              onClick={() => {
                setIsPasswordModalOpen(true);
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-600 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-emerald-400"
            >
              <Lock size={16} />
              <span>Ubah Password</span>
            </button>
          </div>

          <div className="my-1.5 h-px bg-slate-100 dark:bg-slate-800" />

          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50 dark:text-rose-500 dark:hover:bg-rose-500/10 disabled:opacity-50"
          >
            <LogOut size={16} strokeWidth={2.5} />
            <span>{loading ? "Memproses..." : "Keluar Sesi"}</span>
          </button>
        </div>
      )}

      <ProfileUpdateModal 
        open={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        profile={currentProfile}
        onUpdateSuccess={(newProfileData) => {
          setCurrentProfile((prev) => ({ ...prev, ...newProfileData }));
        }}
      />
      
      <PasswordUpdateModal 
        open={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
}
