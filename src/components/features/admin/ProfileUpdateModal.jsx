"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { createPortal } from "react-dom";
import Cropper from "react-easy-crop";

export default function ProfileUpdateModal({ open, onClose, profile, onUpdateSuccess }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  
  // Cropper states
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [rawImageSrc, setRawImageSrc] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open && profile) {
      setFullName(profile.full_name || "");
      setEmail(profile.email || "");
      setAvatarPreview(profile.avatar_url || "");
      setAvatarFile(null);
      setError("");
      setSuccess("");
      setIsCropping(false);
    }
  }, [open, profile]);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  if (!open || !mounted) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran foto maksimal 2MB");
      return;
    }
    
    const url = URL.createObjectURL(file);
    setRawImageSrc(url);
    setIsCropping(true);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setError("");
    e.target.value = null; // reset input
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const generateCroppedImage = async () => {
    try {
      const image = await createImage(rawImageSrc);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) return;
          // Add a custom property to simulate a File
          blob.name = "avatar.jpg";
          resolve(blob);
        }, "image/jpeg", 0.95);
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleCropApply = async () => {
    const croppedBlob = await generateCroppedImage();
    if (croppedBlob) {
      setAvatarFile(croppedBlob);
      setAvatarPreview(URL.createObjectURL(croppedBlob));
      setIsCropping(false);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sesi tidak valid");

      let finalAvatarUrl = profile?.avatar_url;

      // Upload avatar jika ada perubahan
      if (avatarFile) {
        const fileExt = "jpg";
        const fileName = `${session.user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, { upsert: true, contentType: "image/jpeg" });

        if (uploadError) {
          throw new Error("Gagal mengunggah foto profil: " + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        finalAvatarUrl = publicUrlData.publicUrl;
      }

      // Update ke database
      const response = await fetch("/api/admin/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          avatarUrl: finalAvatarUrl,
          accessToken: session.access_token
        }),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message || "Gagal memperbarui profil");

      setSuccess("Profil berhasil diperbarui.");
      
      // Call success callback to refresh data in parent
      if (onUpdateSuccess) {
        onUpdateSuccess({ full_name: fullName, email, avatar_url: finalAvatarUrl });
      }

      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 2000);

    } catch (err) {
      setError(err?.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  const getInitials = (name) => {
    if (!name) return "A";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={(!loading && !isCropping) ? onClose : undefined} 
      />

      <div className="relative w-full max-w-md animate-in zoom-in slide-in-from-bottom-8 duration-300 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        
        {isCropping ? (
          <div className="flex flex-col items-center">
            <h3 className="mb-4 text-xl font-black tracking-tight text-slate-900 dark:text-white">Sesuaikan Foto</h3>
            <p className="mb-6 text-center text-xs font-medium text-slate-500">Geser atau zoom untuk menempatkan wajah di tengah bingkai.</p>
            
            <div className="relative h-64 w-full overflow-hidden rounded-3xl border-2 border-slate-100 bg-slate-900 dark:border-slate-700">
              <Cropper
                image={rawImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="mt-6 flex w-full items-center gap-4">
              <span className="text-xs font-bold text-slate-400">Zoom</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(e.target.value)}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-emerald-600 dark:bg-slate-700"
              />
            </div>

            <div className="mt-8 flex w-full gap-3">
              <button
                type="button"
                onClick={handleCropApply}
                className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-emerald-600 px-6 text-[12px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95"
              >
                Terapkan
              </button>
              <button
                type="button"
                onClick={() => setIsCropping(false)}
                className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-[12px] font-black uppercase tracking-widest text-slate-600 transition-all hover:border-slate-900 hover:text-slate-900 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-white dark:hover:text-white"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Header at the top */}
            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Ubah Profil</h3>
            <p className="mt-2 mb-8 px-6 text-center text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
              Perbarui informasi profil Anda untuk tetap terhubung.
            </p>

            <div className="relative mb-2">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-[2rem] border-4 border-white bg-slate-100 text-4xl font-black text-slate-400 shadow-xl shadow-slate-200/50 transition-all hover:scale-105 active:scale-95 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-500 dark:shadow-none"
              >
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <span>{getInitials(fullName || profile?.full_name)}</span>
                )}
                
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Permanent Camera Badge */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-emerald-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-emerald-600 dark:border-slate-900"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/jpeg,image/png,image/webp" 
                onChange={handleFileChange}
              />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Klik ikon untuk ubah foto</p>
            
            <form onSubmit={handleSubmit} className="mt-8 w-full space-y-5 text-left">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Nama Lengkap</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold transition-colors focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:focus:border-emerald-500 dark:focus:bg-slate-900"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Alamat Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold transition-colors focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:focus:border-emerald-500 dark:focus:bg-slate-900"
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-500/10 dark:text-rose-400">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-500/10 dark:text-emerald-400">
                  {success}
                </div>
              )}

              <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row-reverse">
                <button
                  type="submit"
                  disabled={loading || !fullName || !email}
                  className="flex h-12 w-full items-center justify-center rounded-2xl bg-emerald-600 px-6 text-[12px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50 sm:w-auto"
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-[12px] font-black uppercase tracking-widest text-slate-600 transition-all hover:border-slate-900 hover:text-slate-900 active:scale-95 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-white dark:hover:text-white sm:w-auto"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
