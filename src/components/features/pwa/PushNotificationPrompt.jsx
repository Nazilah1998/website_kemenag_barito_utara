"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function PushNotificationPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      console.log("Checking OneSignal permission...");
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function(OneSignal) {
        console.log("OneSignal is ready!");
        try {
          const isSupported = OneSignal.Notifications.isPushSupported();
          console.log("Is Push Supported?", isSupported);
          if (!isSupported) return;

          // Gunakan API bawaan browser untuk mengecek status izin secara akurat
          const permission = window.Notification ? window.Notification.permission : "default";
          const dismissedAt = localStorage.getItem("onesignal-soft-prompt-dismissed");
          const now = Date.now();
          const SIX_HOURS = 6 * 60 * 60 * 1000; // 6 jam dalam milidetik
          let hasDismissedRecently = false;

          if (dismissedAt) {
            if (now - parseInt(dismissedAt, 10) < SIX_HOURS) {
              hasDismissedRecently = true;
            }
          }

          console.log("Native Permission:", permission, "HasDismissedRecently:", hasDismissedRecently);

          if (permission === "default" && !hasDismissedRecently) {
            console.log("Setting timeout to show prompt...");
            // Tunda kemunculan 5 detik agar tidak mengganggu kesan pertama pengunjung
            setTimeout(() => {
              console.log("Showing prompt now!");
              setShow(true);
            }, 5000);
          }
        } catch (error) {
          console.error("OneSignal Prompt Error:", error);
        }
      });
    };

    checkPermission();
  }, []);

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("onesignal-soft-prompt-dismissed", Date.now().toString());
  };

  const handleSubscribe = () => {
    setShow(false);
    localStorage.setItem("onesignal-soft-prompt-dismissed", Date.now().toString());
    
    window.OneSignalDeferred.push(async function(OneSignal) {
      try {
        await OneSignal.Notifications.requestPermission();
      } catch (error) {
        console.warn("Gagal meminta izin notifikasi (mungkin mode Incognito):", error);
      }
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 sm:pt-32 px-4 sm:px-0 bg-slate-900/40 backdrop-blur-sm transition-all">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-emerald-900/20 ring-1 ring-slate-100 dark:ring-slate-800 p-6 animate-in slide-in-from-top-10 fade-in duration-500 overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-emerald-50 dark:bg-emerald-900/20 blur-2xl pointer-events-none"></div>

        <div className="flex items-start gap-5 relative z-10">
          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/40 rounded-2xl flex items-center justify-center border border-emerald-200/50 dark:border-emerald-700/50 shadow-inner">
            <Image
              src="/assets/icons/kemenag-192.png"
              alt="Logo Kemenag"
              width={40}
              height={40}
              className="object-contain drop-shadow-sm"
            />
          </div>
          <div className="flex-1 pt-1">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
              Pembaruan Informasi
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Izinkan kami mengirimkan notifikasi untuk berita dan pengumuman resmi terbaru dari Kementerian Agama Kabupaten Barito Utara.
            </p>
            
            <div className="mt-6 flex items-center gap-2 justify-end">
              <button
                onClick={handleDismiss}
                className="px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors focus:outline-none"
              >
                Lain Kali
              </button>
              <button
                onClick={handleSubscribe}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:shadow-emerald-600/20 transition-all focus:outline-none flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Aktifkan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
